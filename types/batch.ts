import { Alert } from '@/types/alerts'
import { CostosDirecto } from '@/types/cost'
import { Merma } from '@/types/decrease'
import { TipoDestino, TipoSeguimiento, Unidad } from '@/types/enums'
import { Establecimiento } from '@/types/establishment'
import { Rodeo } from '@/types/establishment/herd'
import { Product } from '@/types/product'
import z from 'zod'

// ✅ Estados sanitarios según backend
export const EstadoAnimalEnum = z.enum([
  'SANO',
  'MASTITIS',
  'TRATAMIENTO',
  'PREPARTO',
])
export const DestinoAnimalEnum = z.enum(['TANQUE', 'DESCARTE'])

const baseFields = {
  idProducto: z
    .string()
    .uuid('ID de producto inválido')
    .min(1, 'Debe seleccionar un producto'),
  unidad: z.enum([Unidad.KG, Unidad.LITROS], 'Unidad inválida'),

  // TempTanque: condicional (se valida en superRefine)
  tempTanque: z.coerce.number().optional(),

  destino: z.enum(
    [TipoDestino.TANQUE_FRIO, TipoDestino.VENTA, TipoDestino.FABRICA_QUESOS],
    'Destino inválido'
  ),

  cantidad: z.preprocess(
    (val) =>
      val === '' || val === null || val === undefined ? undefined : Number(val),
    z.number().positive('La cantidad debe ser mayor a 0')
  ),

  // ✅ CAMPO NUEVO: Obligatorio según backend
  cantBajadas: z.preprocess(
    (val) =>
      val === '' || val === null || val === undefined ? undefined : Number(val),
    z.number().int().min(1, 'Mínimo 1 bajada').max(100, 'Máximo 100 bajadas')
  ),

  // Fecha en formato dd/mm/aaaa
  fechaProduccion: z
    .string()
    .min(1, 'La fecha de producción es obligatoria')
    .refine(
      (val) => {
        // Valida formato dd/mm/aaaa
        const regex = /^\d{2}\/\d{2}\/\d{4}$/
        if (!regex.test(val)) return false

        const [day, month, year] = val.split('/')
        const fechaIngresada = new Date(`${year}-${month}-${day}T00:00:00`)
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const haceUnaSemana = new Date(hoy)
        haceUnaSemana.setDate(hoy.getDate() - 7)

        return fechaIngresada >= haceUnaSemana && fechaIngresada <= hoy
      },
      {
        message:
          'La fecha debe estar entre hoy y 7 días atrás (formato: dd/mm/aaaa)',
      }
    ),
}

// Animal en modo INDIVIDUAL
const AnimalLoteSchema = z.object({
  idAnimal: z.string().uuid('ID de animal inválido'),
  litros: z.coerce.number().positive('Los litros deben ser mayores a 0'),
  estado: EstadoAnimalEnum,
  destino: DestinoAnimalEnum, // ✅ Requerido por backend
})

const IndividualSchema = z
  .object({
    ...baseFields,
    tipoSeguimiento: z.literal(TipoSeguimiento.INDIVIDUAL),
    animales: z
      .array(AnimalLoteSchema)
      .min(1, 'Debe seleccionar al menos un animal'),
  })
  .refine(
    (data) => {
      const sumaLitros = data.animales.reduce((acc, a) => acc + a.litros, 0)
      return Math.abs(sumaLitros - data.cantidad) < 0.01
    },
    {
      message:
        'La suma de litros de los animales debe coincidir con la cantidad total',
      path: ['animales'],
    }
  )

// Modo RODEO
const RodeoSchema = z.object({
  ...baseFields,
  tipoSeguimiento: z.literal(TipoSeguimiento.RODEO),
  idRodeo: z
    .string()
    .uuid('ID de rodeo inválido')
    .min(1, 'Debe seleccionar un rodeo válido'),
})

// Modo RODEO_UNICO
const RodeoUnicoSchema = z.object({
  ...baseFields,
  tipoSeguimiento: z.literal(TipoSeguimiento.RODEO_UNICO),
  idRodeo: z
    .string()
    .uuid('ID de rodeo inválido')
    .min(1, 'Debe seleccionar un rodeo válido'),
})

// ✅ Schema principal con validación condicional
export const BatchSchema = z
  .discriminatedUnion('tipoSeguimiento', [
    RodeoSchema,
    RodeoUnicoSchema,
    IndividualSchema,
  ])
  .superRefine((data, ctx) => {
    // tempTanque es obligatoria SOLO si destino = TANQUE_FRIO
    if (data.destino === TipoDestino.TANQUE_FRIO) {
      if (data.tempTanque === undefined || data.tempTanque === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'La temperatura del tanque es obligatoria cuando el destino es Tanque Frío',
          path: ['tempTanque'],
        })
      } else if (data.tempTanque <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La temperatura del tanque debe ser mayor a 0',
          path: ['tempTanque'],
        })
      }
    }
  })

export type BatchData = z.infer<typeof BatchSchema>
export type BatchDto = BatchData & { id: string }

// Interfaz para la respuesta del backend
export interface Lote {
  idLote: string
  numeroLote: number
  fechaProduccion: string
  idProducto: string
  producto?: Product
  cantidad: number
  unidad: Unidad
  cantAnimales?: number
  idEstablecimiento: string
  estado: boolean
  establecimiento?: Establecimiento
  tempTanque?: number
  destino: TipoDestino
  rodeo?: Rodeo
  mermas?: Merma[]
  costosDirectos?: CostosDirecto[]
  alertas?: Alert[]
  cantBajadas: number
  tipoSeguimiento?: TipoSeguimiento
}

export interface BatchFilters {
  nombre?: string
  orden?: 'asc' | 'desc'
  page?: string
  limit?: string
  estado?: boolean
  producto?: string
  numeroLote?: string
  fecha_desde?: string
  fecha_hasta?: string
}
