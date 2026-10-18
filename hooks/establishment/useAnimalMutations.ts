import { useState } from 'react'
import { updateAnimalApi, deleteBajaAnimal } from '@/utils/api/catalog.api'

export function useAnimalMutations() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Editar animal
  const updateAnimal = async (
    id: string,
    codigo: string,
    nombre: string,
    observacion: string
  ) => {
    setIsUpdating(true)
    setError(null)
    try {
      // Llama a la API segura (Axios)
      return await updateAnimalApi(id, codigo, nombre, observacion)
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || 'Error al actualizar'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsUpdating(false)
    }
  }

  // 2. Eliminar / Dar de baja
  const deleteAnimal = async (id: string, motivo: string = 'EGRESO_VENTA') => {
    setIsDeleting(true)
    setError(null)
    try {
      // Armamos el payload que pide la documentación (Punto 3)
      const payload = {
        tipoSeguimiento: 'INDIVIDUAL',
        tipo: 'EGRESO',
        motivo: motivo,
        animales: id, // El ID del animal a dar de baja
      }

      // Usamos la función de tu catalog.api
      return await deleteBajaAnimal(payload)
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || 'Error al dar de baja'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    updateAnimal,
    deleteAnimal,
    isUpdating,
    isDeleting,
    error,
  }
}
