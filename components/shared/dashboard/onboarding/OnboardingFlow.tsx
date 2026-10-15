'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
// import { useInvitations } from '@/hooks/invitation/useInvitations'
import { Plus } from 'lucide-react'
// import { SendHorizonal } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
// import { useRouter } from 'next/navigation'
const EstablishmentStep = dynamic(() => import('./EstablishmentStep'), {
  loading: () => (
    <p className="py-10 text-center text-sm text-[#626059]">
      Cargando formulario…
    </p>
  ),
})

type Step = 'welcome' | 'createEstablishment'

const OnboardingFlow = () => {
  const [step, setStep] = useState<Step>('welcome')
  // const navigate = useRouter()
  // const { data: invitations } = useInvitations()

  // const hasInvitations =
  //   (invitations?.data?.invitaciones_establecimiento?.length ?? 0) > 0 ||
  //   (invitations?.data?.invitaciones_organizacion?.length ?? 0) > 0

  return (
    <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center p-4">
      <Card className="w-full max-w-150 border-none shadow-2xl py-8 bg-white/95 backdrop-blur-md rounded-lg relative">
        <CardContent className="space-y-8">
          {/* ── WELCOME ── */}
          {step === 'welcome' && (
            <div className="flex flex-col items-center text-center h-full">
              <div className="flex items-center justify-center py-2">
                <img
                  src="/logos/isotipo_tambo_1.png"
                  alt="logo"
                  width={786}
                  height={786}
                  className="w-22 h-auto"
                />
              </div>
              <div className="w-auto flex items-start gap-2">
                <h3 className="text-2xl font-bold">¡Bienvenido a Tambo 360!</h3>
              </div>
              <section className="max-w-103 flex flex-col items-center justify-center gap-6 mt-4 text-[15px]">
                <p>
                  Para comenzar, necesitas crear tu primera organización o
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

                {/* Pausado: botón de invitaciones en onboarding
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
                */}
              </section>
            </div>
          )}
          {step === 'createEstablishment' && <EstablishmentStep />}
        </CardContent>
      </Card>
    </div>
  )
}

export default OnboardingFlow
