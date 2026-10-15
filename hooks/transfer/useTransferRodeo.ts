import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { transferRodeoRequest } from '@/utils/api/transfer.api'
import { baseKeys } from '@/utils/queryKeys'
import type {
  TransferAnimalPayload,
  TransferRodeoPayload,
} from '@/types/transfer'
import { useTransferOutbox } from '@/stores/useTransferOutbox'
import { currentScope } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import { applyOptimisticTransfer } from '@/hooks/transfer/offlineTransferCache'

export function useTransferRodeo() {
  const queryClient = useQueryClient()
  const params = useParams()
  const idEstablecimiento = params.id as string

  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: [
        ...baseKeys.establishment,
        idEstablecimiento,
        'opciones-seguimiento',
      ],
    })
    queryClient.invalidateQueries({
      queryKey: [...baseKeys.batch, 'filters'],
    })
  }

  return useMutation({
    networkMode: 'always',
    mutationFn: async (
      payload: TransferRodeoPayload | TransferAnimalPayload
    ) => {
      // offline
      if (!isCurrentlyOnline()) {
        applyOptimisticTransfer(queryClient, payload)
        useTransferOutbox
          .getState()
          .enqueue({ type: 'transfer', scope: currentScope(), payload })
        return { offline: true }
      }
      const { data } = await transferRodeoRequest(
        payload as TransferRodeoPayload
      )
      return data
    },
    onSettled: () => {
      if (!isCurrentlyOnline()) return
      invalidateAll()
    },
  })
}
