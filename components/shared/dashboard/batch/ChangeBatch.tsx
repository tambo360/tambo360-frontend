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
} from 'lucide-react'
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
import { TipoDestino, Unidad, TipoSeguimiento } from '@/types/enums'
import { usePathname } from 'next/navigation'
import { useCurrentDateTime } from '@/hooks/useCurrentDateTime'

// ✅ IMPORTS NUEVOS PARA LA SOLUCIÓN DEL BUG
import { useOpcionesSeguimiento } from '@/hooks/establishment/useOpcionesSeguimiento'
import {
  RodeoOpcion,
  AnimalOpcion,
} from '@/utils/api/establishment/configuration.api' // Ajusta ruta si es necesario
import { useIndividualLoteForm } from '@/hooks/batch/useIndividualLoteForm'

// ✅ Labels corregidos según backend
const ESTADO_LABELS: Record<string, string> = {
  SANO: 'Sano',
  MASTITIS: 'Mastitis',
  TRATAMIENTO: 'Tratamiento',
  PREPARTO: 'Preparto',
}

interface RodeoOption {
  idRodeo: string
  label: string
  cantAnimales: number
}

interface ChangeBatchProps {
  open: boolean
  onClose: () => void
  onOpen?: () => void
  batch?: Lote
}

const ChangeBatch = ({ open, onClose, onOpen, batch }: ChangeBatchProps) => {
  const [id, setId] = useState('')
  const [finished, setFinished] = useState(false)

  const { mutateAsync } = useCreateBatch()
  const { mutateAsync: mutateAsyncUpdate } = useUpdateBatch()
  const { data: productsData } = useProducts()
  const pathname = usePathname()
  const {
    fecha: fechaActual,
    hora: horaActual,
    loading: dateTimeLoading,
  } = useCurrentDateTime()

  // ✅ 1. USAMOS EL NUEVO HOOK EN LUGAR DE useConfiguration
  const { data: opcionesData, isLoading: opcionesLoading } =
    useOpcionesSeguimiento()

  const tipoSeguimiento = opcionesData?.tipoSeguimiento as
    | TipoSeguimiento
    | undefined

  // ✅ 2. MAPEO LIMPIO (El backend ya envía el label formateado, ej: "Rodeo Alta Producción")
  const rodeos: RodeoOption[] = (opcionesData?.rodeos ?? []).map(
    (r: RodeoOpcion) => ({
      idRodeo: r.idRodeo,
      label: r.label,
      cantAnimales: r.cantVacas,
    })
  )

  const animalesDisponibles = opcionesData?.animales ?? []

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

  const form = useForm<any>({
    resolver: zodResolver(BatchSchema),
    defaultValues: {
      tipoSeguimiento: undefined,
      idProducto: '',
      cantidad: '',
      cantBajadas: '1',
      fechaProduccion: '',
      horaProduccion: '',
      unidad: Unidad.LITROS,
      idRodeo: '',
      animales: [],
      destino: undefined,
      tempTanque: '',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = form

  // ✅ 3. PASAMOS LOS ANIMALES DISPONIBLES AL HOOK
  const individualLote = useIndividualLoteForm(form, animalesDisponibles)

  // Forzar tipoSeguimiento y resetear según variante
  useEffect(() => {
    if (!tipoSeguimiento || batch) return

    const commonValues = {
      tipoSeguimiento,
      idProducto: '',
      cantidad: '',
      cantBajadas: '1',
      fechaProduccion: fechaActual,
      horaProduccion: horaActual,
      unidad: Unidad.LITROS,
      destino: undefined,
      tempTanque: '',
    }

    if (tipoSeguimiento === TipoSeguimiento.INDIVIDUAL) {
      reset({ ...commonValues, animales: [] })
    } else {
      reset({ ...commonValues, idRodeo: '' })
    }
  }, [tipoSeguimiento, batch, reset, fechaActual, horaActual])

  // Auto-completar fecha/hora al abrir
  useEffect(() => {
    if (batch || dateTimeLoading) return
    if (!watch('fechaProduccion')) setValue('fechaProduccion', fechaActual)
    if (!watch('horaProduccion')) setValue('horaProduccion', horaActual)
    if (!watch('cantBajadas')) setValue('cantBajadas', 1)
  }, [batch, dateTimeLoading, fechaActual, horaActual, setValue, watch])

  // Auto-seleccionar primer rodeo
  useEffect(() => {
    if (
      (tipoSeguimiento === TipoSeguimiento.RODEO ||
        tipoSeguimiento === TipoSeguimiento.RODEO_UNICO) &&
      rodeos.length > 0 &&
      !watch('idRodeo')
    ) {
      setValue('idRodeo', rodeos[0].idRodeo)
    }
  }, [tipoSeguimiento, rodeos, setValue, watch])

  // Auto-seleccionar primer producto
  useEffect(() => {
    if (watch('idProducto') || !productsData?.data?.length) return
    const primerProducto = productsData.data[0]
    setValue('idProducto', primerProducto.idProducto)
    setValue(
      'unidad',
      primerProducto.categoria === 'quesos' ? Unidad.KG : Unidad.LITROS
    )
  }, [productsData, setValue, watch])

  // Cargar datos si se edita
  useEffect(() => {
    if (!batch) return

    let fechaFormateada = ''
    if (batch.fechaProduccion) {
      const date = new Date(batch.fechaProduccion)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      fechaFormateada = `${day}/${month}/${year}`
    }

    reset({
      tipoSeguimiento,
      idProducto: batch.idProducto ?? '',
      cantidad: batch.cantidad?.toString() ?? '',
      cantBajadas: batch.cantBajadas?.toString() ?? '1',
      fechaProduccion: fechaFormateada,
      horaProduccion: horaActual,
      unidad: batch.unidad ?? Unidad.LITROS,
      idRodeo: batch.rodeo?.idRodeo ?? '',
      tempTanque: batch.tempTanque?.toString() ?? '',
      destino: batch.destino,
    })
  }, [batch, reset, tipoSeguimiento, horaActual])

  // Submit
  const onSubmit = handleSubmit(
    handleSubmitWithConnectionCheck(async (data) => {
      const [day, month, year] = data.fechaProduccion.split('/')
      const fechaProduccion = `${day}/${month}/${year}`

      if (!batch) {
        if (!tipoSeguimiento) {
          showErrorMessage(
            'No se puede crear el lote: falta la configuración del establecimiento.'
          )
          return
        }

        const idLote = crypto.randomUUID()
        const base = {
          tipoSeguimiento,
          idProducto: data.idProducto,
          cantidad: Number(data.cantidad),
          unidad: data.unidad,
          fechaProduccion,
          idLote,
          tempTanque: data.tempTanque ? Number(data.tempTanque) : undefined,
          destino: data.destino,
          cantBajadas: Number(data.cantBajadas),
        }

        let newBatch: Record<string, unknown>
        if (tipoSeguimiento === TipoSeguimiento.INDIVIDUAL) {
          newBatch = {
            ...base,
            animales: data.animales.map((a: any) => ({
              ...a,
              litros: Number(a.litros),
            })),
          }
        } else {
          newBatch = { ...base, idRodeo: data.idRodeo }
        }

        try {
          await mutateAsync(newBatch)
          setId(idLote)
          setFinished(true)
        } catch (error) {
          console.error('❌ Error al crear lote:', error)
          showErrorMessage('Error al crear el lote. Revisa los datos.')
        }
      } else {
        await mutateAsyncUpdate({
          id: batch.idLote,
          values: {
            ...data,
            fechaProduccion,
            cantidad: Number(data.cantidad),
            cantBajadas: Number(data.cantBajadas),
            tempTanque: data.tempTanque ? Number(data.tempTanque) : undefined,
          },
        })
        setId(batch.idLote)
        setFinished(true)
      }
    })
  )

  // ✅ 4. ACTUALIZAMOS LAS CONDICIONES DE READY Y SUBMIT CON opcionesLoading
  const isReady =
    !opcionesLoading &&
    !!tipoSeguimiento &&
    (tipoSeguimiento === TipoSeguimiento.INDIVIDUAL ? true : rodeos.length > 0)

  const canSubmit =
    tipoSeguimiento === TipoSeguimiento.INDIVIDUAL
      ? isReady && individualLote.isBalanced && individualLote.fields.length > 0
      : isReady && !!watch('idRodeo')

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setFinished(false)
          reset()
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
                ? 'El lote ha sido actualizado exitosamente en el sistema.'
                : 'El nuevo lote ha sido registrado exitosamente en el sistema.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Button
              variant="default"
              className="flex items-center justify-center w-full h-12 text-base font-bold bg-[#2E7D53] hover:bg-[#236342] text-white rounded-xl shadow-md transition-all"
              asChild
            >
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
        <DialogContent className="max-w-lg bg-white rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
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
            {/* Fecha + Hora + Cant. Bajadas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
              <div className="space-y-2">
                <Label className="font-bold text-xs">Fecha *</Label>
                <Input
                  type="text"
                  placeholder="dd/mm/aaaa"
                  className="rounded-xl border-gray-200 bg-gray-50/50"
                  {...register('fechaProduccion')}
                  disabled
                />
                {errors.fechaProduccion && (
                  <span className="text-xs text-red-600">
                    {errors.fechaProduccion.message as string}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs">Hora</Label>
                <Input
                  type="time"
                  className="rounded-xl border-gray-200 bg-gray-50/50"
                  {...register('horaProduccion')}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs">Cant. de Bajadas *</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Ej: 2"
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

            {/* MODO RODEO / RODEO_UNICO */}
            {(tipoSeguimiento === TipoSeguimiento.RODEO ||
              tipoSeguimiento === TipoSeguimiento.RODEO_UNICO) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <div className="space-y-2 w-full">
                  <Label className="font-bold text-xs">Rodeo Origen *</Label>
                  {opcionesLoading ? (
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
                      onValueChange={(e) => setValue('idRodeo', e)}
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
                              {rodeo.label} ({rodeo.cantAnimales} animales)
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
                    Volumen Total (Litros) *
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
              </div>
            )}

            {/* MODO INDIVIDUAL */}
            {tipoSeguimiento === TipoSeguimiento.INDIVIDUAL && (
              <>
                <div className="space-y-2 w-full pt-2 border-t">
                  <Label className="font-bold text-xs">
                    Seleccionar vacas asociadas *
                  </Label>

                  {opcionesLoading ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Cargando animales...
                      </span>
                    </div>
                  ) : individualLote.animals.length === 0 ? (
                    <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-xl">
                      No hay animales registrados.
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl divide-y max-h-64 overflow-y-auto">
                      {individualLote.animals.map((animal) => {
                        const selected = individualLote.isAnimalSelected(
                          animal.idAnimal
                        )
                        const field = individualLote.fields.find(
                          (f) => f.idAnimal === animal.idAnimal
                        )
                        return (
                          <div key={animal.idAnimal} className="p-3 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selected}
                                  onCheckedChange={() =>
                                    individualLote.toggleAnimal(animal.idAnimal)
                                  }
                                />
                                <span className="text-sm font-medium">
                                  {animal.codigo} - {animal.nombre}
                                </span>
                              </div>
                            </div>

                            {selected && (
                              <div className="grid grid-cols-2 gap-2 ml-8">
                                <div>
                                  <Label className="text-[10px] text-gray-500">
                                    Litros
                                  </Label>
                                  <Input
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="0"
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
                                <div>
                                  <Label className="text-[10px] text-gray-500">
                                    Destino
                                  </Label>
                                  <Select
                                    value={field?.destino ?? ''}
                                    onValueChange={(v) =>
                                      individualLote.updateDestino(
                                        animal.idAnimal,
                                        v as any
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-8 text-xs rounded-lg">
                                      <SelectValue placeholder="Destino" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="TANQUE">
                                        Tanque
                                      </SelectItem>
                                      <SelectItem value="DESCARTE">
                                        Descarte
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-2">
                                  <Label className="text-[10px] text-gray-500">
                                    Estado Sanitario
                                  </Label>
                                  <Select
                                    value={field?.estado ?? ''}
                                    onValueChange={(v) =>
                                      individualLote.updateEstado(
                                        animal.idAnimal,
                                        v as any
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-8 text-xs rounded-lg">
                                      <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(ESTADO_LABELS).map(
                                        ([value, label]) => (
                                          <SelectItem key={value} value={value}>
                                            {label}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
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
                      {(errors.animales as any)?.message ??
                        'Revisa los animales'}
                    </span>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <Label className="font-bold text-xs">
                    Producción Total Asociada (Litros) *
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
              </>
            )}

            {/* Destino + Temperatura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
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
                    {errors.destino.message as string}
                  </span>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="font-bold text-xs">
                  Temperatura del tanque (°C){' '}
                  {watch('destino') === TipoDestino.TANQUE_FRIO && '*'}
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
                {watch('destino') === TipoDestino.TANQUE_FRIO && (
                  <p className="text-[10px] text-orange-600">
                    Obligatorio para Tanque Frío
                  </p>
                )}
              </div>
            </div>

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
                disabled={!canSubmit || opcionesLoading}
              >
                {opcionesLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : batch ? (
                  'Actualizar lote'
                ) : (
                  'Crear lote'
                )}
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
