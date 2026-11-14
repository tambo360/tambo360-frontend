'use client'

import type { QueryClient } from '@tanstack/react-query'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import type {
  DecreaseData,
  Merma,
  OfflineDecreaseCreate,
} from '@/types/decrease'
import type { Lote } from '@/types/batch'

/**
 * Parche optimista de mermas en los tres lugares donde viven:
 * - `['mermas', 'lote', idLote]` (lista plana del modal de detalle)
 * - `batch.filters` (envelope `{ data: { lotes: [{ lote: { mermas }}] } }`)
 * - `batch.detail(id)` (envelope `{ data: lote | { lote } }`)
 */

const BATCH_LIST_PREFIXES = [
  [...baseKeys.batch, 'filters'],
  [...baseKeys.batch, 'today'],
] as const

const mermasKey = (idLote: string) => ['mermas', 'lote', idLote] as const

export function createMermaOffline(values: OfflineDecreaseCreate): Merma {
  return {
    idMerma: values.idMerma,
    tipo: values.tipo as Merma['tipo'],
    observacion: values.observacion,
    cantidad: Number(values.cantidad),
    fechaCreacion: values.fechaCreacion,
    idLote: values.idLote,
  }
}

function patchBatchEnvelopes(
  qc: QueryClient,
  idLote: string,
  fn: (mermas: Merma[]) => Merma[]
) {
  for (const prefix of BATCH_LIST_PREFIXES) {
    const entries = qc
      .getQueryCache()
      .findAll({ queryKey: prefix, exact: false })
    for (const entry of entries) {
      const envelope = entry.state.data as
        | { data?: { lotes?: Array<{ lote?: Lote } | Lote> } }
        | undefined
      const lotes = envelope?.data?.lotes
      if (!lotes) continue
      let touched = false
      const next = lotes.map((item) => {
        const wrapper = item as { lote?: Lote }
        const lote = wrapper.lote ?? (item as Lote)
        if (lote.idLote !== idLote) return item
        touched = true
        const updatedLote = {
          ...lote,
          mermas: fn([...(lote.mermas ?? [])]),
        }
        return wrapper.lote ? { ...wrapper, lote: updatedLote } : updatedLote
      })
      if (touched) {
        qc.setQueryData(entry.queryKey, {
          ...envelope,
          data: { ...envelope?.data, lotes: next },
        })
      }
    }
  }
  // Detail
  qc.setQueryData(queryKeys.batch.detail(idLote), (prev: unknown) => {
    if (!prev || typeof prev !== 'object') return prev
    const holder = (prev as { data?: unknown }).data
    const applyTo = (lote: Lote): Lote => ({
      ...lote,
      mermas: fn([...(lote.mermas ?? [])]),
    })
    if (!holder || typeof holder !== 'object') return prev
    if ((holder as { lote?: Lote }).lote) {
      return {
        ...(prev as object),
        data: {
          ...(holder as object),
          lote: applyTo((holder as { lote: Lote }).lote),
        },
      }
    }
    if ((holder as Lote).idLote) {
      return { ...(prev as object), data: applyTo(holder as Lote) }
    }
    return prev
  })
}

export function applyOptimisticMermaCreate(qc: QueryClient, merma: Merma) {
  qc.setQueryData(mermasKey(merma.idLote), (prev: unknown) => {
    const list = Array.isArray(prev) ? (prev as Merma[]) : []
    if (list.some((m) => m.idMerma === merma.idMerma)) return prev
    return [merma, ...list]
  })
  patchBatchEnvelopes(qc, merma.idLote, (list) =>
    list.some((m) => m.idMerma === merma.idMerma) ? list : [merma, ...list]
  )
}

export function applyOptimisticMermaUpdate(
  qc: QueryClient,
  idLote: string,
  idMerma: string,
  values: Partial<DecreaseData>
) {
  const map = (list: Merma[]) =>
    list.map((m) =>
      m.idMerma === idMerma
        ? {
            ...m,
            ...(values.tipo !== undefined ? { tipo: values.tipo } : {}),
            ...(values.observacion !== undefined
              ? { observacion: values.observacion }
              : {}),
            ...(values.cantidad !== undefined
              ? { cantidad: Number(values.cantidad) }
              : {}),
          }
        : m
    )
  qc.setQueryData(mermasKey(idLote), (prev: unknown) =>
    Array.isArray(prev) ? map(prev as Merma[]) : prev
  )
  patchBatchEnvelopes(qc, idLote, map)
}

export function removeOptimisticMerma(
  qc: QueryClient,
  idLote: string,
  idMerma: string
) {
  qc.setQueryData(mermasKey(idLote), (prev: unknown) =>
    Array.isArray(prev)
      ? (prev as Merma[]).filter((m) => m.idMerma !== idMerma)
      : prev
  )
  patchBatchEnvelopes(qc, idLote, (list) =>
    list.filter((m) => m.idMerma !== idMerma)
  )
}

/** Tras sincronizar un create: reemplaza la merma temporal por la real. */
export function replaceTempMerma(
  qc: QueryClient,
  idLote: string,
  tempId: string,
  real: Partial<Merma> & { idMerma?: string; id?: string }
) {
  const realId = real.idMerma ?? real.id ?? tempId
  const map = (list: Merma[]) =>
    list.map((m) =>
      m.idMerma === tempId ? { ...m, ...(real as object), idMerma: realId } : m
    )
  qc.setQueryData(mermasKey(idLote), (prev: unknown) =>
    Array.isArray(prev) ? map(prev as Merma[]) : prev
  )
  patchBatchEnvelopes(qc, idLote, map)
}
