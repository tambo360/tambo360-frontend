'use client'
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import Cookies from 'js-cookie'
import { api } from '@/services/api'
import { useLogout } from '@/hooks/auth/useLogout'
import { AuthState, User } from '@/types/types'
import Loading from '@/components/layout/Loading'
import { usePathname, useRouter } from 'next/navigation'

interface AuthContextType extends AuthState {
  setToken: (token: string | null) => void
  login: ({ user, token }: { user: User; token: string }) => void
  setUser: Dispatch<SetStateAction<User | null>>
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()
  const { mutateAsync } = useLogout()
  const navigate = useRouter()

  const isAuthenticated = !!user

  const LANDING_PATHS = [
    '/',
    '/contacto',
    '/precios',
    '/producto',
    '/nosotros',
    '/equipo',
    '/testimonios',
  ]

  const fetchSession = async () => {
    if (LANDING_PATHS.includes(pathname)) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await api.get('/auth/me')
      if (res?.data.data) {
        setUser(res.data.data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchSession()
  }, [])

  const login = async ({ user, token }: { user: User; token: string }) => {
    setLoading(true)
    setUser(user)
    setToken(token)
    setError(null)
    navigate.push('/bienvenida')
    setLoading(false)
  }

  const logout = async () => {
    try {
      setUser(null)
      setToken(null)
      setError(null)
      await mutateAsync()
      Cookies.remove('token')
    } catch (error) {
      console.warn(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        setLoading,
        setError,
      }}
    >
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
