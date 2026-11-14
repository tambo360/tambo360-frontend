import { DecreaseWithLote, OfflineDecreaseCreate } from '@/types/decrease'
import { createDecrease } from '@/utils/api/decrease.api'
import { queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useDecreaseOutbox } from '@/stores/useDecreaseOutbox'
import { currentEstablisment } from '@/lib/offlineId'
import { isCurrentlyOnline } from '@/hooks/connection/useOnlineStatus'
import {
  applyOptimisticMermaCreate,
  createMermaOffline,
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
        const payload: OfflineDecreaseCreate = {
          ...values,
          idMerma: tempIdMerma,
          fechaCreacion: new Date().toISOString(),
        }
        applyOptimisticMermaCreate(queryClient, createMermaOffline(payload))
        useDecreaseOutbox.getState().enqueue({
          type: 'create',
          scope: currentEstablisment(),
          idLote: values.idLote,
          targetId: tempIdMerma,
          payload,
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
        queryKey: ['mermas', 'lote', variables.idLote],
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.batch.detail(variables.idLote),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.batch.all })
    },
  })
}
