import { api } from '@/services/api'
import {
  EstablishmentData,
  UpdateEstablishmentPayload,
} from '@/types/establishment'

// ✅ CORREGIDO: Según la doc, se crea todo en /organizacion y solo necesita el nombre
export const createEstablishment = (dto: EstablishmentData) =>
  api.post('/organizacion', { nombre: dto.nombre })

export const updateEstablishment = (dto: UpdateEstablishmentPayload) =>
  api.patch(`/conf/establecimiento`, dto)

export const getEstablishment = (id: string) => api.get(`/organizacion/${id}`) // Ajustado según la doc: "Obtener Organización por ID: /organizacion/:id"
