const MESES_ES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const

/**
 * Formatea una fecha ISO 8601 al formato corto `DDMonYYYY` (ej. `31Ago2026`).
 * Usa getters UTC para que una fecha como `2026-08-31T00:00:00.000Z`
 * no se desplace al día anterior en zonas horarias negativas (ej. UTC-3).
 * Si el valor no es una fecha válida, devuelve el string original.
 */
export const formatShortDate = (iso: string): string => {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const dia = String(d.getUTCDate()).padStart(2, '0')
  const mes = MESES_ES[d.getUTCMonth()]
  const anio = d.getUTCFullYear()
  return `${dia}${mes}${anio}`
}
