import LoginForm from '@/components/shared/login/LoginForm'
import { Card } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión | Tambo360',
  description:
    'Ingresá tus credenciales para empezar a usar la plataforma Tambo360.',
}

const Login: React.FC = () => {
  return (
    <div
      className="relative min-h-dvh w-full bg-[#F2F1EC] font-inter"
      data-testid="login-page-container"
    >
      <div
        aria-hidden
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/vacas_1.webp')" }}
      />
      <div className="fixed inset-0 z-0 bg-black/30" />
      <div className="relative z-10 flex justify-end items-center min-h-dvh w-full p-4">
        <Card className="h-full m-auto w-full border-none shadow-2xl py-0 px-4 bg-white/95 backdrop-blur-md rounded-xl relative sm:m-0 sm:ml-auto sm:max-w-125">
          <LoginForm />
        </Card>
      </div>
    </div>
  )
}

export default Login
