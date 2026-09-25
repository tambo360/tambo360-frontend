import { api } from '@/services/api'
import { DecreaseData, DecreaseWithLote } from '@/types/decrease'

export const getDecreaseTypes = () => api.get('/mermas/tipos')

// POST /mermas
// El backend espera: { tipoMerma, cantidad, observacion?, id_lote }
export const createDecrease = (dto: DecreaseWithLote) =>
  api.post('/mermas', {
    tipoMerma: dto.tipo,
    cantidad: dto.cantidad,
    observacion: dto.observacion,
    id_lote: dto.idLote,
  })

export const getDecreases = () => api.get('/mermas')
export const getDecrease = (id: string) => api.get(`/mermas/${id}`)

// PUT /mermas/:id — mismo body, sin id_lote (va en la URL)
export const updateDecrease = (dto: DecreaseData, id: string) =>
  api.put(`/mermas/${id}`, {
    tipoMerma: dto.tipo,
    cantidad: dto.cantidad,
    observacion: dto.observacion,
  })

export const deleteDecrease = (id: string) => api.delete(`/mermas/${id}`)
