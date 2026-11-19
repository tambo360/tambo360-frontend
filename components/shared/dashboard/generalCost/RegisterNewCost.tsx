'use client'

import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ConnectionErrorModal } from '@/components/ConnectionErrorModal'
import { useConnectionError } from '@/hooks/connection/useConnectionError'
import { useCreateGeneralCost } from '@/hooks/generalCost/useCreateGeneralCost'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import {
  COST_DESCRIPTION_MAX,
  GENERAL_COST_TYPE_LABELS,
  getCostDateRange,
  newGeneralCostSchema,
  CreateNewCostRequest,
} from '@/types/generalCost'
import { GeneralCostType } from '@/types/enums'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

interface RegisterNewCostProps {
  open: boolean
  onClose: () => void
  onOpen?: () => void
}

const RegisterNewCost = ({ open, onClose, onOpen }: RegisterNewCostProps) => {
  // Rango de fechas calculado con la fecha local de hoy
  const { min: minDate, max: maxDate } = getCostDateRange()

  const { mutateAsync, isPending } = useCreateGeneralCost()
  const { showErrorMessage } = useErrorMessage()
  const {
    showConnectionError,
    handleSubmitWithConnectionCheck,
    retry,
    dismiss,
  } = useConnectionError({
    onServerError: showErrorMessage,
    closeParentDialog: onClose,
    openParentDialog: onOpen,
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newGeneralCostSchema),
    defaultValues: {
      tipoCosto: undefined,
      descripcion: '',
      monto: '',
      fecha: maxDate,
    },
  })

  const busy = isSubmitting || isPending

  const closeDialog = () => {
    onClose()
    setTimeout(() => {
      reset({
        tipoCosto: undefined,
        descripcion: '',
        monto: '',
        fecha: getCostDateRange().max,
      })
    }, 200)
  }

  const onFormSubmit = handleSubmit(
    handleSubmitWithConnectionCheck(async (data) => {
      const payload: CreateNewCostRequest = {
        tipoCosto: data.tipoCosto,
        descripcion: data.descripcion?.trim() || undefined,
        monto: data.monto,
        fecha: new Date(data.fecha).toISOString(),
      }
      await mutateAsync({ values: payload })
      closeDialog()
    })
  )

  return (
    <>
      <Dialog open={open} onOpenChange={closeDialog}>
        {/* [&>button]:hidden oculta la X automática del diálogo; usamos la del diseño */}
        <DialogContent className="w-full max-w-125 bg-white rounded-xl p-0 overflow-hidden gap-0 border-gray-200 [&>button]:hidden">
          <DialogHeader className="px-6 pt-6 pb-2 text-left">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-3xl font-extrabold text-gray-900">
                Nuevo costo
              </DialogTitle>
              <button
                type="button"
                onClick={closeDialog}
                disabled={busy}
                aria-label="Cerrar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>

          <form onSubmit={onFormSubmit} className="px-6 pb-6 pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-900">
                  Fecha
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  min={minDate}
                  max={maxDate}
                  className="h-10 rounded-lg border-0 bg-slate-100 shadow-none"
                  {...register('fecha')}
                  disabled={busy}
                />
                {errors.fecha && (
                  <span className="text-[11px] text-red-500 font-medium">
                    {errors.fecha.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-900">
                  Hora
                </Label>
                <Input
                  type="time"
                  className="h-10 rounded-lg border-0 bg-slate-100 shadow-none"
                  disabled={busy}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Tipo de costo
              </Label>
              <Controller
                name="tipoCosto"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    disabled={busy}
                  >
                    <SelectTrigger className="w-full h-12 rounded-lg border-slate-200 bg-white shadow-sm">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {/* Mapeamos directo el enum, ya que ALIMENTACION es automático */}
                        {Object.values(GeneralCostType).map((costType) => (
                          <SelectItem key={costType} value={costType}>
                            {GENERAL_COST_TYPE_LABELS[costType] || costType}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipoCosto && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.tipoCosto.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Valor</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                  $
                </span>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0"
                  className="h-12 rounded-lg border-slate-200 bg-white pl-8 shadow-sm"
                  {...register('monto')}
                  disabled={busy}
                />
              </div>
              {errors.monto && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.monto.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Observaciones
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Ej:Compra balanceado alta proteína (20 tn)"
                rows={3}
                maxLength={COST_DESCRIPTION_MAX}
                className="rounded-lg border-slate-200 bg-white shadow-sm resize-none"
                {...register('descripcion')}
                disabled={busy}
              />
              {errors.descripcion && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.descripcion.message}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 px-1 text-xs text-gray-600">
              <Info className="h-3.5 w-3.5 shrink-0 text-gray-900" />
              <span>
                Verifica que los datos sean correctos antes de crear el costo.
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 rounded-lg border-black bg-white text-black font-bold hover:bg-gray-50"
                onClick={closeDialog}
                disabled={busy}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 rounded-lg bg-[#659711] hover:bg-[#537d0d] text-white font-bold"
                disabled={busy}
              >
                {busy ? 'Guardando...' : 'Aceptar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ConnectionErrorModal
        open={showConnectionError}
        onRetry={retry}
        onCancel={() => dismiss(() => reset())}
      />
    </>
  )
}

export default RegisterNewCost
