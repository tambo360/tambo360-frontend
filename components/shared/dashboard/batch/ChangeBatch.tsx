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
import { useEffect, useState, useMemo } from 'react'
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

import { useOpcionesSeguimiento } from '@/hooks/establishment/useOpcionesSeguimiento'
import {
  RodeoOpcion,
  AnimalOpcion,
} from '@/utils/api/establishment/configuration.api'
import { useIndividualLoteForm } from '@/hooks/batch/useIndividualLoteForm'
import BatchDetailModal from '@/components/shared/dashboard/batch/BatchDetailModal'

// ✅ IMPORTAMOS EL HOOK DE CONFIGURACIÓN (Cuestionario)
import { useConfiguration } from '@/hooks/establishment/useConfiguration'

const ESTADO_LABELS: Record<string, string> = {
  SANO: 'Sana',
  MASTITIS: 'Mastitis',
  TRATAMIENTO: 'Tratamiento',
  PREPARTO: 'Preparto',
}

const toDisplayDate = (isoDate: string): string => {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
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

  // ✅ 1. OBTENEMOS LA CONFIGURACIÓN REAL DEL CUESTIONARIO
  const { data: configData, isLoading: configLoading } = useConfiguration()

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [createdBatchId, setCreatedBatchId] = useState('')

  const fechaActualDisplay = toDisplayDate(fechaActual)

  const { data: opcionesData, isLoading: opcionesLoading } =
    useOpcionesSeguimiento()

  // ✅ 2. ANIMALES FILTRADOS (Los que vienen del backend sin fallbacks)
  const animalesDisponibles = opcionesData?.animales ?? []

  // ✅ 3. RODEOS: Usamos los del backend, o los del cuestionario si el backend falla
  const rodeos: RodeoOption[] = useMemo(() => {
    // Si el endpoint de opciones trae rodeos, los usamos
    if (opcionesData?.rodeos && opcionesData.rodeos.length > 0) {
      return opcionesData.rodeos.map((r: RodeoOpcion) => ({
        idRodeo: r.idRodeo,
        label: r.label,
        cantAnimales: r.cantVacas,
      }))
    }
    // Si no, los sacamos de la configuración del cuestionario (Caso 2 o 3)
    if (configData?.data?.rodeos && configData.data.rodeos.length > 0) {
      return configData.data.rodeos.map((r: any) => ({
        idRodeo: r.idRodeo || r.tipoRodeo,
        label: `Rodeo ${r.tipoRodeo.replace(/_/g, ' ').toLowerCase()} (${r.cantVacas} vacas)`,
        cantAnimales: r.cantVacas,
      }))
    }
    return []
  }, [opcionesData, configData])

  // ✅ 4. LÓGICA DE ORO: Determinamos el tipo real basándonos en el cuestionario
  const tipoSeguimiento = useMemo(() => {
    // 1. Intentamos obtener el tipo desde la configuración del cuestionario
    const configTipo = (configData?.data as any)?.tipoSeguimiento as
      | TipoSeguimiento
      | undefined

    // Si el cuestionario dice explícitamente RODEO o RODEO_UNICO, respetamos eso.
    if (
      configTipo === TipoSeguimiento.RODEO ||
      configTipo === TipoSeguimiento.RODEO_UNICO
    ) {
      return configTipo
    }

    // 2. Si no, revisamos si hay rodeos configurados pero no animales individuales
    const tieneRodeos =
      configData?.data?.rodeos && configData.data.rodeos.length > 0
    const tieneAnimales =
      (configData?.data as any)?.animales &&
      (configData?.data as any).animales.length > 0

    if (tieneRodeos && !tieneAnimales) {
      // Si hay rodeos pero no animales individuales, forzamos el modo Rodeo
      return configData.data.rodeos.length === 1
        ? TipoSeguimiento.RODEO_UNICO
        : TipoSeguimiento.RODEO
    }

    // 3. Si nada de lo anterior, usamos lo que dice el endpoint de opciones
    return opcionesData?.tipoSeguimiento as TipoSeguimiento | undefined
  }, [configData, opcionesData])

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
      destino: '',
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

  const individualLote = useIndividualLoteForm(form, animalesDisponibles)

  // Forzar tipoSeguimiento y resetear según variante
  useEffect(() => {
    if (!tipoSeguimiento || batch) return

    const commonValues = {
      tipoSeguimiento,
      idProducto: watch('idProducto') || '',
      cantidad: '',
      cantBajadas: '1',
      fechaProduccion: fechaActualDisplay,
      horaProduccion: horaActual,
      unidad: watch('unidad') || Unidad.LITROS,
      destino: '',
      tempTanque: '',
    }

    if (tipoSeguimiento === TipoSeguimiento.INDIVIDUAL) {
      reset({ ...commonValues, animales: [] })
    } else {
      reset({ ...commonValues, idRodeo: '' })
    }
  }, [tipoSeguimiento, batch, reset, fechaActualDisplay, horaActual])

  // Auto-completar fecha/hora al abrir
  useEffect(() => {
    if (batch || dateTimeLoading) return
    if (!watch('fechaProduccion'))
      setValue('fechaProduccion', fechaActualDisplay)
    if (!watch('horaProduccion')) setValue('horaProduccion', horaActual)
    if (!watch('cantBajadas')) setValue('cantBajadas', 1)
  }, [batch, dateTimeLoading, fechaActualDisplay, horaActual, setValue, watch])

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
      destino: batch.destino ?? '',
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
          setCreatedBatchId(idLote)
          setFinished(true)
          setIsDetailModalOpen(true)
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

  const isReady =
    !opcionesLoading &&
    !configLoading &&
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
        // ==========================================
        // PANTALLA DE ÉXITO (Tercera imagen)
        // ==========================================
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
                : 'El nuevo lote ha sido registrado exitosamente en el sistema. Ahora puedes gestionar su seguimiento y producción.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Button
              variant="default"
              className="flex items-center justify-center w-full h-12 text-base font-bold bg-[#2E7D53] hover:bg-[#236342] text-white rounded-xl shadow-md transition-all"
              onClick={() => {
                setIsDetailModalOpen(true)
                setFinished(false)
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
        // ==========================================
        // FORMULARIO DE CREACIÓN
        // ==========================================
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

            {/* MODO RODEO / RODEO_UNICO (Segunda imagen) */}
            {(tipoSeguimiento === TipoSeguimiento.RODEO ||
              tipoSeguimiento === TipoSeguimiento.RODEO_UNICO) && (
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
                      placeholder="Ej: 4.5"
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
                      onValueChange={(e) =>
                        setValue('destino', e as TipoDestino)
                      }
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

            {/* MODO INDIVIDUAL (Primera imagen) */}
            {tipoSeguimiento === TipoSeguimiento.INDIVIDUAL && (
              <>
                <div className="space-y-3 w-full pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold text-xs">
                      Seleccionar vacas asociadas
                    </Label>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="h-7 text-xs bg-[#2E7D53] hover:bg-[#236342] text-white rounded-lg px-3"
                      onClick={() => {}}
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
                                  className="rounded-full"
                                />
                                <span className="text-sm font-medium flex items-center gap-2">
                                  {animal.codigo && `${animal.codigo} - `}
                                  {animal.nombre || 'Sin nombre'}
                                  {animal.raza && (
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                      {animal.raza
                                        .replace(/_/g, ' ')
                                        .toLowerCase()}
                                    </span>
                                  )}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
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
                      {(errors.animales as any)?.message ??
                        'Revisa los animales'}
                    </span>
                  )}
                </div>

                <div className="space-y-2 w-full">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs">Destino</Label>
                    <Select
                      value={watch('destino') ?? ''}
                      onValueChange={(e) =>
                        setValue('destino', e as TipoDestino)
                      }
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
        onCancel={() => dismiss(reset)}
      />
      <BatchDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        batchId={createdBatchId}
      />
    </Dialog>
  )
}

export default ChangeBatch
