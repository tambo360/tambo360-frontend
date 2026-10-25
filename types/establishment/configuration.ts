import {
  RazasVacas,
  TipoOrdenie,
  TipoRodeo,
  TipoSeguimiento,
  VentaLeche,
} from '@/types/enums'
import z from 'zod'

type RodeoCompletoInput = {
  costoRacion?: unknown
  razas?: Array<{ cantVacas?: unknown }> | undefined
}

export const esRodeoCompleto = (rodeo?: RodeoCompletoInput | null) => {
  const costoOk =
    typeof rodeo?.costoRacion === 'number' &&
    Number.isFinite(rodeo.costoRacion) &&
    rodeo.costoRacion > 0
  const razasOk =
    !!rodeo?.razas?.length &&
    rodeo.razas.every((item) => Number(item?.cantVacas) > 0)
  return costoOk && razasOk
}

const rodeoSchema = z.object({
  tipoRodeo: z.nativeEnum(TipoRodeo),
  costoRacion: z.preprocess(
    (v) => (typeof v === 'number' && Number.isNaN(v) ? undefined : v),
    z
      .number('El costo de la ración debe ser un número')
      .min(1, 'El costo de la ración debe ser un número mayor o igual a 1')
      .optional()
  ),
  razas: z
    .array(
      z.object({
        raza: z.nativeEnum(RazasVacas, {
          error: 'Seleccioná una raza válida',
        }),
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

export const MSG_CODIGO_DUPLICADO = 'Este RP/N° ya está usado en otra fila'

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
  rodeos: z
    .array(rodeoSchema)
    .refine((rodeos) => rodeos.some((r) => esRodeoCompleto(r)), {
      error:
        'Completá al menos un rodeo con costo de ración y una raza para finalizar',
    })
    .optional(),
  animales: z
    .array(animalSchema)
    .superRefine((lista, ctx) => {
      const vistos = new Map<string, number>()
      ;(lista ?? []).forEach((a, i) => {
        const key = (a.codigo ?? '').trim()
        if (!key) return
        const primero = vistos.get(key)
        if (primero !== undefined) {
          ctx.addIssue({
            code: 'custom',
            path: [i, 'codigo'],
            message: MSG_CODIGO_DUPLICADO,
          })
          ctx.addIssue({
            code: 'custom',
            path: [primero, 'codigo'],
            message: MSG_CODIGO_DUPLICADO,
          })
        } else {
          vistos.set(key, i)
        }
      })
    })
    .optional(),
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
