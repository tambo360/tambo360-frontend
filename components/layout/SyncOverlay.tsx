'use client'

import { useEffect } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useSyncStatus } from '@/stores/useSyncStatus'

/** Tiempo mínimo visible aunque el drain termine antes (pedido: 5s). */
const MIN_VISIBLE_MS = 5000
/** Gracia extra tras terminar para leer el "¡Listo!". */
const DONE_GRACE_MS = 800

/**
 * Aviso bloqueante al volver online con pendientes: ocupa toda la pantalla,
 * sin botón de cierre ni ESC — se oculta solo (mínimo 5s visibles).
 */
export default function SyncOverlay() {
  const { phase, total, done, startedAt, finishedAt, reset } = useSyncStatus()

  useEffect(() => {
    if (phase !== 'done' || !startedAt || !finishedAt) return
    const elapsed = finishedAt - startedAt
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed) + DONE_GRACE_MS
    const t = setTimeout(reset, wait)
    return () => clearTimeout(t)
  }, [phase, startedAt, finishedAt, reset])

  if (phase === 'idle') return null

  const finished = phase === 'done'
  const progress =
    total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="alertdialog"
      aria-modal="true"
      aria-live="polite"
      aria-label="Sincronizando cambios pendientes"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl text-center">
        <div className="flex justify-center">
          <div className="relative w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            {finished ? (
              <CheckCircle2 className="w-10 h-10 text-[#2E7D53]" />
            ) : (
              <Loader2 className="w-10 h-10 text-[#2E7D53] animate-spin" />
            )}
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
          {finished ? '¡Sincronizado!' : 'Ya estás online'}
        </h2>
        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
          {finished
            ? 'Tus cambios ya están en el servidor.'
            : 'Estamos sincronizando tus cambios…'}
        </p>

        {!finished && total > 0 && (
          <p
            className="mt-1 text-sm font-semibold text-gray-700"
            aria-live="polite"
          >
            {Math.min(done, total)} de {total}
          </p>
        )}

        <div
          className="mt-4 h-2 w-full rounded-full bg-gray-100 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={finished ? 100 : progress}
        >
          <div
            className="h-full rounded-full bg-[#2E7D53] transition-all duration-300"
            style={{ width: `${finished ? 100 : progress}%` }}
          />
        </div>

        {!finished && (
          <p className="mt-4 text-xs text-gray-500">
            Espera un momento antes de seguir trabajando.
          </p>
        )}
      </div>
    </div>
  )
}
