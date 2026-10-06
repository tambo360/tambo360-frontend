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
  // Sin ella, un reload offline no matchea ninguna
  // ruta y el navegador muestra su página de error (dino). Con `true` las
  // nuestras van primero y las por defecto después.
  extendDefaultRuntimeCaching: true,
  fallbacks: {
    document: '/offline.html',
  },
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
      // GET de lotes: primero red, si no hay red sirve lo visitado.
      // Los datos entre recargas los sostiene además el caché persistido
      // de React Query (IndexedDB); esto cubre el shell y respuestas crudas.
      {
        urlPattern: /\/backend\/lote\/listar.*$/,
        handler: 'NetworkFirst',
        method: 'GET',
        options: {
          cacheName: 'tambo360-lotes',
          expiration: { maxEntries: 60, maxAgeSeconds: 48 * 60 * 60 },
          networkTimeoutSeconds: 3,
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // Config del establecimiento (ubicación, tipo de seguimiento, etc.)
      {
        urlPattern:
          /\/backend\/(conf\/establecimiento|establecimiento\/cuestionario\/info).*$/,
        handler: 'NetworkFirst',
        method: 'GET',
        options: {
          cacheName: 'tambo360-config',
          expiration: { maxEntries: 20, maxAgeSeconds: 48 * 60 * 60 },
          networkTimeoutSeconds: 3,
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // { // PLANTILLA, por cada endpoint GET en offline debe agregar un objeto similar.
      //   urlPattern: /\/backend\/merma\/listar.*$/,
      //   handler: 'NetworkFirst',
      //   method: 'GET',
      //   options: {
      //     cacheName: 'tambo360-mermas', // nombre único por endpoint
      //     expiration: { maxEntries: 60, maxAgeSeconds: 48 * 60 * 60 },
      //     networkTimeoutSeconds: 3,
      //     cacheableResponse: { statuses: [0, 200] },
      //   },
      // },
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
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${BACKEND_URL}/:path*`,
      },
    ]
  },
})
