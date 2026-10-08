'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Atrapa la flecha atrás del navegador en el cuestionario incompleto.
 * Sin esto, el historial queda como `[/, .../cuestionario]` porque el login
 * usa `replace` (borra `/iniciar-sesion`), y el back cae al landing `/`.
 * Al interceptar, cierra sesión (si no, `PublicLayout` rebotaría adelante
 * de nuevo al cuestionario) y manda a `/iniciar-sesion`.
 */
const BackToLoginTrap = () => {
  const { user, loading, cuestionarioCompletado, logout } = useAuth()
  const router = useRouter()
  const hasUser = !!user

  const pushedRef = useRef(false)
  const interceptedRef = useRef(false)

  useEffect(() => {
    if (loading) return
    if (!hasUser) return
    if (cuestionarioCompletado) return
    if (typeof window === 'undefined') return

    // Entrada dummy para interceptar el pop ANTES de salir del cuestionario.
    // Sin dummy, el back navegaría a `/` y el listener ya estaría desmontado.
    if (!pushedRef.current) {
      window.history.pushState(
        { 'tambo-back-trap': true },
        '',
        window.location.href
      )
      pushedRef.current = true
    }

    const onPopState = () => {
      if (interceptedRef.current) return
      interceptedRef.current = true
      // `logout` limpia user/token + caché local de forma síncrona y dispara
      // `POST /auth/logout` en background; no se espera para navegar.
      void logout()
      router.replace('/iniciar-sesion')
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [loading, hasUser, cuestionarioCompletado, logout, router])

  return null
}

export default BackToLoginTrap
