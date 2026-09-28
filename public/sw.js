if (!self.define) {
  let e,
    a = {}
  const c = (c, s) => (
    (c = new URL(c + '.js', s).href),
    a[c] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;((e.src = c), (e.onload = a), document.head.appendChild(e))
        } else ((e = c), importScripts(c), a())
      }).then(() => {
        let e = a[c]
        if (!e) throw new Error(`Module ${c} didn’t register its module`)
        return e
      })
  )
  self.define = (s, i) => {
    const n =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (a[n]) return
    let t = {}
    const b = (e) => c(e, n),
      r = { module: { uri: n }, exports: t, require: b }
    a[n] = Promise.all(s.map((e) => r[e] || b(e))).then((e) => (i(...e), t))
  }
}
define(['./workbox-97a2e3da'], function (e) {
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
          url: '/_next/static/chunks/1296-347836bb90778caa.js',
          revision: '347836bb90778caa',
        },
        {
          url: '/_next/static/chunks/133-f4d89eec075ee8fd.js',
          revision: 'f4d89eec075ee8fd',
        },
        {
          url: '/_next/static/chunks/1407-5a4ad239fce2c29a.js',
          revision: '5a4ad239fce2c29a',
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
          url: '/_next/static/chunks/2653-5d66b91a9007d9e9.js',
          revision: '5d66b91a9007d9e9',
        },
        {
          url: '/_next/static/chunks/2665-a3fc4a576f3a0992.js',
          revision: 'a3fc4a576f3a0992',
        },
        {
          url: '/_next/static/chunks/2811-756bf61baed424f5.js',
          revision: '756bf61baed424f5',
        },
        {
          url: '/_next/static/chunks/3012-f45458d6bb993874.js',
          revision: 'f45458d6bb993874',
        },
        {
          url: '/_next/static/chunks/3207-730adb3870190214.js',
          revision: '730adb3870190214',
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
          url: '/_next/static/chunks/4178-5d7ee6a6840095a9.js',
          revision: '5d7ee6a6840095a9',
        },
        {
          url: '/_next/static/chunks/4488-0f9f3535c1b6ae84.js',
          revision: '0f9f3535c1b6ae84',
        },
        {
          url: '/_next/static/chunks/4573-9625fb4867347ddc.js',
          revision: '9625fb4867347ddc',
        },
        {
          url: '/_next/static/chunks/4939-5fcc8eaab720e17d.js',
          revision: '5fcc8eaab720e17d',
        },
        {
          url: '/_next/static/chunks/4990.2ae6e79f2eebae41.js',
          revision: '2ae6e79f2eebae41',
        },
        {
          url: '/_next/static/chunks/5238-98015cc70b7e01b7.js',
          revision: '98015cc70b7e01b7',
        },
        {
          url: '/_next/static/chunks/5638-513903bb76cb3ab9.js',
          revision: '513903bb76cb3ab9',
        },
        {
          url: '/_next/static/chunks/6158-d5e6544577307d6e.js',
          revision: 'd5e6544577307d6e',
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
          url: '/_next/static/chunks/7447-f084d36af9f9b34d.js',
          revision: 'f084d36af9f9b34d',
        },
        {
          url: '/_next/static/chunks/7509-e13e57015b06a214.js',
          revision: 'e13e57015b06a214',
        },
        {
          url: '/_next/static/chunks/7724-16bc157b21344295.js',
          revision: '16bc157b21344295',
        },
        {
          url: '/_next/static/chunks/9410-760da9f6f4a312bd.js',
          revision: '760da9f6f4a312bd',
        },
        {
          url: '/_next/static/chunks/9496-f800567a802d61a3.js',
          revision: 'f800567a802d61a3',
        },
        {
          url: '/_next/static/chunks/9539-2aee678b3fad57dd.js',
          revision: '2aee678b3fad57dd',
        },
        {
          url: '/_next/static/chunks/9759-3ef0be4e79753162.js',
          revision: '3ef0be4e79753162',
        },
        {
          url: '/_next/static/chunks/9915-f81684841ecb302c.js',
          revision: 'f81684841ecb302c',
        },
        {
          url: '/_next/static/chunks/app/(auth)/iniciar-sesion/page-89e04269deabaddc.js',
          revision: '89e04269deabaddc',
        },
        {
          url: '/_next/static/chunks/app/(auth)/layout-e58c49b9c82bcd3a.js',
          revision: 'e58c49b9c82bcd3a',
        },
        {
          url: '/_next/static/chunks/app/(auth)/recuperar-contrasena/page-1e68b6e4ae0aee70.js',
          revision: '1e68b6e4ae0aee70',
        },
        {
          url: '/_next/static/chunks/app/(auth)/registrarse/page-c64e27805de1bcf4.js',
          revision: 'c64e27805de1bcf4',
        },
        {
          url: '/_next/static/chunks/app/(auth)/verificar/page-542f13377d2293fb.js',
          revision: '542f13377d2293fb',
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
          url: '/_next/static/chunks/app/(landing)/layout-f06a8096c479a054.js',
          revision: 'f06a8096c479a054',
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
          url: '/_next/static/chunks/app/(onboard)/bienvenida/page-66ccc2259ab653ef.js',
          revision: '66ccc2259ab653ef',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/invitaciones/page-97524d28dc5860c2.js',
          revision: '97524d28dc5860c2',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/layout-0d07657462ccb18e.js',
          revision: '0d07657462ccb18e',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/alertas/page-59c5aff40666c4e3.js',
          revision: '59c5aff40666c4e3',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/analisis/page-357a0d74743faaa8.js',
          revision: '357a0d74743faaa8',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/configuracion/page-788bce0595f394b9.js',
          revision: '788bce0595f394b9',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/costos/page-41172335f56d9bfa.js',
          revision: '41172335f56d9bfa',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/historial/page-98e519e3dd8097ae.js',
          revision: '98e519e3dd8097ae',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/layout-449007286c061782.js',
          revision: '449007286c061782',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/produccion/lote/%5BloteId%5D/page-fd659916969af3ee.js',
          revision: 'fd659916969af3ee',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/(dashboard)/produccion/page-2f419c6f469ceb0f.js',
          revision: '2f419c6f469ceb0f',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/cuestionario/page-cdb62fb9c4c2073e.js',
          revision: 'cdb62fb9c4c2073e',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/invitar/page-455c494b5d118c63.js',
          revision: '455c494b5d118c63',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/%5BorgId%5D/%5Bid%5D/layout-2ddfe00cc5815797.js',
          revision: '2ddfe00cc5815797',
        },
        {
          url: '/_next/static/chunks/app/(onboard)/organizaciones/page-32d4466f064599ce.js',
          revision: '32d4466f064599ce',
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
          url: '/_next/static/chunks/app/layout-13584e6ded02ca62.js',
          revision: '13584e6ded02ca62',
        },
        {
          url: '/_next/static/chunks/app/manifest.webmanifest/route-2b6b55e36b50b5c9.js',
          revision: '2b6b55e36b50b5c9',
        },
        {
          url: '/_next/static/chunks/app/not-found-f6e2e9be50c18e23.js',
          revision: 'f6e2e9be50c18e23',
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
          url: '/_next/static/css/827658ac991ae42e.css',
          revision: '827658ac991ae42e',
        },
        {
          url: '/_next/static/css/941481150c1741ff.css',
          revision: '941481150c1741ff',
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
        {
          url: '/_next/static/xjL36TUKyo6m0c8sMZNPS/_buildManifest.js',
          revision: '58928cbb12234c44d3c3e1758d210086',
        },
        {
          url: '/_next/static/xjL36TUKyo6m0c8sMZNPS/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/alertIcon.svg', revision: '043e3a76ef2964cc2fd4c6ed26c0f09b' },
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
          url: '/logos/tambo-logo-360.png',
          revision: '8a10422404036f8d679caa4621a219cf',
        },
        {
          url: '/logotipo 1.png',
          revision: '44c2ff011a577578724bbde62db19440',
        },
        { url: '/offline.html', revision: 'aa1ae3dd9587138c6ead124f0faeb053' },
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
        ],
      }),
      'GET'
    ),
    e.registerRoute(/^.*\/backend\/auth\/.*$/, new e.NetworkOnly(), 'GET'),
    e.registerRoute(/^.*\/backend\/.*$/, new e.NetworkOnly(), 'POST'),
    (self.__WB_DISABLE_DEV_LOGS = !0))
})
