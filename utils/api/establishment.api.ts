import { api } from '@/services/api'
import {
  EstablishmentData,
  UpdateEstablishmentPayload,
} from '@/types/establishment'

export const createEstablishment = (dto: EstablishmentData) =>
  api.post('/organizacion', { nombre: dto.nombre })

export const updateEstablishment = (dto: UpdateEstablishmentPayload) =>
  api.patch(`/conf/establecimiento`, dto)

// ✅ Corregido: era /organizacion/${id}, debe ser /establecimiento/${id}
export const getEstablishment = (id: string) =>
  api.get(`/establecimiento/${id}`)
