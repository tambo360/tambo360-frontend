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

export const DEFAULT_GENERAL_COST_PERIOD: GeneralCostPeriod = {
  fechaDesde: '2026-09-01T00:00:00.000Z',
  fechaHasta: '2026-09-30T00:00:00.000Z',
}

export interface EconomicSummary {
  periodo: GeneralCostPeriod
  gastoAlimentacion: number
  gastoCostosGenerales: number
  gastoTotal: number
  lotesCompletos: number
  prorrateoPromedio: number
}
