'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useBatchOutbox, type BatchOutboxOp } from '@/stores/useBatchOutbox'
import {
  useDecreaseOutbox,
  type DecreaseOutboxOp,
} from '@/stores/useDecreaseOutbox'
import {
  useTransferOutbox,
  type TransferOutboxOp,
} from '@/stores/useTransferOutbox'
import { useSyncStatus } from '@/stores/useSyncStatus'
import { currentScope } from '@/lib/offlineId'
import { replaceTempLote } from '@/hooks/batch/offlineBatchCache'
import { replaceTempMerma } from '@/hooks/decrease/offlineDecreaseCache'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import {
  completeBatch,
  createBatch,
  deleteBatch,
  updateBatch,
} from '@/utils/api/batch.api'
import {
  createDecrease,
  deleteDecrease,
  updateDecrease,
} from '@/utils/api/decrease.api'
import { transferRodeoRequest } from '@/utils/api/transfer.api'

const MAX_TRIES = 3

type Entity = 'batch' | 'decrease' | 'transfer'

interface UnifiedOp {
  entity: Entity
  opId: string
  scope: string
  createdAt: number
  tries: number
  op: BatchOutboxOp | DecreaseOutboxOp | TransferOutboxOp
}

function scopeFromParams(
  params: { orgId?: string | string[]; id?: string | string[] } | null
): string {
  const orgId = Array.isArray(params?.orgId) ? params?.orgId[0] : params?.orgId
  const estId = Array.isArray(params?.id) ? params?.id[0] : params?.id
  if (orgId && estId) return `${orgId}/${estId}`
  return currentScope()
}

function errorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    const data = (err as { response?: { data?: { message?: string } } })
      .response?.data
    if (data?.message) return data.message
    if (err instanceof Error && err.message) return err.message
  }
  return 'Error de red'
}

function removeOp(entity: Entity, opId: string) {
  if (entity === 'batch') useBatchOutbox.getState().removeOp(opId)
  else if (entity === 'decrease') useDecreaseOutbox.getState().removeOp(opId)
  else useTransferOutbox.getState().removeOp(opId)
}

function bumpTries(entity: Entity, opId: string, message: string) {
  if (entity === 'batch') useBatchOutbox.getState().bumpTries(opId, message)
  else if (entity === 'decrease')
    useDecreaseOutbox.getState().bumpTries(opId, message)
  else useTransferOutbox.getState().bumpTries(opId, message)
}

function moveToFailed(entity: Entity, opId: string, message: string) {
  if (entity === 'batch') useBatchOutbox.getState().moveToFailed(opId, message)
  else if (entity === 'decrease')
    useDecreaseOutbox.getState().moveToFailed(opId, message)
  else useTransferOutbox.getState().moveToFailed(opId, message)
}

function stillPending(entity: Entity, opId: string): boolean {
  const ops =
    entity === 'batch'
      ? useBatchOutbox.getState().ops
      : entity === 'decrease'
        ? useDecreaseOutbox.getState().ops
        : useTransferOutbox.getState().ops
  return ops.some((o) => o.opId === opId)
}

function invalidateAll(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: [...baseKeys.batch, 'filters'] })
  qc.invalidateQueries({ queryKey: queryKeys.batch.day() })
  qc.invalidateQueries({ queryKey: ['mermas'] })
  qc.invalidateQueries({ queryKey: queryKeys.decrease.lists() })
  qc.invalidateQueries({ queryKey: [...baseKeys.establishment] })
  qc.invalidateQueries({ queryKey: queryKeys.dashboard.current() })
  qc.invalidateQueries({ queryKey: [...baseKeys.dashboard, 'graph'] })
}

async function replayBatch(
  qc: QueryClient,
  op: BatchOutboxOp,
  loteIdMap: Map<string, string>
) {
  const resolveId = (id: string) => loteIdMap.get(id) ?? id

  if (op.type === 'create') {
    if (!op.payload) return
    const { data } = await createBatch(op.payload)
    const real = (data?.data ?? data) as {
      idLote?: string
      id?: string
      numeroLote?: number
    }
    const tempId = (op.payload as { idLote?: string }).idLote
    if (tempId) {
      const realId = real?.idLote ?? real?.id ?? tempId
      loteIdMap.set(tempId, realId)
      replaceTempLote(qc, tempId, {
        ...(real as object),
        idLote: realId,
      } as Parameters<typeof replaceTempLote>[2])
    }
    return
  }

  if (!op.targetId) return
  const target = resolveId(op.targetId)

  if (op.type === 'update' && op.payload) {
    await updateBatch(op.payload, target)
    return
  }
  if (op.type === 'delete') {
    await deleteBatch(target)
    return
  }
  if (op.type === 'complete') {
    await completeBatch(target)
  }
}

