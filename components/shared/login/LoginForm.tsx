'use client'
import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/auth/useLogin'
import { useAuth } from '@/context/AuthContext'
import { EyeIcon, EyeOff, ArrowRight } from 'lucide-react'
import { LoginSchema } from '@/types/login'
import { useForm } from 'react-hook-form'
import React, { useState, useEffect } from 'react'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import Link from 'next/link'

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { mutateAsync, isPending, error: apiError } = useLogin()
  const { showErrorMessage } = useErrorMessage()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm({
    defaultValues: {
      correo: '',
      contraseña: '',
    },
    resolver: zodResolver(LoginSchema),
  })

  useEffect(() => {
    if (submitCount > 0 && Object.keys(errors).length > 0) {
      showErrorMessage()
    }
  }, [submitCount, errors, showErrorMessage])

  useEffect(() => {
    if (apiError) {
      const message =
        apiError.response?.data?.message ||
        'Error al iniciar sesión. Por favor, intenta de nuevo.'
      showErrorMessage(message)
    }
  }, [apiError, showErrorMessage])

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await mutateAsync(data)
      login({ token: response.data.token, user: response.data.user })
    } catch (err) {
      console.warn('Error al iniciar sesión:', err)
    }
  })

  return (
    <CardContent className="px-0 flex-1">
      <form
        onSubmit={onSubmit}
        className="flex flex-col h-full justify-between gap-4 py-5"
        noValidate
        data-testid="login-form"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center md:py-7 sm:py-4 py-2">
            <img
              src="/logos/tambo-logo-360.png"
              alt="logo"
              className="h-10.75"
            />
          </div>
          <div className="space-y-2 text-center">
            <h1
              className="text-3xl font-bold tracking-tight text-[#0B1001]"
              data-testid="login-title"
            >
              Bienvenido
            </h1>
            <p className="text-sm text-[#626059]">
              Ingresa tus credenciales para empezar a usar la plataforma.
            </p>
          </div>
          <div className="space-y-2 text-left">
            <Label
              className={`font-bold ${errors.correo ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
            >
              Correo electrónico
            </Label>
            <Input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              {...register('correo')}
              className={`h-14 ${errors.correo ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
              disabled={isPending}
              data-testid="email-input"
            />
            {errors.correo && (
              <p className="text-xs font-medium text-[#B91C1C]">
                {errors.correo.message}
              </p>
            )}
          </div>

          <div className="space-y-2 text-left">
            <Label
              className={`font-bold ${errors.contraseña ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
            >
              Contraseña
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                {...register('contraseña')}
                className={`h-14 ${errors.contraseña ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
                disabled={isPending}
                data-testid="password-input"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626059] hover:bg-transparent h-auto p-0"
                data-testid="toggle-password-visibility"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <EyeIcon className="size-5" />
                )}
              </Button>
            </div>
            {errors.contraseña && (
              <p className="text-xs font-medium text-[#B91C1C]">
                {errors.contraseña.message}
              </p>
            )}
            <div className="flex justify-end pt-1">
              <Link
                href="/recuperar-contrasena"
                data-testid="reset-password-link"
                className="text-xs text-[#626059] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
        </div>
        <div>
          <Button
            type="submit"
            className="w-full h-14 rounded-lg text-lg font-medium transition-all bg-[#0B1001] hover:bg-[#2F3427] text-[#FFFBF1] gap-2"
            disabled={isPending}
            data-testid="login-submit-button"
          >
            {isPending ? 'Cargando...' : 'Iniciar sesión'}{' '}
            <ArrowRight className="size-5" />
          </Button>
          <div className="text-center pt-2 border-t border-[#F2F1EC]">
            <p className="text-sm text-[#626059]">
              ¿No tienes una cuenta?{' '}
              <Link
                href="/registrarse"
                data-testid="register-link"
                className="font-bold text-[#0B1001] hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </form>
    </CardContent>
  )
}

export default LoginForm
