const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
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
})
