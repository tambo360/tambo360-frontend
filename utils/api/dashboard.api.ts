import { api } from '@/services/api'
import { GraphParams } from '@/types/dashboard'

export const getCurrentMonth = () => api.get('/dashboard/mes-actual')

export const getGraph = (params: GraphParams) =>
  api.get('/dashboard/grafico', { params: params })

export const getFreeLiters = () => api.get('/dashboard/litros-libres')

export const getMarketPrice = () => api.get('/dashboard/precio-mercado')
