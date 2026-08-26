import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Providers from '@/utils/Providers'
import { GoogleTagManager } from '@next/third-parties/google'
import { PWAInstallToast } from '@/components/shared/PWAInstallToast'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Tambo360 | Software de Gestión Agropecuaria con IA en Argentina',
  description:
    'Optimizá la rentabilidad de tu establecimiento con Tambo360. El SaaS de gestión operativa y producción lechera con alertas de IA y modo offline en el lote.',
  keywords: [
    'software de gestión agropecuaria',
    'gestión de tambos',
    'software para tambo',
    'gestión de producción lechera',
    'alertas de IA para tambo',
    'software offline para tambo',
    'SaaS para gestión de tambos',
    'optimización de tambos con IA',
    'rentabilidad en la producción lechera',
    'software de gestión agropecuaria en Argentina',
    'gestión de tambos en Argentina',
    'software para tambo en Argentina',
    'gestión de producción lechera en Argentina',
    'alertas de IA para tambo en Argentina',
    'software offline para tambo en Argentina',
    'SaaS para gestión de tambos en Argentina',
    'optimización de tambos con IA en Argentina',
    'rentabilidad en la producción lechera en Argentina',
    'Tambo360',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', 'font-sans', inter.variable)}
      suppressHydrationWarning
    >
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          {children}
          <PWAInstallToast />
        </Providers>
      </body>
    </html>
  )
}
