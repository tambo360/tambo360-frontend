import { z } from 'zod'

export interface UpdatePerfilPayload {
  nombre?: string
  correo?: string
  contraseñaActual?: string
}

export interface PerfilActualizado {
  idUsuario: string
  nombre: string
  correo: string
  verificado: boolean
}

export interface UpdatePerfilResponse {
  success: boolean
  message: string
  data: PerfilActualizado
}

// La validación depende de lo que ya tiene el usuario: el nombre solo se
// valida si cambió, y la contraseña solo se exige si cambió el correo.
export const createPerfilSchema = (
  nombreActual: string,
  correoActual: string
) =>
  z
    .object({
      nombre: z.string().trim(),
      correo: z.string().trim().pipe(z.email('Correo inválido')),
      contraseñaActual: z.string(),
    })
    .superRefine((values, ctx) => {
      const nombreCambio = values.nombre !== nombreActual
      const correoCambio =
        values.correo.toLowerCase() !== correoActual.toLowerCase()

      if (nombreCambio && values.nombre.length < 5) {
        ctx.addIssue({
          code: 'custom',
          path: ['nombre'],
          message: 'El nombre debe tener al menos 5 caracteres',
        })
      }

      if (correoCambio && !values.contraseñaActual) {
        ctx.addIssue({
          code: 'custom',
          path: ['contraseñaActual'],
          message: 'Para cambiar el correo se requiere la contraseña actual',
        })
      }
    })

export type PerfilFormValues = z.infer<ReturnType<typeof createPerfilSchema>>
