import LoginForm from '@/components/shared/login/LoginForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const Login: React.FC = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#F2F1EC] relative font-inter bg-[url('/vacas_1.webp')] bg-cover bg-center bg-no-repeat"
      data-testid="login-page-container"
    >
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 left-4 z-10 rounded-full"
      >
        <Link href="/">
          <ChevronLeft className="size-6" />
        </Link>
      </Button>
      <div className="absolute inset-0 bg-black/10 z-0" />
      <div className="hidden md:flex md:w-1/3 xl:w-1/2" />
      <div className="w-full md:w-2/3 xl:w-1/2 flex items-center justify-center md:justify-end p-4 md:p-8 z-10">
        <Card className="w-full max-w-125 border-none shadow-2xl py-10 px-2 md:px-4 bg-white/95 backdrop-blur-md rounded-xl relative">
          <LoginForm />
        </Card>
      </div>
    </div>
  )
}

export default Login
