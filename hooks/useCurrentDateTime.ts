// hooks/useCurrentDateTime.ts
import { useEffect, useState } from 'react'

interface CurrentDateTime {
  fecha: string // yyyy-mm-dd, para <input type="date">
  hora: string // HH:mm, para <input type="time">
}

const fallbackLocal = (): CurrentDateTime => {
  const now = new Date()
  return {
    fecha: now.toISOString().slice(0, 10),
    hora: now.toTimeString().slice(0, 5),
  }
}

/**
 * Trae la fecha/hora actual desde una API externa (worldtimeapi.org, zona
 * America/Argentina/Buenos_Aires) para no depender del reloj del dispositivo.
 * Si la API externa falla, cae en la hora local del navegador.
 */
export function useCurrentDateTime() {
  const [dateTime, setDateTime] = useState<CurrentDateTime>(fallbackLocal)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(
      'https://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires'
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        const dt = new Date(data.datetime)
        setDateTime({
          fecha: dt.toISOString().slice(0, 10),
          hora: dt.toTimeString().slice(0, 5),
        })
      })
      .catch(() => {
        if (!cancelled) setDateTime(fallbackLocal())
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { ...dateTime, loading }
}
