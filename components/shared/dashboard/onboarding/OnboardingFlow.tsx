'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useCreateOrganization } from '@/hooks/organization/useCreateOrganization'
import { useInvitations } from '@/hooks/invitation/useInvitations'
import { createOrganization } from '@/types/organization'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, LogOut, Plus, SendHorizonal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Step = 'welcome' | 'createEstablishment'

function EstablishmentStep() {
  const { mutate, isPending, error, isSuccess } = useCreateOrganization()
  const [url, setUrl] = useState('')
  const navigate = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '' },
    resolver: zodResolver(createOrganization),
  })

  const onSubmit = handleSubmit((data) => {
    mutate(data.name, {
      onSuccess: (res) => {
        setUrl(
          '/organizaciones/' +
            res.data.idOrganizacion +
            '/' +
            res.data.idEstablecimiento +
            '/cuestionario'
        )
      },
    })
  })

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <img src="/logos/tambo-logo-360.png" alt="logo" className="h-10.75" />
        </div>
        <img src="/successIcon.svg" alt="success" className="size-32" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[#0B1001]">
            Establecimiento creado correctamente!
          </h2>
          <p className="text-sm">
            Ya puedes comenzar a configurar tu establencimiento
          </p>
        </div>
        <Button
          variant="darkGreen"
          className="flex items-center gap-2 h-10 w-42 px-6 mt-8"
          onClick={() => navigate.push(url)}
        >
          Continuar <ArrowRight className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-center py-2">
          <img src="/logos/isotipo_tambo 1.png" alt="logo" className="w-22" />
        </div>
        <h3 className="text-center text-2xl font-bold text-[#0B1001]">
          Crear Nuevo
        </h3>
      </div>
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="org-name">Nombre del establecimiento</Label>
          <Input
            id="org-name"
            placeholder="Ingrese el nombre del establecimiento"
            {...register('name')}
            disabled={isPending}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {error?.response?.data?.message && (
          <p className="text-sm text-red-500">
            {error.response.data.message ||
              'Ocurrió un error al crear la organización. Por favor, inténtelo de nuevo.'}
          </p>
        )}

        <div className="flex items-center justify-center w-full pt-2">
          <Button
            variant="darkGreen"
            className="w-33.25 h-12.5"
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'Creando...' : 'Aceptar'}
          </Button>
        </div>
      </form>
    </>
  )
}

const OnboardingFlow = () => {
  const [step, setStep] = useState<Step>('welcome')
  const navigate = useRouter()
  const { logout } = useAuth()
  const { data: invitations } = useInvitations()

  const hasInvitations =
    (invitations?.data?.invitaciones_establecimiento?.length ?? 0) > 0 ||
    (invitations?.data?.invitaciones_organizacion?.length ?? 0) > 0

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#F2F1EC] relative font-inter bg-[url('/vacas_4.webp')] bg-cover bg-center bg-no-repeat"
      data-testid="verify-user-page"
    >
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div className="relative w-full h-full p-4 flex flex-col items-center justify-center z-10">
        <Card className="w-full max-w-150 border-none shadow-2xl py-8 bg-white/95 backdrop-blur-md rounded-lg relative">
          <CardContent className="space-y-8">
            {/* ── WELCOME ── */}
            {step === 'welcome' && (
              <div className="flex flex-col items-center text-center h-full">
                <div className="flex items-center justify-center py-2">
                  <img
                    src="/logos/isotipo_tambo 1.png"
                    alt="logo"
                    className="w-22"
                  />
                </div>
                <div className="w-auto flex items-start gap-2">
                  <h3 className="text-2xl font-bold">
                    ¡Bienvenido a Tambo 360!
                  </h3>
                </div>
                <section className="max-w-103 flex flex-col items-center justify-center gap-6 mt-4 text-[15px]">
                  <p>
                    Para comenzar, necesitas crear tu primarea organización o
                    esperar a ser invitado por alguien más
                  </p>
                </section>
                <section className="flex items-center justify-center gap-8 w-full mt-8">
                  <Button
                    variant="darkGreen"
                    className="flex items-center gap-4 w-full h-12.5 max-w-68"
                    onClick={() => setStep('createEstablishment')}
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white">
                      <Plus
                        className="pt-px size-4 text-[#29845A]"
                        strokeWidth={3}
                      />
                    </span>
                    Crear Establecimiento
                  </Button>

                  {hasInvitations && (
                    <Button
                      variant="darkGreen"
                      className="flex items-center gap-2 w-full h-12 max-w-48 relative"
                      onClick={() => navigate.push('/invitaciones')}
                    >
                      <div className="size-4 absolute top-2 right-2 bg-red-500" />
                      <SendHorizonal />
                      Invitaciones
                    </Button>
                  )}
                </section>
              </div>
            )}
            {step === 'createEstablishment' && <EstablishmentStep />}
          </CardContent>
        </Card>
      </div>
      <Button
        variant="landingSecondary"
        onClick={logout}
        className="cursor-pointer! absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
        data-testid="logout-button"
      >
        <LogOut className="size-4" />
        Cerrar sesión
      </Button>
    </div>
  )
}

export default OnboardingFlow
