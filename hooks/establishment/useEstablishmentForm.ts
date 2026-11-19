'use client'
import { useEstablishment } from '@/hooks/establishment/useEstablishment'
import { useUpdateEstablishment } from '@/hooks/establishment/useUpdateEstablishment'
import { useConfiguration } from '@/hooks/establishment/useConfiguration'
import {
  establishmentFormSchema,
  EstablishmentFormData,
} from '@/types/establishment'
import { TipoOrdenie } from '@/types/enums'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

type ApiRecord = Record<string, unknown>

// Convierte el valor del backend (ej. "BALDE" o "balde") al valor del enum
const toTipoOrdenie = (raw: unknown): string => {
  const value = String(raw ?? '')
    .trim()
    .toLowerCase()
  return Object.values(TipoOrdenie).find((t) => t === value) ?? ''
}

const toPositiveNumber = (raw: unknown, fallback: number): number => {
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function useEstablishmentForm() {
  const params = useParams()
  const id = params?.id as string

  const { data: establishmentData, isLoading: isLoadingEstablishment } =
    useEstablishment({ id })
  const { data: config, isLoading: isLoadingConfig } = useConfiguration()
  const { mutateAsync: updateEstablishment, isPending } =
    useUpdateEstablishment()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentFormSchema),
    defaultValues: {
      nombre: '',
      // cuencaLechera: '',
      tipoOrdenie: '',
      ordenie_dia: 2,
      promLitros: 0,
      provincia: '',
      localidad: '',
    },
  })

  useEffect(() => {
    if (!establishmentData?.data) return
    const est = establishmentData.data?.establecimiento
    const cfg = (config?.data ?? {}) as ApiRecord

    reset({
      nombre: est?.nombre ?? '',
      // cuencaLechera: est?.provincia ?? '',
      tipoOrdenie: toTipoOrdenie(
        cfg.tipo_ordeñe ?? cfg.tipoOrdenie ?? cfg.tipo_ordenie
      ),
      ordenie_dia: toPositiveNumber(
        cfg.ordeñe_por_dia ?? cfg.cantOrdenies ?? cfg.cantOrdenie,
        1
      ),
      promLitros: toPositiveNumber(cfg.litros_por_dia ?? cfg.promLitros, 1),
      provincia: est?.provincia ?? '',
      localidad: est?.localidad ?? '',
    })
  }, [establishmentData, config, reset])

  const onSubmit = async (data: EstablishmentFormData) => {
    try {
      await updateEstablishment({
        idEst:
          establishmentData?.data?.establecimiento?.idEstablecimiento ?? id,
        nombre: data.nombre,
        //cuenca_lechera: data.cuencaLechera,
        tipo_ordenie: data.tipoOrdenie,
        ordenie_dia: data.ordenie_dia,
        promLitros: data.promLitros,
        ubicacion: {
          provincia: data.provincia,
          localidad: data.localidad,
        },
      })
      reset(data)
      toast.success('Cambios guardados correctamente', {
        position: 'top-center',
        duration: 4000,
      })
    } catch (error) {
      const message = (error as AxiosError<{ message?: string }>)?.response
        ?.data?.message
      toast.error(message ?? 'No se pudieron guardar los cambios', {
        position: 'top-center',
      })
    }
  }

  // Si la validación falla, avisamos en vez de quedarnos sin respuesta
  const onInvalid = () => {
    toast.error('Revisa los campos marcados en rojo antes de guardar', {
      position: 'top-center',
    })
  }

  const submitForm = handleSubmit(onSubmit, onInvalid)

  const onCancel = () => {
    reset()
  }

  return {
    register,
    handleSubmit,
    submitForm,
    setValue,
    watch,
    errors,
    isDirty,
    isPending,
    isLoading: isLoadingEstablishment || isLoadingConfig,
    onSubmit,
    onCancel,
  }
}
