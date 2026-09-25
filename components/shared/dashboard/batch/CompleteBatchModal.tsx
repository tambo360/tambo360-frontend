'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { queryKeys } from '@/utils/queryKeys'
import { useState } from 'react'

interface CompleteBatchModalProps {
  open: boolean
  onClose: () => void
  batchId: string
  onSuccess?: () => void
}

export const CompleteBatchModal = ({
  open,
  onClose,
  batchId,
  onSuccess,
}: CompleteBatchModalProps) => {
  const queryClient = useQueryClient()
  const [showError, setShowError] = useState(false)

  const { mutate: completeBatch, isPending } = useMutation({
    mutationFn: () => api.post(`/lote/completar/${batchId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.batch.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.batch.detail(batchId),
      })
      onClose()
      onSuccess?.()
    },
    onError: () => {
      setShowError(true)
    },
  })

  const handleConfirm = () => {
    completeBatch()
  }

  const handleCloseError = () => {
    setShowError(false)
    onClose()
  }

  return (
    <>
      {/* Modal de Confirmación */}
      <Dialog open={open && !showError} onOpenChange={onClose}>
        <DialogContent className="w-[95%] sm:max-w-md bg-[#FFFBF0] rounded-3xl p-8 shadow-xl border-0">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Ícono de advertencia */}
            <div className="relative">
              <div className="w-16 h-16 bg-[#D4A92C] rounded-full flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#F4D03F] rounded-full opacity-60" />
              <div className="absolute -bottom-2 -left-3 w-4 h-4 bg-[#E8B84D] rounded-full opacity-40" />
            </div>

            {/* Título */}
            <div className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                ¿Completar lote?
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                Una vez completado, el lote se cerrará permanentemente. No
                podrás editar la información ni registrar nuevas mermas o costos
                asociados.
              </DialogDescription>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 w-full pt-2">
              <Button
                onClick={handleConfirm}
                disabled={isPending}
                className="h-12 rounded-xl px-6 bg-[#D4A92C] hover:bg-[#B8941F] text-white font-semibold text-base shadow-md disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Completando...
                  </>
                ) : (
                  'Sí, completar lote'
                )}
              </Button>
              <Button
                onClick={onClose}
                disabled={isPending}
                variant="outline"
                className="h-12 rounded-xl px-6 border-2 border-gray-200 bg-white text-gray-700 font-semibold text-base hover:bg-gray-50 disabled:opacity-70"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Error */}
      <Dialog open={showError} onOpenChange={handleCloseError}>
        <DialogContent className="w-[95%] sm:max-w-md bg-[#FFF0F0] rounded-3xl p-8 shadow-xl border-0">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Ícono de error */}
            <div className="relative">
              <div className="w-16 h-16 bg-[#DC2626] rounded-full flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#F87171] rounded-full opacity-60" />
              <div className="absolute -bottom-2 -left-3 w-4 h-4 bg-[#EF4444] rounded-full opacity-40" />
            </div>

            {/* Título */}
            <div className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                No pudimos guardar los cambios
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                Hubo un error inesperado al intentar registrar los datos. Por
                favor, intentar guardar nuevamente en unos momentos
              </DialogDescription>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 w-full pt-2">
              <Button
                onClick={handleConfirm}
                disabled={isPending}
                className="h-12 rounded-xl px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Intentar de nuevo
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </>
                )}
              </Button>
              <Button
                onClick={handleCloseError}
                disabled={isPending}
                variant="outline"
                className="h-12 rounded-xl px-6 border-2 border-gray-200 bg-white text-gray-700 font-semibold text-base hover:bg-gray-50 disabled:opacity-70"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
