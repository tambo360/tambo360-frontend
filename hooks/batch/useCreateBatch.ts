import { BatchData } from '@/types/batch'
import { createBatch } from '@/utils/api/batch.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useBatchOutbox } from '@/stores/useBatchOutbox'
import { currentEstablisment, randomLoteId, toISODate } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import {
  applyOptimisticCreate,
  applyOptimisticDashboardCurrent,
  createLoteOffline,
  getOfflineProduct,
  nextNumberProvisionalLote,
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
  return useMutation<
    any,
    AxiosError<{ message: string }>,
    BatchData & { idLote?: string }
  >({
    networkMode: 'always',
    mutationFn: async (values: BatchData & { idLote?: string }) => {
      const idLote = values.idLote ?? randomLoteId()
      const payload = { ...values, idLote }

      // offline
      if (!isCurrentlyOnline()) {
        const scope = currentEstablisment()
        const pendingNumbers = useBatchOutbox
          .getState()
          .ops.filter((op) => op.type === 'create' && op.scope === scope)
          .map((op) => op.payload?.numeroLote)
        const offlinePayload = {
          ...payload,
          numeroLote: nextNumberProvisionalLote(queryClient, pendingNumbers),
        }
        const lote = createLoteOffline(queryClient, offlinePayload)
        // invalidateQuerys en offline
        applyOptimisticCreate(queryClient, lote)
        applyOptimisticDashboardCurrent(queryClient, lote)

        // El nombre se conserva en la cola local, no se envía al backend.
        const producto = getOfflineProduct(offlinePayload.idProducto)
        const queuedPayload = {
          ...offlinePayload,
          fechaProduccion: toISODate(offlinePayload.fechaProduccion),
          ...(producto ? { producto } : {}),
        }
        useBatchOutbox
          .getState()
          .enqueue({ type: 'create', scope, payload: queuedPayload })

        return { idLote, offline: true }
      }
      const { data } = await createBatch(payload)
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
