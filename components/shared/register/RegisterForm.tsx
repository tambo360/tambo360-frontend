'use client'
import { ArrowRight, EyeOff, EyeIcon } from 'lucide-react'
import { useRegister } from '@/hooks/auth/useRegister'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { RegisterSchema } from '@/types/register'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import { CardContent } from '@/components/ui/card'
import { useResendEmail } from '@/hooks/auth/useResendEmail'
import Link from 'next/link'

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { mutateAsync, isPending, error: apiError } = useRegister()
  const { showErrorMessage } = useErrorMessage()
  const [isResending, setIsResending] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(1)

  const { mutateAsync: mutateAsyncResend, isPending: isResendingEmail } =
    useResendEmail()

  useEffect(() => {
    if (step === 2) setSecondsLeft(180)
  }, [step])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000
    )
    return () => clearInterval(timer)
  }, [secondsLeft])

  const handleNextStep = () => setStep((prev) => prev + 1)
  const handleAddEmail = (email: string) => setEmail(email)

  async function handleResend() {
    try {
      setIsResending(true)
      await mutateAsyncResend(email)
      setSecondsLeft(180)
    } catch (e) {
      console.warn(e)
    } finally {
      setIsResending(false)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm({
    defaultValues: {
      correo: '',
      nombre: '',
      contraseña: '',
      confirmarContraseña: '',
    },
    resolver: zodResolver(RegisterSchema),
  })

  useEffect(() => {
    if (submitCount > 0 && Object.keys(errors).length > 0) {
      showErrorMessage()
    }
  }, [submitCount, errors, showErrorMessage])

  useEffect(() => {
    if (apiError) {
      const message =
        apiError.response?.data?.message || 'Ocurrió un error en el servidor'
      showErrorMessage(message)
    }
  }, [apiError, showErrorMessage])

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data)
      handleAddEmail(data.correo)
      handleNextStep()
    } catch (err) {
      console.warn('Error al registrarse:', err)
    }
  })

  return (
    <CardContent className="space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-auto flex items-start gap-2">
          <img src="/logos/isotipo_tambo 1.png" alt="logo" className="h-12" />
          <img src="/logotipo 1.png" alt="tambo" className="h-6" />
          <span className="ml-2 text-xl font-bold tracking-tight">QA</span>
        </div>
        {step === 1 && (
          <div className="space-y-2">
            <h1
              className="text-4xl font-bold tracking-tight text-[#0B1001]"
              data-testid="register-title"
            >
              Crear cuenta
            </h1>
            <p className="text-sm text-[#626059]">
              Comencemos con el proceso de registro para tu establecimiento
              lácteo
            </p>
          </div>
        )}
      </div>

      {step === 1 ? (
        <div className="w-full flex flex-col items-center font-inter">
          <form
            onSubmit={onSubmit}
            className="w-full space-y-6"
            noValidate
            data-testid="register-form"
          >
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <Label
                  className={`font-bold ${errors.nombre ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                >
                  Nombre*
                </Label>
                <Input
                  placeholder="Ingresa tu nombre y apellido"
                  {...register('nombre')}
                  className={`h-14 ${errors.nombre ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
                  disabled={isPending || isResendingEmail}
                  data-testid="full-name-input"
                />
                {errors.nombre && (
                  <p className="text-xs font-medium text-[#B91C1C]">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-left">
                <Label
                  className={`font-bold ${errors.correo ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                >
                  Correo electrónico*
                </Label>
                <Input
                  placeholder="Ingresa tu correo electrónico"
                  {...register('correo')}
                  className={`h-14 ${errors.correo ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
                  disabled={isPending || isResendingEmail}
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
                  Contraseña*
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    {...register('contraseña')}
                    className={`h-14 ${errors.contraseña ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
                    disabled={isPending || isResendingEmail}
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
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                {!errors.contraseña && (
                  <p className="text-[10px] text-[#626059]">
                    Requisitos: 8 caracteres, mayúscula, minúscula y carácter
                    especial.
                  </p>
                )}
                {errors.contraseña && (
                  <p className="text-xs font-medium text-[#B91C1C]">
                    {errors.contraseña.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-left">
                <Label
                  className={`font-bold ${errors.confirmarContraseña ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                >
                  Confirmar contraseña*
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    {...register('confirmarContraseña')}
                    className={`h-14 ${errors.confirmarContraseña ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
                    disabled={isPending || isResendingEmail}
                    data-testid="confirm-password-input"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626059] hover:bg-transparent h-auto p-0"
                    data-testid="toggle-confirm-password-visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </Button>
                </div>
                {errors.confirmarContraseña && (
                  <p className="text-xs font-medium text-[#B91C1C]">
                    {errors.confirmarContraseña.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-lg text-lg font-medium transition-all bg-[#0B1001] hover:bg-[#2F3427] text-[#FFFBF1] flex items-center justify-center gap-2"
              disabled={isPending || isResendingEmail}
              data-testid="register-submit-button"
            >
              {isPending || isResendingEmail ? 'Cargando...' : 'Siguiente'}
              <ArrowRight className="size-5" />
            </Button>
          </form>
        </div>
      ) : (
        <section
          className="h-full min-h-[40vh] flex flex-col items-center justify-center gap-6"
          data-testid="verify-email-step"
        >
          <h2 className="text-4xl font-bold tracking-tight text-[#0B1001]">
            Revisa tu email
          </h2>
          <p className="text-sm text-center text-[#626059]">
            Haz clic en el enlace del email para activar tu cuenta y comenzar a
            usar Tambo360.
          </p>
          <div className="w-full max-w-sm">
            <Button
              variant="outline"
              className="w-full h-14 border-[#D1CFCA] text-[#0B1001] hover:bg-[#F2F1EC]"
              onClick={handleResend}
              disabled={
                secondsLeft > 0 || isResending || isPending || isResendingEmail
              }
              data-testid="resend-email-button"
            >
              {isResending
                ? 'Enviando...'
                : secondsLeft > 0
                  ? `Reenviar email (${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0')})`
                  : 'Reenviar email'}
            </Button>
          </div>
        </section>
      )}

      {step === 1 && (
        <div className="text-center pt-4 border-t border-[#F2F1EC]">
          <p className="text-sm text-[#626059]">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/iniciar-sesion"
              data-testid="login-link"
              className="font-bold text-[#0B1001] hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      )}
    </CardContent>
  )
}

export default RegisterForm
