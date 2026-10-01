export type MotivoTransferencia =
  | 'TRANSFERENCIA_SANITARIA'
  | 'TRANSFERENCIA_CICLO_PRODUCTIVO'
  | 'TRANSFERENCIA_RECUPERACION'

export interface OpcionTransferencia {
  value: string
  label: string
}

export interface MotivoOpcion extends OpcionTransferencia {
  value: MotivoTransferencia
  causas: OpcionTransferencia[]
}

export const MOTIVOS_TRANSFERENCIA: MotivoOpcion[] = [
  {
    value: 'TRANSFERENCIA_SANITARIA',
    label: 'Sanitaria',
    causas: [
      { value: 'MASTITIS', label: 'Mastitis' },
      { value: 'PROBLEMA_PODAL', label: 'Problema podal' },
      { value: 'PROBLEMA_UTERINO', label: 'Problema uterino' },
      { value: 'ENFERMEDAD_GENERAL', label: 'Enfermedad general' },
    ],
  },
  {
    value: 'TRANSFERENCIA_CICLO_PRODUCTIVO',
    label: 'Ciclo productivo',
    causas: [
      { value: 'SECADA_PROGRAMADA', label: 'Secada programada' },
      { value: 'PARTO', label: 'Parto' },
      { value: 'ABORTO', label: 'Aborto' },
    ],
  },
  {
    value: 'TRANSFERENCIA_RECUPERACION',
    label: 'Recuperación',
    causas: [{ value: 'ALTA_MEDICA', label: 'Alta médica' }],
  },
]

export const CATEGORIAS_TRANSFERENCIA: OpcionTransferencia[] = [
  { value: 'ORDENE', label: 'Ordeñe' },
  { value: 'SECAS', label: 'Secas' },
]

// ── INDIVIDUAL ──
export interface TransferAnimalPayload {
  tipo: 'TRANSFERENCIA'
  motivo: MotivoTransferencia
  causa: string
  tipoSeguimiento: 'INDIVIDUAL'
  origen: string
  destino: string
  animal: { id: string; categoria: string }
  retorno: string | null
  observacion?: string
}

export interface TransferAnimalOption {
  idAnimal: string
  codigo?: string | null
  nombre?: string | null
}

// ── RODEO / RODEO_UNICO ──
export interface TransferRodeoPayload {
  tipo: 'TRANSFERENCIA'
  motivo: MotivoTransferencia
  causa: string
  tipoSeguimiento: 'RODEO' | 'RODEO_UNICO'
  origen: string
  destino: string
  animal: { raza: string; cantVacas: number }
  retorno: string | null
  observacion?: string
}
