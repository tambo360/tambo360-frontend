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

export const newGeneralCostSchema = z.object({
  tipoCosto: z.enum(GeneralCostType, {
    message: 'Tipo de costo requerido',
  }),
  descripcion: z
    .string()
    .max(500, 'Máximo 500 caracteres')
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
    .refine((v) => !isNaN(Date.parse(v)), 'Fecha no válida'),
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
