if (!self.define) {
  let e,
    a = {}
  const s = (s, c) => (
    (s = new URL(s + '.js', c).href),
    a[s] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;((e.src = s), (e.onload = a), document.head.appendChild(e))
        } else ((e = s), importScripts(s), a())
      }).then(() => {
        let e = a[s]
        if (!e) throw new Error(`Module ${s} didn’t register its module`)
        return e
      })
  )
  self.define = (c, i) => {
    const n =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (a[n]) return
    let t = {}
    const r = (e) => s(e, n),
      o = { module: { uri: n }, exports: t, require: r }
    a[n] = Promise.all(c.map((e) => o[e] || r(e))).then((e) => (i(...e), t))
  }
}
define(['./workbox-3c9d0171'], function (e) {
  'use strict'
  ;(importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/chunks/05f4ccaa-468a166560971b5c.js',
          revision: '468a166560971b5c',
        },
        {
          url: '/_next/static/chunks/1132-ec55cb7c4dd43377.js',
          revision: 'ec55cb7c4dd43377',
        },
        {
          url: '/_next/static/chunks/133-ae93a992572f87fc.js',
          revision: 'ae93a992572f87fc',
        },
        {
          url: '/_next/static/chunks/1407-5a4ad239fce2c29a.js',
          revision: '5a4ad239fce2c29a',
        },
        {
          url: '/_next/static/chunks/1566-f8941e71cc3efd19.js',
          revision: 'f8941e71cc3efd19',
        },
        {
          url: '/_next/static/chunks/2224-a200116f6bc4841b.js',
          revision: 'a200116f6bc4841b',
        },
        {
          url: '/_next/static/chunks/2523-d74fcc711cbe316e.js',
          revision: 'd74fcc711cbe316e',
        },
        {
          url: '/_next/static/chunks/2606-4584321d484d8f82.js',
          revision: '4584321d484d8f82',
        },
        {
          url: '/_next/static/chunks/2653-dc5478ee213f15cd.js',
          revision: 'dc5478ee213f15cd',
        },
        {
          url: '/_next/static/chunks/2811-756bf61baed424f5.js',
          revision: '756bf61baed424f5',
        },
        {
          url: '/_next/static/chunks/3231-a28b4d4c1757675b.js',
          revision: 'a28b4d4c1757675b',
        },
        {
          url: '/_next/static/chunks/3715-8ca01c657c9dcafc.js',
          revision: '8ca01c657c9dcafc',
        },
        {
          url: '/_next/static/chunks/4071-cf5feea45911ea7b.js',
          revision: 'cf5feea45911ea7b',
        },
        {
          url: '/_next/static/chunks/4178-5d7ee6a6840095a9.js',
          revision: '5d7ee6a6840095a9',
        },
        {
          url: '/_next/static/chunks/4573-9625fb4867347ddc.js',
          revision: '9625fb4867347ddc',
        },
        {
          url: '/_next/static/chunks/4760-f064b6c6be35628b.js',
          revision: 'f064b6c6be35628b',
        },
        {
          url: '/_next/static/chunks/4990.2ae6e79f2eebae41.js',
          revision: '2ae6e79f2eebae41',
        },
        {
          url: '/_next/static/chunks/5690-ccc69a6762701682.js',
          revision: 'ccc69a6762701682',
        },
        {
          url: '/_next/static/chunks/5813-b897357adf6cf317.js',
          revision: 'b897357adf6cf317',
        },
        {
          url: '/_next/static/chunks/583-6feaf4de98557549.js',
          revision: '6feaf4de98557549',
        },
        {
          url: '/_next/static/chunks/6183-c8dc37ace0ae1d57.js',
          revision: 'c8dc37ace0ae1d57',
        },
        {
          url: '/_next/static/chunks/6247-b58c1020a23526f5.js',
          revision: 'b58c1020a23526f5',
        },
        {
          url: '/_next/static/chunks/6299.ce097b5b702349b1.js',
          revision: 'ce097b5b702349b1',
        },
        {
          url: '/_next/static/chunks/6311-2d60bb151064dadd.js',
          revision: '2d60bb151064dadd',
        },
        {
          url: '/_next/static/chunks/6730-74be1b9ac933f65d.js',
          revision: '74be1b9ac933f65d',
        },
        {
          url: '/_next/static/chunks/6769-c5ee0a11e8de2657.js',
          revision: 'c5ee0a11e8de2657',
        },
        {
          url: '/_next/static/chunks/7322-868622bca2627c0c.js',
          revision: '868622bca2627c0c',
        },
        {
          url: '/_next/static/chunks/7361-0a6669925d392ee8.js',
          revision: '0a6669925d392ee8',
        },
        {
          url: '/_next/static/chunks/7724-16bc157b21344295.js',
          revision: '16bc157b21344295',
        },
        {
          url: '/_next/static/chunks/7896-2ad7b8090548b32d.js',
          revision: '2ad7b8090548b32d',
        },
        {
          url: '/_next/static/chunks/7923-15a7d667603c1209.js',
          revision: '15a7d667603c1209',
        },
        {
          url: '/_next/static/chunks/8700-e53d7ab77c91be63.js',
          revision: 'e53d7ab77c91be63',
        },
        {
          url: '/_next/static/chunks/8812-c9972c01c4b2f64d.js',
          revision: 'c9972c01c4b2f64d',
        },
        {
          url: '/_next/static/chunks/8974-3f4e59e373914ae6.js',
          revision: '3f4e59e373914ae6',
        },
        {
          url: '/_next/static/chunks/9127-46cdd5e9191b8ba3.js',
          revision: '46cdd5e9191b8ba3',
        },
        {
          url: '/_next/static/chunks/app/(auth)/iniciar-sesion/page-58dd30491f6443fa.js',
          revision: '58dd30491f6443fa',
        },
        {
          url: '/_next/static/chunks/app/(auth)/layout-fa2721f4eeaa9710.js',
          revision: 'fa2721f4eeaa9710',
        },
        {
          url: '/_next/static/chunks/app/(auth)/recuperar-contrasena/page-2540a8c6bff19ad8.js',
          revision: '2540a8c6bff19ad8',
        },
        {
          url: '/_next/static/chunks/app/(auth)/registrarse/page-e9ec24641d22d341.js',
          revision: 'e9ec24641d22d341',
        },
        {
          url: '/_next/static/chunks/app/(auth)/verificar/page-190c899b3e3c40d0.js',
          revision: '190c899b3e3c40d0',
        },
        {
          url: '/_next/static/chunks/app/(landing)/contacto/page-07f6f9d4715ed6ef.js',
          revision: '07f6f9d4715ed6ef',
        },
        {
          url: '/_next/static/chunks/app/(landing)/equipo/page-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/(landing)/layout-85a926eb09fe6571.js',
          revision: '85a926eb09fe6571',
        },
        {
          url: '/_next/static/chunks/app/(landing)/nosotros/page-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/(landing)/page-c40fbf849a19061b.js',
          revision: 'c40fbf849a19061b',
        },
        {
          url: '/_next/static/chunks/app/(landing)/precios/page-9a2a9f131c7d5fd2.js',
          revision: '9a2a9f131c7d5fd2',
        },
        {
          url: '/_next/static/chunks/app/(landing)/producto/page-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/(landing)/testimonios/page-c13e01cb48e8a13f.js',
          revision: 'c13e01cb48e8a13f',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/bienvenida/page-a3e47517e1ae4c04.js',
          revision: 'a3e47517e1ae4c04',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/invitaciones/page-424ce33c03cf79d9.js',
          revision: '424ce33c03cf79d9',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/layout-b7538fb2f84a1098.js',
          revision: 'b7538fb2f84a1098',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/alertas/page-114bea7c365bc292.js',
          revision: '114bea7c365bc292',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/analisis/page-273f9df8270ed1ce.js',
          revision: '273f9df8270ed1ce',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/configuracion/page-c12809053d71bc5a.js',
          revision: 'c12809053d71bc5a',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/costos/page-fbadf20cd8d318bd.js',
          revision: 'fbadf20cd8d318bd',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/historial/page-5a6c04467cc7c255.js',
          revision: '5a6c04467cc7c255',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/layout-ed0c25bb581093ee.js',
          revision: 'ed0c25bb581093ee',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/produccion/lote/%5BloteId%5D/page-6b4a5814d2f41fed.js',
          revision: '6b4a5814d2f41fed',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/produccion/page-9ea13f14179e7563.js',
          revision: '9ea13f14179e7563',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/cuestionario/page-928e3548d73fd75f.js',
          revision: '928e3548d73fd75f',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/invitar/page-9fa2d1c16916665c.js',
          revision: '9fa2d1c16916665c',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/layout-2b37492de1c2ccc0.js',
          revision: '2b37492de1c2ccc0',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/page-b06930e61131d85a.js',
          revision: 'b06930e61131d85a',
        },
        {
          url: '/_next/static/chunks/app/_global-error/page-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/layout-40d07e36434e44ee.js',
          revision: '40d07e36434e44ee',
        },
        {
          url: '/_next/static/chunks/app/manifest.webmanifest/route-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/not-found-253f914cfe9514c5.js',
          revision: '253f914cfe9514c5',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/sitemap.xml/route-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/framework-918cbdc033dd495a.js',
          revision: '918cbdc033dd495a',
        },
        {
          url: '/_next/static/chunks/main-15d7d39429702d62.js',
          revision: '15d7d39429702d62',
        },
        {
          url: '/_next/static/chunks/main-app-98ddbbc3772a7bf5.js',
          revision: '98ddbbc3772a7bf5',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/app-error-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/forbidden-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/global-error-121a793749487151.js',
          revision: '121a793749487151',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/unauthorized-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-38f45aeb0e00fc26.js',
          revision: '38f45aeb0e00fc26',
        },
        {
          url: '/_next/static/css/00052a318521b992.css',
          revision: '00052a318521b992',
        },
        {
          url: '/_next/static/css/827658ac991ae42e.css',
          revision: '827658ac991ae42e',
        },
        {
          url: '/_next/static/jamlp5PE4650CikKt3OvI/_buildManifest.js',
          revision: 'ae95ec4364c09f0a70dfffaa7ebce369',
        },
        {
          url: '/_next/static/jamlp5PE4650CikKt3OvI/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/media/19cfc7226ec3afaa-s.woff2',
          revision: '9dda5cfc9a46f256d0e131bb535e46f8',
        },
        {
          url: '/_next/static/media/21350d82a1f187e9-s.woff2',
          revision: '4e2553027f1d60eff32898367dd4d541',
        },
        {
          url: '/_next/static/media/8e9860b6e62d6359-s.woff2',
          revision: '01ba6c2a184b8cba08b0d57167664d75',
        },
        {
          url: '/_next/static/media/ba9851c3c22cd980-s.woff2',
          revision: '9e494903d6b0ffec1a1e14d34427d44d',
        },
        {
          url: '/_next/static/media/c5fe6dc8356a8c31-s.woff2',
          revision: '027a89e9ab733a145db70f09b8a18b42',
        },
        {
          url: '/_next/static/media/df0a9ae256c0569c-s.woff2',
          revision: 'd54db44de5ccb18886ece2fda72bdfe0',
        },
        {
          url: '/_next/static/media/e4af272ccee01ff0-s.p.woff2',
          revision: '65850a373e258f1c897a2b3d75eb74de',
        },
        { url: '/alertIcon.svg', revision: '84057a819fdeee32363f29af76776fc7' },
        {
          url: '/establecimiento.webp',
          revision: '0b4b94af5f6dcb858e3ecfe761036f8e',
        },
        {
          url: '/landing/hero.webp',
          revision: 'ce3b77943b8a8216ead4d28c671931d4',
        },
        {
          url: '/landing/tambo-engine.webp',
          revision: '1c649db1ed4025ef923d2bac5dc6747f',
        },
        {
          url: '/logos/isotipo_192x192.jpg',
          revision: '80a69aed5acae64bbd2ee1a8cf4c7d66',
        },
        {
          url: '/logos/isotipo_512x512.jpg',
          revision: '12d93c39ebdf163f9504cde40fc2bba1',
        },
        {
          url: '/logos/isotipo_tambo 1.png',
          revision: 'cd6550abb0f2a4600d990fe6641396cf',
        },
        {
          url: '/logotipo 1.png',
          revision: '44c2ff011a577578724bbde62db19440',
        },
        { url: '/offline.html', revision: 'aaf017980bd5e9e1a8de0c2555f14feb' },
        { url: '/robot.svg', revision: '362d3b436d07781741b772ae1bef1066' },
        { url: '/robots.txt', revision: '97a54fbade34735e7f77912693c96278' },
        {
          url: '/screenshots/desktop.jpg',
          revision: '6f8278ca95478444152c4b2dad17a623',
        },
        {
          url: '/screenshots/mobile.jpeg',
          revision: '54581b3451b1ceecd3affe3feb3b51f4',
        },
        { url: '/smart_toy.svg', revision: '23526c9a9aaa9b0e0add800cbc2179f4' },
        {
          url: '/successIcon.svg',
          revision: '752a57261d3dd38057f11a1af450c5c4',
        },
        {
          url: '/swe-worker-5c72df51bb1f6ee0.js',
          revision: '76fdd3369f623a3edcf74ce2200bfdd0',
        },
        {
          url: '/team/cintiaduarte.webp',
          revision: '9462ffbb9cd2e7a39763ec17a901ecbe',
        },
        {
          url: '/team/elianaproserpio.webp',
          revision: '569ce0b5e3114a8c3ecad27f335fb824',
        },
        {
          url: '/team/facundofernandez.webp',
          revision: 'edf8c24b4690202a470d18e512324e8a',
        },
        {
          url: '/team/gabrielnievas.webp',
          revision: '3ce99a861d8af458e80a4ed9adafef06',
        },
        {
          url: '/team/juanmeza.webp',
          revision: '538fc9cf74ffe7cd2dfeb07375288eb8',
        },
        {
          url: '/team/lorenasartori.webp',
          revision: '7e8bcfe246b670634ecad16b9c934bac',
        },
        {
          url: '/team/nicolasdebella.webp',
          revision: '52fc15ead5c73e64e0197aba5a1f9263',
        },
        {
          url: '/team/nicolasmansilla.webp',
          revision: '55569955d8fc46be5f5b9b85bc7ea7b6',
        },
        {
          url: '/team/nicolaspavon.webp',
          revision: 'edea828f611baff1c9cc37a85539d9a3',
        },
        {
          url: '/team/ornellameolans.webp',
          revision: 'aaec7f6248bdf3e7002810b108a82835',
        },
        {
          url: '/team/tatianatablada.webp',
          revision: 'c2bd09c87ec07ba1a9ff7ff5c18222d5',
        },
        {
          url: '/team/vero.webp',
          revision: 'f4451b73b05b6e695213d75b4aaf8691',
        },
        { url: '/vacas.webp', revision: '6a6f39d196d5de45e7abab28e4636ff0' },
        { url: '/vacas_1.webp', revision: '155cd4f2a1b279d501de349b31e0afa0' },
        { url: '/vacas_2.webp', revision: '87fefdfc34b02f09584496fe1c16b315' },
        { url: '/vacas_3.webp', revision: '6c3da3beb12c6ee72cad503c887fd58c' },
        { url: '/vacas_4.webp', revision: '160d8df98c74dfef635f201ce2170e1e' },
        { url: '/vacas_5.webp', revision: '837248670b55faebed4922673819eda4' },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && 'opaqueredirect' === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: 'next-static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: a } }) =>
        !(!e || a.startsWith('/api/auth/callback') || !a.startsWith('/api/')),
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: a }, sameOrigin: s }) =>
        '1' === e.headers.get('RSC') &&
        '1' === e.headers.get('Next-Router-Prefetch') &&
        s &&
        !a.startsWith('/api/'),
      new e.NetworkFirst({
        cacheName: 'pages-rsc-prefetch',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: a }, sameOrigin: s }) =>
        '1' === e.headers.get('RSC') && s && !a.startsWith('/api/'),
      new e.NetworkFirst({
        cacheName: 'pages-rsc',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: a }) => a && !e.startsWith('/api/'),
      new e.NetworkFirst({
        cacheName: 'pages',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET'
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0))
})
