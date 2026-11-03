const LOCALE = 'es-AR'

// Desde esta cantidad de caracteres pasamos a formato compacto (ej: 1,2 M)
const MAX_FULL_LENGTH = 10

interface FormattedStatValue {
  /** Lo que se muestra en la tarjeta (puede ser compacto) */
  display: string
  /** El valor completo, para el tooltip (atributo title) */
  full: string
}

export const formatStatValue = (
  value?: string | number | null
): FormattedStatValue => {
  const number = Number(value)

  if (
    value === null ||
    value === undefined ||
    value === '' ||
    Number.isNaN(number)
  ) {
    return { display: '—', full: '—' }
  }

  const full = number.toLocaleString(LOCALE)

  if (full.length < MAX_FULL_LENGTH) {
    return { display: full, full }
  }

  const display = new Intl.NumberFormat(LOCALE, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)

  return { display, full }
}
