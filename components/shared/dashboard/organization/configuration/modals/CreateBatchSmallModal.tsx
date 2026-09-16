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
import { useState } from 'react'

interface CowItem {
  id: string
  name: string
  status: 'Sana' | 'Mastitis' | 'Preparto'
}

interface CreateBatchSmallModalProps {
  open: boolean
  onClose: () => void
  onOpen?: () => void
  onSuccess?: () => void
}

export const CreateBatchSmallModal = ({
  open,
  onClose,
  onOpen,
  onSuccess,
}: CreateBatchSmallModalProps) => {
  // ---------- Hooks de datos ----------
  const { data: config } = useConfiguration()
  const { data: herdsData, isLoading: herdsLoading } = useHerds()
  const { data: productsData, isLoading: productsLoading } = useProducts()
  const { data: animals, isLoading: animalsLoading } = useAnimals()
  const { mutateAsync: createBatch, isPending: isCreating } = useCreateBatch()

  const tipoSeguimiento = config?.data?.TipoSeguimiento as
    | TipoSeguimiento
    | undefined

  // ---------- Estados locales ----------
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [idLoteCreado, setIdLoteCreado] = useState('')

  // ---------- Hooks de error ----------
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

  // ---------- React Hook Form ----------
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<SmallBatchFormData>({
    defaultValues: {
      fechaProduccion: '',
      horaProduccion: '',
      idProducto: '',
      cantidad: '',
      unidad: Unidad.LITROS,
      destino: TipoDestino.TANQUE_FRIO,
      tempTanque: '',
      idRodeo: '',
      cantRaza: '',
    },
    resolver: zodResolver(SmallBatchSchema),
  })

  // ---------- Efectos para resetear el formulario al abrir/cerrar ----------
  useEffect(() => {
    if (!open) {
      setFinished(false)
      reset()
      setSelectedAnimals([])
    }
  }, [open, reset])

  // Auto-seleccionar el primer rodeo si es RODEO_UNICO
  useEffect(() => {
    if (
      tipoSeguimiento === TipoSeguimiento.RODEO_UNICO &&
      herdsData?.data?.data?.length
    ) {
      const primerRodeo = herdsData.data.data[0]
      setValue('idRodeo', primerRodeo.idRodeo)
    }
  }, [tipoSeguimiento, herdsData, setValue])

  // Cuando se selecciona un producto, ajustar la unidad
  const handleProductChange = (productId: string) => {
    setValue('idProducto', productId)
    const product = productsData?.data.find(
      (p: Product) => p.idProducto === productId
    )
    if (product?.categoria === 'quesos') {
      setValue('unidad', Unidad.KG)
    } else {
      setValue('unidad', Unidad.LITROS)
    }
  }

  // ---------- Manejo de selección de animales ----------
  const handleCheckboxChange = (id: string) => {
    setSelectedAnimals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // ---------- Submit ----------
  const onSubmit = handleSubmit(
    handleSubmitWithConnectionCheck(async (data) => {
      // Armar fecha completa (YYYY-MM-DDTHH:mm)
      const fechaCompleta = `${data.fechaProduccion}T${data.horaProduccion}:00`

      // Payload base
      const payload: any = {
        tipoSeguimiento,
        idProducto: data.idProducto,
        cantidad: parseFloat(data.cantidad),
        unidad: data.unidad,
        destino: data.destino,
        tempTanque: data.tempTanque,
        fechaProduccion: fechaCompleta,
      }

      // Agregar campos según tipo de seguimiento
      if (tipoSeguimiento === TipoSeguimiento.INDIVIDUAL) {
        if (selectedAnimals.length === 0) {
          alert('Seleccioná al menos un animal')
          return
        }
        // Repartir litros equitativamente entre los animales seleccionados
        const litrosPorAnimal =
          parseFloat(data.cantidad) / selectedAnimals.length
        payload.animales = selectedAnimals.map((idAnimal) => {
          const animal = animals?.find((a) => a.idAnimal === idAnimal)
          // Mapear estado: si es NORMAL, lo dejamos como 'NORMAL' (preguntar al backend)
          // Según la doc, los estados posibles son: MASTITIS, TRATAMIENTO, PREPARTO, DESCARTE
          let estado = animal?.estado || 'NORMAL'
          // Si el backend no acepta NORMAL, podrías mapear a otro valor
          // Por ahora lo enviamos tal cual
          return {
            idAnimal,
            estado,
            litros: litrosPorAnimal,
          }
        })
      } else if (tipoSeguimiento === TipoSeguimiento.RODEO_UNICO) {
        if (!data.idRodeo) {
          alert('No hay rodeo seleccionado')
          return
        }
        payload.idRodeo = data.idRodeo
        // Si el usuario ingresó cantidad de animales, la usamos, si no, la tomamos del rodeo
        const rodeo = herdsData?.data.data.find(
          (r: Rodeo) => r.idRodeo === data.idRodeo
        )
        payload.cantRaza = data.cantRaza
          ? parseInt(data.cantRaza, 10)
          : rodeo?.cantAnimales || 0
      } else {
        // RODEO (caso 3) - no debería llegar aquí, pero por si acaso
        if (!data.idRodeo) {
          alert('Seleccioná un rodeo')
          return
        }
        payload.idRodeo = data.idRodeo
        payload.cantRaza = data.cantRaza ? parseInt(data.cantRaza, 10) : 0
      }

      try {
        const response = await createBatch(payload)
        setIdLoteCreado(response?.idLote || crypto.randomUUID())
        setFinished(true)
        onSuccess?.()
      } catch (error) {
        console.error('Error al crear lote:', error)
        showErrorMessage('Ocurrió un error al crear el lote')
      }
    })
  )

  // ---------- Renderizado condicional de la lista de animales ----------
  const renderAnimalSelection = () => {
    if (tipoSeguimiento !== TipoSeguimiento.INDIVIDUAL) return null

    if (animalsLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">
            Cargando animales...
          </span>
        </div>
      )
    }

    if (!animals || animals.length === 0) {
      return (
        <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-xl">
          No hay animales registrados. Primero debes cargar animales en la
          sección de inventario.
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <Label className="font-bold text-xs text-gray-700">
          Seleccionar animales *
        </Label>
        <div className="border border-blue-400 rounded-2xl p-3 space-y-3 bg-white shadow-sm max-h-60 overflow-y-auto">
          {animals.map((animal) => (
            <div
              key={animal.idAnimal}
              className="flex items-center justify-between py-1 px-1 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`animal-${animal.idAnimal}`}
                  checked={selectedAnimals.includes(animal.idAnimal)}
                  onCheckedChange={() => handleCheckboxChange(animal.idAnimal)}
                />
                <label
                  htmlFor={`animal-${animal.idAnimal}`}
                  className="text-xs font-medium text-gray-800 cursor-pointer"
                >
                  {animal.codigo} - {animal.nombre}
                </label>
              </div>
              <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor:
                    animal.estado === 'NORMAL'
                      ? '#ecfdf5'
                      : animal.estado === 'MASTITIS'
                        ? '#fef2f2'
                        : animal.estado === 'PREPARTO'
                          ? '#eff6ff'
                          : '#f3f4f6',
                  borderColor:
                    animal.estado === 'NORMAL'
                      ? '#a7f3d0'
                      : animal.estado === 'MASTITIS'
                        ? '#fecaca'
                        : animal.estado === 'PREPARTO'
                          ? '#bfdbfe'
                          : '#d1d5db',
                  color:
                    animal.estado === 'NORMAL'
                      ? '#065f46'
                      : animal.estado === 'MASTITIS'
                        ? '#991b1b'
                        : animal.estado === 'PREPARTO'
                          ? '#1e40af'
                          : '#374151',
                }}
              >
                {animal.estado}
              </span>
            </div>
          ))}
        </div>
        {selectedAnimals.length === 0 && (
          <p className="text-xs text-red-500">
            Debes seleccionar al menos un animal
          </p>
        )}
      </div>
    )
  }

  // ---------- Renderizado de cantidad de animales (para RODEO_UNICO) ----------
  const renderCantidadAnimales = () => {
    if (tipoSeguimiento !== TipoSeguimiento.RODEO_UNICO) return null

    const rodeoSeleccionado = herdsData?.data.data.find(
      (r: Rodeo) => r.idRodeo === watch('idRodeo')
    )

    return (
      <div className="space-y-2">
        <Label className="font-bold text-xs text-gray-700">
          Cantidad de animales en el rodeo *
        </Label>
        <Input
          type="number"
          min="1"
          placeholder="Ej: 60"
          className="rounded-xl border-gray-200 bg-gray-50/50"
          {...register('cantRaza')}
        />
        {rodeoSeleccionado && !watch('cantRaza') && (
          <p className="text-xs text-gray-400">
            (El rodeo tiene {rodeoSeleccionado.cantAnimales} animales. Puedes
            dejarlo en blanco para usar ese valor.)
          </p>
        )}
        {errors.cantRaza && (
          <p className="text-xs text-red-500">{errors.cantRaza.message}</p>
        )}
      </div>
    )
  }

  // ---------- Render del modal de éxito (igual que en ChangeBatch) ----------
  if (finished) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
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
              Lote creado correctamente
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 leading-relaxed px-2">
              El nuevo lote ha sido registrado exitosamente en el sistema. Ahora
              puedes gestionar su seguimiento y producción.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Button
              variant="default"
              className="flex items-center justify-center w-full h-12 text-base font-bold bg-[#2E7D53] hover:bg-[#236342] text-white rounded-xl shadow-md transition-all"
              asChild
            >
              <Link
                href={`/produccion/lote/${idLoteCreado}`}
                className="flex items-center justify-center gap-2"
                onClick={onClose}
              >
                Ir al detalle del lote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center w-full h-12 text-base font-bold bg-white border-gray-300 text-gray-800 hover:bg-gray-50 rounded-xl shadow-sm transition-all"
              onClick={() => {
                setFinished(false)
                reset()
                setSelectedAnimals([])
              }}
            >
              Crear otro lote
            </Button>
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
      </Dialog>
    )
  }

  // ---------- Render principal del formulario ----------
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl p-6 shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Crear nuevo lote
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {tipoSeguimiento === TipoSeguimiento.INDIVIDUAL
              ? 'Seleccioná los animales y asigná la producción total.'
              : 'Ingresá la producción total del rodeo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          {/* Fila: Fecha + Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="font-bold text-xs text-gray-700">Fecha *</Label>
              <Input
                type="date"
                className="rounded-xl border-gray-200 bg-gray-50/50"
                {...register('fechaProduccion')}
              />
              {errors.fechaProduccion && (
                <span className="text-xs text-red-600">
                  {errors.fechaProduccion.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs text-gray-700">Hora *</Label>
              <Input
                type="time"
                className="rounded-xl border-gray-200 bg-gray-50/50"
                {...register('horaProduccion')}
              />
              {errors.horaProduccion && (
                <span className="text-xs text-red-600">
                  {errors.horaProduccion.message}
                </span>
              )}
            </div>
          </div>

          {/* Rodeo Origen (solo para RODEO_UNICO o RODEO) */}
          {(tipoSeguimiento === TipoSeguimiento.RODEO_UNICO ||
            tipoSeguimiento === TipoSeguimiento.RODEO) && (
            <div className="space-y-2">
              <Label className="font-bold text-xs text-gray-700">
                Rodeo Origen *
              </Label>
              <Select
                value={watch('idRodeo')}
                onValueChange={(value) => setValue('idRodeo', value)}
                disabled={herdsLoading}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
                  <SelectValue placeholder="Selecciona rodeo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {herdsData?.data.data.map((rodeo: Rodeo) => (
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
          )}

          {/* Selección de animales (solo INDIVIDUAL) */}
          {renderAnimalSelection()}

          {/* Cantidad de animales (solo RODEO_UNICO) */}
          {renderCantidadAnimales()}

          {/* Volumen Total Bruto */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Volumen Total Bruto (Litros) *
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej: 2450"
              className="rounded-xl border-gray-200 bg-gray-50/50"
              {...register('cantidad')}
            />
            {errors.cantidad && (
              <span className="text-xs text-red-600">
                {errors.cantidad.message}
              </span>
            )}
          </div>

          {/* Destino */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">Destino *</Label>
            <Select
              value={watch('destino')}
              onValueChange={(value) =>
                setValue('destino', value as TipoDestino)
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
                {errors.destino.message}
              </span>
            )}
          </div>

          {/* Temperatura del tanque */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Temperatura del tanque (°C) *
            </Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Ej: 4.5"
              className="rounded-xl border-gray-200 bg-gray-50/50"
              {...register('tempTanque')}
            />
            {errors.tempTanque && (
              <span className="text-xs text-red-600">
                {errors.tempTanque.message}
              </span>
            )}
          </div>

          {/* Producto */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Tipo de producción *
            </Label>
            <Select
              value={watch('idProducto')}
              onValueChange={handleProductChange}
              disabled={productsLoading}
            >
              <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
                <SelectValue placeholder="Selecciona producto..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {productsData?.data.map((product: Product) => (
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

          {/* Unidad (automática según producto) */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">Unidad</Label>
            <Input
              type="text"
              disabled
              className="rounded-xl border-gray-200 bg-gray-100 text-gray-500"
              value={watch('unidad')}
            />
          </div>

          {/* Aviso */}
          <span className="flex items-center gap-2 text-xs text-gray-500 pt-1">
            <AlertCircle className="size-4 text-gray-400 shrink-0" />
            Verifica que los datos sean correctos antes de crear el lote.
          </span>

          {/* Botones */}
          <DialogFooter className="flex flex-row gap-3 w-full pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center w-full h-12 text-base font-bold rounded-xl border-gray-200 text-gray-600"
              onClick={() => onClose()}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex items-center justify-center w-full h-12 text-base font-bold rounded-xl bg-[#1B4D3E] hover:bg-[#153c31] text-white disabled:opacity-50"
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Crear lote
            </Button>
          </DialogFooter>
        </form>

        <ConnectionErrorModal
          open={showConnectionError}
          onRetry={retry}
          onCancel={() => {
            dismiss(reset)
            onClose()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CreateBatchSmallModal
