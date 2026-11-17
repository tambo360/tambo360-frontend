'use client'

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
  GENERAL_COST_TYPE_LABELS,
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

// Helpers para las fechas
const today = new Date().toISOString().split('T')[0]
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0]

const RegisterNewCost = ({ open, onClose, onOpen }: RegisterNewCostProps) => {
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
      fecha: today,
    },
  })

  const busy = isSubmitting || isPending

  const closeDialog = () => {
    onClose()
    setTimeout(() => {
      reset({ tipoCosto: undefined, descripcion: '', monto: '', fecha: today })
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
        {/* Corregí el max-w-[500px] por max-w-125 para sacar la advertencia de Tailwind */}
        <DialogContent className="w-full max-w-125 bg-white rounded-xl p-0 overflow-hidden gap-0 border-gray-200">
          <DialogHeader className="px-6 pt-6 pb-2 text-left">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Nuevo costo
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onFormSubmit} className="px-6 pb-6 pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Fecha
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  min={sevenDaysAgo}
                  max={today}
                  className="h-10 rounded-lg border-slate-200 bg-white"
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
                <Label className="text-xs font-semibold text-gray-700">
                  Hora (Opcional)
                </Label>
                <Input
                  type="time"
                  className="h-10 rounded-lg border-slate-200 bg-white"
                  disabled={busy}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
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
                    <SelectTrigger className="w-full h-10 rounded-lg border-slate-200 bg-white">
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
              <Label className="text-xs font-semibold text-gray-700">
                Valor
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                  $
                </span>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="h-10 rounded-lg border-slate-200 bg-white pl-8"
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
              <Label className="text-xs font-semibold text-gray-700">
                Observaciones
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Ej: Compra balanceado alta proteína (20 tn)"
                rows={3}
                maxLength={500}
                className="rounded-lg border-slate-200 bg-white resize-none"
                {...register('descripcion')}
                disabled={busy}
              />
              {errors.descripcion && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.descripcion.message}
                </span>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 rounded-lg border-gray-300 text-gray-700 font-semibold"
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
