'use client'

import type { User } from '@/types/types'

const LAST_USER_KEY = 'tambo360-last-user'

/**
 * Último usuario autenticado (solo perfil visible: nombre, avatar...).
 * Permite que un reload offline renderice el shell en vez de expulsar al
 * login. Nunca guarda tokens ni credenciales.
 */
export function saveLastUser(user: User) {
  window.localStorage.setItem(LAST_USER_KEY, JSON.stringify(user))
}

export function getLastUser(): User | null {
  try {
    const raw = window.localStorage.getItem(LAST_USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function clearLastUser() {
  window.localStorage.removeItem(LAST_USER_KEY)
}

const QUESTIONNAIRE_KEY = 'tambo360-cuestionario-completado'

/**
 * Flag de cuestionario completado. Vive en contexto y solo el login lo
 * actualiza, así que sin persistencia cualquier reload (online u offline)
 * lo resetea a `false` y `PublicLayout` expulsa a `/cuestionario`.
 */
export function saveCuestionarioCompletado(value: boolean) {
  window.localStorage.setItem(QUESTIONNAIRE_KEY, value ? '1' : '0')
}

export function getCuestionarioCompletado(): boolean | null {
  try {
    const raw = window.localStorage.getItem(QUESTIONNAIRE_KEY)
    if (raw === '1') return true
    if (raw === '0') return false
    return null
  } catch {
    return null
  }
}

export function clearCuestionarioCompletado() {
  window.localStorage.removeItem(QUESTIONNAIRE_KEY)
}

/**
 * Deriva el flag desde el objeto usuario (misma lectura que `LoginForm`).
 * Permite restaurarlo en cada `fetchSession` sin obligar a un login nuevo:
 * si la sesión ya estaba activa cuando se agregó la persistencia, el
 * localStorage aún no tiene el flag guardado.
 */
export function deriveCuestionarioCompletado(user: unknown): boolean {
  const org = (user as any)?.organizaciones?.[0]
  return (
    org?.establecimientoOrganizacionUsuarios?.[0]?.establecimiento
      ?.cuestionarioCompletado ??
    org?.organizacion?.establecimientos?.[0]?.cuestionarioCompletado ??
    false
  )
}
