'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight, EyeOff, EyeIcon } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import { useForgotPassword } from '@/hooks/auth/useForgotPassword'
import { useResetPassword } from '@/hooks/auth/useResetPassword'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import { useRouter, useSearchParams } from 'next/navigation'
import { AxiosError } from 'axios'
import Link from 'next/link'

const EmailSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
})

const PasswordsSchema = z
  .object({
    contraseña: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmarContraseña: z.string(),
  })
  .refine((data) => data.contraseña === data.confirmarContraseña, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarContraseña'],
  })

const RecoverAccountHeader: React.FC<{
  title: string
  description: string
}> = ({ title, description }) => {
  return (
    <>
      <div className="flex items-center justify-center md:py-7 sm:py-4 py-2">
        <img src="/logos/tambo-logo-360.png" alt="logo" className="h-10.75" />
      </div>
      <div className="space-y-2 text-center">
        <h1
          className="text-3xl font-bold tracking-tight text-[#0B1001]"
          data-testid="register-title"
        >
          {title}
        </h1>
        <p className="text-sm text-[#626059]">{description}</p>
      </div>
    </>
  )
}

const ResetPasswordForm: React.FC = () => {
  const searchParams = useSearchParams()
  const navigate = useRouter()
  const { showErrorMessage } = useErrorMessage()

  const [resetToken] = useState(() => searchParams.get('token'))
  const [step, setStep] = useState(resetToken ? 3 : 1)
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)

  const { mutateAsync: sendEmail, isPending: isSendingEmail } =
    useForgotPassword()
  const { mutateAsync: resetPass, isPending: isResetting } = useResetPassword()

  useEffect(() => {
    if (!searchParams.get('token')) return
    navigate.replace('/recuperar-contrasena', { scroll: false })
  }, [searchParams, navigate])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000
    )
    return () => clearInterval(timer)
  }, [secondsLeft])

  const emailForm = useForm({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  const passForm = useForm({
    resolver: zodResolver(PasswordsSchema),
    defaultValues: { contraseña: '', confirmarContraseña: '' },
    mode: 'onChange',
  })

  useEffect(() => {
    if (
      emailForm.formState.submitCount > 0 &&
      Object.keys(emailForm.formState.errors).length > 0
    ) {
      showErrorMessage()
    }
  }, [
    emailForm.formState.submitCount,
    emailForm.formState.errors,
    showErrorMessage,
  ])

  useEffect(() => {
    if (
      passForm.formState.submitCount > 0 &&
      Object.keys(passForm.formState.errors).length > 0
    ) {
      showErrorMessage()
    }
  }, [
    passForm.formState.submitCount,
    passForm.formState.errors,
    showErrorMessage,
  ])

  const handleRequestReset = emailForm.handleSubmit(async (data) => {
    try {
      await sendEmail(data.email)
      setUserEmail(data.email)
      setStep(2)
      setSecondsLeft(180)
      toast.success('Correo enviado con éxito')
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      showErrorMessage(
        error.response?.data?.message || 'Error al enviar el correo'
      )
    }
  })

  async function handleResend() {
    if (!userEmail) return
    try {
      await sendEmail(userEmail)
      setSecondsLeft(180)
    } catch {
      // useForgotPassword already shows a toast on error
    }
  }

  const onResetSubmit = passForm.handleSubmit(async (data) => {
    if (!resetToken) return
    try {
      await resetPass({ token: resetToken, password: data.contraseña })
      setStep(4)
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      showErrorMessage(
        error.response?.data?.message || 'Error al restablecer la contraseña'
      )
    }
  })

  return (
    <>
      <CardContent className="relative z-10 flex flex-col px-0">
        {step === 1 && (
          <form
            onSubmit={handleRequestReset}
            className="flex flex-col gap-4 py-5"
            noValidate
            data-testid="forgot-password-form"
          >
            <div className="space-y-4">
              <RecoverAccountHeader
                title={'Recuperar cuenta'}
                description={
                  'Te enviaremos un enlace para restablecer tu contraseña.'
                }
              />
              <div className="space-y-2 text-left">
                <Label
                  className={`font-bold ${emailForm.formState.submitCount > 0 && emailForm.formState.errors.email ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                >
                  Correo electrónico
                </Label>
                <Input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  {...emailForm.register('email')}
                  className={`h-14 ${emailForm.formState.submitCount > 0 && emailForm.formState.errors.email ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
                  disabled={isSendingEmail}
                  data-testid="email-input"
                />
                {emailForm.formState.submitCount > 0 &&
                  emailForm.formState.errors.email && (
                    <p className="text-xs font-medium text-[#B91C1C]">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
              </div>
            </div>
            <div>
              <Button
                disabled={isSendingEmail || !emailForm.formState.isValid}
                className="w-full h-14 bg-[#0B1001] hover:bg-[#2F3427] text-white rounded-lg font-bold flex gap-2"
                data-testid="send-reset-link-button"
              >
                {isSendingEmail ? 'Enviando...' : 'Enviar enlace'}{' '}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div className="text-center py-6 border-t border-[#F2F1EC]">
                <Link
                  href="/iniciar-sesion"
                  data-testid="back-to-login"
                  className="text-sm font-bold text-[#0B1001] hover:underline"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={onResetSubmit}
            className="flex flex-1 flex-col justify-between gap-4 py-5"
            noValidate
            data-testid="reset-password-form"
          >
            <div className="space-y-4">
              <RecoverAccountHeader
                title={'Revisa tu email'}
                description={`Enviamos un enlace al email ${userEmail} para reestablecer tu cuenta y comenzar a usar Tambo360`}
              />
              <div className="w-full space-y-4 pb-7">
                <Button
                  type="button"
                  className="w-full h-14 bg-[#0B1001] hover:bg-[#2F3427] text-[#FFFBF1]"
                  onClick={handleResend}
                  disabled={secondsLeft > 0 || isSendingEmail}
                  data-testid="resend-link-button"
                >
                  {isSendingEmail
                    ? 'Enviando...'
                    : secondsLeft > 0
                      ? `Reenviar enlace (${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0')})`
                      : 'Reenviar enlace'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={onResetSubmit}
            className="flex flex-1 flex-col justify-between gap-4 py-5"
            noValidate
            data-testid="reset-password-form"
          >
            <div className="space-y-4">
              <RecoverAccountHeader
                title={'Nueva contraseña'}
                description={'Ingresa tu nueva clave de acceso.'}
              />
              <div className="space-y-2">
                <Label
                  className={`font-bold ${passForm.formState.submitCount > 0 && passForm.formState.errors.contraseña ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                >
                  Nueva contraseña*
                </Label>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    {...passForm.register('contraseña')}
                    className={`h-14 ${passForm.formState.submitCount > 0 && passForm.formState.errors.contraseña ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
                    disabled={isResetting}
                    data-testid="new-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626059]"
                    data-testid="toggle-password-visibility"
                  >
                    {showPass ? (
                      <EyeIcon className="size-5" />
                    ) : (
                      <EyeOff className="size-5" />
                    )}
                  </button>
                </div>
                {passForm.formState.submitCount > 0 &&
                  passForm.formState.errors.contraseña && (
                    <p className="text-xs font-medium text-[#B91C1C]">
                      {passForm.formState.errors.contraseña.message as string}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label
                  className={`font-bold ${passForm.formState.submitCount > 0 && passForm.formState.errors.confirmarContraseña ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                >
                  Confirmar contraseña*
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPass ? 'text' : 'password'}
                    {...passForm.register('confirmarContraseña')}
                    className={`h-14 ${passForm.formState.submitCount > 0 && passForm.formState.errors.confirmarContraseña ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
                    disabled={isResetting}
                    data-testid="confirm-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626059]"
                    data-testid="toggle-confirm-password-visibility"
                  >
                    {showConfirmPass ? (
                      <EyeIcon className="size-5" />
                    ) : (
                      <EyeOff className="size-5" />
                    )}
                  </button>
                </div>
                {passForm.formState.submitCount > 0 &&
                  passForm.formState.errors.confirmarContraseña && (
                    <p className="text-xs font-medium text-[#B91C1C]">
                      {
                        passForm.formState.errors.confirmarContraseña
                          .message as string
                      }
                    </p>
                  )}
              </div>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isResetting || !passForm.formState.isValid}
                className="w-full h-14 bg-[#0B1001] hover:bg-[#2F3427] text-white rounded-lg font-bold flex gap-2"
                data-testid="update-password-button"
              >
                {isResetting ? 'Guardando...' : 'Restablecer contraseña'}{' '}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div className="text-center py-6 border-t border-[#F2F1EC]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-bold text-[#0B1001] hover:underline"
                  data-testid="request-new-link-button"
                >
                  ¿El enlace venció? Solicita uno nuevo
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="relative flex flex-col justify-center gap-4 py-5 bg-white/95">
            <div className="absolute left-1/2 top-7 -translate-x-1/2">
              <img
                src="/logos/tambo-logo-360.png"
                alt="logo"
                className="h-10.75"
              />
            </div>
            <div className="">
              <div className="w-full flex flex-col gap-4 pb-5 pt-20">
                <div className="space-y-2 text-center">
                  <h1
                    className="text-3xl font-bold tracking-tight text-[#0B1001]"
                    data-testid="register-title"
                  >
                    ¡Contraseña Actualizada!
                  </h1>
                  <p className="text-sm text-[#626059]">
                    Tu contraseña ha sido restablecida con éxito. Ya puedes
                    iniciar sesión con tus nuevas credenciales.
                  </p>
                </div>
                <Button
                  onClick={() => navigate.push('/iniciar-sesion')}
                  className="w-full h-14 bg-[#0B1001] text-white rounded-lg font-bold"
                  data-testid="go-to-login-after-reset"
                >
                  Ir al inicio de sesión
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </>
  )
}

export default ResetPasswordForm
