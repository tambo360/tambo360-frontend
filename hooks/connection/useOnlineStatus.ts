'use client'

import React from 'react'

const readOnline = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true
  }
  return navigator.onLine
}

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = React.useState<boolean>(readOnline)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    // Sincroniza por si cambió entre el render y el efecto
    setIsOnline(navigator.onLine)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

export function isCurrentlyOnline(): boolean {
  return readOnline()
}
