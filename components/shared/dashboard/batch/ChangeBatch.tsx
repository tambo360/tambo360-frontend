'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertCircle,
  ArrowRight,
  Check,
  LayoutDashboard,
  Loader2,
  Calendar,
  Clock,
} from 'lucide-react'
import { Lote } from '@/types/batch'
import { TipoDestino, TipoSeguimiento } from '@/types/enums'
import { useChangeBatchForm } from '@/hooks/batch/useChangeBatchForm'
import { ConnectionErrorModal } from '@/components/ConnectionErrorModal'
import { TransferModal } from '@/components/shared/dashboard/organization/configuration/modals/TransferModal'

const ESTADO_LABELS: Record<string, string> = {
  SANO: 'Sana',
  MASTITIS: 'Mastitis',
  TRATAMIENTO: 'Tratamiento',
  PREPARTO: 'Preparto',
}

const formatDestino = (destino: string) =>
  destino
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

interface ChangeBatchProps {
  open: boolean
  onClose: () => void
  onOpen?: () => void
  onViewDetail?: (batchId: string) => void
  batch?: Lote
}

const ChangeBatch = ({
  open,
  onClose,
  onOpen,
  onViewDetail,
  batch,
}: ChangeBatchProps) => {
  const {
    register,
    errors,
    watch,
    setValue,
    onSubmit,
    tipoSeguimiento,
    rodeos,
    individualLote,
    opcionesLoading,
    configLoading,
    canSubmit,
    finished,
    startAnotherBatch,
    handleDialogChange,
    createdBatchId,
    isTransferModalOpen,
    setIsTransferModalOpen,
    handleSaveTransfer,
    showConnectionError,
    retry,
    handleConnectionCancel,
  } = useChangeBatchForm({ open, onClose, onOpen, batch })

  const isRodeoMode =
    tipoSeguimiento === TipoSeguimiento.RODEO ||
    tipoSeguimiento === TipoSeguimiento.RODEO_UNICO

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      {finished ? (
        // ==========================================
        // PANTALLA DE ÉXITO
        // ==========================================
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[95vw] sm:max-w-md mx-auto bg-[#E8F5E9] rounded-3xl p-8 shadow-2xl border border-green-100 text-center [&>button]:hidden"
        >
          <DialogHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-green-200 rounded-full blur-sm opacity-70"></div>
                <div className="relative w-20 h-20 bg-[#2E7D53] rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-10 h-10 text-white stroke-[3]" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              {batch
                ? 'Lote actualizado correctamente'
                : 'Lote creado correctamente'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 leading-relaxed px-2">
              {batch
                ? 'El lote ha sido actualizado exitosamente en el sistema.'
                : 'El nuevo lote ha sido registrado exitosamente en el sistema. Ahora puedes gestionar su seguimiento y producción.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 w-full">
            <Button
              variant="default"
              className="w-full h-12 text-base font-bold bg-[#2E7D53] hover:bg-[#236342] text-white rounded-xl shadow-md transition-all"
              onClick={() => {
                // Guardamos el id antes de cerrar: el hook puede reiniciarlo
                const id = createdBatchId
                onClose()
                if (id) onViewDetail?.(id)
              }}
            >
              <span className="flex items-center justify-center gap-2">
                Ir al detalle del lote
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            {!batch && (
              <Button
                variant="outline"
                className="w-full h-12 text-base font-bold bg-white border-gray-300 text-gray-800 hover:bg-gray-50 rounded-xl shadow-sm transition-all"
                onClick={startAnotherBatch}
              >
                Crear otro lote
              </Button>
            )}
          </div>

          <DialogFooter className="flex justify-center items-center pt-2">
            <button
              onClick={() => onClose()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors underline underline-offset-4"
            >
              <LayoutDashboard className="w-4 h-4" />
              Volver al Dashboard
            </button>
          </DialogFooter>
        </DialogContent>
      ) : (
        // ==========================================
        // FORMULARIO
        // ==========================================
        <DialogContent className="w-[95vw] sm:max-w-2xl bg-white rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {batch ? 'Editar lote' : 'Crear nuevo lote'}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {batch
                ? 'Ingresa los nuevos datos para actualizar el lote.'
                : 'Ingresa los datos para iniciar el seguimiento de producción.'}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5 pt-2" onSubmit={onSubmit}>
            {/* Fecha + Hora */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="space-y-2">
                <Label className="font-bold text-xs">Fecha</Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="dd/mm/aaaa"
                    className="rounded-xl border-gray-200 bg-gray-50/50 pr-10"
                    {...register('fechaProduccion')}
                    disabled
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.fechaProduccion && (
                  <span className="text-xs text-red-600">
                    {errors.fechaProduccion.message as string}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs">Hora</Label>
                <div className="relative">
                  <Input
                    type="time"
                    className="rounded-xl border-gray-200 bg-gray-50/50 pr-10"
                    {...register('horaProduccion')}
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* MODO RODEO / RODEO_UNICO (mismo payload, solo cambia la etiqueta) */}
            {isRodeoMode && (
              <>
                <div className="space-y-2 w-full">
                  <Label className="font-bold text-xs">Rodeo Origen</Label>
                  {opcionesLoading || configLoading ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Cargando opciones...
                      </span>
                    </div>
                  ) : rodeos.length === 0 ? (
                    <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-xl">
                      No hay rodeos configurados.
                    </div>
                  ) : (
                    <Select
                      value={watch('idRodeo') || ''}
                      onValueChange={(value) =>
                        setValue('idRodeo', value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
                        <SelectValue placeholder="Selecciona rodeo..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {rodeos.map((rodeo) => (
                            <SelectItem
                              key={rodeo.idRodeo}
                              value={rodeo.idRodeo}
                            >
                              {rodeo.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  {errors.idRodeo && (
                    <span className="text-xs text-red-600">
                      {errors.idRodeo.message as string}
                    </span>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <Label className="font-bold text-xs">
                    Volumen Total Bruto (Litros)
                  </Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ej: 2450"
                    className="rounded-xl border-gray-200 bg-gray-50/50"
                    {...register('cantidad')}
                  />
                  {errors.cantidad && (
                    <span className="text-xs text-red-600">
                      {errors.cantidad.message as string}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs">
                      Cantidad de bajadas
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Ej: 4"
                      className="rounded-xl border-gray-200 bg-gray-50/50"
                      {...register('cantBajadas')}
                    />
                    {errors.cantBajadas && (
                      <span className="text-xs text-red-600">
                        {errors.cantBajadas.message as string}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-xs">Destino</Label>
                    <Select
                      value={watch('destino') ?? ''}
                      onValueChange={(value) =>
                        setValue('destino', value as TipoDestino, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
                        <SelectValue placeholder="Selecciona destino..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(TipoDestino).map((destino) => (
                            <SelectItem key={destino} value={destino}>
                              {formatDestino(destino)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.destino && (
                      <span className="text-xs text-red-600">
                        {errors.destino.message as string}
                      </span>
                    )}
                  </div>
                </div>

                {watch('destino') === TipoDestino.TANQUE_FRIO && (
                  <div className="space-y-2 w-full">
                    <Label className="font-bold text-xs">
                      Temperatura del tanque (°C)
                    </Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      placeholder="Ej: 4.5"
                      className="rounded-xl border-gray-200 bg-gray-50/50"
                      {...register('tempTanque')}
                    />
                    {errors.tempTanque && (
                      <span className="text-xs text-red-600">
                        {errors.tempTanque.message as string}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}

            {/* MODO INDIVIDUAL */}
            {tipoSeguimiento === TipoSeguimiento.INDIVIDUAL && (
              <>
                <div className="space-y-3 w-full pt-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <Label className="font-bold text-xs">
                      Seleccionar vacas asociadas
                    </Label>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="h-7 text-xs bg-[#2E7D53] hover:bg-[#236342] text-white rounded-lg px-3 shrink-0 w-full sm:w-auto"
                      onClick={() => setIsTransferModalOpen(true)}
                    >
                      Cambiar estado
                    </Button>
                  </div>

                  {opcionesLoading ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Cargando animales...
                      </span>
                    </div>
                  ) : individualLote.animals.length === 0 ? (
                    <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-xl">
                      No se encontraron animales reales en el sistema.
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl divide-y max-h-64 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {individualLote.animals.map((animal) => {
                        const selected = individualLote.isAnimalSelected(
                          animal.idAnimal
                        )
                        const field = individualLote.fields.find(
                          (f) => f.idAnimal === animal.idAnimal
                        )
                        return (
                          <div key={animal.idAnimal} className="p-3 space-y-2">
                            <div className="flex items-center justify-between gap-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <Checkbox
                                  checked={selected}
                                  onCheckedChange={() =>
                                    individualLote.toggleAnimal(animal.idAnimal)
                                  }
                                  className="rounded-full shrink-0"
                                />
                                <span className="text-sm font-medium flex items-center gap-2 truncate">
                                  <span className="truncate">
                                    {animal.codigo && `${animal.codigo} - `}
                                    {animal.nombre || 'Sin nombre'}
                                  </span>
                                  {animal.raza && (
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shrink-0">
                                      {animal.raza
                                        .replace(/_/g, ' ')
                                        .toLowerCase()}
                                    </span>
                                  )}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 shrink-0">
                                {ESTADO_LABELS[animal.estado] || 'Sana'}
                              </span>
                            </div>

                            {selected && (
                              <div className="flex items-center gap-3 ml-8">
                                <div className="flex-1">
                                  <Input
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    className="h-8 text-xs rounded-lg"
                                    value={field?.litros ?? ''}
                                    onChange={(e) =>
                                      individualLote.updateLitros(
                                        animal.idAnimal,
                                        e.target.value === ''
                                          ? undefined
                                          : Number(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {errors.animales && (
                    <span className="text-xs text-red-600 block">
                      {(errors.animales as { message?: string })?.message ??
                        'Revisa los animales'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs">
                      Producción Total Asociada (Litros)
                    </Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="rounded-xl border-gray-200 bg-gray-50/50"
                      {...register('cantidad')}
                    />
                    {errors.cantidad && (
                      <span className="text-xs text-red-600">
                        {errors.cantidad.message as string}
                      </span>
                    )}
                    {individualLote.fields.length > 0 && (
                      <p
                        className={`text-xs ${individualLote.isBalanced ? 'text-green-600' : 'text-red-500'}`}
                      >
                        Total cargado: {individualLote.totalLitros} L
                        {!individualLote.isBalanced &&
                          ` — faltan/sobran ${individualLote.diferencia} L`}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-xs">
                      Cantidad de bajadas
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Ej: 4"
                      className="rounded-xl border-gray-200 bg-gray-50/50"
                      {...register('cantBajadas')}
                    />
                    {errors.cantBajadas && (
                      <span className="text-xs text-red-600">
                        {errors.cantBajadas.message as string}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs">Destino</Label>
                    <Select
                      value={watch('destino') ?? ''}
                      onValueChange={(value) =>
                        setValue('destino', value as TipoDestino, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
                        <SelectValue placeholder="Selecciona destino..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(TipoDestino).map((destino) => (
                            <SelectItem key={destino} value={destino}>
                              {formatDestino(destino)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.destino && (
                      <span className="text-xs text-red-600">
                        {errors.destino.message as string}
                      </span>
                    )}
                  </div>

                  {watch('destino') === TipoDestino.TANQUE_FRIO && (
                    <div className="space-y-2">
                      <Label className="font-bold text-xs">
                        Temperatura del tanque (°C)
                      </Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        placeholder="Ej: 4.5"
                        className="rounded-xl border-gray-200 bg-gray-50/50"
                        {...register('tempTanque')}
                      />
                      {errors.tempTanque && (
                        <span className="text-xs text-red-600">
                          {errors.tempTanque.message as string}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <span className="flex items-center gap-2 text-xs text-gray-500 pt-1">
              <AlertCircle className="size-4 text-gray-400 shrink-0" />
              Verifica que los datos sean correctos antes de crear el lote.
            </span>

            <DialogFooter className="flex flex-row gap-3 w-full pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 text-base font-bold rounded-xl border-gray-200 text-gray-600"
                onClick={() => onClose()}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                className="flex-1 h-12 text-base font-bold rounded-xl bg-[#1B4D3E] hover:bg-[#153c31] text-white disabled:opacity-50"
                type="submit"
                disabled={!canSubmit || opcionesLoading || configLoading}
              >
                {opcionesLoading || configLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : batch ? (
                  'Actualizar lote'
                ) : (
                  'Guardar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}

      <ConnectionErrorModal
        open={showConnectionError}
        onRetry={retry}
        onCancel={handleConnectionCancel}
      />
      <TransferModal
        open={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        tipoSeguimiento={TipoSeguimiento.INDIVIDUAL}
        animales={individualLote.animals}
        preselectedIds={individualLote.fields.map((f) => f.idAnimal)}
      />
    </Dialog>
  )
}

export default ChangeBatch
