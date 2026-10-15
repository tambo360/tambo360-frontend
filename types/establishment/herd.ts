import { TipoRodeo } from '@/types/enums'

export interface Rodeo {
  idRodeo: string
  idConfiguracion: string
  value: TipoRodeo
  label: string
  cantVacas: number
  costoRacion: number
  tipoRodeo?: string
}
