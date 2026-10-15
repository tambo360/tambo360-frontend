'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { DecreaseData } from '@/types/decrease'

export type DecreaseOpType = 'create' | 'update' | 'delete'

export interface DecreaseOutboxOp {
  opId: string
  type: DecreaseOpType
  /** `orgId/estId` capturado al encolar: la cola nunca mezcla establecimientos. */
  scope: string
  /** Lote dueño (real o temporal; se mapea al drenar). */
  idLote: string
  /** Para update/delete (y create): id de merma objetivo (real o temporal). */
  targetId: string
  payload?: DecreaseData & { idLote: string }
  createdAt: number
  tries: number
  lastError?: string
}

interface DecreaseOutboxState {
  ops: DecreaseOutboxOp[]
  failed: DecreaseOutboxOp[]
  enqueue: (op: Omit<DecreaseOutboxOp, 'opId' | 'createdAt' | 'tries'>) => void
  removeOp: (opId: string) => void
  bumpTries: (opId: string, message?: string) => void
  moveToFailed: (opId: string, message?: string) => void
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
  a: DecreaseOutboxOp,
  type: DecreaseOpType,
  scope: string,
  idLote: string,
  id: string
) =>
  a.type === type &&
  a.scope === scope &&
  a.idLote === idLote &&
  a.targetId === id

export const useDecreaseOutbox = create<DecreaseOutboxState>()(
  persist(
    (set, get) => ({
      ops: [],
      failed: [],

      enqueue: (op) => {
        const { ops } = get()
        const entry: DecreaseOutboxOp = {
          ...op,
          opId:
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: Date.now(),
          tries: 0,
        }

        // ── Coalescencia ──
        if (op.type === 'update') {
          // update sobre un create pendiente → fusiona en el create
          const pendingCreate = ops.find(
            (o) =>
              o.type === 'create' &&
              o.scope === op.scope &&
              o.targetId === op.targetId
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
                      } as DecreaseOutboxOp['payload'],
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
                (o) =>
                  !sameTarget(o, 'update', op.scope, op.idLote, op.targetId)
              ),
              entry,
            ],
          })
          return
        }

        if (op.type === 'delete') {
          // delete sobre un create pendiente → se anulan (cero requests)
          const pendingCreate = ops.find(
            (o) =>
              o.type === 'create' &&
              o.scope === op.scope &&
              o.targetId === op.targetId
          )
          if (pendingCreate) {
            set({
              ops: ops.filter(
                (o) =>
                  o.opId !== pendingCreate.opId &&
                  !(
                    o.type === 'update' &&
                    o.scope === op.scope &&
                    o.targetId === op.targetId
                  )
              ),
            })
            return
          }
          // delete reemplaza update/delete pendientes del mismo objetivo
          set({
            ops: [
              ...ops.filter(
                (o) =>
                  !(
                    o.scope === op.scope &&
                    o.targetId === op.targetId &&
                    (o.type === 'update' || o.type === 'delete')
                  )
              ),
              entry,
            ],
          })
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

      clear: () => set({ ops: [], failed: [] }),
    }),
    {
      name: 'tambo360-decrease-outbox',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : noopStorage
      ),
      partialize: (s) =>
        ({ ops: s.ops, failed: s.failed }) as DecreaseOutboxState,
    }
  )
)
