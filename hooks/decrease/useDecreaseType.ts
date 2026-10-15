import { getDecreaseTypes } from '@/utils/api/decrease.api'
import { queryKeys } from '@/utils/queryKeys'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useOnlineStatus } from '@/hooks/connection/useOnlineStatus'

export function useDecreaseType() {
  const isOnline = useOnlineStatus()
  return useQuery({
    queryKey: queryKeys.decrease.types(),
    queryFn: async () => {
      const { data } = await getDecreaseTypes()
      return data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // offline
    networkMode: 'offlineFirst',
    placeholderData: keepPreviousData,
    retry: isOnline ? 3 : false,
    refetchOnReconnect: true,
  })
}
