import { logOut } from '@/utils/api/auth.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { del } from 'idb-keyval'
import { useBatchOutbox } from '@/stores/useBatchOutbox'
import { clearCuestionarioCompletado } from '@/lib/offlineUser'
import { OFFLINE_QUERY_CACHE_KEY } from '@/utils/QueryProvider'

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await logOut()
      return data
    },

    onSuccess: () => {
      queryClient.clear()
      useBatchOutbox.getState().clear()
      clearCuestionarioCompletado()
      del(OFFLINE_QUERY_CACHE_KEY).catch(() => undefined)
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.alert, 'filters'],
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.alert.lasts() })
      queryClient.invalidateQueries({ queryKey: queryKeys.alert.noViewed() })
      queryClient.invalidateQueries({ queryKey: queryKeys.alert.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.batch.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.batch.day() })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.batch, 'filters'],
      })
      queryClient.invalidateQueries({ queryKey: [...baseKeys.batch, 'detail'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.cost.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.decrease.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.current() })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.dashboard, 'graph'],
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishment.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.organization.lists(),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.organization.all })
    },
  })
}
