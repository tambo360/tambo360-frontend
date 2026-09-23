import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  DecreaseData,
  DecreaseSchema,
  TIPO_MERMA_LABELS,
} from '@/types/decrease'
import { useDecreaseType } from '@/hooks/decrease/useDecreaseType'

export interface DecreaseTypeOption {
  value: string
  label: string
}

type FieldErrors = Partial<Record<'tipo' | 'cantidad' | 'observacion', string>>

interface UseDecreaseFormProps {
  open: boolean
  onSave: (data: DecreaseData) => Promise<void>
}

// Respaldo por si el endpoint /mermas/tipos falla o responde vacío
const FALLBACK_TYPES: DecreaseTypeOption[] = Object.entries(
  TIPO_MERMA_LABELS
).map(([value, label]) => ({ value, label }))

const pad = (n: number) => String(n).padStart(2, '0')

// Fecha y hora locales del dispositivo. Solo se muestran: el backend asigna
// `fechaCreacion` por su cuenta al crear la merma.
const getNowParts = () => {
  const now = new Date()
  return {
    fecha: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    hora: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  }
}

export function useDecreaseForm({ open, onSave }: UseDecreaseFormProps) {
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [tipo, setTipo] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [observacion, setObservacion] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})

  const { data: typesData, isLoading: typesLoading } = useDecreaseType()

  // La respuesta puede venir como arreglo directo o envuelta en { data: [...] }
  const types: DecreaseTypeOption[] = useMemo(() => {
    const list = Array.isArray(typesData) ? typesData : typesData?.data
    return Array.isArray(list) && list.length > 0 ? list : FALLBACK_TYPES
  }, [typesData])

  // Cada vez que se abre el modal: fecha y hora actuales, campos limpios
  useEffect(() => {
    if (!open) return
    const now = getNowParts()
    setFecha(now.fecha)
    setHora(now.hora)
    setTipo('')
    setCantidad('')
    setObservacion('')
    setErrors({})
  }, [open])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = DecreaseSchema.safeParse({
      tipo: tipo || undefined,
      cantidad,
      observacion: observacion.trim() || undefined,
    })

    const nextErrors: FieldErrors = {}

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]) as keyof FieldErrors
        if (!nextErrors[key]) nextErrors[key] = issue.message
      }
    } else if (result.data.cantidad <= 0) {
      nextErrors.cantidad = 'La cantidad debe ser mayor a 0'
    }

    if (!result.success || Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    await onSave(result.data)
  }

  return {
    types,
    typesLoading,
    fecha,
    hora,
    tipo,
    setTipo,
    cantidad,
    setCantidad,
    observacion,
    setObservacion,
    errors,
    handleSubmit,
  }
}
