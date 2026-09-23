'use client'

import { CheckCircle, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BatchSuccessScreenProps {
  batchId: string
  onGoToDetail: () => void
  onCreateAnother: () => void
  onReturnToDashboard: () => void
}

export const BatchSuccessScreen = ({
  onGoToDetail,
  onCreateAnother,
  onReturnToDashboard,
}: BatchSuccessScreenProps) => {
  return (
    <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#E8F5E9] rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Ícono de éxito */}
          <div className="relative">
            <div className="w-20 h-20 bg-[#2E7D53] rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#66BB6A] rounded-full opacity-60" />
            <div className="absolute -bottom-3 -left-4 w-5 h-5 bg-[#81C784] rounded-full opacity-40" />
          </div>

          {/* Contenido */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Lote creado correctamente
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
              El nuevo lote ha sido registrado exitosamente en el sistema. Ahora
              puedes gestionar su seguimiento y producción.
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3 w-full pt-4">
            <Button
              onClick={onGoToDetail}
              className="h-14 rounded-xl px-8 bg-[#2E7D53] hover:bg-[#236342] text-white font-semibold text-base shadow-lg flex items-center justify-center gap-2"
            >
              Ir al detalle del lote
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={onCreateAnother}
              variant="outline"
              className="h-14 rounded-xl px-8 border-2 border-gray-200 bg-white text-gray-700 font-semibold text-base hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear otro lote
            </Button>
            <button
              onClick={onReturnToDashboard}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2 transition-colors"
            >
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
