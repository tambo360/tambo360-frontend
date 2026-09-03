import z from 'zod'

export const TIPOS_COSTO = [
  'PERSONAL',
  'SERVICIOS',
  'LOGISTICA',
  'MANTENIMIENTO',
  'VETERINARIO',
  'INMUEBLE',
  'OTRO',
]

export const newGastoSchema = z.object({
  tipoCosto: z.enum(TIPOS_COSTO, { message: 'Tipo de costo requerido' }),
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

export type reqNewGasto = z.infer<typeof newGastoSchema>
