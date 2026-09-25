import { api } from '@/services/api'
import { DecreaseData, DecreaseWithLote } from '@/types/decrease'

export const getDecreaseTypes = () => api.get('/mermas/tipos')

// POST /mermas
// El backend espera: { id_lote, tipoMerma, cantidad, observaciones? }
export const createDecrease = (dto: DecreaseWithLote) =>
  api.post('/mermas', {
    id_lote: dto.idLote,
    tipoMerma: dto.tipo,
    cantidad: dto.cantidad,
    observaciones: dto.observacion, // ✅ PLURAL
  })

export const getDecreases = () => api.get('/mermas')
export const getDecrease = (id: string) => api.get(`/mermas/${id}`)

// PUT /mermas/:id — mismo body, sin id_lote (el doc lo prohíbe explícitamente)
export const updateDecrease = (dto: DecreaseData, id: string) =>
  api.put(`/mermas/${id}`, {
    tipoMerma: dto.tipo,
    cantidad: dto.cantidad,
    observaciones: dto.observacion, // ✅ PLURAL
  })

export const deleteDecrease = (id: string) => api.delete(`/mermas/${id}`)
