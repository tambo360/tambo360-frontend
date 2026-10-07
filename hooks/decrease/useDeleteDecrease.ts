import { deleteDecrease } from '@/utils/api/decrease.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useDecreaseOutbox } from '@/stores/useDecreaseOutbox'
import { currentScope } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import { removeOptimisticMerma } from '@/hooks/decrease/offlineDecreaseCache'

interface DeleteDecreaseProps {
  idLote: string
}
export function useDeleteDecrease({ idLote }: DeleteDecreaseProps) {
  const queryClient = useQueryClient()
  return useMutation<
    AxiosResponse | { offline: boolean },
    AxiosError<{ message: string }>,
    string
  >({
    networkMode: 'always',
    mutationFn: async (id: string) => {
      // offline
      if (!isCurrentlyOnline()) {
        removeOptimisticMerma(queryClient, idLote, id)
        useDecreaseOutbox.getState().enqueue({
          type: 'delete',
          scope: currentScope(),
          idLote,
          targetId: id,
        })
        return { offline: true }
      }

      const { data } = await deleteDecrease(id)
      return data
    },

    onSuccess: () => {
      if (!isCurrentlyOnline()) return
      queryClient.invalidateQueries({ queryKey: queryKeys.decrease.lists() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.batch.detail(idLote),
      })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.batch, 'filters'],
      })
    },
  })
}
