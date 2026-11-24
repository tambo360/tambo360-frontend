'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const FALLBACK_ESTABLECIMIENTO = 'Establecimiento'

function getEstablecimientoNombre(user: unknown): string {
  const org = (user as any)?.organizaciones?.[0]
  return (
    org?.establecimientoOrganizacionUsuarios?.[0]?.establecimiento?.nombre ??
    org?.organizacion?.establecimientos?.[0]?.nombre ??
    FALLBACK_ESTABLECIMIENTO
  )
}

export function usePerfil() {
  const { user, logout } = useAuth()
  const [showDatos, setShowDatos] = useState(false)

  const nombre = user?.nombre ?? ''
  const correo = user?.correo ?? ''
  const inicial = nombre.trim().charAt(0).toUpperCase() || '?'
  const establecimiento = getEstablecimientoNombre(user)

  const toggleDatos = () => setShowDatos((prev) => !prev)

  return {
    nombre,
    correo,
    inicial,
    establecimiento,
    showDatos,
    toggleDatos,
    logout,
  }
}
