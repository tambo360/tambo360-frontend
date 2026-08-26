import {
  TipoOrdenie,
  TipoRodeo,
  TipoSeguimiento,
  VentaLeche,
} from '@/types/enums'
import z from 'zod'

const rodeoSchema = z.object({
  tipoRodeo: z.nativeEnum(TipoRodeo),
  cantVacas: z
    .number('La cantidad de vacas debe ser un número')
    .int('La cantidad de vacas debe ser un número entero')
    .positive('La cantidad de vacas debe ser un número entero positivo'),
  costoRacion: z
    .number('El costo de la ración debe ser un número')
    .positive('El costo de la ración debe ser un número positivo'),
})

// Construimos un esquema discriminado por `TipoSeguimiento` para validar cada caso
const baseSchema = z.object({
  cantVacas: z
    .number('La cantidad de vacas debe ser un número')
    .int('La cantidad de vacas debe ser un número entero')
    .positive('La cantidad de vacas debe ser un número entero positivo'),
  cantOrdenie: z
    .number()
    .int('La cantidad de ordeñes debe ser un número entero')
    .positive(
      'La cantidad de ordeñes por día debe ser un número entero positivo'
    ),
  tipoOrdenie: z.nativeEnum(TipoOrdenie),
  promLitros: z
    .number('El promedio de litros debe ser un número')
    .positive('El promedio de litros debe ser un número positivo'),
  ventaLeche: z.nativeEnum(VentaLeche),
  empleados: z.boolean('El campo de empleados debe ser un booleano'),
  cantEmpleados: z
    .number()
    .int('La cantidad de empleados debe ser un número entero')
    .positive('La cantidad de empleados debe ser un número entero positivo')
    .optional(),
  ubicacion: z.object({
    provincia: z.string('La provincia es requerida'),
    localidad: z.string('La localidad es requerida'),
  }),
})

const rodeoUnicoSchema = z.object({
  tipoRodeo: z.literal('UNICO'),
  cantVacas: z.number().int().positive(),
  costoRacion: z.number().positive(),
})

const animalSchema = z.object({
  codigo: z.string().nonempty('El código es requerido'),
  nombre: z.string().optional(),
  categoria: z.string().nonempty('La categoría es requerida'),
  estado: z.string().nonempty('El estado es requerido'),
  fechaNacimiento: z.string().optional(),
})

const schemaRodeo = baseSchema.extend({
  TipoSeguimiento: z.literal(TipoSeguimiento.RODEO),
  rodeos: z.array(rodeoSchema).min(1),
})

const schemaRodeoUnico = baseSchema.extend({
  TipoSeguimiento: z.literal(TipoSeguimiento.RODEO_UNICO),
  // Permitimos un único rodeo cuyo tipo no forma parte del enum original
  rodeos: z.array(rodeoUnicoSchema).length(1),
})

const schemaIndividual = baseSchema.extend({
  TipoSeguimiento: z.literal(TipoSeguimiento.INDIVIDUAL),
  rodeos: z.undefined().optional(),
  animales: z.array(animalSchema).min(1),
})

export const configurationSchema = z
  .discriminatedUnion('TipoSeguimiento', [
    schemaRodeo,
    schemaRodeoUnico,
    schemaIndividual,
  ])
  .superRefine((data, ctx) => {
    // Validación: si empleados === true, cantEmpleados es obligatorio
    if (
      data.empleados &&
      (data.cantEmpleados === undefined || data.cantEmpleados === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'La cantidad de empleados es requerida si el establecimiento tiene empleados',
      })
    }

    // Validación específica para RODEO: debe existir al menos un rodeo de cada tipo definido en el enum
    if (data.TipoSeguimiento === TipoSeguimiento.RODEO) {
      const rodeos = (data as any).rodeos
      if (!rodeos || rodeos.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Debe existir al menos un rodeo cuando el seguimiento es RODEO',
        })
        return
      }
      const tiposPresentes = new Set(rodeos.map((r: any) => r.tipoRodeo))
      const todosLosTipos = Object.values(TipoRodeo)
      for (const tipo of todosLosTipos) {
        if (!tiposPresentes.has(tipo)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Debe existir al menos un rodeo de cada tipo cuando el seguimiento es RODEO',
          })
          break
        }
      }
    }

    // RODEO_UNICO ya validado por length(1) y literal 'UNICO'
    // INDIVIDUAL no debe tener rodeos
    if (data.TipoSeguimiento === TipoSeguimiento.INDIVIDUAL) {
      const rodeos = (data as any).rodeos
      if (rodeos && rodeos.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'No se deben registrar rodeos cuando el seguimiento es INDIVIDUAL',
        })
      }
    }
  })

export type ConfigurationData = z.infer<typeof configurationSchema>

export type ConfigurationRequest = Omit<
  ConfigurationData,
  'registrarRodeo' | 'costoRacion'
> & {
  TipoSeguimiento: 'RODEO'
  tipoSeguimiento?: 'RODEO'
  idEstablecimiento: string
  rodeos: Array<{
    tipoRodeo: string
    cantVacas: number
    costoRacion: number
  }>
}
