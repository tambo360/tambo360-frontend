'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * Botón atrás visible (mobile / PWA sin barra del navegador).
 * Replica el efecto del trap de la flecha del navegador: cierra sesión
 * (si no, `PublicLayout` rebotaría adelante al cuestionario) y manda a
 * `/iniciar-sesion`. Solo se monta en el cuestionario incompleto.
 */
const CuestionarioBackButton = () => {
  const { logout } = useAuth()
  const router = useRouter()

  const handleBack = () => {
    // `logout` limpia user/token + caché local de forma síncrona y dispara
    // `POST /auth/logout` en background; no se espera para navegar.
    void logout()
    router.replace('/iniciar-sesion')
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="rounded-full"
      onClick={handleBack}
      aria-label="Volver a iniciar sesión"
    >
      <ChevronLeft className="size-6" />
    </Button>
  )
}

export default CuestionarioBackButton
