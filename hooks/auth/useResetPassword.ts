import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '@/utils/api/auth.api'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ password, token }: { password: string; token: string }) =>
      resetPassword(password, token),
    onSuccess: () => {
      toast.success('Contraseña restablecida con éxito')
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || 'Error al restablecer la contraseña'
      toast.error(message)
    },
  })
}
