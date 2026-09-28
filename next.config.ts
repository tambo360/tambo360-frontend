const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://tambo360-backend-develop.onrender.com/api'
).replace(/\/$/, '')

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    // Auth nunca debe cachearse: en iOS un 401 cacheado parece "no puedo entrar".
    // El resto de rutas conserva el comportamiento anterior.
    runtimeCaching: [
      {
        urlPattern: /^.*\/backend\/auth\/.*$/,
        handler: 'NetworkOnly',
        method: 'GET',
      },
      {
        urlPattern: /^.*\/backend\/.*$/,
        handler: 'NetworkOnly',
        method: 'POST',
      },
    ],
  },
})

module.exports = withPWA({
  reactStrictMode: true,
  // ⚠️ Ignorar errores de TypeScript durante el build
  typescript: {
    ignoreBuildErrors: true,
  },
  // ⚠️ Ignorar errores de ESLint durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Proxy same-site: el browser solo habla con nuestro dominio (cookie
  // first-party, Safari iOS la acepta) y Next reenvía al backend.
  // No cambia paths: /backend/auth/me -> <BACKEND>/auth/me.
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${BACKEND_URL}/:path*`,
      },
    ]
  },
})
