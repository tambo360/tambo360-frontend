'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

const TOAST_ID = 'pwa-install'

declare global {
  interface Window {
    __pwaPrompt?: Event
  }
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as any).standalone === true

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  // iPadOS 13+ se identifica como Mac
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

const closeIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

const shareIcon = (
  <svg
    className="inline w-4 h-4 align-text-bottom"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 16V4m0 0L8 8m4-4l4 4M6 12v7a1 1 0 001 1h10a1 1 0 001-1v-7"
    />
  </svg>
)

function InstallCard({
  description,
  onClose,
  children,
}: {
  description: React.ReactNode
  onClose: () => void
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 bg-background border rounded-lg p-4 shadow-lg w-full max-w-90">
      <div className="shrink-0 relative size-16">
        <img
          src="/logos/isotipo_512x512.jpg"
          alt="Tambo360 Logo"
          className="object-contain rounded-md"
        />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-sm">Instalar Tambo360</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        {children}
      </div>

      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        {closeIcon}
      </button>
    </div>
  )
}

export function PWAInstallToast() {
  useEffect(() => {
    // Ya instalada y abierta como app: no se muestra.
    if (isStandalone()) return

    // El cierre es solo de esta carga: al recargar sin tener la app instalada
    // el toast vuelve a aparecer (no se persiste nada en localStorage).
    const dismiss = () => toast.dismiss(TOAST_ID)

    // iOS (Safari/Chrome) no dispara `beforeinstallprompt`: se muestran instrucciones.
    if (isIOS()) {
      toast.custom(
        () => (
          <InstallCard
            onClose={dismiss}
            description={
              <>
                Toca {shareIcon} y luego &quot;Agregar a pantalla de
                inicio&quot; para usarla sin conexión.
              </>
            }
          />
        ),
        { id: TOAST_ID, duration: Infinity, position: 'bottom-right' }
      )

      return () => {
        toast.dismiss(TOAST_ID)
      }
    }

    const showInstallToast = (e: Event) => {
      window.__pwaPrompt = e

      toast.custom(
        () => (
          <InstallCard
            onClose={dismiss}
            description="Gestiona tu producción más rápido y sin conexión."
          >
            <div className="flex gap-2 mt-2">
              <button
                onClick={async () => {
                  toast.dismiss(TOAST_ID)
                  // El evento es de un solo uso: si cancela, el toast ya
                  // se cerró y vuelve a aparecer en la próxima carga.
                  await (e as any).prompt()
                }}
                className="text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-medium flex-1"
              >
                Instalar
              </button>
              <button
                onClick={dismiss}
                className="text-xs bg-secondary text-secondary-foreground px-4 py-1.5 rounded-md font-medium flex-1"
              >
                Ahora no
              </button>
            </div>
          </InstallCard>
        ),
        { id: TOAST_ID, duration: Infinity, position: 'bottom-right' }
      )
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      showInstallToast(e)
    }

    // El script de app/layout.tsx captura el evento antes de hidratar:
    // si ya se disparó, se muestra de inmediato.
    if (window.__pwaPrompt) showInstallToast(window.__pwaPrompt)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', dismiss)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', dismiss)
    }
  }, [])

  return null
}
