import { DecreaseData } from '@/types/decrease'
import { updateDecrease } from '@/utils/api/decrease.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useDecreaseOutbox } from '@/stores/useDecreaseOutbox'
import { currentScope } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import { applyOptimisticMermaUpdate } from '@/hooks/decrease/offlineDecreaseCache'

interface UpdateDecreaseProps {
  idLote: string
}
export function useUpdateDecrease({ idLote }: UpdateDecreaseProps) {
  const queryClient = useQueryClient()
  return useMutation<
    AxiosResponse<{ decrease: DecreaseData }> | { offline: boolean },
    AxiosError<{ message: string }>,
    { values: DecreaseData; id: string }
  >({
    networkMode: 'always',
    mutationFn: async ({
      values,
      id,
    }: {
      values: DecreaseData
      id: string
    }) => {
      // offline
      if (!isCurrentlyOnline()) {
        applyOptimisticMermaUpdate(queryClient, idLote, id, values)
        useDecreaseOutbox.getState().enqueue({
          type: 'update',
          scope: currentScope(),
          idLote,
          targetId: id,
          payload: { ...values, idLote },
        })
        return { offline: true }
      }

      const { data } = await updateDecrease(values, id)
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
