import { api } from '@/services/api'

// ==========================================
// 1. Configuración del Establecimiento (Cuestionario)
// ==========================================
export const sendConfiguration = async (data: any) =>
  api.post('/establecimiento/cuestionario', data)

export const getConfiguration = async () =>
  api.get('/establecimiento/cuestionario/info')

// ==========================================
// 2. ✅ Opciones de Seguimiento para Lotes
// ==========================================
export interface RazaOpcion {
  idRaza: string
  nombre: string
  value: string
  cantVacas: number
}

export interface RodeoOpcion {
  idRodeo: string
  label: string
  value: string // ej: "ALTA_PRODUCCION", "UNICO_ORDENIE", "BAJA_PRODUCCION"
  costoRacion: number
  cantVacas: number
  razas?: RazaOpcion[]
}

export interface AnimalOpcion {
  idAnimal: string
  codigo: string
  nombre: string
  categoria: string
  estado: 'SANO' | 'MASTITIS' | 'TRATAMIENTO' | 'PREPARTO'
  fechaNacimiento: string
}

export interface OpcionesSeguimientoResponse {
  tipoSeguimiento: 'RODEO' | 'RODEO_UNICO' | 'INDIVIDUAL'
  rodeos?: RodeoOpcion[]
  animales?: AnimalOpcion[]
}

/**
 * Obtiene los recursos disponibles (rodeos o animales) para crear lotes,
 * validados contra la configuración ACTIVA del establecimiento.
 */
export const getOpcionesSeguimiento =
  async (): Promise<OpcionesSeguimientoResponse> => {
    const res = await api.get('/establecimiento/info/opciones-seguimiento')
    return res.data.data
  }

// ==========================================
// 3. Fallback (Por si el backend pide cambiar a Organización)
// ==========================================
/**
 * NOTA: Si el backend te confirma que el endpoint anterior está desactivado
 * y debes usar el de organización, descomenta esta función y úsala en el hook
 * en lugar de `getOpcionesSeguimiento`.
 */
// export const getOpcionesSeguimientoOrg = async (): Promise<OpcionesSeguimientoResponse> => {
//   const res = await api.get('/organizacion/info/opciones-seguimiento')
//   return res.data.data
// }
