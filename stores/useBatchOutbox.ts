'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { BatchData } from '@/types/batch'
import type { Product } from '@/types/product'

export type BatchOpType = 'create' | 'update' | 'delete' | 'complete'

type OfflineProduct = Pick<Product, 'idProducto' | 'nombre' | 'categoria'>

export interface BatchOutboxOp {
  opId: string // id unico del lote
  type: BatchOpType // tipo de operacion
  scope: string // (orgId/estId) a qué establecimiento pertenece
  payload?: BatchData & {
    idLote?: string
    producto?: OfflineProduct
    numeroLote?: number
  }
  targetId?: string // a qué lote apunta (para update/delete/complete)
  createdAt: number // cuándo se encoló
  tries: number
  lastError?: string
}

interface BatchOutboxState {
  ops: BatchOutboxOp[]
  failed: BatchOutboxOp[]
  // encolar operacion
  enqueue: (op: Omit<BatchOutboxOp, 'opId' | 'createdAt' | 'tries'>) => void
  // remover operacion
  removeOp: (opId: string) => void
  bumpTries: (opId: string, message?: string) => void
  moveToFailed: (opId: string, message?: string) => void
  hasPendingCreate: (scope: string, id: string) => boolean
  clear: () => void
}

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  get length() {
    return 0
  },
}

const sameTarget = (
  a: BatchOutboxOp,
  type: BatchOpType,
  scope: string,
  id: string
) => a.type === type && a.scope === scope && a.targetId === id

export const useBatchOutbox = create<BatchOutboxState>()(
  persist(
    (set, get) => ({
      ops: [],
      failed: [],

      enqueue: (op) => {
        const { ops } = get()
        const entry: BatchOutboxOp = {
          ...op,
          opId:
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: Date.now(),
          tries: 0,
        }

        // ── Coalescencia: colapsa ops del mismo objetivo ──
        if (op.type === 'update' && op.targetId) {
          // update sobre un create pendiente → fusiona en el create
          const pendingCreate = ops.find(
            (o) =>
              o.type === 'create' &&
              o.scope === op.scope &&
              (o.payload as any)?.idLote === op.targetId
          )
          if (pendingCreate) {
            set({
              ops: ops.map((o) =>
                o.opId === pendingCreate.opId
                  ? {
                      ...o,
                      payload: {
                        ...(o.payload as object),
                        ...(op.payload as object),
                      } as BatchOutboxOp['payload'],
                    }
                  : o
              ),
            })
            return
          }
          // update sobre update pendiente → gana el último
          set({
            ops: [
              ...ops.filter(
                (o) => !sameTarget(o, 'update', op.scope, op.targetId as string)
              ),
              entry,
            ],
          })
          return
        }

        if (op.type === 'delete' && op.targetId) {
          // delete sobre un create pendiente → se anulan (cero requests)
          const pendingCreate = ops.find(
            (o) =>
              o.type === 'create' &&
              o.scope === op.scope &&
              (o.payload as any)?.idLote === op.targetId
          )
          if (pendingCreate) {
            set({
              ops: ops.filter(
                (o) =>
                  o.opId !== pendingCreate.opId &&
                  !(
                    (o.type === 'update' || o.type === 'complete') &&
                    o.scope === op.scope &&
                    o.targetId === op.targetId
                  )
              ),
            })
            return
          }
          // delete reemplaza update/complete pendientes del mismo objetivo
          set({
            ops: [
              ...ops.filter(
                (o) =>
                  !(
                    o.scope === op.scope &&
                    o.targetId === op.targetId &&
                    (o.type === 'update' ||
                      o.type === 'complete' ||
                      o.type === 'delete')
                  )
              ),
              entry,
            ],
          })
          return
        }

        if (op.type === 'complete' && op.targetId) {
          // Sin sentido si hay un delete pendiente del mismo objetivo
          if (
            ops.some((o) =>
              sameTarget(o, 'delete', op.scope, op.targetId as string)
            )
          ) {
            return
          }
          // Evita duplicados
          if (
            ops.some((o) =>
              sameTarget(o, 'complete', op.scope, op.targetId as string)
            )
          ) {
            return
          }
          set({ ops: [...ops, entry] })
          return
        }

        set({ ops: [...ops, entry] })
      },

      removeOp: (opId) =>
        set({ ops: get().ops.filter((o) => o.opId !== opId) }),

      bumpTries: (opId, message) =>
        set({
          ops: get().ops.map((o) =>
            o.opId === opId
              ? { ...o, tries: o.tries + 1, lastError: message }
              : o
          ),
        }),

      moveToFailed: (opId, message) => {
        const op = get().ops.find((o) => o.opId === opId)
        if (!op) return
        set({
          ops: get().ops.filter((o) => o.opId !== opId),
          failed: [...get().failed, { ...op, lastError: message }],
        })
      },

      hasPendingCreate: (scope, id) =>
        get().ops.some(
          (o) =>
            o.type === 'create' &&
            o.scope === scope &&
            (o.payload as any)?.idLote === id
        ),

      clear: () => set({ ops: [], failed: [] }),
    }),
    {
      name: 'tambo360-batch-outbox',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : noopStorage
      ),
      partialize: (s) => ({ ops: s.ops, failed: s.failed }) as BatchOutboxState,
    }
  )
)
