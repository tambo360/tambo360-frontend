import RegisterForm from '@/components/shared/register/RegisterForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Crear cuenta | Tambo360',
  description:
    'Registrá tu establecimiento lácteo en Tambo360 y empezá a gestionar tu producción.',
}

const Register: React.FC = () => {
  return (
    <div
      className="relative min-h-dvh w-full bg-[#F2F1EC] font-inter"
      data-testid="register-page-container"
    >
      <div
        aria-hidden
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/vacas_2.webp')" }}
      />
      <div className="fixed inset-0 z-0 bg-black/30" />
      <Button
        variant="secondary"
        size="icon"
        className="cursor-pointer! absolute top-4 left-4 z-30! rounded-full"
        asChild
      >
        <Link href="/iniciar-sesion">
          <ChevronLeft className="size-6" />
        </Link>
      </Button>
      <div className="relative z-10 flex min-h-dvh w-full p-4">
        <Card className="m-auto w-full border-none shadow-2xl py-0 px-4 bg-white/95 backdrop-blur-md rounded-xl relative sm:m-0 sm:ml-auto sm:max-w-125 sm:min-h-[calc(100dvh-2rem)]">
          <RegisterForm />
        </Card>
      </div>
    </div>
  )
}

export default Register
