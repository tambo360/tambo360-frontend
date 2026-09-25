import { api } from '@/services/api'
import { TransferAnimalPayload, TransferRodeoPayload } from '@/types/transfer'

export const transferAnimalRequest = (payload: TransferAnimalPayload) =>
  api.post('/conf/animal/transferir', payload)

export const transferRodeoRequest = (payload: TransferRodeoPayload) =>
  api.post('/conf/animal/transferir', payload)

// ── Form data para transferencia (endpoint 10 del README) ──
export const getTransferFormData = async () => {
  const res = await api.get('/conf/animal/transferir/form-data')
  return res.data?.data ?? res.data
}
