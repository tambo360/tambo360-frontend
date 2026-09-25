import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { transferRodeoRequest } from '@/utils/api/transfer.api'
import { baseKeys } from '@/utils/queryKeys'

export function useTransferRodeo() {
  const queryClient = useQueryClient()
  const params = useParams()
  const idEstablecimiento = params.id as string

  return useMutation({
    mutationFn: transferRodeoRequest,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ...baseKeys.establishment,
          idEstablecimiento,
          'opciones-seguimiento',
        ],
      })
      queryClient.invalidateQueries({ queryKey: ['lotes'] })
    },
  })
}
