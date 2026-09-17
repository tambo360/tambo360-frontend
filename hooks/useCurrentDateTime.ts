// hooks/useCurrentDateTime.ts
import { useEffect, useState } from 'react'

interface CurrentDateTime {
  fecha: string // yyyy-mm-dd, para <input type="date">
  hora: string // HH:mm, para <input type="time">
}

const getLocalDateTime = (): CurrentDateTime => {
  const now = new Date()
  return {
    fecha: now.toISOString().slice(0, 10),
    hora: now.toTimeString().slice(0, 5),
  }
}

/**
 * Fecha/hora actual tomada directamente del dispositivo (zona horaria local
 * del navegador). Antes intentaba traerla de una API externa
 * (worldtimeapi.org), pero ese servicio fallaba de forma constante
 * (net::ERR_CONNECTION_RESET), así que se removió: solo agregaba latencia
 * y ruido en consola sin aportar un valor real.
 */
export function useCurrentDateTime() {
  const [dateTime, setDateTime] = useState<CurrentDateTime>(getLocalDateTime)
  const [loading] = useState(false)

  useEffect(() => {
    setDateTime(getLocalDateTime())
  }, [])

  return { ...dateTime, loading }
}
