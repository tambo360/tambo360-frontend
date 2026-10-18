import { useMemo, useState } from 'react'
import { getMonthPeriod } from '@/types/generalCost'

export function useMonthPeriod() {
  const today = new Date()
  const currentYear = today.getUTCFullYear()
  const currentMonth = today.getUTCMonth()

  const [cursor, setCursor] = useState({
    year: currentYear,
    month: currentMonth,
  })

  const period = useMemo(
    () => getMonthPeriod(cursor.year, cursor.month),
    [cursor.year, cursor.month]
  )

  const isCurrentMonth =
    cursor.year === currentYear && cursor.month === currentMonth

  const label = useMemo(() => {
    const text = new Date(
      Date.UTC(cursor.year, cursor.month, 1)
    ).toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    return text.charAt(0).toUpperCase() + text.slice(1)
  }, [cursor.year, cursor.month])

  const goPrev = () =>
    setCursor(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    )

  const goNext = () => {
    if (isCurrentMonth) return
    setCursor(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    )
  }

  return { period, label, isCurrentMonth, goPrev, goNext }
}
