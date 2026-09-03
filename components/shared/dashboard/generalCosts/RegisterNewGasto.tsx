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
import { newGastoSchema, reqNewGasto } from '@/types/generalCost'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

interface RegisterNewGastoProps {
  open: boolean
  onClose: () => void
  onOpen?: () => void
}

const RegisterNewGasto = ({ open, onClose, onOpen }: RegisterNewGastoProps) => {
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
    resolver: zodResolver(newGastoSchema),
    defaultValues: {
      tipoCosto: undefined,
      descripcion: '',
      monto: '',
      fecha: '',
    },
  })

  const busy = isSubmitting || isPending

  const closeDialog = () => {
    onClose()
    setTimeout(() => {
      reset({ tipoCosto: undefined, descripcion: '', monto: '', fecha: '' })
    }, 200)
  }

  const onFormSubmit = handleSubmit(
    handleSubmitWithConnectionCheck(async (data) => {
      const payload: reqNewGasto = {
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
        <DialogContent className="w-full max-w-162 bg-white rounded-lg p-0 overflow-hidden gap-0 border-gray-200">
          <DialogHeader className="px-8 pt-7 pb-2 text-center">
            <DialogTitle className="text-xl font-extrabold tracking-tight text-gray-900 text-center">
              NUEVO GASTO
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onFormSubmit} className="px-8 pb-8 pt-4 space-y-5">
            <div className="grid grid-cols-[1fr_142px] gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Tipo de gasto
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
                      <SelectTrigger className="w-full rounded-xl bg-white border-transparent shadow-[0px_4px_4px_0px_#00000040]">
                        <SelectValue placeholder="Seleccionar tipo de gasto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="PERSONAL">Personal</SelectItem>
                          <SelectItem value="SERVICIOS">Servicios</SelectItem>
                          <SelectItem value="LOGISTICA">Logística</SelectItem>
                          <SelectItem value="MANTENIMIENTO">
                            Mantenimiento
                          </SelectItem>
                          <SelectItem value="VETERINARIO">
                            Veterinario
                          </SelectItem>
                          <SelectItem value="INMUEBLE">Inmueble</SelectItem>
                          <SelectItem value="OTRO">Otro</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tipoCosto && (
                  <span className="text-xs text-red-main">
                    {errors.tipoCosto.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="fecha"
                  className="text-sm font-medium text-gray-900"
                >
                  Fecha
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className="relative rounded-xl bg-white border-transparent shadow-[0px_4px_4px_0px_#00000040] pl-3 pr-9 text-xs [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60"
                  {...register('fecha')}
                  disabled={busy}
                />
                {errors.fecha && (
                  <span className="text-xs text-red-main">
                    {errors.fecha.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="descripcion"
                className="text-sm font-medium text-gray-900"
              >
                Descripcion
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Ej:Compra balanceado alta proteina (20 tn)"
                rows={3}
                maxLength={500}
                className="rounded-xl bg-white border-transparent shadow-[0px_4px_4px_0px_#00000040] resize-none min-h-23.5"
                {...register('descripcion')}
                disabled={busy}
              />
              {errors.descripcion && (
                <span className="text-xs text-red-main">
                  {errors.descripcion.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="monto"
                className="text-sm font-medium text-gray-900"
              >
                Valor
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  $
                </span>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder=""
                  className="rounded-xl bg-white border-transparent shadow-[0px_4px_4px_0px_#00000040] pl-8"
                  {...register('monto')}
                  disabled={busy}
                />
              </div>
              {errors.monto && (
                <span className="text-xs text-red-main">
                  {errors.monto.message}
                </span>
              )}
            </div>

            <div className="flex gap-4 pt-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-md border-gray-200"
                onClick={closeDialog}
                disabled={busy}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 rounded-md bg-[#29845A] hover:bg-[#174a3b] text-white font-bold"
                disabled={busy}
              >
                {busy ? 'Guardando...' : 'Agregar Gasto'}
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

export default RegisterNewGasto
