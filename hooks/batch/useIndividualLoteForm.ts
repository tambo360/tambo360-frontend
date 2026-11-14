import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form'
import { useMemo } from 'react'
import { AnimalOpcion } from '@/utils/api/establishment/configuration.api' // Ajusta la ruta si es necesario

// ✅ Estados según backend
export type EstadoSanitario = 'SANO' | 'MASTITIS' | 'TRATAMIENTO' | 'PREPARTO'
export type DestinoProduccion = 'TANQUE' | 'DESCARTE'

export interface AnimalLoteField {
  idAnimal: string
  litros: number | string | undefined
  estado: EstadoSanitario | undefined
  destino: DestinoProduccion | undefined
}

// Tipado correcto del formulario
type FormValues = {
  cantidad: number
  cantBajadas: number
  animales: AnimalLoteField[]
  tipoSeguimiento: string
  idProducto: string
  fechaProduccion: string
  horaProduccion: string
  unidad: string
  destino: string
  tempTanque?: number
  idRodeo?: string
}

// ✅ Ahora recibe los animales como parámetro en lugar de fetchearlos internamente
export function useIndividualLoteForm(
  form: UseFormReturn<FormValues>,
  animalesDisponibles: AnimalOpcion[]
) {
  const { fields, append, remove, update } = useFieldArray<FormValues>({
    control: form.control,
    name: 'animales',
  })

  const cantidad = useWatch({
    control: form.control,
    name: 'cantidad',
    defaultValue: 0,
  })
  const animales = useWatch({
    control: form.control,
    name: 'animales',
    defaultValue: [],
  })

  // Suma en vivo de los litros
  const totalLitros = useMemo(() => {
    return animales.reduce(
      (acc, animal) => acc + (Number(animal.litros) || 0),
      0
    )
  }, [animales])

  // Diferencia contra el volumen total
  const diferencia = useMemo(() => {
    const cant = Number(cantidad) || 0
    return Number((cant - totalLitros).toFixed(2))
  }, [cantidad, totalLitros])

  // Validación de punto flotante
  const isBalanced = Math.abs(diferencia) < 0.01

  const isAnimalSelected = (idAnimal: string) =>
    fields.some((f) => f.idAnimal === idAnimal)

  const getLitros = (idAnimal: string) =>
    animales.find((animal) => animal.idAnimal === idAnimal)?.litros

  // Toggle animal
  const toggleAnimal = (idAnimal: string) => {
    const index = fields.findIndex((f) => f.idAnimal === idAnimal)
    if (index >= 0) {
      remove(index)
    } else {
      append({
        idAnimal,
        litros: undefined,
        estado: 'SANO', // Valor por defecto
        destino: 'TANQUE', // Valor por defecto
      })
    }
  }

  const updateLitros = (idAnimal: string, litros: string) => {
    const index = fields.findIndex((f) => f.idAnimal === idAnimal)
    if (index >= 0) {
      if (litros === '') {
        remove(index)
      } else {
        form.setValue(`animales.${index}.litros`, litros, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    } else if (litros !== '') {
      append({
        idAnimal,
        litros,
        estado: 'SANO',
        destino: 'TANQUE',
      })
    }
  }

  const updateEstado = (
    idAnimal: string,
    estado: EstadoSanitario | undefined
  ) => {
    const index = fields.findIndex((f) => f.idAnimal === idAnimal)
    if (index >= 0) {
      update(index, { ...fields[index], estado })
    }
  }

  const updateDestino = (
    idAnimal: string,
    destino: DestinoProduccion | undefined
  ) => {
    const index = fields.findIndex((f) => f.idAnimal === idAnimal)
    if (index >= 0) {
      update(index, { ...fields[index], destino })
    }
  }

  return {
    animals: animalesDisponibles ?? [], // ✅ Usamos los que vienen del prop
    fields,
    totalLitros,
    diferencia,
    isBalanced,
    isAnimalSelected,
    getLitros,
    toggleAnimal,
    updateLitros,
    updateEstado,
    updateDestino,
  }
}
