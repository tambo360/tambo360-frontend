import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Tambo360',
    short_name: 'Tambo360',
    description:
      'Tambo360 es un sistema de gestión de producción para tambos y la industria láctea: controla lotes, mermas y costos, incluso sin conexión.',
    start_url: '/iniciar-sesion',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/logos/isotipo_192x192.jpeg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: '/logos/isotipo_512x512.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: '/logos/isotipo_512x512.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/mobile.jpeg',
        sizes: '720x1448',
        type: 'image/jpeg',
      },
      {
        src: '/screenshots/desktop.jpeg',
        sizes: '1345x768',
        type: 'image/jpeg',
        form_factor: 'wide',
      },
    ],
  }
}
