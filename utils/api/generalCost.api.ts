import { api } from '@/services/api'
import { reqNewGasto } from '@/types/generalCost'

export const createNewGasto = (data: reqNewGasto) =>
  api.post('/costos-generales', data)
