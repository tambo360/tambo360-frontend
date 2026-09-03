import { api } from '@/services/api'
import {
  CreateNewCostRequest,
  DEFAULT_GENERAL_COST_PERIOD,
  GeneralCostPeriod,
} from '@/types/generalCost'

export const createGeneralCost = (data: CreateNewCostRequest) =>
  api.post('/costos-generales', data)

export const getGeneralCosts = (
  params: GeneralCostPeriod = DEFAULT_GENERAL_COST_PERIOD
) => api.get('/costos-generales/', { params })

export const getGeneralCostsSummary = (
  params: GeneralCostPeriod = DEFAULT_GENERAL_COST_PERIOD
) => api.get('/costos-generales/resumen', { params })
