import OnboardingFlow from '@/components/shared/dashboard/onboarding/OnboardingFlow'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bienvenida | Tambo360',
  description:
    'Creá tu primer establecimiento en Tambo360 y empezá a gestionar tu producción.',
}

const Page = () => {
  return (
    <div
      className="relative min-h-dvh w-full bg-[#F2F1EC] font-inter"
      data-testid="verify-user-page"
    >
      <link
        rel="preload"
        href="/vacas_4.webp"
        as="image"
        fetchPriority="high"
      />
      <div
        aria-hidden
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/vacas_4.webp')" }}
      />
      <div className="fixed inset-0 z-0 bg-black/30" />
      <OnboardingFlow />
    </div>
  )
}
export default Page
