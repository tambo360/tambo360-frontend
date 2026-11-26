'use client'

import { useMutation } from '@tanstack/react-query'
import type { AxiosError, AxiosResponse } from 'axios'
import { useAuth } from '@/context/AuthContext'
import { saveLastUser } from '@/lib/offlineUser'
import { updatePerfil } from '@/utils/api/profile.api'
import type { UpdatePerfilPayload, UpdatePerfilResponse } from '@/types/profile'

export function useUpdatePerfil() {
  const { user, setUser } = useAuth()

  return useMutation<
    AxiosResponse<UpdatePerfilResponse>,
    AxiosError<{ message?: string }>,
    UpdatePerfilPayload
  >({
    mutationFn: (payload) => updatePerfil(payload),
    onSuccess: ({ data }) => {
      if (!user) return
      // Actualiza el usuario en el contexto (avatar, nombre, verificado)
      // y el snapshot offline, sin esperar otro GET /auth/me.
      const updated = {
        ...user,
        nombre: data.data.nombre,
        correo: data.data.correo,
        verificado: data.data.verificado,
      }
      setUser(updated)
      saveLastUser(updated)
    },
  })
}
