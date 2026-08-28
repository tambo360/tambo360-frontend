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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, ArrowRight, Check, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lote, BatchSchema } from '@/types/batch'
import { useCreateBatch } from '@/hooks/batch/useCreateBatch'
import { useUpdateBatch } from '@/hooks/batch/useUpdateBatch'
import { useProducts } from '@/hooks/product/useProducts'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import { useConnectionError } from '@/hooks/connection/useConnectionError'
import { ConnectionErrorModal } from '@/components/ConnectionErrorModal'
import { Product } from '@/types/product'
import { TipoDestino, Unidad } from '@/types/enums'
import { usePathname } from 'next/navigation'
import { useHerds } from '@/hooks/establishment/herd/useHerds'
import { Rodeo } from '@/types/establishment/herd'

interface ChangeBatchProps {
  open: boolean
  onClose: () => void
  onOpen?: () => void
  batch?: Lote
  cantAnimales?: number
}

const ChangeBatch = ({
  open,
  onClose,
  onOpen,
  batch,
  cantAnimales,
}: ChangeBatchProps) => {
  const [id, setId] = useState('')
  const [finished, setFinished] = useState(false)
  const { mutateAsync } = useCreateBatch()
  const { mutateAsync: mutateAsyncUpdate } = useUpdateBatch()
  const { data } = useProducts()
  const { data: herds } = useHerds()
  const pathname = usePathname()

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
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      idProducto: '',
      cantidad: '',
      fechaProduccion: '',
      unidad: Unidad.KG,
      idRodeo: '',
      cantRaza: 0,
      destino: undefined,
      tempTanque: '',
    },
    resolver: zodResolver(BatchSchema),
  })

  useEffect(() => {
    if (batch) {
      const fecha =
        batch.fechaProduccion && !isNaN(Date.parse(batch.fechaProduccion))
          ? new Date(batch.fechaProduccion).toISOString().slice(0, 10)
          : ''

      reset({
        idProducto: batch.idProducto ?? '',
        cantidad: (batch.cantidad ?? '').toString(),
        fechaProduccion: fecha,
        unidad: batch.unidad ?? Unidad.KG,
        idRodeo: batch.rodeo?.idRodeo ?? '',
        tempTanque: batch.tempTanque ?? '',
        destino: batch.destino,
        cantRaza: batch.cantAnimales
          ? batch.cantAnimales.toString()
          : cantAnimales
            ? cantAnimales.toString()
            : '0',
      })

      setValue('fechaProduccion', fecha, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      })
    } else {
      reset({
        idProducto: '',
        cantidad: '',
        fechaProduccion: '',
        unidad: Unidad.KG,
        idRodeo: '',
        cantRaza: 0,
        tempTanque: '',
        destino: undefined,
      })
    }
  }, [batch, reset, setValue, cantAnimales])

  const onSubmit = handleSubmit(
    handleSubmitWithConnectionCheck(async (data) => {
      if (!batch) {
        const date = new Date(data.fechaProduccion)
        const fechaProduccion = [
          String(date.getUTCDate()).padStart(2, '0'),
          String(date.getUTCMonth() + 1).padStart(2, '0'),
          date.getUTCFullYear(),
        ].join('/')
        const idLote = crypto.randomUUID()
        const newBatch = {
          idProducto: data.idProducto,
          cantidad: data.cantidad,
          unidad: data.unidad,
          idRodeo: data.idRodeo,
          cantRaza: data.cantRaza,
          fechaProduccion: fechaProduccion,
          idLote: idLote,
          tempTanque: data.tempTanque,
          destino: data.destino,
        }

        await mutateAsync(newBatch)
        setId(idLote)
        setFinished(true)
      } else {
        const date = new Date(data.fechaProduccion)
        const fechaProduccion = [
          String(date.getUTCDate()).padStart(2, '0'),
          String(date.getUTCMonth() + 1).padStart(2, '0'),
          date.getUTCFullYear(),
        ].join('/')
        await mutateAsyncUpdate({
          id: batch.idLote,
          values: { ...data, fechaProduccion },
        })
        setId(batch.idLote)
        setFinished(true)
      }
    })
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setFinished(false)
          reset({
            idProducto: '',
            cantidad: '',
            fechaProduccion: '',
          })
          onClose()
        }
      }}
    >
      {finished ? (
        <DialogContent className="space-y-6 bg-[#E8F5E9] rounded-3xl p-8 shadow-2xl border border-green-100 max-w-md mx-auto text-center">
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
                ? 'El lote ha sido actualizado exitosamente en el sistema. Ahora puedes gestionar su seguimiento y producción.'
                : 'El nuevo lote ha sido registrado exitosamente en el sistema. Ahora puedes gestionar su seguimiento y producción.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Button
              variant="default"
              className="flex items-center justify-center w-full h-12 text-base font-bold bg-[#2E7D53] hover:bg-[#236342] text-white rounded-xl shadow-md transition-all"
              asChild
            >
              {/* Conectado con la ruta de detalle utilizando el id generado o del batch */}
              <Link
                href={`${pathname.includes('/lote') ? pathname.split('/lote')[0] : pathname}/lote/${id}`}
                className="flex items-center justify-center gap-2"
                onClick={onClose}
              >
                Ir al detalle del lote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            {!batch && (
              <Button
                variant="outline"
                className="flex items-center justify-center w-full h-12 text-base font-bold bg-white border-gray-300 text-gray-800 hover:bg-gray-50 rounded-xl shadow-sm transition-all"
                onClick={() => {
                  setFinished(false)
                  reset()
                }}
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
        <DialogContent className="max-w-lg bg-white rounded-3xl p-6 shadow-xl">
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

          <form className="space-y-4 pt-2" onSubmit={onSubmit}>
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="space-y-2 w-full">
                <Label className="font-bold text-xs">
                  Fecha de producción *
                </Label>
                <Input
                  type="date"
                  placeholder="dd/mm/aaaa"
                  className="rounded-xl border-gray-200 bg-gray-50/50"
                  {...register('fechaProduccion')}
                />
                {errors.fechaProduccion && (
                  <span className="text-xs text-red-600">
                    {errors.fechaProduccion.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 w-full">
              <div className="space-y-2 w-full">
                <Label className="font-bold text-xs">Rodeo Origen *</Label>
                <Select
                  defaultValue={batch ? batch.rodeo?.idRodeo : ''}
                  onValueChange={(e) => setValue('idRodeo', e)}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
                    <SelectValue placeholder="Selecciona rodeo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {herds?.data.data.map((rodeo: Rodeo) => (
                        <SelectItem key={rodeo.idRodeo} value={rodeo.idRodeo}>
                          {rodeo.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.idRodeo && (
                  <span className="text-xs text-red-600">
                    {errors.idRodeo.message}
                  </span>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="font-bold text-xs">
                  Volumen Total Bruto (Litros) *
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
                    {errors.cantidad.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 w-full">
              <div className="space-y-2 w-full">
                <Label className="font-bold text-xs">Destino *</Label>
                <Select
                  value={watch('destino')}
                  onValueChange={(e) => setValue('destino', e as TipoDestino)}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
                    <SelectValue placeholder="Selecciona destino..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(TipoDestino).map((destino) => (
                        <SelectItem key={destino} value={destino}>
                          {destino
                            .replace('_', ' ')
                            .toLowerCase()
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.destino && (
                  <span className="text-xs text-red-600">
                    {errors.destino.message}
                  </span>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="font-bold text-xs">
                  Temperatura del tanque (°C) *
                </Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="4.2"
                  className="rounded-xl border-gray-200 bg-gray-50/50"
                  {...register('tempTanque')}
                />
                {errors.tempTanque && (
                  <span className="text-xs text-red-600">
                    {errors.tempTanque.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 w-full pt-2 border-t">
              <div className="space-y-2 w-full h-full">
                <Label className="font-bold text-xs">Cantidad de vacas *</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0.00"
                  className="rounded-xl border-gray-200 bg-gray-50/50"
                  {...register('cantRaza')}
                />
                {errors.cantRaza && (
                  <span className="text-xs text-red-600">
                    {errors.cantRaza.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 w-full">
              <div className="space-y-2 w-full">
                <Label className="font-bold text-xs">
                  Tipo de producción *
                </Label>
                <Select
                  value={watch('idProducto')}
                  onValueChange={(e) => {
                    setValue('idProducto', e)
                    const product = data?.data.find(
                      (product: Product) => product.idProducto === e
                    )

                    if (product?.categoria === 'quesos') {
                      setValue('unidad', Unidad.KG)
                    } else {
                      setValue('unidad', Unidad.LITROS)
                    }
                  }}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
                    <SelectValue placeholder="Selecciona producto..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {data?.data.map((product: Product) => (
                        <SelectItem
                          key={product.idProducto}
                          value={product.idProducto}
                        >
                          {product.nombre}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.idProducto && (
                  <span className="text-xs text-red-600">
                    {errors.idProducto.message}
                  </span>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="font-bold text-xs">Unidad *</Label>
                <Select
                  value={watch('unidad')}
                  onValueChange={(e) => setValue('unidad', e as Unidad)}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
                    <SelectValue placeholder="Selecciona unidad..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={Unidad.KG}>{Unidad.KG}</SelectItem>
                      <SelectItem value={Unidad.LITROS}>
                        {Unidad.LITROS}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.unidad && (
                  <span className="text-xs text-red-600">
                    {errors.unidad.message}
                  </span>
                )}
              </div>
            </div>

            <span className="flex items-center gap-2 text-xs text-gray-500 pt-1">
              <AlertCircle className="size-4 text-gray-400 shrink-0" /> Verifica
              que los datos sean correctos antes de crear el lote.
            </span>
            <DialogFooter className="flex flex-row gap-3 w-full pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center w-full h-12 text-base font-bold rounded-xl border-gray-200 text-gray-600"
                onClick={() => onClose()}
              >
                Cancelar
              </Button>

              <Button
                variant="default"
                className="flex items-center justify-center w-full h-12 text-base font-bold rounded-xl bg-[#1B4D3E] hover:bg-[#153c31] text-white"
                type="submit"
              >
                {batch ? 'Actualizar lote' : 'Crear lote'}
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
      <ConnectionErrorModal
        open={showConnectionError}
        onRetry={retry}
        onCancel={() => dismiss(reset)}
      />
    </Dialog>
  )
}
export default ChangeBatch
