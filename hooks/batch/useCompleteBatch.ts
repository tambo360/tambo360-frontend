import { completeBatch } from '@/utils/api/batch.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useBatchOutbox } from '@/stores/useBatchOutbox'
import { currentScope } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import { markCompleteOptimistic } from '@/hooks/batch/offlineBatchCache'

export function useCompleteBatch() {
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
        markCompleteOptimistic(queryClient, id)
        useBatchOutbox
          .getState()
          .enqueue({ type: 'complete', scope: currentScope(), targetId: id })
        return { offline: true }
      }

      const { data } = await completeBatch(id)
      return data
    },

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.batch.detail(id) })
      const previous = queryClient.getQueryData(queryKeys.batch.detail(id))
      queryClient.setQueryData(queryKeys.batch.detail(id), () => previous)
      return { previous }
    },

    onSuccess: () => {
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
  })
}
