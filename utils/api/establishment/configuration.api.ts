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
  value: string
  costoRacion: number
  cantVacas: number
  razas?: RazaOpcion[]
}

export interface AnimalOpcion {
  idAnimal: string
  codigo: string
  nombre: string
  raza?: string
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
 * Helper: Filtra los animales "fallback" que el backend usa como placeholders
 */
const filtrarAnimalesReales = (animales: AnimalOpcion[]): AnimalOpcion[] => {
  return animales.filter((animal) => {
    const nombre = (animal.nombre || '').toLowerCase()
    const codigo = (animal.codigo || '').toLowerCase()
    // Excluir cualquier animal que sea fallback o temporal
    if (nombre.includes('fallback')) return false
    if (codigo.includes('fallback')) return false
    if (codigo.includes('temp-')) return false
    return true
  })
}

/**
 * Endpoint alternativo que SÍ devuelve los animales reales.
 * Se usa como respaldo cuando el endpoint oficial falla o trae basura.
 */
export const getAnimalesReales = async (): Promise<AnimalOpcion[]> => {
  const res = await api.get('/conf/animal/listar')
  const animales = res.data?.data ?? []
  return filtrarAnimalesReales(animales)
}

/**
 * Obtiene los recursos disponibles (rodeos o animales) para crear lotes.
 * Si el endpoint oficial devuelve solo fallbacks, usa el alternativo.
 */
export const getOpcionesSeguimiento =
  async (): Promise<OpcionesSeguimientoResponse> => {
    const res = await api.get('/establecimiento/info/opciones-seguimiento')
    const data: OpcionesSeguimientoResponse = res.data.data

    // ✅ FALLBACK INTELIGENTE: Si es INDIVIDUAL y los animales son puros fallbacks,
    // usamos el endpoint alternativo que sí trae los datos reales
    if (data.tipoSeguimiento === 'INDIVIDUAL') {
      const animalesFiltrados = filtrarAnimalesReales(data.animales ?? [])

      // Si no quedó ningún animal real, intentamos con el endpoint alternativo
      if (animalesFiltrados.length === 0) {
        try {
          const animalesReales = await getAnimalesReales()
          return {
            ...data,
            animales: animalesReales,
          }
        } catch (error) {
          console.error(
            'Error al obtener animales del endpoint alternativo:',
            error
          )
        }
      }

      // Si había animales pero también fallbacks, filtramos
      return {
        ...data,
        animales: animalesFiltrados,
      }
    }

    return data
  }
