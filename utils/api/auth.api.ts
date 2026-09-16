import { RegisterData } from '@/types/register'
import { LoginData } from '@/types/login'
import { api } from '@/services/api'

export const logOut = () => api.post('/auth/logout')

export const getCurrentUser = () => api.get('/auth/me')

export const registerUser = (dto: RegisterData) =>
  api.post('/auth/crear-cuenta', dto)

export const loginUser = (dto: LoginData) =>
  api.post('/auth/iniciar-sesion', dto)

export const resendVerificationEmail = (correo: string) =>
  api.post('/auth/reenviar-verificacion', { correo })

export const verifyEmail = (token: string) =>
  api.post(`/auth/verificar-email`, { token })

export const forgotPassword = async (email: string) => {
  const { data } = await api.post('/auth/contrasena-olvidada', {
    correo: email,
  })
  return data
}

export const resetPassword = async (password: string, token: string) => {
  const { data } = await api.post('/auth/restablecer-contrasena', {
    nuevaContraseña: password,
    token: token,
  })
  return data
}
