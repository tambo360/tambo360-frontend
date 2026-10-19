'use client'

import { useEffect } from 'react'

// Solo desarrollo: desregistra Service Workers de builds anteriores que hayan
// quedado controlando localhost. Un SW viejo sirve HTML/JS cacheados y rompe
// el dev (hydration mismatches, bundles viejos, 404 a _buildManifest).
// En producción este componente no se renderiza.
export default function DevSWUnregister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => {
        reg.unregister().catch(() => {})
      })
    })
    if ('caches' in window) {
      caches
        .keys()
        .then((keys) => {
          keys.forEach((key) => {
            caches.delete(key).catch(() => {})
          })
        })
        .catch(() => {})
    }
  }, [])
  return null
}
