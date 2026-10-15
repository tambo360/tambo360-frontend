import { deleteBatch } from '@/utils/api/batch.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useBatchOutbox } from '@/stores/useBatchOutbox'
import { currentScope } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import { removeOptimistic } from '@/hooks/batch/offlineBatchCache'

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({
    queryKey: [...baseKeys.batch, 'filters'],
  })

  queryClient.invalidateQueries({ queryKey: queryKeys.batch.day() })
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.current() })
  queryClient.invalidateQueries({
    queryKey: [...baseKeys.dashboard, 'graph'],
  })
}

export function useDeleteBatch() {
  const queryClient = useQueryClient()
  return useMutation<
    AxiosResponse | { offline: boolean },
    AxiosError<{ message: string }>,
    { id: string }
  >({
    networkMode: 'always',
    mutationFn: async ({ id }: { id: string }) => {
      // offline
      if (!isCurrentlyOnline()) {
        removeOptimistic(queryClient, id)
        useBatchOutbox
          .getState()
          .enqueue({ type: 'delete', scope: currentScope(), targetId: id })
        return { offline: true }
      }

      const { data } = await deleteBatch(id)
      return data
    },

    onError: () => {
      if (!isCurrentlyOnline()) return
      invalidateAll(queryClient)
    },

    onSuccess: () => {
      if (!isCurrentlyOnline()) return
      invalidateAll(queryClient)
    },
  })
}
