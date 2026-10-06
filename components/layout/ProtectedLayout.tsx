'use client'

import Loading from '@/components/layout/Loading'
import { useAuth } from '@/context/AuthContext'
import { useOnlineStatus } from '@/hooks/connection/useOnlineStatus'
import { getLastUser } from '@/lib/offlineUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const isOnline = useOnlineStatus()

  // Sin red y con última sesión conocida: se deja pasar con la caché local
  // en vez de expulsar al login (que además no funcionaría offline).
  const hasSnapshot = typeof window !== 'undefined' && getLastUser() !== null
  const offlineWithCache = !isOnline && (user !== null || hasSnapshot)

  useEffect(() => {
    if (loading) return

    if (!user && !offlineWithCache) {
      router.replace('/iniciar-sesion')
      return
    }
  }, [user, loading, router, offlineWithCache])

  if (loading || (!user && !offlineWithCache)) {
    return <Loading />
  }

  return <>{children}</>
}
export default ProtectedRoute
