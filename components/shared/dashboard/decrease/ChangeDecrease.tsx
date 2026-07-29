'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConnectionErrorModal } from '@/components/ConnectionErrorModal'
import { useConnectionError } from '@/hooks/connection/useConnectionError'
import { useCreateDecrease } from '@/hooks/decrease/useCreateDecrease'
import { useUpdateDecrease } from '@/hooks/decrease/useUpdateDecrease'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import { Merma, DecreaseSchema, TIPO_MERMA_LABELS } from '@/types/decrease'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TipoMerma } from '@/types/enums'

interface ChangeDecreaseProps {
  open: boolean
  onClose: () => void
  onOpen?: () => void
  idBatch?: string
  decrease?: Merma
}

const ChangeDecrease = ({
  open,
  onClose,
  onOpen,
  decrease,
  idBatch,
}: ChangeDecreaseProps) => {
  const { mutateAsync: create, isPending } = useCreateDecrease()
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
  const { mutateAsync: update, isPending: isPendingUpdate } = useUpdateDecrease(
    { idLote: idBatch! }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      cantidad: '',
      observacion: '',
      tipo: undefined,
    },

    resolver: zodResolver(DecreaseSchema),
  })

  useEffect(() => {
    if (decrease) {
      reset({
        cantidad: decrease.cantidad.toString(),
        observacion: decrease.observacion,
        tipo: decrease.tipo,
      })
    } else {
      reset({
        cantidad: '',
        observacion: '',
        tipo: undefined,
      })
    }
  }, [decrease, reset])

  const onSubmit = handleSubmit(
    handleSubmitWithConnectionCheck(async (data) => {
      if (decrease) {
        await update(
          { id: decrease.idMerma, values: data },
          {
            onSuccess: () => {
              reset()
            },
          }
        )
      } else {
        await create(
          { ...data, idLote: idBatch! },
          {
            onSuccess: () => {
              reset()
            },
          }
        )
      }
      onClose()
    })
  )

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose()
        reset()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {decrease ? 'Editar merma' : 'Registrar merma'}
          </DialogTitle>
          <DialogDescription>
            {decrease
              ? 'Ingresa los nuevos datos para actualizar la merma asociada al lote de produccion'
              : 'Ingresa los datos para asociar la merma a un lote de produccion'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Motivo de merma*</Label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending || isPendingUpdate}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo de merma..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={TipoMerma.MASTITIS}>
                        {TIPO_MERMA_LABELS[TipoMerma.MASTITIS]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.ESTRES_CALORICO}>
                        {TIPO_MERMA_LABELS[TipoMerma.ESTRES_CALORICO]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.DERRAME_EN_ORDENE}>
                        {TIPO_MERMA_LABELS[TipoMerma.DERRAME_EN_ORDENE]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.FALLA_EQUIPO}>
                        {TIPO_MERMA_LABELS[TipoMerma.FALLA_EQUIPO]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.RECHAZO_ANTIBIOTICOS}>
                        {TIPO_MERMA_LABELS[TipoMerma.RECHAZO_ANTIBIOTICOS]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.ACIDOSIS_RUMINAL}>
                        {TIPO_MERMA_LABELS[TipoMerma.ACIDOSIS_RUMINAL]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.PERDIDA_EN_TRANSPORTE}>
                        {TIPO_MERMA_LABELS[TipoMerma.PERDIDA_EN_TRANSPORTE]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.VENCIMIENTO_PRODUCTO}>
                        {TIPO_MERMA_LABELS[TipoMerma.VENCIMIENTO_PRODUCTO]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.DANO_POR_MANIPULACION}>
                        {TIPO_MERMA_LABELS[TipoMerma.DANO_POR_MANIPULACION]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.DISCREPANCIA_INVENTARIO}>
                        {TIPO_MERMA_LABELS[TipoMerma.DISCREPANCIA_INVENTARIO]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.MERMA_DESCONOCIDA}>
                        {TIPO_MERMA_LABELS[TipoMerma.MERMA_DESCONOCIDA]}
                      </SelectItem>
                      <SelectItem value={TipoMerma.OTRO}>
                        {TIPO_MERMA_LABELS[TipoMerma.OTRO]}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.tipo && (
              <span className="flex items-center gap-2 text-xs text-red-500">
                {errors.tipo.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Merma (Kg/L)*</Label>
            <Input
              placeholder="0.00"
              inputMode="decimal"
              {...register('cantidad')}
              disabled={isPending || isPendingUpdate}
            />

            {errors.cantidad && (
              <span className="flex items-center gap-2 text-xs text-red-500">
                {errors.cantidad.message}
              </span>
            )}

            <small>
              Este valor se restará del stock disponible sin modificar la
              producción original
            </small>
          </div>

          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Textarea
              placeholder="Anota la información que consideres importante"
              {...register('observacion')}
              disabled={isPending || isPendingUpdate}
            />

            {errors.observacion && (
              <span className="flex items-center gap-2 text-xs text-red-500">
                {errors.observacion.message}
              </span>
            )}
          </div>

          <span className="flex items-center gap-2 text-xs">
            <AlertCircle className="size-5" /> Verifica que los datos sean
            correctos antes de {decrease ? 'actualizar' : 'registrar'} la merma
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-14"
              onClick={() => {
                onClose()
                reset()
              }}
              disabled={isPending || isPendingUpdate}
            >
              Cancelar
            </Button>

            <Button
              className="w-full h-14"
              type="submit"
              disabled={isPending || isPendingUpdate}
            >
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
      <ConnectionErrorModal
        open={showConnectionError}
        onRetry={retry}
        onCancel={() => dismiss(reset)}
      />
    </Dialog>
  )
}
export default ChangeDecrease
