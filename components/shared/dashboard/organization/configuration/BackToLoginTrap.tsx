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

  useEffect(() => {
    if (loading) return
    if (!hasUser) return
    if (cuestionarioCompletado) return
    if (typeof window === 'undefined') return

    // Entrada dummy para interceptar el pop ANTES de salir del cuestionario.
    // Sin dummy, el back navegaría a `/` y el listener ya estaría desmontado.
    // Solo se arma una vez por montaje (logout no está memoizado y el efecto
    // puede re-ejecutarse sin desmontar).
    const arm = () => {
      window.history.pushState(
        { 'tambo-back-trap': true },
        '',
        window.location.href
      )
    }
    if (!pushedRef.current) {
      arm()
      pushedRef.current = true
    }

    // Se intercepta SIEMPRE que el usuario esté en el cuestionario incompleto.
    // Antes solo se interceptaba el primer pop (interceptedRef); un segundo
    // back rápido escapaba a la entrada anterior del historial (p. ej.
    // /recuperar-contrasena) con la sesión todavía viva. Tras cada pop se
    // re-arma el dummy para que el stack no se agote con backs rápidos.
    const onPopState = () => {
      arm()
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
