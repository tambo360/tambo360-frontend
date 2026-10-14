import PublicLayout from '@/components/layout/PublicLayout'
import type { Metadata } from 'next'

// Título genérico del grupo (auth). Las páginas server (iniciar-sesión,
// registrarse) definen su propio title y lo sobrescriben; las páginas client
// (recuperar-contraseña, verificar) no pueden exportar metadata, así que
// heredan este.
export const metadata: Metadata = {
  title: 'Acceso | Tambo360',
  description:
    'Accedé a Tambo360 para gestionar la producción de tu establecimiento lácteo.',
}

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <PublicLayout>{children}</PublicLayout>
}
export default layout
