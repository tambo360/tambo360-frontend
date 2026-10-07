'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  TransferAnimalPayload,
  TransferRodeoPayload,
} from '@/types/transfer'

export type TransferOpType = 'transfer'

export interface TransferOutboxOp {
  opId: string
  type: TransferOpType
  /** `orgId/estId` capturado al encolar: la cola nunca mezcla establecimientos. */
  scope: string
  payload: TransferRodeoPayload | TransferAnimalPayload
  createdAt: number
  tries: number
  lastError?: string
}

interface TransferOutboxState {
  ops: TransferOutboxOp[]
  failed: TransferOutboxOp[]
  enqueue: (op: Omit<TransferOutboxOp, 'opId' | 'createdAt' | 'tries'>) => void
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

const samePayload = (a: TransferOutboxOp, b: TransferOutboxOp) =>
  a.type === b.type &&
  a.scope === b.scope &&
  JSON.stringify(a.payload) === JSON.stringify(b.payload)

export const useTransferOutbox = create<TransferOutboxState>()(
  persist(
    (set, get) => ({
      ops: [],
      failed: [],

      enqueue: (op) => {
        const { ops } = get()
        const entry: TransferOutboxOp = {
          ...op,
          opId:
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: Date.now(),
          tries: 0,
        }
        // Las cantidades son aditivas: NO se fusiona (fusionar sumaría mal).
        // Solo se suprimen duplicados exactos (doble click).
        if (ops.some((o) => samePayload(o, entry))) return
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
      name: 'tambo360-transfer-outbox',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : noopStorage
      ),
      partialize: (s) =>
        ({ ops: s.ops, failed: s.failed }) as TransferOutboxState,
    }
  )
)
