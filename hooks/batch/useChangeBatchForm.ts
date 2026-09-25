import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { BatchSchema, Lote } from '@/types/batch'
import { TipoDestino, TipoSeguimiento, Unidad } from '@/types/enums'
import { useCreateBatch } from '@/hooks/batch/useCreateBatch'
import { useUpdateBatch } from '@/hooks/batch/useUpdateBatch'
import { useIndividualLoteForm } from '@/hooks/batch/useIndividualLoteForm'
import { useProducts } from '@/hooks/product/useProducts'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import { useConnectionError } from '@/hooks/connection/useConnectionError'
import { useConfiguration } from '@/hooks/establishment/useConfiguration'
import { useOpcionesSeguimiento } from '@/hooks/establishment/useOpcionesSeguimiento'
import { RodeoOpcion } from '@/utils/api/establishment/configuration.api'

export interface RodeoOption {
  idRodeo: string
  label: string
  cantAnimales: number
}

interface UseChangeBatchFormProps {
  open: boolean
  onClose: () => void
  onOpen?: () => void
  batch?: Lote
}

// Rodeos que no producen leche: no se ofrecen como "Rodeo Origen"
const RODEOS_SIN_PRODUCCION = ['UNICO_SECA', 'VACAS_SECAS']

// Fecha (dd/mm/aaaa) y hora (HH:mm) del momento exacto en que se llama.
// Se lee en cada reset para que cada lote nuevo tome la hora real.
const getNowParts = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    fecha: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`,
    hora: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  }
}

// Solo acepta valores válidos del enum; nunca inventa uno
const toTipoSeguimiento = (value: unknown): TipoSeguimiento | undefined => {
  const validos = Object.values(TipoSeguimiento) as string[]
  return typeof value === 'string' && validos.includes(value)
    ? (value as TipoSeguimiento)
    : undefined
}

// El lote de este modal es de leche: se busca el producto "leche"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pickMilkProduct = (products: any[] | undefined) => {
  if (!products?.length) return undefined
  const esLeche = (p: { categoria?: string; nombre?: string }) =>
    `${p.categoria ?? ''} ${p.nombre ?? ''}`.toLowerCase().includes('leche')
  return (
    products.find(esLeche) ??
    products.find((p) => p.categoria !== 'quesos') ??
    products[0]
  )
}

interface DefaultsContext {
  productId: string
  rodeoId: string
}

const buildDefaults = (
  tipoSeguimiento: TipoSeguimiento,
  ctx: DefaultsContext
) => {
  const { fecha, hora } = getNowParts()

  const common = {
    tipoSeguimiento,
    idProducto: ctx.productId,
    cantidad: '',
    cantBajadas: '1',
    fechaProduccion: fecha,
    horaProduccion: hora,
    unidad: Unidad.LITROS,
    destino: '',
    tempTanque: '',
  }

  return tipoSeguimiento === TipoSeguimiento.INDIVIDUAL
    ? { ...common, animales: [] }
    : { ...common, idRodeo: ctx.rodeoId }
}

export function useChangeBatchForm({
  open,
  onClose,
  onOpen,
  batch,
}: UseChangeBatchFormProps) {
  const [finished, setFinished] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [createdBatchId, setCreatedBatchId] = useState('')

  const { mutateAsync } = useCreateBatch()
  const { mutateAsync: mutateAsyncUpdate } = useUpdateBatch()
  const { data: productsData } = useProducts()
  const { data: configData, isLoading: configLoading } = useConfiguration()
  const { data: opcionesData, isLoading: opcionesLoading } =
    useOpcionesSeguimiento()
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

  // ─── Tipo de seguimiento ───────────────────────────────────────────
  // Es una etiqueta del backend: se envía exactamente la del establecimiento.
  // La respuesta real trae `tipo_seguimiento` (snake_case). Nunca se deduce
  // por cantidad de rodeos ni se asume un valor por defecto.
  const tipoSeguimiento = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = configData?.data as any
    return (
      toTipoSeguimiento(config?.tipo_seguimiento) ??
      toTipoSeguimiento(config?.tipoSeguimiento) ??
      toTipoSeguimiento(opcionesData?.tipoSeguimiento)
    )
  }, [configData, opcionesData])

  const isRodeoMode =
    tipoSeguimiento === TipoSeguimiento.RODEO ||
    tipoSeguimiento === TipoSeguimiento.RODEO_UNICO

  // ─── Rodeos de origen ──────────────────────────────────────────────
  const rodeos: RodeoOption[] = useMemo(() => {
    if (opcionesData?.rodeos && opcionesData.rodeos.length > 0) {
      return opcionesData.rodeos.map((r: RodeoOpcion) => ({
        idRodeo: r.idRodeo,
        label: r.label,
        cantAnimales: r.cantVacas,
      }))
    }

    // Respaldo: rodeos del cuestionario (solo los que producen leche)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const configRodeos = (configData?.data?.rodeos ?? []) as any[]
    return configRodeos
      .filter((r) => r.idRodeo && !RODEOS_SIN_PRODUCCION.includes(r.tipoRodeo))
      .map((r) => ({
        idRodeo: r.idRodeo as string,
        label: `Rodeo ${String(r.tipoRodeo).replace(/_/g, ' ').toLowerCase()} (${r.cantVacas} vacas)`,
        cantAnimales: r.cantVacas as number,
      }))
  }, [opcionesData, configData])

  const animalesDisponibles = opcionesData?.animales ?? []

  const milkProduct = useMemo(
    () => pickMilkProduct(productsData?.data),
    [productsData]
  )

  // ─── Formulario ────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Últimos valores conocidos de producto y rodeo, para poder resetear el
  // formulario desde cualquier acción sin volver a calcularlos
  const latest = useRef<DefaultsContext>({
    productId: '',
    rodeoId: '',
  })

  useEffect(() => {
    latest.current = {
      productId: milkProduct?.idProducto ?? '',
      rodeoId: rodeos[0]?.idRodeo ?? '',
    }
  })

  // Al abrir el modal se vuelve a la pantalla del formulario
  useEffect(() => {
    if (open) setFinished(false)
  }, [open])

  // Formulario limpio al abrir (o cuando llega el tipo de seguimiento)
  useEffect(() => {
    if (!open || batch || !tipoSeguimiento) return
    reset(buildDefaults(tipoSeguimiento, latest.current))
  }, [open, batch, tipoSeguimiento, reset])

  // Producto y rodeo que llegan después del reset
  useEffect(() => {
    if (batch || !milkProduct || watch('idProducto')) return
    setValue('idProducto', milkProduct.idProducto)
  }, [batch, milkProduct, setValue, watch])

  useEffect(() => {
    if (batch || !isRodeoMode || rodeos.length === 0 || watch('idRodeo')) return
    setValue('idRodeo', rodeos[0].idRodeo)
  }, [batch, isRodeoMode, rodeos, setValue, watch])

  // Cargar datos al editar
  useEffect(() => {
    if (!open || !batch) return

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
      horaProduccion: getNowParts().hora,
      unidad: batch.unidad ?? Unidad.LITROS,
      idRodeo: batch.rodeo?.idRodeo ?? '',
      tempTanque: batch.tempTanque?.toString() ?? '',
      destino: batch.destino ?? '',
    })
  }, [open, batch, tipoSeguimiento, reset])

  // ─── Acciones ──────────────────────────────────────────────────────
  const resetToDefaults = useCallback(() => {
    if (!tipoSeguimiento) return
    reset(buildDefaults(tipoSeguimiento, latest.current))
  }, [tipoSeguimiento, reset])

  const startAnotherBatch = useCallback(() => {
    setFinished(false)
    resetToDefaults()
  }, [resetToDefaults])

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFinished(false)
      onClose()
    }
  }

  const handleConnectionCancel = () => dismiss(() => resetToDefaults())

  // Pendiente de conectar con el backend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveTransfer = (data: any) => {
    console.log('🔄 Datos de transferencia (pendiente conectar backend):', data)
    setIsTransferModalOpen(false)
  }

  const onSubmit = handleSubmit(
    handleSubmitWithConnectionCheck(async (data) => {
      // ── Editar ──
      if (batch) {
        await mutateAsyncUpdate({
          id: batch.idLote,
          values: {
            ...data,
            cantidad: Number(data.cantidad),
            cantBajadas: Number(data.cantBajadas),
            tempTanque: data.tempTanque ? Number(data.tempTanque) : undefined,
          },
        })
        setCreatedBatchId(batch.idLote)
        setFinished(true)
        return
      }

      // ── Crear ──
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
        fechaProduccion: data.fechaProduccion,
        idLote,
        tempTanque:
          data.destino === TipoDestino.TANQUE_FRIO && data.tempTanque
            ? Number(data.tempTanque)
            : undefined,
        destino: data.destino,
        cantBajadas: Number(data.cantBajadas),
      }

      // RODEO y RODEO_UNICO llevan el mismo payload; INDIVIDUAL solo animales
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any =
        tipoSeguimiento === TipoSeguimiento.INDIVIDUAL
          ? {
              ...base,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              animales: data.animales.map((a: any) => ({
                ...a,
                litros: Number(a.litros),
              })),
            }
          : { ...base, idRodeo: data.idRodeo }

      try {
        const created = await mutateAsync(payload)
        setCreatedBatchId(created?.idLote ?? idLote)
        setFinished(true)
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        console.error(
          '❌ Error al crear lote:',
          axiosError.response?.status,
          axiosError.response?.data
        )
        showErrorMessage(
          axiosError.response?.data?.message ??
            'Error al crear el lote. Revisa los datos.'
        )
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

  return {
    // formulario
    register,
    errors,
    watch,
    setValue,
    onSubmit,
    // datos
    tipoSeguimiento,
    rodeos,
    individualLote,
    // estado de carga
    opcionesLoading,
    configLoading,
    canSubmit,
    // pantallas
    finished,
    startAnotherBatch,
    handleDialogChange,
    // detalle del lote creado
    isDetailModalOpen,
    setIsDetailModalOpen,
    createdBatchId,
    // transferencia
    isTransferModalOpen,
    setIsTransferModalOpen,
    handleSaveTransfer,
    // error de conexión
    showConnectionError,
    retry,
    handleConnectionCancel,
  }
}
