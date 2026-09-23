'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Plus,
  Filter,
  Loader2,
  ArrowLeft,
  Trash2,
  Edit,
  CheckCircle2,
  X,
  Pencil,
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
import { useBatchDecrease } from '@/hooks/decrease/useBatchDecrease'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import { Lote } from '@/types/batch'
import { TIPO_MERMA_LABELS } from '@/types/decrease'
import { api } from '@/services/api'
import { queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import RegisterMermaModal from '@/components/shared/dashboard/organization/configuration/modals/RegisterMermaidModal'

interface LoteConDetalles extends Lote {
  observaciones?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lote?: any
}

interface BatchDetailModalProps {
  open: boolean
  onClose: () => void
  batchId: string
  onEditRequest?: (batch: Lote) => void
  onCompleteRequest?: (batch: Lote) => void
  onDeleted?: () => void
}

// Hook interno para actualizar observaciones del lote
function useUpdateObservations(idLote: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (observaciones: string) =>
      api.patch(`/lote/${idLote}`, { observaciones }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.batch.detail(idLote),
      })
    },
  })
}

const BatchDetailModal = ({
  open,
  onClose,
  batchId,
  onEditRequest,
  onCompleteRequest,
  onDeleted,
}: BatchDetailModalProps) => {
  const { data: batchData, isLoading, error } = useBatch({ id: batchId })
  const { isLoading: configLoading } = useConfiguration()

  const {
    isCreateOpen,
    openCreate,
    closeCreate,
    isCreating,
    handleCreate,
    decreaseToDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,
  } = useBatchDecrease({ batchId })

  // ── Observaciones ──
  const [isEditingObs, setIsEditingObs] = useState(false)
  const [obsDraft, setObsDraft] = useState('')
  const [isDeletingBatch, setIsDeletingBatch] = useState(false)
  const { mutateAsync: updateObservations, isPending: isSavingObs } =
    useUpdateObservations(batchId)
  const { showErrorMessage } = useErrorMessage()

  useEffect(() => {
    setIsEditingObs(false)
    setObsDraft('')
  }, [batchId, open])

  const dialogClass =
    'w-[95vw] max-w-4xl md:max-w-5xl lg:max-w-6xl bg-white rounded-3xl p-6 md:p-8 shadow-xl max-h-[95vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>button]:hidden'

  // ── Eliminar lote ──
  const handleConfirmDeleteBatch = async () => {
    try {
      await api.delete(`/lote/${batchId}`)
      setIsDeletingBatch(false)
      onDeleted?.()
      onClose()
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } }
      showErrorMessage(
        e?.response?.data?.message ||
          'No se pudo eliminar el lote. Intenta de nuevo.'
      )
      setIsDeletingBatch(false)
    }
  }

  if (isLoading || configLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={dialogClass}>
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
        <DialogContent className={dialogClass}>
          <DialogTitle className="sr-only">Error al cargar el lote</DialogTitle>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No se pudo cargar el lote</p>
            <p className="text-sm">{error?.message || 'ID inválido'}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // La respuesta viene { lote, alertas }, leer el lote interno
  const raw = batchData.data as any
  const batch: LoteConDetalles = (raw?.lote ?? raw) as LoteConDetalles

  // Estado visible (derivado de mermas)
  const hasMermas = Array.isArray(batch.mermas) && batch.mermas.length > 0
  const isComplete = hasMermas
  const isIncomplete = !isComplete

  // Estado real del backend para habilitar/deshabilitar acciones
  const isLocked = Boolean(batch.estado)

  const rawLote = batch.lote ?? batch.numeroLote ?? batch.idLote
  const loteIdentificador =
    typeof rawLote === 'object' && rawLote !== null
      ? rawLote.numeroLote || rawLote.idLote || '1'
      : rawLote || '1'

  const startEditObs = () => {
    setObsDraft(batch.observaciones || '')
    setIsEditingObs(true)
  }

  const cancelEditObs = () => {
    setIsEditingObs(false)
    setObsDraft('')
  }

  const saveObs = async () => {
    try {
      await updateObservations(obsDraft.trim())
      setIsEditingObs(false)
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } }
      showErrorMessage(
        e?.response?.data?.message ||
          'No se pudieron guardar las observaciones.'
      )
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={dialogClass}>
          <DialogTitle className="sr-only">
            Detalle del Lote {String(loteIdentificador)}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Información completa del lote de producción y sus mermas.
          </DialogDescription>

          <div className="flex flex-col w-full gap-6">
            {/* Barra superior de navegación */}
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
                  {batch.producto?.nombre || 'Sin producto'}
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                {!isLocked && (
                  <Button
                    onClick={() => onCompleteRequest?.(batch)}
                    className="bg-[#658a14] hover:bg-[#547310] text-white text-xs font-semibold h-10 rounded-xl gap-1.5 px-5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Completar lote
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => onEditRequest?.(batch)}
                  disabled={isLocked}
                  className="border-gray-200 text-gray-600 text-xs font-semibold h-10 rounded-xl gap-1.5 px-5 hover:bg-gray-50 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit className="w-4 h-4 text-gray-500" /> Editar lote
                </Button>
              </div>
            </div>

            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {batch.cantidad
                    ? Number(batch.cantidad).toLocaleString('es-AR')
                    : 0}{' '}
                  <span className="text-sm font-normal text-gray-500">
                    {batch.unidad || 'L'}
                  </span>
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
                  {batch.mermas && batch.mermas.length > 0
                    ? batch.mermas
                        .reduce((acc, m) => acc + Number(m.cantidad || 0), 0)
                        .toLocaleString('es-AR')
                    : 0}{' '}
                  <span className="text-sm font-normal text-gray-500">L</span>
                </p>
              </div>
            </div>

            {/* Observaciones (editable) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  Observaciones
                </h3>
                {!isEditingObs && (
                  <button
                    type="button"
                    onClick={startEditObs}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Editar observaciones"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isEditingObs ? (
                <div className="space-y-2">
                  <textarea
                    value={obsDraft}
                    onChange={(e) => setObsDraft(e.target.value)}
                    maxLength={300}
                    rows={3}
                    placeholder="Escribe una observación sobre este lote..."
                    className="w-full text-xs text-gray-700 leading-relaxed p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#2E7D53] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      {obsDraft.length}/300
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={cancelEditObs}
                        disabled={isSavingObs}
                        className="h-8 rounded-lg px-3 border-gray-200 text-gray-600 text-xs font-semibold"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={saveObs}
                        disabled={isSavingObs}
                        className="h-8 rounded-lg px-3 bg-[#2E7D53] hover:bg-[#236342] text-white text-xs font-semibold"
                      >
                        {isSavingObs ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 leading-relaxed">
                  {batch.observaciones ||
                    'Sin observaciones registradas para este lote.'}
                </p>
              )}
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
                    onClick={openCreate}
                    disabled={isLocked}
                    className="bg-[#2E7D53] hover:bg-[#236342] text-white text-xs font-semibold h-9 rounded-xl gap-1.5 px-3.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" /> Agregar Merma
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto hide-scrollbar">
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
                            {new Date(merma.fechaCreacion).toLocaleDateString(
                              'es-AR'
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-medium">
                            {TIPO_MERMA_LABELS[merma.tipo] ?? merma.tipo ?? '—'}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-medium">
                            {Number(merma.cantidad) || 0} L
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-medium max-w-xs truncate">
                            {merma.observacion || '—'}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => requestDelete(merma)}
                                aria-label="Eliminar merma"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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

            {/* Sección Inferior: Eliminar Lote */}
            {!isLocked && (
              <div className="pt-2 pb-2">
                <button
                  type="button"
                  onClick={() => setIsDeletingBatch(true)}
                  className="w-full py-3.5 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-gray-400 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center shadow-sm"
                >
                  Eliminar lote
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Registrar merma */}
      <RegisterMermaModal
        open={isCreateOpen}
        onClose={closeCreate}
        onSave={handleCreate}
        isLoading={isCreating}
      />

      {/* Confirmar eliminación de merma */}
      <Dialog
        open={!!decreaseToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeleting) cancelDelete()
        }}
      >
        <DialogContent className="w-[95%] sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Eliminar merma
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 leading-relaxed">
            Se eliminará la merma de {Number(decreaseToDelete?.cantidad) || 0} L
            {decreaseToDelete?.tipo
              ? ` (${TIPO_MERMA_LABELS[decreaseToDelete.tipo] ?? decreaseToDelete.tipo})`
              : ''}
            . Esta acción no se puede deshacer.
          </DialogDescription>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={cancelDelete}
              disabled={isDeleting}
              className="h-11 rounded-xl px-6 border-gray-200 text-gray-700 font-semibold w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="h-11 rounded-xl px-6 bg-red-600 hover:bg-red-700 text-white font-semibold w-full sm:w-auto"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminación de LOTE */}
      <Dialog
        open={isDeletingBatch}
        onOpenChange={(isOpen) => {
          if (!isOpen) setIsDeletingBatch(false)
        }}
      >
        <DialogContent className="w-[95%] sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Eliminar lote
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 leading-relaxed">
            Se eliminará el lote{' '}
            <span className="font-semibold text-gray-700">
              #{String(loteIdentificador)}
            </span>{' '}
            y todas sus mermas asociadas. Esta acción no se puede deshacer.
          </DialogDescription>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeletingBatch(false)}
              className="h-11 rounded-xl px-6 border-gray-200 text-gray-700 font-semibold w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDeleteBatch}
              className="h-11 rounded-xl px-6 bg-red-600 hover:bg-red-700 text-white font-semibold w-full sm:w-auto"
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BatchDetailModal
