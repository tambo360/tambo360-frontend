'use client'

import { create } from 'zustand'

export type SyncPhase = 'idle' | 'syncing' | 'done'

interface SyncStatusState {
  phase: SyncPhase
  /** Pendientes al iniciar el drain. */
  total: number
  /** Ops ya procesadas (éxito, fallida o reintentada). */
  done: number
  startedAt: number | null
  finishedAt: number | null
  /** Arranca un ciclo. Si ya hay uno en curso, se ignora (anti-parpadeo). */
  begin: (total: number) => void
  tick: () => void
  finish: () => void
  reset: () => void
}

export const useSyncStatus = create<SyncStatusState>()((set, get) => ({
  phase: 'idle',
  total: 0,
  done: 0,
  startedAt: null,
  finishedAt: null,

  begin: (total: number) => {
    if (get().phase === 'syncing' || total <= 0) return
    set({
      phase: 'syncing',
      total,
      done: 0,
      startedAt: Date.now(),
      finishedAt: null,
    })
  },

  tick: () => {
    if (get().phase !== 'syncing') return
    set({ done: get().done + 1 })
  },

  finish: () => {
    if (get().phase !== 'syncing') return
    set({ phase: 'done', finishedAt: Date.now() })
  },

  reset: () =>
    set({
      phase: 'idle',
      total: 0,
      done: 0,
      startedAt: null,
      finishedAt: null,
    }),
}))
