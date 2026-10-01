// hooks/useCurrentDateTime.ts
import { useEffect, useState } from 'react'

interface CurrentDateTime {
  fecha: string // yyyy-mm-dd, para <input type="date">
  hora: string // HH:mm, para <input type="time">
}

const pad = (n: number) => String(n).padStart(2, '0')

// Todo se arma con getters locales del navegador. `toISOString()` devuelve
// la fecha en UTC y, en horario de tarde/noche, salía un día adelantada.
const getLocalDateTime = (): CurrentDateTime => {
  const now = new Date()
  return {
    fecha: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    hora: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  }
}

/**
 * Fecha/hora actual tomada directamente del dispositivo (zona horaria local
 * del navegador). Antes intentaba traerla de una API externa
 * (worldtimeapi.org), pero ese servicio fallaba de forma constante
 * (net::ERR_CONNECTION_RESET), así que se removió: solo agregaba latencia
 * y ruido en consola sin aportar un valor real.
 *
 * El valor se calcula una vez al montar el componente. Quien necesite la hora
 * exacta de un momento concreto (por ejemplo, al abrir un formulario) debe
 * leer el reloj en ese momento en vez de reutilizar este valor.
 */
export function useCurrentDateTime() {
  const [dateTime, setDateTime] = useState<CurrentDateTime>(getLocalDateTime)
  const [loading] = useState(false)

  useEffect(() => {
    setDateTime(getLocalDateTime())
  }, [])

  return { ...dateTime, loading }
}
