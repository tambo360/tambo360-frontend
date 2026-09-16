import { api } from '@/services/api'
import {
  EstablishmentData,
  UpdateEstablishmentPayload,
} from '@/types/establishment'

export const createEstablishment = (dto: EstablishmentData) =>
  api.post('/establecimiento', dto, {
    headers: {
      'x-organizacion-id': dto.organizacionId,
    },
  })

export const updateEstablishment = (dto: UpdateEstablishmentPayload) =>
  api.patch(`/conf/establecimiento`, dto)

export const getEstablishment = (id: string) =>
  api.get(`/establecimiento/${id}`)
