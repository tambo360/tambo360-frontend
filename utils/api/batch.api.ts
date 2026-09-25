import { api } from '@/services/api'
import { BatchData, BatchFilters } from '@/types/batch'

export const createBatch = (dto: BatchData) => api.post('/lote', dto)

export const updateBatch = (dto: BatchData, id: string) =>
  api.patch(`/lote/${id}`, dto)

export const getBatches = ({ filters }: { filters: BatchFilters }) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, v]) => v !== undefined && v !== '' && v !== null
    )
  )

  return api.get('/lote/listar', { params })
}

export const getBatch = (id: string) => api.get(`/lote/buscar/${id}`)

// ✅ Producción de hoy = listar con filtro de fecha (formato dd/mm/aaaa)
// Reemplaza al viejo /lote/produccion-hoy que no existe en el backend.
export const getBatchesDay = () => {
  const hoy = new Date()
  const dd = String(hoy.getDate()).padStart(2, '0')
  const mm = String(hoy.getMonth() + 1).padStart(2, '0')
  const yyyy = hoy.getFullYear()
  const fechaHoy = `${dd}/${mm}/${yyyy}`

  return api.get('/lote/listar', {
    params: {
      fecha_desde: fechaHoy,
      fecha_hasta: fechaHoy,
      limit: 100,
    },
  })
}

export const deleteBatch = (id: string) => api.delete(`/lote/${id}`)

export const completeBatch = (id: string) => api.post(`/lote/completar/${id}`)
