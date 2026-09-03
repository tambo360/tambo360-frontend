'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { AlertCircle } from 'lucide-react'
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
        <DialogContent className="max-w-lg bg-white rounded-2xl p-0 overflow-hidden gap-0 sm:max-w-lg border-gray-200">
          <DialogHeader className="px-6 pt-6 pb-4 space-y-1.5 text-left">
            <DialogTitle className="text-xl font-extrabold text-gray-900">
              Registrar costo general
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Ingresá los datos del costo general del establecimiento.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onFormSubmit} className="px-6 pb-6 pt-2 space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">
                Tipo de costo <span className="text-red-main">*</span>
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
                    <SelectTrigger className="w-full rounded-xl bg-[#F1F5F9] border-gray-200">
                      <SelectValue placeholder="Seleccionar tipo de costo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="SERVICIOS">Servicios</SelectItem>
                        <SelectItem value="LOGISTICA">Logística</SelectItem>
                        <SelectItem value="MANTENIMIENTO">
                          Mantenimiento
                        </SelectItem>
                        <SelectItem value="VETERINARIO">Veterinario</SelectItem>
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
              <Label htmlFor="monto" className="font-semibold text-gray-700">
                Monto (ARS) <span className="text-red-main">*</span>
              </Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej: 125000.50"
                className="rounded-xl bg-[#F1F5F9] border-gray-200"
                {...register('monto')}
                disabled={busy}
              />
              {errors.monto && (
                <span className="text-xs text-red-main">
                  {errors.monto.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="descripcion"
                className="font-semibold text-gray-700"
              >
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Ej: Sueldos del personal del establecimiento"
                rows={3}
                maxLength={500}
                className="rounded-xl bg-[#F1F5F9] border-gray-200 resize-none"
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
              <Label htmlFor="fecha" className="font-semibold text-gray-700">
                Fecha <span className="text-red-main">*</span>
              </Label>
              <Input
                id="fecha"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                className="rounded-xl bg-[#F1F5F9] border-gray-200"
                {...register('fecha')}
                disabled={busy}
              />
              {errors.fecha && (
                <span className="text-xs text-red-main">
                  {errors.fecha.message}
                </span>
              )}
            </div>

            <span className="flex items-center gap-2 text-xs text-gray-500 pt-1">
              <AlertCircle className="size-4 text-red-main shrink-0" />
              Verificá que los datos sean correctos antes de registrar el costo.
            </span>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-200 font-semibold"
                onClick={closeDialog}
                disabled={busy}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 rounded-xl bg-[#1B4D3E] hover:bg-[#153c31] text-white font-bold"
                disabled={busy}
              >
                {busy ? 'Guardando...' : 'Registrar costo'}
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
