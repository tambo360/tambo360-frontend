import { BatchData } from '@/types/batch'
import { createBatch } from '@/utils/api/batch.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useBatchOutbox } from '@/stores/useBatchOutbox'
import { currentScope } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import {
  applyOptimisticCreate,
  buildOptimisticLote,
  nextProvisionalNumero,
} from '@/hooks/batch/offlineBatchCache'

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

export function useCreateBatch() {
  const queryClient = useQueryClient()
  return useMutation<any, AxiosError<{ message: string }>, BatchData>({
    networkMode: 'always',
    mutationFn: async (values: BatchData) => {
      // offline
      if (!isCurrentlyOnline()) {
        const scope = currentScope()
        const idLote = crypto.randomUUID()
        const payload = { ...values, idLote }
        const lote = buildOptimisticLote(
          queryClient,
          payload,
          nextProvisionalNumero(queryClient)
        )
        applyOptimisticCreate(queryClient, lote)
        useBatchOutbox.getState().enqueue({ type: 'create', scope, payload })

        return { idLote, offline: true }
      }

      const { data } = await createBatch(values)
      return data.data
    },

    onError: () => {
      if (!isCurrentlyOnline()) return
      invalidateAll(queryClient)
    },

    onSuccess: () => {
      if (!isCurrentlyOnline()) return
      invalidateAll(queryClient)
    },

    onSettled: () => {
      if (!isCurrentlyOnline()) return
      invalidateAll(queryClient)
    },
  })
}
