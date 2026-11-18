'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

const DECISION_KEY = 'pwa-install-decision'
const DISMISSED_AT_KEY = 'pwa-install-dismissed-at'
const DISMISS_DAYS = 7
const TOAST_ID = 'pwa-install'

const safeGet = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const safeSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {}
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as any).standalone === true

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  // iPadOS 13+ se identifica como Mac
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

const recentlyDismissed = () => {
  const at = Number(safeGet(DISMISSED_AT_KEY))
  return !!at && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000
}

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
          src="/logos/isotipo_512x512.png"
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
    if (isStandalone()) return
    if (safeGet(DECISION_KEY) === 'installed') return
    if (recentlyDismissed()) return

    const dismiss = () => {
      safeSet(DISMISSED_AT_KEY, String(Date.now()))
      toast.dismiss(TOAST_ID)
    }

    // iOS (Safari/Chrome) no dispara `beforeinstallprompt`: se muestran instrucciones.
    if (isIOS()) {
      const timer = window.setTimeout(() => {
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
      }, 2000)

      return () => {
        window.clearTimeout(timer)
        toast.dismiss(TOAST_ID)
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()

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
                  const evt = e as any
                  await evt.prompt()
                  const { outcome } = await evt.userChoice
                  if (outcome === 'accepted') {
                    safeSet(DECISION_KEY, 'installed')
                  } else {
                    safeSet(DISMISSED_AT_KEY, String(Date.now()))
                  }
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

    const handleInstalled = () => {
      safeSet(DECISION_KEY, 'installed')
      toast.dismiss(TOAST_ID)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  return null
}
