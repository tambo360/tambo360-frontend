import { Lote } from '@/types/batch'
import { RolEstablecimiento, TipoOrdenie, VentaLeche } from '@/types/enums'
import { Organizacion, OrganizacionUsuario } from '@/types/organization'
import z from 'zod'

export const EstablishmentSchema = z.object({
  nombre: z
    .string()
    .min(5, 'El nombre del establecimiento debe tener al menos 5 caracteres')
    .max(
      100,
      'El nombre del establecimiento no puede tener más de 100 caracteres'
    ),
})

export const UpdateEstablishmentSchema = z.object({
  nombre: z
    .string()
    .min(5, 'El nombre del establecimiento debe tener al menos 5 caracteres')
    .max(
      100,
      'El nombre del establecimiento no puede tener más de 100 caracteres'
    ),
})

export const establishmentFormSchema = z.object({
  nombre: z
    .string()
    .min(5, 'El nombre del establecimiento debe tener al menos 5 caracteres')
    .max(
      100,
      'El nombre del establecimiento no puede tener más de 100 caracteres'
    ),
  // cuencaLechera: z.string().min(1, 'La cuenca lechera es requerida'),
  tipoOrdenie: z.string().min(1, 'El tipo de ordeñe es requerido'),
  ordenie_dia: z
    .number('Los ordeñes por día deben ser un número')
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 ordeñe por día')
    .max(3, 'Máximo 3 ordeñes por día'),
  promLitros: z
    .number('El promedio de litros debe ser un número')
    .positive('El promedio de litros debe ser mayor que 0'),
  provincia: z.string().min(1, 'La provincia es requerida'),
  localidad: z.string().min(1, 'La localidad es requerida'),
})

export interface UpdateEstablishmentPayload {
  idEst: string
  nombre: string
  tipo_ordenie: string
  ordenie_dia: number
  promLitros: number
  ubicacion: {
    provincia: string
    localidad: string
  }
}

export type EstablishmentName = z.infer<typeof UpdateEstablishmentSchema>
export type EstablishmentData = z.infer<typeof EstablishmentSchema> & {
  organizacionId: string
}
export type EstablishmentFormData = z.infer<typeof establishmentFormSchema>

export interface Establecimiento {
  idEstablecimiento: string
  nombre: string
  localidad?: string
  provincia?: string
  fechaCreacion: Date
  idOrganizacion: string
  organizacion?: Organizacion
  loteProducciones?: Lote[]
  establecimientoOrganizacionUsuarios?: Establecimiento_OrganiacionUsuario[]
  configuracions?: Configuracion[]
  establecimientoRazas?: EstablecimientoRaza[]
}

export interface Establecimiento_OrganiacionUsuario {
  idEstablecimientoOrganizacionUsuario: string
  idEstablecimiento: string
  establecimiento?: Establecimiento
  idOrganizacionUsuario: string
  organizacionUsuario?: OrganizacionUsuario
  rol: RolEstablecimiento
  estado: boolean
  fechaCreacion: Date
}

export interface Configuracion {
  idConfiguracion: string
  idEstablecimiento: string
  establecimiento?: Establecimiento
  cantVacas?: number
  cantOrdenies?: number
  promLitros?: number
  tipoOrdenie?: TipoOrdenie
  ventaLeche?: VentaLeche
  empleados?: boolean
  cantEmpleados?: number
  modificadoEn?: Date
}

export interface EstablecimientoRaza {
  idEstablecimientoRaza: string
  idEstablecimiento: string
  establecimiento?: Establecimiento
  idRaza: string
  raza?: Raza
}

export interface Raza {
  idRaza: string
  nombre: string
  establecimientoRazas?: EstablecimientoRaza[]
}
