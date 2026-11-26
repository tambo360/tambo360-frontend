'use client'

import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/context/AuthContext'
import { useUpdatePerfil } from '@/hooks/profile/useUpdatePerfil'
import {
  createPerfilSchema,
  type PerfilFormValues,
  type UpdatePerfilPayload,
} from '@/types/profile'

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
  const { mutate, isPending } = useUpdatePerfil()
  const [showDatos, setShowDatos] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const nombre = user?.nombre ?? ''
  const correo = user?.correo ?? ''
  const verificado = user?.verificado ?? true
  const inicial = nombre.trim().charAt(0).toUpperCase() || '?'
  const establecimiento = getEstablecimientoNombre(user)

  const schema = useMemo(
    () => createPerfilSchema(nombre, correo),
    [nombre, correo]
  )

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PerfilFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre, correo, contraseñaActual: '' },
  })

  const [nombreInput, correoInput] = useWatch({
    control,
    name: ['nombre', 'correo'],
  })

  const nombreCambio = (nombreInput ?? '').trim() !== nombre
  const correoCambio =
    (correoInput ?? '').trim().toLowerCase() !== correo.toLowerCase()
  const hasChanges = nombreCambio || correoCambio

  const toggleDatos = () => {
    setShowDatos((prev) => !prev)
    setNotice(null)
    clearErrors()
    reset({ nombre, correo, contraseñaActual: '' })
  }

  const onSubmit = handleSubmit((data) => {
    setNotice(null)

    // Solo se envía lo que cambió: si va el correo, backend exige la
    // contraseña actual aunque sea el mismo correo.
    const payload: UpdatePerfilPayload = {}
    if (data.nombre.trim() !== nombre) payload.nombre = data.nombre.trim()
    if (data.correo.trim().toLowerCase() !== correo.toLowerCase()) {
      payload.correo = data.correo.trim()
      payload.contraseñaActual = data.contraseñaActual
    }
    if (!payload.nombre && !payload.correo) return

    mutate(payload, {
      onSuccess: (res) => {
        const actualizado = res.data.data
        setNotice(res.data.message)
        reset({
          nombre: actualizado.nombre,
          correo: actualizado.correo,
          contraseñaActual: '',
        })
      },
      onError: (error) => {
        const status = error.response?.status
        const message =
          error.response?.data?.message ??
          'No se pudo actualizar el perfil. Inténtalo de nuevo.'

        if (status === 401) setError('contraseñaActual', { message })
        else if (status === 409) setError('correo', { message })
        else setError('root.serverError', { message })
      },
    })
  })

  return {
    nombre,
    correo,
    inicial,
    establecimiento,
    verificado,
    showDatos,
    toggleDatos,
    logout,
    register,
    errors,
    onSubmit,
    isPending,
    hasChanges,
    correoCambio,
    notice,
  }
}
