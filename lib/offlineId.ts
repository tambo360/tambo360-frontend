// Genera un UUID v7
export function randomLoteId(): string {
  const randomBytes = (n: number): number[] => {
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      return Array.from(crypto.getRandomValues(new Uint8Array(n)))
    }
    // Fallback
    return Array.from({ length: n }, () => Math.floor(Math.random() * 256))
  }
  const hex = (b: number) => b.toString(16).padStart(2, '0')
  const ts = Date.now().toString(16).padStart(12, '0').slice(-12)
  const r = randomBytes(10).map(hex).join('')
  return (
    `${ts.slice(0, 8)}-${ts.slice(8, 12)}` +
    `-7${r.slice(0, 3)}` +
    `-${((parseInt(r.slice(3, 4), 16) & 0x3) | 0x8).toString(16)}${r.slice(4, 7)}` +
    `-${r.slice(7, 19)}`
  )
}

/** `orgId/estId` actuales desde el pathname (misma fuente que el interceptor). */
export function currentEstablisment(): string {
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
