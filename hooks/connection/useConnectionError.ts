import { useCallback, useRef, useState } from 'react'

interface UseConnectionErrorOptions {
  onServerError?: (message: string) => void
  closeParentDialog?: () => void // cierra el form cuando hay error de red
  openParentDialog?: () => void // reabre el form al hacer retry
  offlinePassthrough?: boolean
}

interface UseConnectionErrorReturn {
  showConnectionError: boolean
  handleSubmitWithConnectionCheck: <T>(
    submitFn: (data: T) => Promise<void>
  ) => (data: T) => Promise<void>
  retry: () => void
  dismiss: (resetFn?: () => void) => void
}

export const useConnectionError = (
  options?: UseConnectionErrorOptions
): UseConnectionErrorReturn => {
  const [showConnectionError, setShowConnectionError] = useState(false)
  const pendingRetryRef = useRef<(() => Promise<void>) | null>(null)

  const handleSubmitWithConnectionCheck = useCallback(
    <T>(submitFn: (data: T) => Promise<void>) =>
      async (data: T) => {
        const attempt = async () => {
          if (!navigator.onLine) {
            // Flujo con cola offline: delega en la mutación (encola + éxito
            // optimista) sin mostrar el modal de error de conexión.
            if (options?.offlinePassthrough) {
              try {
                await submitFn(data)
                setShowConnectionError(false)
                pendingRetryRef.current = null
              } catch (err: any) {
                const serverMessage =
                  err?.response!.data?.message || 'Error inesperado'
                options?.onServerError?.(serverMessage)
              }
              return
            }
            options?.closeParentDialog?.()
            setShowConnectionError(true)
            pendingRetryRef.current = attempt
            return
          }

          try {
            await submitFn(data)
            setShowConnectionError(false)
            pendingRetryRef.current = null
          } catch (err: any) {
            const serverMessage =
              err?.response!.data?.message || 'Error inesperado'

            if (!navigator.onLine) {
              options?.closeParentDialog?.()
              setShowConnectionError(true)
              pendingRetryRef.current = attempt
            } else {
              // Error del servidor → toast, el form sigue abierto
              options?.onServerError?.(serverMessage)
            }
          }
        }

        await attempt()
      },
    [options]
  )

  // Retry: cierra el error modal, reabre el form, reintenta
  const retry = useCallback(async () => {
    if (pendingRetryRef.current) {
      setShowConnectionError(false)
      options?.openParentDialog?.()
      await pendingRetryRef.current()
    }
  }, [options])

  // Dismiss: cierra todo, limpia pending, resetea form si se pasa fn
  const dismiss = useCallback((resetFn?: () => void) => {
    setShowConnectionError(false)
    pendingRetryRef.current = null
    resetFn?.()
  }, [])

  return {
    showConnectionError,
    handleSubmitWithConnectionCheck,
    retry,
    dismiss,
  }
}