async function replayDecrease(
  qc: QueryClient,
  op: DecreaseOutboxOp,
  loteIdMap: Map<string, string>,
  mermaIdMap: Map<string, string>
) {
  const resolveLote = (id: string) => loteIdMap.get(id) ?? id
  const resolveMerma = (id: string) => mermaIdMap.get(id) ?? id
  const idLote = resolveLote(op.idLote)

  if (op.type === 'create') {
    if (!op.payload) return
    const { data } = await createDecrease({ ...op.payload, idLote })
    const real = (data?.data ?? data) as { idMerma?: string; id?: string }
    const realId = real?.idMerma ?? real?.id ?? op.targetId
    mermaIdMap.set(op.targetId, realId)
    replaceTempMerma(qc, idLote, op.targetId, {
      ...(real as object),
      idMerma: realId,
    })
    return
  }

  const target = resolveMerma(op.targetId)

  if (op.type === 'update' && op.payload) {
    await updateDecrease(
      {
        tipo: op.payload.tipo,
        cantidad: op.payload.cantidad,
        observacion: op.payload.observacion,
      },
      target
    )
    return
  }
  if (op.type === 'delete') {
    await deleteDecrease(target)
  }
}

async function replayTransfer(op: TransferOutboxOp) {
  // Mismo endpoint para rodeo e individual (comportamiento actual del modal).
  await transferRodeoRequest(
    op.payload as import('@/types/transfer').TransferRodeoPayload
  )
}

async function drainScope(qc: QueryClient, scope: string) {
  if (typeof window === 'undefined' || !navigator.onLine) return

  const unified: UnifiedOp[] = [
    ...useBatchOutbox
      .getState()
      .ops.filter((o) => o.scope === scope)
      .map((op) => ({
        entity: 'batch' as Entity,
        opId: op.opId,
        scope: op.scope,
        createdAt: op.createdAt,
        tries: op.tries,
        op,
      })),
    ...useDecreaseOutbox
      .getState()
      .ops.filter((o) => o.scope === scope)
      .map((op) => ({
        entity: 'decrease' as Entity,
        opId: op.opId,
        scope: op.scope,
        createdAt: op.createdAt,
        tries: op.tries,
        op,
      })),
    ...useTransferOutbox
      .getState()
      .ops.filter((o) => o.scope === scope)
      .map((op) => ({
        entity: 'transfer' as Entity,
        opId: op.opId,
        scope: op.scope,
        createdAt: op.createdAt,
        tries: op.tries,
        op,
      })),
  ]
  if (unified.length === 0) return

  // Orden fiel al usuario: lo primero que hizo, primero se sincroniza.
  // Los ids temporales se mapean al vuelo para las ops que los referencien.
  unified.sort((a, b) => a.createdAt - b.createdAt)

  // Aviso bloqueante (mínimo 5s en el overlay): solo si hay pendientes.
  useSyncStatus.getState().begin(unified.length)

  const loteIdMap = new Map<string, string>()
  const mermaIdMap = new Map<string, string>()
  let synced = 0

  for (const item of unified) {
    // Pudo resolverse por coalescencia mientras drenábamos
    if (!stillPending(item.entity, item.opId)) {
      useSyncStatus.getState().tick()
      continue
    }

    try {
      if (item.entity === 'batch') {
        await replayBatch(qc, item.op as BatchOutboxOp, loteIdMap)
      } else if (item.entity === 'decrease') {
        await replayDecrease(
          qc,
          item.op as DecreaseOutboxOp,
          loteIdMap,
          mermaIdMap
        )
      } else {
        await replayTransfer(item.op as TransferOutboxOp)
      }
      removeOp(item.entity, item.opId)
      synced += 1
      useSyncStatus.getState().tick()
    } catch (err) {
      const msg = errorMessage(err)
      // Sin red a mitad del drain: frena, queda para el próximo 'online'
      if (!navigator.onLine) {
        useSyncStatus.getState().finish()
        return
      }
      const tries = item.tries + 1
      if (tries >= MAX_TRIES) {
        moveToFailed(item.entity, item.opId, msg)
        toast.error('No se pudo sincronizar un cambio pendiente.', {
          description: msg,
        })
      } else {
        bumpTries(item.entity, item.opId, msg)
      }
      useSyncStatus.getState().tick()
    }
  }

  useSyncStatus.getState().finish()

  if (synced > 0) {
    invalidateAll(qc)
  }
}

/**
 * Monta el drenaje de las colas offline: al montar y al recuperar conexión.
 * Usar UNA vez en el layout del dashboard.
 */
export function useOutboxSync() {
  const queryClient = useQueryClient()
  const params = useParams()

  useEffect(() => {
    const scope = scopeFromParams(
      params as { orgId?: string | string[]; id?: string | string[] } | null
    )
    drainScope(queryClient, scope)
    const handleOnline = () =>
      drainScope(queryClient, scopeFromParams(params as never))
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient])
}
