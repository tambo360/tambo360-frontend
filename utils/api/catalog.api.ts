import { api } from '@/services/api'

// ─── Endpoint 11: Catálogo (rodeos o animales básicos) ───
export const getCatalogo = async () => {
  const res = await api.get('/conf/info/catalogo')
  return res.data?.data ?? res.data
}

// ─── Endpoint 8: Alta form-data ─────────────────
export const getAltaFormData = async () => {
  const res = await api.get('/conf/animal/alta/form-data')
  return res.data?.data ?? res.data
}

// ─── Endpoint 2: Registrar Alta ─────────────────
export const postAltaAnimal = async (payload: any) => {
  const res = await api.post('/conf/animal', payload)
  return res.data
}

// ─── Endpoint 9: Baja form-data ─────────────────
export const getBajaFormData = async () => {
  const res = await api.get('/conf/animal/baja/form-data')
  return res.data?.data ?? res.data
}

// ─── Endpoint 3: Dar de Baja ────────────────────
export const deleteBajaAnimal = async (payload: any) => {
  const res = await api.delete('/conf/animal', { data: payload })
  return res.data
}

// ─── Endpoint 10: Transferir form-data ──────────
export const getTransferFormData = async () => {
  const res = await api.get('/conf/animal/transferir/form-data')
  return res.data?.data ?? res.data
}

// ─── Endpoint 7: Transferir animales ────────────
export const postTransferirAnimal = async (payload: any) => {
  const res = await api.post('/conf/animal/transferir', payload)
  return res.data
}

// ─── Endpoint 5: Movimientos (transferencias) ───
export const getMovimientos = async () => {
  const res = await api.get('/conf/movimiento')
  return res.data?.data ?? res.data
}

// ─── Endpoint 4: Listar animales (vista INDIVIDUAL) ─────
// Devuelve DEL, situacion, género, observación y producción del día
export const getAnimalesListar = async (params?: {
  codigo?: string
  nombre?: string
  estado?: string
  orden?: 'asc' | 'desc'
  page?: number
  limit?: number
}) => {
  const res = await api.get('/conf/animal/listar', { params })
  return res.data?.data ?? res.data
}

// ─── Endpoint 6: Actualizar animal (PATCH) ─────
export const updateAnimalApi = async (
  id: string,
  codigo: string,
  nombre: string,
  observacion?: string
) => {
  // Usamos la misma instancia 'api' que ya inyecta los headers de autenticación.
  // En Axios, los query params se pasan en el tercer argumento (config).
  const res = await api.patch('/conf/animal', null, {
    params: { id, codigo, nombre, observacion },
  })
  return res.data
}
