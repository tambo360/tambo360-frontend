import { api } from '@/services/api'
import { PeriodoCostosGenerales, reqNewGasto } from '@/types/generalCost'

export const createNewGasto = (data: reqNewGasto) =>
  api.post('/costos-generales', data)

export const getCostosGenerales = (
  params: PeriodoCostosGenerales = {
    fechaDesde: '2026-09-01T00:00:00.000Z',
    fechaHasta: '2026-09-30T00:00:00.000Z',
  }
) => api.get('/costos-generales/', { params })
