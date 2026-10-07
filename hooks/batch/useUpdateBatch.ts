import { BatchData, BatchDto } from '@/types/batch'
import { updateBatch } from '@/utils/api/batch.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useBatchOutbox } from '@/stores/useBatchOutbox'
import { currentScope } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import { applyOptimisticUpdate } from '@/hooks/batch/offlineBatchCache'

export function useUpdateBatch() {
  const queryClient = useQueryClient()
  return useMutation<
    AxiosResponse<{ batch: BatchDto }> | { offline: boolean },
    AxiosError<{ message: string }>,
    { values: BatchData; id: string }
  >({
    networkMode: 'always',
    mutationFn: async ({ values, id }: { values: BatchData; id: string }) => {
      // offline
      if (!isCurrentlyOnline()) {
        applyOptimisticUpdate(queryClient, id, values)
        useBatchOutbox.getState().enqueue({
          type: 'update',
          scope: currentScope(),
          targetId: id,
          payload: values,
        })
        return { offline: true }
      }

      const { data } = await updateBatch(values, id)
      return data
    },

    onError: () => {
      if (!isCurrentlyOnline()) return
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.batch, 'filters'],
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.batch.day() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.current() })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.dashboard, 'graph'],
      })
    },

    onSuccess: (_, variables) => {
      if (!isCurrentlyOnline()) return
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.batch, 'filters'],
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.batch.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.current() })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.dashboard, 'graph'],
      })
    },

    onSettled: () => {
      if (!isCurrentlyOnline()) return
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.batch, 'filters'],
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.current() })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.dashboard, 'graph'],
      })
    },
  })
}
