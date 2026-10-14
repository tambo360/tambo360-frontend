import RegisterForm from '@/components/shared/register/RegisterForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const Register: React.FC = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#F2F1EC] relative font-inter bg-[url('/vacas_2.webp')] bg-cover bg-center bg-no-repeat transition-all duration-700"
      data-testid="register-page-container"
    >
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

      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="w-full min-h-screen flex items-center justify-center md:items-start md:justify-end p-2 sm:p-4 z-10">
        <Card className="w-full md:max-w-125 max-h-[95vh] md:max-h-[95vh] border-none shadow-2xl py-0 px-4 sm:px-6 bg-white/95 backdrop-blur-md rounded-xl relative flex flex-col overflow-hidden">
          <RegisterForm />
        </Card>
      </div>
    </div>
  )
}

export default Register
