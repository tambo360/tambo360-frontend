'use client'

import Loading from '@/components/layout/Loading'
import { useAuth } from '@/context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, cuestionarioCompletado } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isRecoveryRoute = pathname === '/recuperar-contrasena'
  const isVerificationRoute = pathname.includes('/verificar')
  const shouldRedirectAuthenticatedUser =
    !isRecoveryRoute && !isVerificationRoute

  useEffect(() => {
    if (loading) return
    if (typeof window !== 'undefined' && !navigator.onLine) return

    if (user && shouldRedirectAuthenticatedUser) {
      if (user.organizaciones != undefined && user.organizaciones?.length > 0) {
        const orgUsuario = user.organizaciones[0]
        const orgId =
          orgUsuario?.organizacion?.idOrganizacion ?? orgUsuario?.idOrganizacion
        const estId =
          orgUsuario?.establecimientoOrganizacionUsuarios?.[0]
            ?.idEstablecimiento ??
          orgUsuario?.organizacion?.establecimientos?.[0]?.idEstablecimiento

        if (!orgId || !estId) {
          router.replace('/bienvenida')
          return
        }

        if (cuestionarioCompletado) {
          router.replace(`/organizaciones/${orgId}/${estId}/analisis`)
        } else {
          router.replace(`/organizaciones/${orgId}/${estId}/cuestionario`)
        }
        return
      }
      router.replace('/bienvenida')
    }
  }, [
    user,
    loading,
    router,
    shouldRedirectAuthenticatedUser,
    cuestionarioCompletado,
  ])

  if (loading) return <Loading />

  // Sesión activa fuera de /verificar y de recuperación: la redirección ya
  // está decidida en el efecto de arriba. Mostrar <Loading /> evita el flash
  // del formulario público mientras el router.replace hace efecto. Offline
  // no se redirige (ver efecto), así que ahí sí se renderiza el contenido.
  const isOffline = typeof window !== 'undefined' && !navigator.onLine
  if (!isOffline && user && shouldRedirectAuthenticatedUser) {
    return <Loading />
  }

  return <>{children}</>
}
