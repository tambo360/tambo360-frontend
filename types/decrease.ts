import { Lote } from '@/types/batch'
import { TipoMerma } from '@/types/enums'
import z from 'zod'

export const TIPO_MERMA_LABELS = {
  [TipoMerma.MASTITIS]: 'Mastitis',
  [TipoMerma.ESTRES_CALORICO]: 'Estrés Calórico',
  [TipoMerma.DERRAME_EN_ORDENE]: 'Derrame en ordeñe',
  [TipoMerma.FALLA_EQUIPO]: 'Falla de Equipo',
  [TipoMerma.RECHAZO_ANTIBIOTICOS]: 'Rechazo por Antibióticos',
  [TipoMerma.ACIDOSIS_RUMINAL]: 'Acidosis Ruminal',
  [TipoMerma.PERDIDA_EN_TRANSPORTE]: 'Perdida en Transporte',
  [TipoMerma.VENCIMIENTO_PRODUCTO]: 'Vencimiento de Producto',
  [TipoMerma.DANO_POR_MANIPULACION]: 'Daño por Manipulación',
  [TipoMerma.DISCREPANCIA_INVENTARIO]: 'Discrepancia de Inventario',
  [TipoMerma.MERMA_DESCONOCIDA]: 'Merma Desconocida',
  [TipoMerma.OTRO]: 'Otro',
}
export const DecreaseSchema = z.object({
  tipo: z
    .enum(TipoMerma)
    .optional()
    .refine((value) => value !== undefined, 'Tipo es requerido'),
  observacion: z
    .string()
    .max(100, 'La observación no puede tener mas de 100 caracteres')
    .optional(),
  cantidad: z
    .string()
    .min(1, 'Cantidad de Merma es requerida')
    .refine((value) => !isNaN(Number(value)), 'Cantidad no valida')
    .transform((value) => Number(value)),
})

export type DecreaseData = z.infer<typeof DecreaseSchema>

export type DecreaseWithLote = DecreaseData & {
  idLote: string
}

export interface Merma {
  idMerma: string
  tipo: TipoMerma
  observacion?: string
  cantidad: number
  fechaCreacion: string

  idLote: string
  lote?: Lote
}
