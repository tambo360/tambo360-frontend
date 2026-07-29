'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Thermometer, Droplets, Sun } from 'lucide-react'
import { useState } from 'react'
import { useCompleteBatch } from '@/hooks/batch/useCompleteBatch'
import Link from 'next/link'
import ChangeBatch from '@/components/shared/dashboard/batch/ChangeBatch'
import { Lote } from '@/types/batch'

interface CompleteBatchProps {
  open: boolean
  onClose: () => void
  batchId?: string
  batch?: Lote
  refetch: () => void
}

const CompleteBatch = ({
  open,
  onClose,
  batchId,
  batch,
  refetch,
}: CompleteBatchProps) => {
  const [finished, setFinished] = useState(false)
  const [openAddBatch, setOpenAddBatch] = useState(false)
  const { mutateAsync, isPending, error } = useCompleteBatch()

  const handleComplete = async () => {
    try {
      await mutateAsync(batchId!)
      refetch()
      setFinished(true)
    } catch (err) {
      console.warn('Error al completar el lote:', err)
    }
  }

  const handleCloseAll = () => {
    setFinished(false)
    onClose()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseAll}>
        {finished ? (
          <DialogContent className="p-10 flex flex-col items-center text-center space-y-6">
            <DialogHeader className="items-center">
              <img src="/successIcon.svg" alt="Terminado" />
              <DialogTitle className="text-[32px] font-bold text-black">
                Lote completo
              </DialogTitle>
              <DialogDescription className="text-base font-medium text-center">
                El nuevo lote ha sido completado exitosamente. No se podrá
                editar la información ni registrar nuevas mamas o costos
                asociados
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col w-full space-y-2">
              <Button className="h-14 text-xl font-bold" asChild>
                <Link href="/analisis">
                  Volver al dashboard <ArrowRight />
                </Link>
              </Button>

              <Button
                className="h-14 text-xl font-bold"
                variant="secondary"
                onClick={() => {
                  setOpenAddBatch(true)
                  handleCloseAll()
                }}
              >
                Crear otro lote
              </Button>
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="p-8 flex flex-col text-left space-y-4">
            <DialogHeader>
              <DialogTitle className="text-[28px] font-bold leading-tight">
                Cerrar Lote
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                Revisa el resumen detallado antes de finalizar la jornada
                productiva.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border rounded-xl p-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  N° Lote
                </p>
                <p className="font-medium">
                  {batch
                    ? String(batch.numeroLote).padStart(3, '0')
                    : (batchId ?? '—')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Producto
                </p>
                <p className="font-medium">{batch?.producto?.nombre ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Fecha
                </p>
                <p className="font-medium">
                  {batch?.fechaProduccion
                    ? batch.fechaProduccion
                        .slice(0, 10)
                        .split('-')
                        .reverse()
                        .join('/')
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Cantidad Total
                </p>
                <p className="font-medium">
                  {batch ? `${batch.cantidad} ${batch.unidad}` : '—'}
                </p>
              </div>
            </div>

            {/*
              TODO (pendiente de backend / integración externa): no existe
              ninguna fuente de datos climáticos en el proyecto todavía.
              "Resumen Climático" se muestra mockeado por ahora.
            */}
            <Card className="bg-[#F3FAEA] border-none p-4">
              <p className="text-sm font-bold mb-3">Resumen Climático</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="size-4 text-green-main" />
                  <div>
                    <p className="text-xs text-gray-500">Temperatura</p>
                    <p className="font-bold text-sm">24.5°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="size-4 text-green-main" />
                  <div>
                    <p className="text-xs text-gray-500">Humedad</p>
                    <p className="font-bold text-sm">68%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="size-4 text-green-main" />
                  <div>
                    <p className="text-xs text-gray-500">Estado</p>
                    <p className="font-bold text-sm">Soleado</p>
                  </div>
                </div>
              </div>
            </Card>

            {error && (
              <p className="text-sm text-red-600 font-medium">
                {error.response?.data?.message ||
                  'Algo salió mal al completar el lote'}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full h-14 text-lg font-bold border-gray-300"
                onClick={handleCloseAll}
                disabled={isPending}
              >
                Cancelar
              </Button>

              <Button
                className="w-full h-14 text-lg font-bold flex items-center justify-center gap-2"
                onClick={handleComplete}
                disabled={isPending}
              >
                {isPending ? 'Procesando...' : 'Confirmar'}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <ChangeBatch
        open={openAddBatch}
        onClose={() => setOpenAddBatch(false)}
        onOpen={() => setOpenAddBatch(true)}
      />
    </>
  )
}

export default CompleteBatch
