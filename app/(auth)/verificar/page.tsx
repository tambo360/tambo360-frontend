'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useVerifyEmail } from '@/hooks/auth/useVerifyEmail'
import { ArrowRight, Loader2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const VerifyUser = () => {
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
    <div
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#F2F1EC] relative font-inter bg-[url('/vacas_4.webp')] bg-cover bg-center bg-no-repeat"
      data-testid="verify-user-page"
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
            <div className="relative flex flex-col h-full justify-between gap-4 py-5">
              <div className="absolute left-1/2 top-7 -translate-x-1/2">
                <img
                  src="/logos/tambo-logo-360.png"
                  alt="logo"
                  className="h-10.75"
                />
              </div>
              <section className=" pt-20 sm:pt-0 w-full flex-1 flex flex-col items-center justify-center gap-6">
                {isPending ? (
                  <div className="space-y-4" data-testid="verifying-loader">
                    <Loader2 className="w-12 h-12 text-[#0B1001] animate-spin mx-auto" />
                    <h2 className="text-4xl font-bold tracking-tight text-[#0B1001]">
                      Verificando...
                    </h2>
                  </div>
                ) : error ? (
                  <div
                    className="flex flex-col items-center justify-center gap-6 w-full"
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
                    className="flex flex-col items-center justify-center gap-6 w-full"
                    data-testid="verification-success-container"
                  >
                    <img
                      src="/successIcon.svg"
                      alt="success"
                      className="w-20 h-20"
                    />
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
        </Card>
      </div>
    </div>
  )
}

export default VerifyUser
