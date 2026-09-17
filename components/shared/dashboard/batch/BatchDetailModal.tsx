'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Plus,
  Filter,
  MoreHorizontal,
  Loader2,
  ArrowLeft,
  Trash2,
  Edit,
  CheckCircle2,
  Thermometer,
  Clock,
  Layers,
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
import { Lote } from '@/types/batch'

// ✅ Import del modal de merma
import RegisterMermaModal from '@/components/shared/dashboard/organization/configuration/modals/RegisterMermaidModal'

interface MermaFormData {
  motivo: string
  cantidad: number
}

interface LoteConDetalles extends Lote {
  observaciones?: string
  turno?: string
  temperatura?: number
  tipoRodeo?: string
  lote?: any
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
  const [isSavingMerma, setIsSavingMerma] = useState(false)

  const {
    data: batchData,
    isLoading,
    error,
    refetch,
  } = useBatch({ id: batchId })
  const { isLoading: configLoading } = useConfiguration()

  const handleSaveMerma = async (data: MermaFormData) => {
    setIsSavingMerma(true)
    try {
      console.log('📦 Guardando merma:', { idLote: batchId, ...data })
      await new Promise((resolve) => setTimeout(resolve, 800))
      refetch()
      setIsMermaModalOpen(false)
    } catch (error) {
      console.error('❌ Error al registrar merma:', error)
    } finally {
      setIsSavingMerma(false)
    }
  }

  if (isLoading || configLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-4xl md:max-w-5xl lg:max-w-6xl bg-white rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogTitle className="sr-only">
            Cargando detalle del lote
          </DialogTitle>
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
        <DialogContent className="w-[95vw] max-w-4xl md:max-w-5xl lg:max-w-6xl bg-white rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogTitle className="sr-only">Error al cargar el lote</DialogTitle>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No se pudo cargar el lote</p>
            <p className="text-sm">{error?.message || 'ID inválido'}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const batch = batchData.data as LoteConDetalles
  const isIncomplete = Boolean(batch.estado)

  const rawLote = batch.lote ?? batch.numeroLote ?? batch.idLote
  const loteIdentificador =
    typeof rawLote === 'object' && rawLote !== null
      ? rawLote.numeroLote || rawLote.idLote || '1'
      : rawLote || '1'

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        {/* Ancho optimizado para desktop con lg:max-w-6xl y [&>button]:hidden para ocultar la X por defecto de Shadcn */}
        <DialogContent className="w-[95vw] max-w-4xl md:max-w-5xl lg:max-w-6xl bg-white rounded-3xl p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogTitle className="sr-only">
            Detalle del Lote {String(loteIdentificador)}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Información completa del lote de producción, mermas y costos
            operativos.
          </DialogDescription>

          <div className="flex flex-col w-full gap-6">
            {/* Barra superior de navegación / Volver y X limpia y proporcionada */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Lista de producción
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cabecera Principal del Lote */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      isIncomplete
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    } text-xs px-2.5 py-0.5 font-semibold`}
                  >
                    {isIncomplete ? 'Incompleto' : 'Completo'}
                  </Badge>
                  <span className="text-xs text-gray-400 font-medium">
                    Inicio:{' '}
                    {batch.fechaProduccion
                      ? new Date(batch.fechaProduccion).toLocaleDateString(
                          'es-AR'
                        )
                      : '—'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Lote #{String(loteIdentificador)} —{' '}
                  {batch.producto?.nombre || 'Queso Crema'}
                </h2>
              </div>

              {/* Botones de acción principal */}
              <div className="flex items-center gap-2.5">
                {isIncomplete && (
                  <Button className="bg-[#658a14] hover:bg-[#547310] text-white text-xs font-semibold h-9 rounded-xl gap-1.5 px-4 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> Completar lote
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-700 text-xs font-semibold h-9 rounded-xl gap-1.5 px-4 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 text-gray-500" /> Editar lote
                </Button>
              </div>
            </div>

            {/* Metadatos secundarios (Turno, Temperatura, Tipo de Rodeo) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl shadow-xs text-gray-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase">
                    Turno
                  </p>
                  <p className="text-xs font-bold text-gray-800">
                    {batch.turno || 'Tarde'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl shadow-xs text-gray-500">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase">
                    Temperatura
                  </p>
                  <p className="text-xs font-bold text-gray-800">
                    {batch.temperatura ? `${batch.temperatura}°C` : '4.2 °C'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl shadow-xs text-gray-500">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase">
                    Tipo de Rodeo
                  </p>
                  <p className="text-xs font-bold text-gray-800">
                    {batch.tipoRodeo || 'Rodeo Alto'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjetas de Resumen de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-50 rounded-xl">
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
                  {batch.cantidad?.toLocaleString('es-AR') || 0}{' '}
                  <span className="text-sm font-normal text-gray-500">
                    {batch.unidad || 'L'}
                  </span>
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-50 rounded-xl">
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
                  $
                  {batch.costosDirectos
                    ?.reduce((acc, c) => acc + (c.monto || 0), 0)
                    .toLocaleString('es-AR') || '0'}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-orange-50 rounded-xl">
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
                    ?.reduce((acc, m) => acc + Number(m.cantidad || 0), 0)
                    .toLocaleString('es-AR') || 0}{' '}
                  <span className="text-sm font-normal text-gray-500">L</span>
                </p>
              </div>
            </div>

            {/* Observaciones */}
            <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm space-y-1.5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Observaciones
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {batch.observaciones ||
                  'Sin observaciones registradas para este lote.'}
              </p>
            </div>

            {/* Historial de Mermas */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">
                  Historial de Mermas
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setIsMermaModalOpen(true)}
                    className="bg-[#2E7D53] hover:bg-[#236342] text-white text-xs font-semibold h-9 rounded-xl gap-1.5 px-3.5 shadow-sm"
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
                            {Number(merma.cantidad) || 0} L
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
                          className="text-center py-8 text-gray-400 text-xs"
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
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">
                  Historial de Costos
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button className="bg-[#2E7D53] hover:bg-[#236342] text-white text-xs font-semibold h-9 rounded-xl gap-1.5 px-3.5 shadow-sm">
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
                        Concepto
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase">
                        Monto
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
                          className="text-center py-8 text-gray-400 text-xs"
                        >
                          No hay costos registrados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Sección Inferior: Eliminar Lote */}
            <div className="pt-4 pb-2 border-t border-gray-100 flex justify-center">
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold gap-1.5 px-4 py-2 rounded-xl"
              >
                <Trash2 className="w-4 h-4" /> Eliminar lote
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RegisterMermaModal
        open={isMermaModalOpen}
        onClose={() => setIsMermaModalOpen(false)}
        onSave={handleSaveMerma}
        isLoading={isSavingMerma}
      />
    </>
  )
}

export default BatchDetailModal
