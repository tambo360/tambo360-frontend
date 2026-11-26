import { api } from '@/services/api'
import type { UpdatePerfilPayload, UpdatePerfilResponse } from '@/types/profile'

export const updatePerfil = (data: UpdatePerfilPayload) =>
  api.patch<UpdatePerfilResponse>('/perfil', data)
