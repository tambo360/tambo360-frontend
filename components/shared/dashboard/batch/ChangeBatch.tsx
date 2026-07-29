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
import { AlertCircle, ArrowRight, Grid } from 'lucide-react'
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
  }, [batch, reset, setValue])

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
        const batch = {
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

        await mutateAsync(batch)
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
        <DialogContent className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-[32px] font-bold text-black flex justify-center">
              <img
                src="/successIcon.svg"
                alt="success"
                className="w-36 aspect-square"
              />
            </DialogTitle>

            <DialogTitle className="text-[32px] font-bold text-black flex justify-center text-center">
              {batch
                ? 'Lote actualizado correctamente'
                : 'Lote creado correctamente'}
            </DialogTitle>

            {batch ? (
              <DialogDescription className="text-center text-[16px]">
                El lote ha sido actualizado exitosamente en <br />
                el sistema. Ahora puedes gestionar su <br />
                seguimiento y produccion.
              </DialogDescription>
            ) : (
              <DialogDescription className="text-center text-[16px]">
                El nuevo lote ha sido registrado exitosamente en <br />
                el sistema. Ahora puedes gestionar su <br />
                seguimiento y produccion.
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="p-4 space-y-2">
            <Button
              variant="default"
              className="flex items-center justify-center w-full h-14 text-xl font-bold"
              asChild
            >
              <Link href={pathname + '/lote/' + id} className="block">
                Ir al detalle del lote
                <ArrowRight className="ml-2 size-6" />
              </Link>
            </Button>

            {!batch && (
              <Button
                variant="secondary"
                className="flex items-center justify-center w-full h-14 text-xl font-bold"
                onClick={() => {
                  setFinished(false)
                  reset()
                }}
              >
                Crear otro lote
              </Button>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-center sm:justify-center items-center text-center">
            <Button variant="ghost" onClick={() => onClose()}>
              <Grid className="size-5" />
              <span className="underline">Volver al dashboard</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="border-b p-2">
            <DialogTitle className="text-[32px] font-bold text-black">
              {batch ? 'Editar lote' : 'Crear nuevo lote'}
            </DialogTitle>

            <DialogDescription>
              {batch
                ? 'Ingresa los nuevos datos para actualizar el lote.'
                : 'Ingresa los datos para iniciar el seguimiento de producción.'}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-2" onSubmit={onSubmit}>
            <div className="flex items-center justify-between gap-2 w-full">
              {/* Fecha */}
              <div className="space-y-2 w-full">
                <Label className="font-bold">Fecha de producción *</Label>
                <Input
                  type="date"
                  placeholder="dd/mm/aaaa"
                  {...register('fechaProduccion')}
                />

                {errors.fechaProduccion && (
                  <span className="text-xs text-red-600">
                    {errors.fechaProduccion.message}
                  </span>
                )}
              </div>

              {/*
                TODO (pendiente de backend): el Figma pide un campo "Hora"
                junto a la fecha. No existe en BatchSchema (types/batch.ts)
                ni en el modelo LoteProduccion del backend (prisma/schema.prisma).
                Falta que backend agregue el campo antes de poder mostrarlo aquí.
              */}
            </div>

            {/* Rodeo Origen y Volumen Total Bruto */}
            <div className="flex items-center justify-between gap-2 w-full">
              {/* razas */}
              <div className="space-y-2 w-full">
                <Label className="font-bold">Rodeo Origen *</Label>
                <Select
                  defaultValue={batch ? batch.rodeo.idRodeo : ''}
                  onValueChange={(e) => setValue('idRodeo', e)}
                >
                  <SelectTrigger className="w-full">
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

              {/* Cantidad producida (Volumen Total Bruto) */}
              <div className="space-y-2 w-full">
                <Label className="font-bold">
                  Volumen Total Bruto (Litros) *
                </Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...register('cantidad')}
                />

                {errors.cantidad && (
                  <span className="text-xs text-red-600">
                    {errors.cantidad.message}
                  </span>
                )}
              </div>
            </div>

            {/* Destino y Temperatura del tanque */}
            <div className="flex items-center justify-between gap-2 w-full">
              {/* Destino */}
              <div className="space-y-2 w-full">
                <Label className="font-bold">Destino *</Label>
                <Select
                  value={watch('destino')}
                  onValueChange={(e) => setValue('destino', e as TipoDestino)}
                >
                  <SelectTrigger className="w-full">
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

              {/* Temperatura del tanque */}
              <div className="space-y-2 w-full">
                <Label className="font-bold">
                  Temperatura del tanque (°C) *
                </Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="4.2"
                  {...register('tempTanque')}
                />

                {errors.tempTanque && (
                  <span className="text-xs text-red-600">
                    {errors.tempTanque.message}
                  </span>
                )}
              </div>
            </div>

            {/*
              Campos requeridos por BatchSchema que NO aparecen en el Figma.
              Se dejan agrupados aquí abajo: quitarlos rompería la validación
              (el formulario nunca podría enviarse). Si el diseño definitivo
              no los contempla, hay que confirmar con quien diseñó el Figma
              antes de eliminarlos.
            */}
            <div className="flex items-center justify-between gap-2 w-full pt-2 border-t">
              {/* cantidad rodeo */}
              <div className="space-y-2 w-full h-full">
                <Label className="font-bold">Cantidad de vacas *</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0.00"
                  {...register('cantRaza')}
                />

                {errors.cantRaza && (
                  <span className="text-xs text-red-600">
                    {errors.cantRaza.message}
                  </span>
                )}
              </div>
            </div>

            {/* producto y unidad */}
            <div className="flex items-center justify-between gap-2 w-full">
              {/* Productos */}
              <div className="space-y-2 w-full">
                <Label className="font-bold">Tipo de producción *</Label>
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
                  <SelectTrigger className="w-full">
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

              {/* Unidad */}
              <div className="space-y-2 w-full">
                <Label className="font-bold">Unidad *</Label>
                <Select
                  value={watch('unidad')}
                  onValueChange={(e) => setValue('unidad', e as Unidad)}
                >
                  <SelectTrigger className="w-full">
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

            <span className="flex items-center gap-2 text-xs">
              <AlertCircle className="size-5" /> Verifica que los datos sean
              correctos antes de crear el lote.
            </span>
            <DialogFooter className="flex flex-row gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center w-full h-16 text-xl font-bold"
                onClick={() => onClose()}
              >
                Cancelar
              </Button>

              <Button
                variant="default"
                className="flex items-center justify-center w-full h-16 text-xl font-bold"
                type="submit"
              >
                {batch ? 'Actualizar lote' : 'Crear lote'}
                <ArrowRight className="size-6" />
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
