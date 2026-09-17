'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ChevronLeft,
  Plus,
  Filter,
  MoreHorizontal,
  Loader2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBatch } from '@/hooks/batch/useBatch'
import { useConfiguration } from '@/hooks/establishment/useConfiguration'
import { TipoSeguimiento } from '@/types/enums'
import { Lote } from '@/types/batch'
import RegisterMermaModal from './RegisterMermaModal'

interface LoteConAnimales extends Lote {
  animales?: Array<{
    idAnimal: string
    codigo: string
    nombre: string
    litros: number
    estado: 'SANO' | 'MASTITIS' | 'TRATAMIENTO' | 'PREPARTO'
  }>
}

interface BatchDetailModalProps {
  open: boolean
  onClose: () => void
  batchId: string
}

const BatchDetailModal = ({
  open,
  onClose,
  batchId,
}: BatchDetailModalProps) => {
  const [isMermaModalOpen, setIsMermaModalOpen] = useState(false)

  const {
    data: batchData,
    isLoading,
    error,
    refetch,
  } = useBatch({ id: batchId })
  const { data: configData, isLoading: configLoading } = useConfiguration()

  const handleSaveMerma = async (data: any) => {
    try {
      console.log('Guardando merma:', { idLote: batchId, ...data })
      refetch()
      setIsMermaModalOpen(false)
    } catch (error) {
      console.error('Error al registrar merma:', error)
    }
  }

  if (isLoading || configLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-white rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !batchData?.data) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-white rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No se pudo cargar el lote</p>
            <p className="text-sm">{error?.message || 'ID inválido'}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const batch = batchData.data as LoteConAnimales

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-white rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1.5 pb-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Detalle del Lote
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Información completa del lote de producción
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-col w-full gap-6 pt-4">
            {/* Cabecera del Lote */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-1.5">
                <Badge
                  variant="outline"
                  className={`${
                    batch.estado
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-green-50 text-green-700 border-green-200'
                  } text-xs px-2.5 py-0.5 font-semibold`}
                >
                  {batch.estado ? 'Incompleto' : 'Completo'}
                </Badge>
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  Lote #{batch.numeroLote || batch.idLote.slice(0, 8)} -{' '}
                  {batch.producto?.nombre || 'Sin producto'}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Fecha:{' '}
                  {batch.fechaProduccion
                    ? new Date(batch.fechaProduccion).toLocaleDateString(
                        'es-AR'
                      )
                    : '—'}
                </p>
                {batch.cantBajadas && (
                  <p className="text-xs text-gray-400">
                    Cantidad de bajadas: {batch.cantBajadas}
                  </p>
                )}
              </div>
            </div>

            {/* Cards de Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Cantidad Producida
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {batch.cantidad || 0}{' '}
                  <span className="text-sm font-normal text-gray-500">
                    {batch.unidad || 'L'}
                  </span>
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Costo Operativo Total
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ${' '}
                  {batch.costosDirectos
                    ?.reduce((acc, c) => acc + c.monto, 0)
                    .toLocaleString('es-AR') || '0'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Merma Registrada
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {batch.mermas
                    ?.reduce((acc, m) => acc + m.cantidad, 0)
                    .toLocaleString('es-AR') || 0}{' '}
                  L
                </p>
              </div>
            </div>

            {/* Historial de Mermas */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">
                  Historial de Mermas
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setIsMermaModalOpen(true)}
                    className="bg-[#2E7D53] hover:bg-[#236342] text-white text-xs font-semibold h-9 rounded-lg gap-1.5 px-3.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Agregar Merma
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase py-3.5 pl-6">
                        Fecha
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase">
                        Tipo
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase">
                        Cantidad
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase">
                        Observación
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase text-right pr-6">
                        Acción
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batch.mermas && batch.mermas.length > 0 ? (
                      batch.mermas.map((merma) => (
                        <TableRow
                          key={merma.idMerma}
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="text-xs text-gray-600 font-medium pl-6 py-4">
                            {new Date(merma.fecha).toLocaleDateString('es-AR')}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-medium">
                            {merma.tipo || '—'}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-medium">
                            {merma.cantidad || 0} L
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-medium max-w-xs truncate">
                            {merma.observacion || '—'}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-600"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-400"
                        >
                          No hay mermas registradas para este lote.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Historial de Costos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">
                  Historial de Costos
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button className="bg-[#2E7D53] hover:bg-[#236342] text-white text-xs font-semibold h-9 rounded-lg gap-1.5 px-3.5 shadow-sm">
                    <Plus className="w-4 h-4" /> Agregar Costo
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase py-3.5 pl-6">
                        Fecha
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase">
                        Tipo
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase">
                        Cantidad
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase">
                        Observación
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase text-right pr-6">
                        Acción
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batch.costosDirectos && batch.costosDirectos.length > 0 ? (
                      batch.costosDirectos.map((costo) => (
                        <TableRow
                          key={costo.idCostoDirecto}
                          className="border-b border-gray-100 hover:bg-gray-50/50"
                        >
                          <TableCell className="text-xs text-gray-600 font-medium pl-6 py-4">
                            {new Date(costo.fechaCreacion).toLocaleDateString(
                              'es-AR'
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-medium">
                            {costo.concepto || '—'}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-medium">
                            $ {costo.monto?.toLocaleString('es-AR') || 0}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-medium max-w-xs truncate">
                            {costo.observaciones || '—'}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-600"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-400"
                        >
                          No hay costos registrados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Mermas */}
      <RegisterMermaModal
        open={isMermaModalOpen}
        onClose={() => setIsMermaModalOpen(false)}
        onSave={handleSaveMerma}
      />
    </>
  )
}

export default BatchDetailModal
