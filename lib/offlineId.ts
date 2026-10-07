/**
 * Helpers offline-first para lotes.
 * El id temporal es un UUID v4 normal generado en `useCreateBatch`
 * (única fuente) cuando no hay conexión; se guarda en el payload del
 * outbox y se usa para la caché optimista, así el replay online reenvía
 * el mismo payload sin remapeos frágiles. Si un id es temporal o no
 * se sabe consultando la cola del outbox, no por prefijos.
 */

/** `orgId/estId` actuales desde el pathname (misma fuente que el interceptor). */
export function currentScope(): string {
  if (typeof window === 'undefined') return 'unknown/unknown'
  const parts = window.location.pathname.split('/')
  if (parts[1] === 'organizaciones' && parts[2] && parts[3]) {
    return `${parts[2]}/${parts[3]}`
  }
  return 'unknown/unknown'
}

/** Convierte `dd/mm/aaaa` (form) a ISO para mostrar en la lista optimista. */
export function toISODate(fechaProduccion: string | undefined): string {
  if (!fechaProduccion) return new Date().toISOString()
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fechaProduccion)
  if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00`).toISOString()
  const d = new Date(fechaProduccion)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}
