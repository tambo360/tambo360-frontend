'use client'

import Loading from '@/components/layout/Loading'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/iniciar-sesion')
      return
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <Loading />
  }

  return <>{children}</>
}
export default ProtectedRoute
