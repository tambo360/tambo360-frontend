import { FormEvent, useMemo, useState } from 'react'
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

export interface InitialDecreaseData {
  tipo: string
  cantidad: number | string
  observacion?: string | null
}

type FieldErrors = Partial<Record<'tipo' | 'cantidad' | 'observacion', string>>

interface UseDecreaseFormProps {
  onSave: (data: DecreaseData) => Promise<void>
  initialData?: InitialDecreaseData | null
}

// Respaldo por si el endpoint /mermas/tipos falla o responde vacío
const FALLBACK_TYPES: DecreaseTypeOption[] = Object.entries(
  TIPO_MERMA_LABELS
).map(([value, label]) => ({ value, label }))

const pad = (n: number) => String(n).padStart(2, '0')

const getNowParts = () => {
  const now = new Date()
  return {
    fecha: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    hora: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  }
}

export function useDecreaseForm({ onSave, initialData }: UseDecreaseFormProps) {
  const [{ fecha, hora }] = useState(getNowParts)
  const [tipo, setTipo] = useState(initialData?.tipo ?? '')
  const [cantidad, setCantidad] = useState(String(initialData?.cantidad ?? ''))
  const [observacion, setObservacion] = useState(initialData?.observacion || '')
  const [errors, setErrors] = useState<FieldErrors>({})

  const { data: typesData, isLoading: typesLoading } = useDecreaseType()

  const types: DecreaseTypeOption[] = useMemo(() => {
    const list = Array.isArray(typesData) ? typesData : typesData?.data
    return Array.isArray(list) && list.length > 0 ? list : FALLBACK_TYPES
  }, [typesData])

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
