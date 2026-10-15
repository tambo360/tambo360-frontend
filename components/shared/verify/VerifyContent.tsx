'use client'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useVerifyEmail } from '@/hooks/auth/useVerifyEmail'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const VerifyContent = () => {
  const { mutateAsync, error, isPending } = useVerifyEmail()
  const search = useSearchParams()
  const { setUser } = useAuth()
  const navigate = useRouter()

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = search.get('token')
        if (token) {
          const response = await mutateAsync(token)
          setUser(response.data.user)
        }
      } catch (err) {
        console.warn(err)
      }
    }
    checkToken()
  }, [search, mutateAsync, setUser])

  return (
    <CardContent className="flex flex-col px-0">
      <div className="relative flex flex-1 flex-col justify-between gap-4 py-5">
        <div className="absolute left-1/2 top-7 -translate-x-1/2">
          <img src="/logos/tambo-logo-360.png" alt="logo" className="h-10.75" />
        </div>
        <section className=" pt-20 sm:pt-0 w-full flex flex-col items-center justify-center gap-6">
          {isPending ? (
            <div
              className="space-y-4 pt-20 pb-3"
              data-testid="verifying-loader"
            >
              <Loader2 className="w-12 h-12 text-[#0B1001] animate-spin mx-auto" />
              <h2 className="text-4xl font-bold tracking-tight text-[#0B1001]">
                Verificando...
              </h2>
            </div>
          ) : error ? (
            <div
              className="flex flex-col items-center justify-center gap-6 w-full pt-20 pb-3"
              data-testid="verification-failed-container"
            >
              <h2 className="text-3xl font-bold tracking-tight text-[#B91C1C]">
                Verificación fallida
              </h2>
              <p className="text-sm text-body-text text-center">
                {error.response?.data?.message ||
                  'El enlace de verificación no es válido o ha expirado.'}
              </p>
              <Button
                onClick={() => navigate.push('/iniciar-sesion')}
                className="w-full h-14 bg-[#0B1001] text-white rounded-lg flex items-center justify-center gap-2"
                data-testid="back-to-login-button"
              >
                Volver al login
              </Button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-6 w-full pt-20 pb-3"
              data-testid="verification-success-container"
            >
              <img src="/successIcon.svg" alt="success" className="w-20 h-20" />
              <h2 className="text-3xl font-bold tracking-tight text-[#0B1001]">
                ¡Usuario validado!
              </h2>
              <p className="text-sm text-body-text text-center">
                Ya puedes comenzar a gestionar tu <br />
                producción.
              </p>
              <Button
                className="w-full h-14 bg-[#0B1001] text-white rounded-lg flex items-center justify-center gap-2"
                onClick={() => navigate.push('/bienvenida')}
                data-testid="create-establishment-button"
              >
                Continuar <ArrowRight className="size-5" />
              </Button>
            </div>
          )}
        </section>
      </div>
    </CardContent>
  )
}

export default VerifyContent
