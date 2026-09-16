'use client'
import { useEstablishment } from '@/hooks/establishment/useEstablishment'
import { useUpdateEstablishment } from '@/hooks/establishment/useUpdateEstablishment'
import { useConfiguration } from '@/hooks/establishment/useConfiguration'
import {
  establishmentFormSchema,
  EstablishmentFormData,
} from '@/types/establishment'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

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
    reset({
      nombre: est?.nombre ?? '',
      // cuencaLechera: est?.provincia ?? '',
      tipoOrdenie: config?.data?.tipo_ordeñe ?? '',
      ordenie_dia: config?.data?.ordeñe_por_dia ?? 1,
      promLitros: config?.data?.litros_por_dia ?? 1,
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
      toast.success('Cambios guardados correctamente', {
        position: 'top-center',
        duration: 4000,
      })
    } catch {
      toast.error('No se pudieron guardar los cambios', {
        position: 'top-center',
      })
    }
  }

  const onCancel = () => {
    reset()
  }

  return {
    register,
    handleSubmit,
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
