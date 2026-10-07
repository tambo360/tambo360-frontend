if (!self.define) {
  let e,
    s = {}
  const a = (a, n) => (
    (a = new URL(a + '.js', n).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;((e.src = a), (e.onload = s), document.head.appendChild(e))
        } else ((e = a), importScripts(a), s())
      }).then(() => {
        let e = s[a]
        if (!e) throw new Error(`Module ${a} didn’t register its module`)
        return e
      })
  )
  self.define = (n, i) => {
    const c =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (s[c]) return
    let t = {}
    const r = (e) => a(e, c),
      o = { module: { uri: c }, exports: t, require: r }
    s[c] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (i(...e), t))
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
          url: '/_next/static/_xu3Ueju7Hk606gUd9CDK/_buildManifest.js',
          revision: '58928cbb12234c44d3c3e1758d210086',
        },
        {
          url: '/_next/static/_xu3Ueju7Hk606gUd9CDK/_ssgManifest.js',
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
          url: '/_next/static/chunks/1246-4f8ca70ad1cc7606.js',
          revision: '4f8ca70ad1cc7606',
        },
        {
          url: '/_next/static/chunks/1296-347836bb90778caa.js',
          revision: '347836bb90778caa',
        },
        {
          url: '/_next/static/chunks/133-f4d89eec075ee8fd.js',
          revision: 'f4d89eec075ee8fd',
        },
        {
          url: '/_next/static/chunks/1452-03c84ac4a7447d73.js',
          revision: '03c84ac4a7447d73',
        },
        {
          url: '/_next/static/chunks/1566-6dca23443bd00a8c.js',
          revision: '6dca23443bd00a8c',
        },
        {
          url: '/_next/static/chunks/2224-cfbe4cc11495294d.js',
          revision: 'cfbe4cc11495294d',
        },
        {
          url: '/_next/static/chunks/2227-8128a316324afc35.js',
          revision: '8128a316324afc35',
        },
        {
          url: '/_next/static/chunks/260-3bb04f6611dbbd74.js',
          revision: '3bb04f6611dbbd74',
        },
        {
          url: '/_next/static/chunks/2653-5d66b91a9007d9e9.js',
          revision: '5d66b91a9007d9e9',
        },
        {
          url: '/_next/static/chunks/2665-bd3552adc5b63187.js',
          revision: 'bd3552adc5b63187',
        },
        {
          url: '/_next/static/chunks/2811-756bf61baed424f5.js',
          revision: '756bf61baed424f5',
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
          url: '/_next/static/chunks/3715-8ca01c657c9dcafc.js',
          revision: '8ca01c657c9dcafc',
        },
        {
          url: '/_next/static/chunks/3919-9d46d598e94bdec0.js',
          revision: '9d46d598e94bdec0',
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
          url: '/_next/static/chunks/4990.2ae6e79f2eebae41.js',
          revision: '2ae6e79f2eebae41',
        },
        {
          url: '/_next/static/chunks/6183-b7e7192e9636deae.js',
          revision: 'b7e7192e9636deae',
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
          url: '/_next/static/chunks/7102-0eb010b51281debf.js',
          revision: '0eb010b51281debf',
        },
        {
          url: '/_next/static/chunks/7159-a0d2e3a9dbbc0dc6.js',
          revision: 'a0d2e3a9dbbc0dc6',
        },
        {
          url: '/_next/static/chunks/7509-8346ec450eadd874.js',
          revision: '8346ec450eadd874',
        },
        {
          url: '/_next/static/chunks/770-43f1c9ae16a10f91.js',
          revision: '43f1c9ae16a10f91',
        },
        {
          url: '/_next/static/chunks/7724-16bc157b21344295.js',
          revision: '16bc157b21344295',
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
          url: '/_next/static/chunks/8468-2624955782c27c61.js',
          revision: '2624955782c27c61',
        },
        {
          url: '/_next/static/chunks/8531-4654b1422b837063.js',
          revision: '4654b1422b837063',
        },
        {
          url: '/_next/static/chunks/8599-09ceff5f8cf5921a.js',
          revision: '09ceff5f8cf5921a',
        },
        {
          url: '/_next/static/chunks/9410-760da9f6f4a312bd.js',
          revision: '760da9f6f4a312bd',
        },
        {
          url: '/_next/static/chunks/9607-9ba4a7a2d14fc5be.js',
          revision: '9ba4a7a2d14fc5be',
        },
        {
          url: '/_next/static/chunks/9815-b392041bbcd2f558.js',
          revision: 'b392041bbcd2f558',
        },
        {
          url: '/_next/static/chunks/9915-f81684841ecb302c.js',
          revision: 'f81684841ecb302c',
        },
        {
          url: '/_next/static/chunks/app/(auth)/iniciar-sesion/page-546c8a3aed759d1a.js',
          revision: '546c8a3aed759d1a',
        },
        {
          url: '/_next/static/chunks/app/(auth)/layout-27a9bfc058df1ea2.js',
          revision: '27a9bfc058df1ea2',
        },
        {
          url: '/_next/static/chunks/app/(auth)/recuperar-contrasena/page-1df26802ebdd864e.js',
          revision: '1df26802ebdd864e',
        },
        {
          url: '/_next/static/chunks/app/(auth)/registrarse/page-96577eba5e5a9a54.js',
          revision: '96577eba5e5a9a54',
        },
        {
          url: '/_next/static/chunks/app/(auth)/verificar/page-483a859ab5eea723.js',
          revision: '483a859ab5eea723',
        },
        {
          url: '/_next/static/chunks/app/(landing)/contacto/page-dc9c2649883bf597.js',
          revision: 'dc9c2649883bf597',
        },
        {
          url: '/_next/static/chunks/app/(landing)/equipo/page-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/(landing)/layout-f43674a7aef900db.js',
          revision: 'f43674a7aef900db',
        },
        {
          url: '/_next/static/chunks/app/(landing)/nosotros/page-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/(landing)/page-e156ce9ea1a0f435.js',
          revision: 'e156ce9ea1a0f435',
        },
        {
          url: '/_next/static/chunks/app/(landing)/precios/page-90b32550306f42b5.js',
          revision: '90b32550306f42b5',
        },
        {
          url: '/_next/static/chunks/app/(landing)/producto/page-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/(landing)/testimonios/page-70904f0e47a6f966.js',
          revision: '70904f0e47a6f966',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/bienvenida/page-f5ec714be4d7dbaf.js',
          revision: 'f5ec714be4d7dbaf',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/invitaciones/page-fddbc8a7076b1b94.js',
          revision: 'fddbc8a7076b1b94',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/layout-0e0d4a30f3232309.js',
          revision: '0e0d4a30f3232309',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/alertas/page-b0087937de9ee09c.js',
          revision: 'b0087937de9ee09c',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/analisis/page-4beb8b34827f4c0e.js',
          revision: '4beb8b34827f4c0e',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/configuracion/page-d785426cad03b70f.js',
          revision: 'd785426cad03b70f',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/costos/page-101d9fa3824f26e2.js',
          revision: '101d9fa3824f26e2',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/historial/page-21928a578bc9f573.js',
          revision: '21928a578bc9f573',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/layout-ff23aa262cd68e45.js',
          revision: 'ff23aa262cd68e45',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/produccion/lote/%5BloteId%5D/page-62696108f847b238.js',
          revision: '62696108f847b238',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/produccion/page-cfb60babed9f201a.js',
          revision: 'cfb60babed9f201a',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/cuestionario/page-a49b4f2f6821a463.js',
          revision: 'a49b4f2f6821a463',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/invitar/page-96f112244b246a13.js',
          revision: '96f112244b246a13',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/layout-ed13ef4d68d6eec4.js',
          revision: 'ed13ef4d68d6eec4',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/page-4e2088ad4adbb7b2.js',
          revision: '4e2088ad4adbb7b2',
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
          url: '/_next/static/chunks/app/layout-499df968e4e7a486.js',
          revision: '499df968e4e7a486',
        },
        {
          url: '/_next/static/chunks/app/manifest.webmanifest/route-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/not-found-0054746d19b95547.js',
          revision: '0054746d19b95547',
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
          url: '/_next/static/chunks/main-35566d75eaf1ec51.js',
          revision: '35566d75eaf1ec51',
        },
        {
          url: '/_next/static/chunks/main-app-02d9aa8df6bb9eb2.js',
          revision: '02d9aa8df6bb9eb2',
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
          url: '/_next/static/chunks/next/dist/client/components/builtin/global-error-a6a14ba191f47c80.js',
          revision: 'a6a14ba191f47c80',
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
          url: '/_next/static/css/ad4734b2ba19043e.css',
          revision: 'ad4734b2ba19043e',
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
          url: '/screenshots/desktop.jpg',
          revision: '6f8278ca95478444152c4b2dad17a623',
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
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith('/api/auth/callback') || !s.startsWith('/api/')),
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
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        '1' === e.headers.get('RSC') &&
        '1' === e.headers.get('Next-Router-Prefetch') &&
        a &&
        !s.startsWith('/api/'),
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
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        '1' === e.headers.get('RSC') && a && !s.startsWith('/api/'),
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
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith('/api/'),
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
