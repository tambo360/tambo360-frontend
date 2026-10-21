'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

/**
 * Atrapa la flecha atrás del navegador en el cuestionario incompleto:
 * popstate → logout + salida dura a /iniciar-sesion.
 */
const BackToLoginTrap = () => {
  const { logout } = useAuth()

  useEffect(() => {
    // Entrada dummy: el back aterriza en la MISMA url del cuestionario
    const arm = () =>
      window.history.pushState(
        { 'tambo-back-trap': true },
        '',
        window.location.href
      )
    arm()

    const onPopState = () => {
      arm() // re-arm: backs rápidos no agotan el stack
      void logout() // user → null: mata el rebote de PublicLayout
      window.location.replace('/iniciar-sesion') // salida que siempre gana
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [logout])

  return null
}

export default BackToLoginTrap
