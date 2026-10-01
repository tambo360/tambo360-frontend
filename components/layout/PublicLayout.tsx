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

  useEffect(() => {
    if (loading) return

    if (user && !pathname.includes('/verificar')) {
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
  }, [user, loading, router, pathname, cuestionarioCompletado])

  if (loading) return <Loading />

  return <>{children}</>
}
