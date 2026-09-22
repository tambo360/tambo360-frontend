import { z } from 'zod'
export const RegisterSchema = z
  .object({
    nombre: z
      .string()
      .min(10, 'Nombre debe tener almenos 10 caracteres')
      .max(20, 'Nombre debe tener menos de 20 caracteres'),
    correo: z
      .email('Correo electrónico no válido')
      .max(50, 'El correo electrónico no puede tener más de 50 caracteres'),
    contraseña: z
      .string()
      .nonempty('La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(50, 'La contraseña no puede tener más de 50 caracteres')
      .refine((value) => /^(?=.*[a-z])/.test(value), {
        message: 'La contraseña debe tener al menos una letra minúscula',
      })
      .refine((value) => /^(?=.*[A-Z])/.test(value), {
        message: 'La contraseña debe tener al menos una letra mayúscula',
      })
      .refine((value) => /^(?=.*[0-9])/.test(value), {
        message: 'La contraseña debe tener al menos un número',
      })
      .refine(
        (value) => /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value),
        {
          message: 'La contraseña debe tener al menos un caracter especial',
        }
      )
      .refine((value) => value === value.trim(), {
        message: 'Tu contraseña tiene un espacio al inicio o al final',
      }),
    confirmarContraseña: z
      .string()
      .nonempty('La confirmación de contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(50, 'La contraseña no puede tener más de 50 caracteres')
      .refine((value) => /^(?=.*[a-z])/.test(value), {
        message: 'La contraseña debe tener al menos una letra minúscula',
      })
      .refine((value) => /^(?=.*[A-Z])/.test(value), {
        message: 'La contraseña debe tener al menos una letra mayúscula',
      })
      .refine((value) => /^(?=.*[0-9])/.test(value), {
        message: 'La contraseña debe tener al menos un número',
      })
      .refine(
        (value) => /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value),
        {
          message: 'La contraseña debe tener al menos un caracter especial',
        }
      ),
  })
  .refine((data) => data.contraseña === data.confirmarContraseña, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarContraseña'],
  })

export type RegisterData = z.infer<typeof RegisterSchema>
