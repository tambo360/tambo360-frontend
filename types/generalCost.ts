import z from 'zod'
import { GeneralCostType } from '@/types/enums'

export const GENERAL_COST_TYPE_LABELS: Record<GeneralCostType, string> = {
  PERSONAL: 'Personal',
  SERVICIOS: 'Servicios',
  LOGISTICA: 'Logística',
  MANTENIMIENTO: 'Mantenimiento',
  VETERINARIO: 'Veterinario',
  INMUEBLE: 'Inmueble',
  OTRO: 'Otro',
}

// Reglas del formulario de nuevo costo
export const COST_MAX_DAYS_BACK = 7
export const COST_DESCRIPTION_MAX = 100

const pad = (n: number) => String(n).padStart(2, '0')

// Fecha local en formato YYYY-MM-DD (sin pasar por UTC)
const toLocalISODate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// Rango permitido: desde 7 días atrás hasta hoy (hora local)
export const getCostDateRange = () => {
  const today = new Date()
  const min = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - COST_MAX_DAYS_BACK
  )
  return { min: toLocalISODate(min), max: toLocalISODate(today) }
}

export const newGeneralCostSchema = z.object({
  tipoCosto: z.enum(GeneralCostType, {
    message: 'Tipo de costo requerido',
  }),
  descripcion: z
    .string()
    .max(COST_DESCRIPTION_MAX, `Máximo ${COST_DESCRIPTION_MAX} caracteres`)
    .optional()
    .refine((v) => !v || v.trim().length > 0, {
      message: 'La descripción no puede contener solo espacios',
    }),
  monto: z.preprocess(
    (v) => {
      if (typeof v !== 'string' || v.trim() === '') return undefined
      return Number(v.trim().replace(',', '.'))
    },
    z
      .number({ message: 'Monto requerido' })
      .refine((v) => !isNaN(v), 'Monto no válido')
      .gt(0, 'Debe ser mayor a 0')
  ),
  fecha: z
    .string()
    .min(1, 'Fecha requerida')
    .refine((v) => !isNaN(Date.parse(v)), 'Fecha no válida')
    .refine(
      (v) => {
        const { min, max } = getCostDateRange()
        return v >= min && v <= max
      },
      {
        message: `La fecha debe estar entre los últimos ${COST_MAX_DAYS_BACK} días y hoy`,
      }
    ),
})

export type CreateNewCostRequest = z.infer<typeof newGeneralCostSchema>

export interface GeneralCost {
  idCostoGeneral: string
  tipoCosto: string
  descripcion?: string
  monto: number
  fecha: string
  automatico?: boolean
  soloLectura?: boolean
}

export interface GeneralCostPeriod {
  fechaDesde: string
  fechaHasta: string
}

// Período de un mes completo (en UTC): del día 1 a las 00:00
// hasta el último día a las 23:59:59.999. `month` va de 0 (enero) a 11.
export const getMonthPeriod = (
  year: number,
  month: number
): GeneralCostPeriod => ({
  fechaDesde: new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)).toISOString(),
  fechaHasta: new Date(
    Date.UTC(year, month + 1, 0, 23, 59, 59, 999)
  ).toISOString(),
})

const now = new Date()

// Mes actual (ya no está fijo en septiembre)
export const DEFAULT_GENERAL_COST_PERIOD: GeneralCostPeriod = getMonthPeriod(
  now.getUTCFullYear(),
  now.getUTCMonth()
)

export interface EconomicSummary {
  periodo: GeneralCostPeriod
  gastoAlimentacion: number
  gastoCostosGenerales: number
  gastoTotal: number
  lotesCompletos: number
  prorrateoPromedio: number
}
