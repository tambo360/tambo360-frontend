import { useMutation } from '@tanstack/react-query'
import { forgotPassword } from '@/utils/api/auth.api'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      toast.success(
        'Si el correo está registrado, recibirás un enlace de recuperación pronto.'
      )
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ||
        'Error al solicitar el restablecimiento'
      toast.error(message)
    },
  })
}
