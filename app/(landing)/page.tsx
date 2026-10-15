//import Testimonials from '@/components/shared/landing/Testimonials'
import ContactForm from '@/components/shared/landing/ContactForm'
import Features from '@/components/shared/landing/Features'
import Pricing from '@/components/shared/landing/Pricing'
import Hero from '@/components/shared/landing/Hero'
import Nosotros from '@/components/shared/landing/Nosotros'
import Equipo from '@/components/shared/landing/Equipo'
import TamboEngineSection from '@/components/shared/landing/TamboEngineSection'

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Hero />
      <Features />
      <TamboEngineSection />
      <Nosotros />
      <Equipo />
      {/*<Testimonials />*/}
      <Pricing />
      <ContactForm />
    </div>
  )
}
