'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight, EyeOff, ChevronLeft, EyeIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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

const ResetPassword: React.FC = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useRouter()
  const { showErrorMessage } = useErrorMessage()

  const [step, setStep] = useState(token ? 3 : 1)
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const { mutateAsync: sendEmail, isPending: isSendingEmail } =
    useForgotPassword()
  const { mutateAsync: resetPass, isPending: isResetting } = useResetPassword()

  const emailForm = useForm({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: '' },
  })

  const passForm = useForm({
    resolver: zodResolver(PasswordsSchema),
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
      setStep(2)
      toast.success('Correo enviado con éxito')
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      showErrorMessage(
        error.response?.data?.message || 'Error al enviar el correo'
      )
    }
  })

  const onResetSubmit = passForm.handleSubmit(async (data) => {
    if (!token) return
    try {
      await resetPass({ token, password: data.contraseña })
      setStep(4)
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      showErrorMessage(
        error.response?.data?.message || 'Error al restablecer la contraseña'
      )
    }
  })

  const backgroundImage =
    step === 2 || step === 4 ? "url('/vacas_4.webp')" : "url('/vacas_3.webp')"

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#F2F1EC] relative font-inter bg-cover bg-center bg-no-repeat transition-all duration-700"
      style={{ backgroundImage }}
    >
      <Button
        variant="secondary"
        size="icon"
        className="cursor-pointer! absolute top-4 left-4 z-30! rounded-full"
        asChild
      >
        <Link href="/">
          <ChevronLeft className="size-6" />
        </Link>
      </Button>
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div className="w-full h-screen flex items-center justify-center sm:items-start sm:justify-end p-4 z-10">
        <Card className="w-full sm:h-full sm:max-w-125 border-none shadow-2xl py-0 px-4 bg-white/95 backdrop-blur-md rounded-xl relative">
          <CardContent className="px-0 flex-1">
            {step === 1 && (
              <form
                onSubmit={handleRequestReset}
                className="flex flex-col h-full justify-between gap-4 py-5"
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
                      className={`font-bold ${emailForm.formState.errors.email ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                    >
                      Correo electrónico
                    </Label>
                    <Input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      {...emailForm.register('email')}
                      className={`h-14 ${emailForm.formState.errors.email ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
                      disabled={isSendingEmail}
                      data-testid="email-input"
                    />
                    {emailForm.formState.errors.email && (
                      <p className="text-xs font-medium text-[#B91C1C]">
                        {emailForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Button
                    disabled={isSendingEmail}
                    className="w-full h-14 bg-[#0B1001] hover:bg-[#2F3427] text-white rounded-lg font-bold flex gap-2"
                    data-testid="send-reset-link-button"
                  >
                    {isSendingEmail ? 'Enviando...' : 'Enviar enlace'}{' '}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <div className="text-center pt-2 border-t border-[#F2F1EC]">
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

            {step === 3 && (
              <form
                onSubmit={onResetSubmit}
                className="flex flex-col h-full justify-between gap-4 py-5"
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
                      className={`font-bold ${passForm.formState.errors.contraseña ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                    >
                      Nueva contraseña*
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPass ? 'text' : 'password'}
                        {...passForm.register('contraseña')}
                        className={`h-14 ${passForm.formState.errors.contraseña ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
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
                    {passForm.formState.errors.contraseña && (
                      <p className="text-xs font-medium text-[#B91C1C]">
                        {passForm.formState.errors.contraseña.message as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      className={`font-bold ${passForm.formState.errors.confirmarContraseña ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                    >
                      Confirmar contraseña*
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPass ? 'text' : 'password'}
                        {...passForm.register('confirmarContraseña')}
                        className={`h-14 ${passForm.formState.errors.confirmarContraseña ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'border-[#D1CFCA] bg-[#F9F9F7]'}`}
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
                    {passForm.formState.errors.confirmarContraseña && (
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
                    disabled={isResetting}
                    className="w-full h-14 bg-[#0B1001] hover:bg-[#2F3427] text-white rounded-lg font-bold flex gap-2"
                    data-testid="update-password-button"
                  >
                    {isResetting ? 'Guardando...' : 'Restablecer contraseña'}{' '}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <div className="text-center pt-2 border-t border-[#F2F1EC]">
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
              <div className="relative flex flex-col h-full justify-between gap-4 py-5">
                <div className="absolute left-1/2 top-7 -translate-x-1/2">
                  <img
                    src="/logos/tambo-logo-360.png"
                    alt="logo"
                    className="h-10.75"
                  />
                </div>
                <div className="flex-1 grid place-items-center pt-20 sm:pt-0">
                  <div className="w-full flex flex-col gap-4">
                    <div className="space-y-2 text-center">
                      <h1
                        className="text-3xl font-bold tracking-tight text-[#0B1001]"
                        data-testid="register-title"
                      >
                        ¡Todo listo!
                      </h1>
                      <p className="text-sm text-[#626059]">
                        Tu contraseña ha sido actualizada con éxito.
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
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword
