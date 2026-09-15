import { TipoOrdenie, TipoRodeo, VentaLeche } from '@/types/enums'
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

const baseSchema = z.object({
  cantOrdenie: z.coerce
    .number()
    .positive('La cantidad de ordeñes por día debe ser un número'),
  tipoOrdenie: z.nativeEnum(TipoOrdenie),
  promDEL: z.number('El promedio de DEL debe ser un número').positive(),
  ventaLeche: z.nativeEnum(VentaLeche),
  precioLitro: z.number('El precio por litro debe ser un número').positive(),
  promLitros: z
    .number()
    .positive('El promedio de litros debe ser un número positivo'),
  ubicacion: z.object({
    provincia: z.string('La provincia es requerida'),
    localidad: z.string('La localidad es requerida'),
  }),
})

const animalSchema = z.object({
  codigo: z.string().nonempty('El código es requerido'),
  nombre: z.string().optional(),
  categoria: z.string().nonempty('La categoría es requerida'),
  estado: z.string().nonempty('El estado es requerido'),
  fechaNacimiento: z.string().optional(),
})

// Tipos que viajan en el seguimiento RODEO. UNICO_ORDENIE pertenece solo
// al modo INDIVIDUAL (bloque "Rodeo único") y no debe enviarse en RODEO.
export const TIPOS_SEGUIMIENTO_RODEO = Object.values(TipoRodeo).filter(
  (tipo) => tipo !== TipoRodeo.UNICO_ORDENIE
)

export const configurationSchema = baseSchema
  .extend({
    rodeos: z.array(rodeoSchema).optional(),
    animales: z.array(animalSchema).optional(),
  })
  .superRefine((data, ctx) => {
    // Sin litros válidos no se puede derivar el modo: el error base ya alcanza
    if (typeof data.promLitros !== 'number' || Number.isNaN(data.promLitros)) {
      return
    }
    // Espeja `esRodeoUnico` del formulario: < 2000 → INDIVIDUAL, si no → RODEO
    const esIndividual = data.promLitros < 2000

    if (!esIndividual) {
      // RODEO: debe existir al menos un rodeo de cada tipo de seguimiento
      // RODEO. UNICO_ORDENIE no viaja en este modo.
      const rodeos = data.rodeos
      if (!rodeos || rodeos.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Debe existir al menos un rodeo cuando el seguimiento es RODEO',
        })
        return
      }
      const tiposPresentes = new Set(rodeos.map((r) => r.tipoRodeo))
      for (const tipo of TIPOS_SEGUIMIENTO_RODEO) {
        if (!tiposPresentes.has(tipo)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Debe existir al menos un rodeo de cada tipo cuando el seguimiento es RODEO',
          })
          break
        }
      }
      if (tiposPresentes.has(TipoRodeo.UNICO_ORDENIE)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'El rodeo único no se debe enviar cuando el seguimiento es RODEO',
        })
      }
      // Higiene del payload: en modo RODEO no viajan animales
      if (data.animales && data.animales.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'No se deben registrar animales cuando el seguimiento es RODEO',
        })
      }
    } else {
      // INDIVIDUAL: se exige exactamente el rodeo único, que el usuario
      // completa en el bloque "Rodeo único" (tipo fijo UNICO_ORDENIE).
      // Los animales son obligatorios solo en el camino Aceptar (tabla
      // del paso 2); con Cancelar no se envían (ausentes) y eso es válido.
      const rodeos = data.rodeos
      if (
        !rodeos ||
        rodeos.length !== 1 ||
        rodeos[0]?.tipoRodeo !== TipoRodeo.UNICO_ORDENIE
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debés completar los datos del rodeo único',
        })
      }
      if (data.animales !== undefined && data.animales.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La lista de animales no puede estar vacía',
        })
      }
    }
  })

export type ConfigurationData = z.infer<typeof configurationSchema>

// Input del formulario (pre-coerción): `cantOrdenie` llega como string
// desde los radios. Se usa como primer genérico del `useForm`.
export type ConfigurationFormInput = z.input<typeof configurationSchema>

export type ConfigurationRequest = Omit<
  ConfigurationData,
  'registrarRodeo' | 'costoRacion'
> & {
  TipoSeguimiento: 'RODEO' | 'INDIVIDUAL'
  tipoSeguimiento?: 'RODEO' | 'INDIVIDUAL'
  idEstablecimiento: string
  rodeos: Array<{
    tipoRodeo: string
    cantVacas: number
    costoRacion: number
  }>
}
