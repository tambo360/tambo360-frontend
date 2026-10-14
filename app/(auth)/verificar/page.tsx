import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AuthCardSkeleton from '@/components/shared/auth/AuthCardSkeleton'
import VerifyContent from '@/components/shared/verify/VerifyContent'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Verificar cuenta | Tambo360',
  description:
    'Verificá tu correo electrónico para activar tu cuenta de Tambo360.',
}

const VerifyUser = () => {
  return (
    <div
      className="relative min-h-dvh w-full bg-[#F2F1EC] font-inter"
      data-testid="verify-user-page"
    >
      <div
        aria-hidden
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/vacas_4.webp')" }}
      />
      <div className="fixed inset-0 z-0 bg-black/30" />
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
      <div className="relative z-10 flex min-h-dvh w-full p-4">
        <Card className="m-auto w-full border-none shadow-2xl py-0 px-4 bg-white/95 backdrop-blur-md rounded-xl relative sm:m-0 sm:ml-auto sm:max-w-125 sm:min-h-[calc(100dvh-2rem)]">
          <Suspense fallback={<AuthCardSkeleton />}>
            <VerifyContent />
          </Suspense>
        </Card>
      </div>
    </div>
  )
}

export default VerifyUser
