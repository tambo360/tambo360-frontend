import { DecreaseWithLote } from '@/types/decrease'
import { createDecrease } from '@/utils/api/decrease.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useDecreaseOutbox } from '@/stores/useDecreaseOutbox'
import { currentScope } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import {
  applyOptimisticMermaCreate,
  buildOptimisticMerma,
} from '@/hooks/decrease/offlineDecreaseCache'

export function useCreateDecrease() {
  const queryClient = useQueryClient()
  return useMutation<
    AxiosResponse | { idMerma: string; offline: boolean },
    AxiosError<{ message: string }>,
    DecreaseWithLote
  >({
    networkMode: 'always',
    mutationFn: async (values: DecreaseWithLote) => {
      // offline
      if (!isCurrentlyOnline()) {
        const tempIdMerma = crypto.randomUUID()
        const merma = buildOptimisticMerma(values, tempIdMerma)
        applyOptimisticMermaCreate(queryClient, merma)
        useDecreaseOutbox.getState().enqueue({
          type: 'create',
          scope: currentScope(),
          idLote: values.idLote,
          targetId: tempIdMerma,
          payload: { ...values },
        })
        return { idMerma: tempIdMerma, offline: true }
      }

      const { data } = await createDecrease(values)
      return data
    },

    onSuccess: (_, variables) => {
      if (!isCurrentlyOnline()) return
      queryClient.invalidateQueries({ queryKey: queryKeys.decrease.lists() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.batch.detail(variables.idLote),
      })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.batch, 'filters'],
      })
    },
  })
}
