if (!self.define) {
  let e,
    a = {}
  const s = (s, n) => (
    (s = new URL(s + '.js', n).href),
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
  self.define = (n, i) => {
    const c =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (a[c]) return
    let t = {}
    const r = (e) => s(e, c),
      o = { module: { uri: c }, exports: t, require: r }
    a[c] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (i(...e), t))
  }
}
define(['./workbox-62888b14'], function (e) {
  'use strict'
  ;(importScripts('/fallback-ce627215c0e4a9af.js'),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/ED__VjH0ewKYj6goTXIca/_buildManifest.js',
          revision: 'f489b124f7b272fdfcdeff4a6ca5c441',
        },
        {
          url: '/_next/static/ED__VjH0ewKYj6goTXIca/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/05f4ccaa-468a166560971b5c.js',
          revision: '468a166560971b5c',
        },
        {
          url: '/_next/static/chunks/1132-ec55cb7c4dd43377.js',
          revision: 'ec55cb7c4dd43377',
        },
        {
          url: '/_next/static/chunks/133-f4d89eec075ee8fd.js',
          revision: 'f4d89eec075ee8fd',
        },
        {
          url: '/_next/static/chunks/2038-352389dc9ec0e7ba.js',
          revision: '352389dc9ec0e7ba',
        },
        {
          url: '/_next/static/chunks/2224-cfbe4cc11495294d.js',
          revision: 'cfbe4cc11495294d',
        },
        {
          url: '/_next/static/chunks/2653-d83bfb52b0a66679.js',
          revision: 'd83bfb52b0a66679',
        },
        {
          url: '/_next/static/chunks/2811-756bf61baed424f5.js',
          revision: '756bf61baed424f5',
        },
        {
          url: '/_next/static/chunks/2854-944b205b0c689501.js',
          revision: '944b205b0c689501',
        },
        {
          url: '/_next/static/chunks/3040-ae410a7eb9e347a3.js',
          revision: 'ae410a7eb9e347a3',
        },
        {
          url: '/_next/static/chunks/3188-d1fe4f48676cfc1a.js',
          revision: 'd1fe4f48676cfc1a',
        },
        {
          url: '/_next/static/chunks/3231-c44b017ea455c4ea.js',
          revision: 'c44b017ea455c4ea',
        },
        {
          url: '/_next/static/chunks/3368-74af029f45378dfe.js',
          revision: '74af029f45378dfe',
        },
        {
          url: '/_next/static/chunks/3919-4b589f08ebdc71e0.js',
          revision: '4b589f08ebdc71e0',
        },
        {
          url: '/_next/static/chunks/4344-cb17cd08ed293f13.js',
          revision: 'cb17cd08ed293f13',
        },
        {
          url: '/_next/static/chunks/4573-9625fb4867347ddc.js',
          revision: '9625fb4867347ddc',
        },
        {
          url: '/_next/static/chunks/4575-78492dae486e8e93.js',
          revision: '78492dae486e8e93',
        },
        {
          url: '/_next/static/chunks/4829-b4aac6fcb7bb6ddf.js',
          revision: 'b4aac6fcb7bb6ddf',
        },
        {
          url: '/_next/static/chunks/488-86b0777d82091f4d.js',
          revision: '86b0777d82091f4d',
        },
        {
          url: '/_next/static/chunks/4986-5ac01f4f09adefee.js',
          revision: '5ac01f4f09adefee',
        },
        {
          url: '/_next/static/chunks/4990.2ae6e79f2eebae41.js',
          revision: '2ae6e79f2eebae41',
        },
        {
          url: '/_next/static/chunks/5396-7a7995bc6a457d69.js',
          revision: '7a7995bc6a457d69',
        },
        {
          url: '/_next/static/chunks/5424-b0ed5ff2cf7f6e78.js',
          revision: 'b0ed5ff2cf7f6e78',
        },
        {
          url: '/_next/static/chunks/6183-c8dc37ace0ae1d57.js',
          revision: 'c8dc37ace0ae1d57',
        },
        {
          url: '/_next/static/chunks/6299.ce097b5b702349b1.js',
          revision: 'ce097b5b702349b1',
        },
        {
          url: '/_next/static/chunks/6325-e13b6c86a236800f.js',
          revision: 'e13b6c86a236800f',
        },
        {
          url: '/_next/static/chunks/7401-044066192d191032.js',
          revision: '044066192d191032',
        },
        {
          url: '/_next/static/chunks/7414.9bf2ffceed65c8ae.js',
          revision: '9bf2ffceed65c8ae',
        },
        {
          url: '/_next/static/chunks/7458-afc75122d3cbadd6.js',
          revision: 'afc75122d3cbadd6',
        },
        {
          url: '/_next/static/chunks/770-3cc684158d4301fd.js',
          revision: '3cc684158d4301fd',
        },
        {
          url: '/_next/static/chunks/7814-2da8e07482020473.js',
          revision: '2da8e07482020473',
        },
        {
          url: '/_next/static/chunks/7846-7080c6000b10a42d.js',
          revision: '7080c6000b10a42d',
        },
        {
          url: '/_next/static/chunks/7913-0ec71f69df7ae65c.js',
          revision: '0ec71f69df7ae65c',
        },
        {
          url: '/_next/static/chunks/8239-af09c35237ac1d1c.js',
          revision: 'af09c35237ac1d1c',
        },
        {
          url: '/_next/static/chunks/8550-a300f52ff4e44f30.js',
          revision: 'a300f52ff4e44f30',
        },
        {
          url: '/_next/static/chunks/8871-05b948cff4c6c1f2.js',
          revision: '05b948cff4c6c1f2',
        },
        {
          url: '/_next/static/chunks/909-dfc52b3304d5ca00.js',
          revision: 'dfc52b3304d5ca00',
        },
        {
          url: '/_next/static/chunks/988-85c30a7a793f2b34.js',
          revision: '85c30a7a793f2b34',
        },
        {
          url: '/_next/static/chunks/app/(auth)/iniciar-sesion/page-2acf2fec31731c39.js',
          revision: '2acf2fec31731c39',
        },
        {
          url: '/_next/static/chunks/app/(auth)/layout-2429bf7da76df1f6.js',
          revision: '2429bf7da76df1f6',
        },
        {
          url: '/_next/static/chunks/app/(auth)/recuperar-contrasena/page-253f7c80bca08462.js',
          revision: '253f7c80bca08462',
        },
        {
          url: '/_next/static/chunks/app/(auth)/registrarse/page-d1ae835a69402d5d.js',
          revision: 'd1ae835a69402d5d',
        },
        {
          url: '/_next/static/chunks/app/(auth)/verificar/page-abfb9d5986100f2c.js',
          revision: 'abfb9d5986100f2c',
        },
        {
          url: '/_next/static/chunks/app/(landing)/layout-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/app/(landing)/page-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/bienvenida/page-807dce0d875808a9.js',
          revision: '807dce0d875808a9',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/invitaciones/page-a8eb8b1f567e132a.js',
          revision: 'a8eb8b1f567e132a',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/layout-0e0d4a30f3232309.js',
          revision: '0e0d4a30f3232309',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/alertas/page-dcbd4140c0b049ce.js',
          revision: 'dcbd4140c0b049ce',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/analisis/page-6b5247448bbaa2b4.js',
          revision: '6b5247448bbaa2b4',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/configuracion/page-917d15c29b0fbe90.js',
          revision: '917d15c29b0fbe90',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/costos/page-1e24e121abc330fc.js',
          revision: '1e24e121abc330fc',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/historial/page-edd08e1e7a2245c4.js',
          revision: 'edd08e1e7a2245c4',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/layout-672465f6bb398fb1.js',
          revision: '672465f6bb398fb1',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/produccion/lote/%5BloteId%5D/page-d0afd94add0d495d.js',
          revision: 'd0afd94add0d495d',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/produccion/page-b3233330125c5a30.js',
          revision: 'b3233330125c5a30',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/cuestionario/page-c5c6102ea1929a54.js',
          revision: 'c5c6102ea1929a54',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/invitar/page-6669803729506ac7.js',
          revision: '6669803729506ac7',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/layout-37eaf053995e0c96.js',
          revision: '37eaf053995e0c96',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/page-178675fc649b61ef.js',
          revision: '178675fc649b61ef',
        },
        {
          url: '/_next/static/chunks/app/_global-error/page-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/app/layout-2d7f663e71c52bee.js',
          revision: '2d7f663e71c52bee',
        },
        {
          url: '/_next/static/chunks/app/manifest.webmanifest/route-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/app/not-found-9935688463af618f.js',
          revision: '9935688463af618f',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/app/sitemap.xml/route-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/framework-918cbdc033dd495a.js',
          revision: '918cbdc033dd495a',
        },
        {
          url: '/_next/static/chunks/main-35566d75eaf1ec51.js',
          revision: '35566d75eaf1ec51',
        },
        {
          url: '/_next/static/chunks/main-app-02d9aa8df6bb9eb2.js',
          revision: '02d9aa8df6bb9eb2',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/app-error-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/forbidden-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/global-error-a6a14ba191f47c80.js',
          revision: 'a6a14ba191f47c80',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/unauthorized-2b0651de4a82a629.js',
          revision: '2b0651de4a82a629',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-71f9122b52a7320e.js',
          revision: '71f9122b52a7320e',
        },
        {
          url: '/_next/static/css/76934e78655a931a.css',
          revision: '76934e78655a931a',
        },
        {
          url: '/_next/static/css/c50624e23d0abf09.css',
          revision: 'c50624e23d0abf09',
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
        { url: '/alertIcon.svg', revision: '043e3a76ef2964cc2fd4c6ed26c0f09b' },
        {
          url: '/establecimiento.webp',
          revision: '0b4b94af5f6dcb858e3ecfe761036f8e',
        },
        {
          url: '/fallback-ce627215c0e4a9af.js',
          revision: '15901f0ce440a5894d841436ca5d5c32',
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
          url: '/logos/isotipo_192x192.png',
          revision: '6b42e95aacc09090ff8b6574dea09644',
        },
        {
          url: '/logos/isotipo_512x512.png',
          revision: '9ebc723b22a1f6edc4033709835a78c7',
        },
        {
          url: '/logos/isotipo_tambo_1.png',
          revision: 'cd6550abb0f2a4600d990fe6641396cf',
        },
        {
          url: '/logos/tambo-logo-360.png',
          revision: '8a10422404036f8d679caa4621a219cf',
        },
        {
          url: '/logotipo 1.png',
          revision: '44c2ff011a577578724bbde62db19440',
        },
        { url: '/offline.html', revision: '6575d3e3509aa6faafe484e7e8543867' },
        { url: '/robot.svg', revision: '08c589dc10d4d98ea3c2315cf75534a1' },
        { url: '/robots.txt', revision: '00ea86f3e45722459a08b4aa2c6631b3' },
        {
          url: '/screenshots/desktop.jpeg',
          revision: '3fbc93c97b7b858c0366bf4f959a92eb',
        },
        {
          url: '/screenshots/mobile.jpeg',
          revision: '54581b3451b1ceecd3affe3feb3b51f4',
        },
        { url: '/smart_toy.svg', revision: 'e5a881f2396e093222374b11d4482a00' },
        {
          url: '/successIcon.svg',
          revision: '2e35f5740d65de2b3f1eec54f5e5b424',
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(/^.*\/backend\/auth\/.*$/, new e.NetworkOnly(), 'GET'),
    e.registerRoute(/^.*\/backend\/.*$/, new e.NetworkOnly(), 'POST'),
    e.registerRoute(
      /\/backend\/lote\/listar.*$/,
      new e.NetworkFirst({
        cacheName: 'tambo360-lotes',
        networkTimeoutSeconds: 3,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 172800 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/backend\/(conf\/establecimiento|establecimiento\/cuestionario\/info).*$/,
      new e.NetworkFirst({
        cacheName: 'tambo360-config',
        networkTimeoutSeconds: 3,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 172800 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/backend\/mermas.*$/,
      new e.NetworkFirst({
        cacheName: 'tambo360-mermas',
        networkTimeoutSeconds: 3,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 172800 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/backend\/lote\/buscar.*$/,
      new e.NetworkFirst({
        cacheName: 'tambo360-lote-detail',
        networkTimeoutSeconds: 3,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 172800 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/backend\/(conf\/animal\/transferir\/form-data|establecimiento\/info\/opciones-seguimiento|productos).*$/,
      new e.NetworkFirst({
        cacheName: 'tambo360-catalogs',
        networkTimeoutSeconds: 3,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 172800 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
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
          {
            handlerDidError: async ({ request: e }) =>
              'undefined' != typeof self ? self.fallback(e) : Response.error(),
          },
        ],
      }),
      'GET'
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0))
})
