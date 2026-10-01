import { useState } from 'react'
import { AxiosError } from 'axios'
import { DecreaseData, Merma } from '@/types/decrease'
import { useCreateDecrease } from '@/hooks/decrease/useCreateDecrease'
import { useDeleteDecrease } from '@/hooks/decrease/useDeleteDecrease'
import { useErrorMessage } from '@/hooks/useErrorMessage'

interface UseBatchDecreaseProps {
  batchId: string
}

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as AxiosError<{ message?: string }>)?.response?.data?.message ??
  fallback

export function useBatchDecrease({ batchId }: UseBatchDecreaseProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [decreaseToDelete, setDecreaseToDelete] = useState<Merma | null>(null)

  const { mutateAsync: createDecrease, isPending: isCreating } =
    useCreateDecrease()
  const { mutateAsync: deleteDecrease, isPending: isDeleting } =
    useDeleteDecrease({ idLote: batchId })
  const { showErrorMessage } = useErrorMessage()

  // ── Crear ──
  const openCreate = () => setIsCreateOpen(true)
  const closeCreate = () => setIsCreateOpen(false)

  const handleCreate = async (data: DecreaseData) => {
    try {
      await createDecrease({ ...data, idLote: batchId })
      setIsCreateOpen(false)
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      console.error(
        '❌ Error al registrar merma:',
        axiosError.response?.status,
        axiosError.response?.data
      )
      showErrorMessage(
        getErrorMessage(
          error,
          'No se pudo registrar la merma. Intenta de nuevo.'
        )
      )
    }
  }

  // ── Eliminar (con confirmación) ──
  const requestDelete = (merma: Merma) => setDecreaseToDelete(merma)
  const cancelDelete = () => setDecreaseToDelete(null)

  const confirmDelete = async () => {
    if (!decreaseToDelete) return
    try {
      await deleteDecrease(decreaseToDelete.idMerma)
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      console.error(
        '❌ Error al eliminar merma:',
        axiosError.response?.status,
        axiosError.response?.data
      )
      showErrorMessage(
        getErrorMessage(
          error,
          'No se pudo eliminar la merma. Intenta de nuevo.'
        )
      )
    } finally {
      setDecreaseToDelete(null)
    }
  }

  return {
    // crear
    isCreateOpen,
    openCreate,
    closeCreate,
    isCreating,
    handleCreate,
    // eliminar
    decreaseToDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,
  }
}
