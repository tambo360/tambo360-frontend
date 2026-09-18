import {
  RazasVacas,
  TipoOrdenie,
  TipoRodeo,
  TipoSeguimiento,
  VentaLeche,
} from '@/types/enums'
import z from 'zod'

const rodeoSchema = z.object({
  tipoRodeo: z.nativeEnum(TipoRodeo),
  costoRacion: z
    .number('El costo de la ración debe ser un número')
    .positive('El costo de la ración debe ser un número positivo'),
  razas: z
    .array(
      z.object({
        raza: z.nativeEnum(RazasVacas, { error: 'Seleccioná una raza válida' }),
        cantVacas: z
          .number('La cantidad debe ser un número')
          .int('La cantidad debe ser un número entero')
          .positive('La cantidad debe ser mayor que 0'),
      })
    )
    .optional(),
})

const baseSchema = z.object({
  cantOrdenie: z.coerce
    .number({ error: 'Seleccioná la cantidad de ordeñes por día' })
    .positive('La cantidad de ordeñes por día debe ser un número'),
  tipoOrdenie: z.nativeEnum(TipoOrdenie, {
    error: 'Seleccioná un tipo de ordeñe válido',
  }),
  promDEL: z
    .number('El promedio de DEL debe ser un número')
    .positive('El promedio de DEL debe ser un número positivo'),
  ventaLeche: z.nativeEnum(VentaLeche, {
    error: 'Seleccioná el destino del producto',
  }),
  precioLitro: z
    .number('El precio por litro debe ser un número')
    .positive('El precio por litro debe ser un número positivo'),
  promLitros: z
    .number('El promedio de litros tiene que ser un número')
    .positive('El promedio de litros debe ser un número positivo'),
  ubicacion: z.object(
    {
      provincia: z
        .string('La provincia es requerida')
        .nonempty('La provincia es requerida'),
      localidad: z
        .string('La localidad es requerida')
        .nonempty('La localidad es requerida'),
    },
    { error: 'Seleccioná la provincia y la localidad' }
  ),
})

const animalSchema = z.object({
  codigo: z.string().nonempty('El código es requerido'),
  nombre: z.string().optional(),
  raza: z.string().nonempty('La raza es requerida'),
  categoria: z.string().nonempty('La categoría es requerida'),
  estado: z.string().nonempty('El estado es requerido'),
  fechaNacimiento: z.string().optional(),
})

export const TIPOS_UNICO = Object.values(TipoRodeo).filter((tipo) =>
  tipo.startsWith('UNICO_')
)

export const TIPOS_SEGUIMIENTO_RODEO = Object.values(TipoRodeo).filter(
  (tipo) => !TIPOS_UNICO.includes(tipo)
)

export const configurationSchema = baseSchema.extend({
  rodeos: z.array(rodeoSchema).optional(),
  animales: z.array(animalSchema).optional(),
})

export type ConfigurationData = z.infer<typeof configurationSchema>

export type ConfigurationFormInput = z.input<typeof configurationSchema>

export type ConfigurationRequest = Omit<
  ConfigurationData,
  'registrarRodeo' | 'costoRacion'
> & {
  TipoSeguimiento: TipoSeguimiento
  rodeos?: Array<{
    tipoRodeo: string
    costoRacion: number
    razas?: Array<{
      raza: string
      cantVacas: number
    }>
  }>
}
