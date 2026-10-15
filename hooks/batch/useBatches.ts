import { BatchFilters } from '@/types/batch'
import { getBatches } from '@/utils/api/batch.api'
import { queryKeys } from '@/utils/queryKeys'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useOnlineStatus } from '@/hooks/connection/useOnlineStatus'

interface BatchesFilters {
  filters: BatchFilters
}
export function useBatches({ filters }: BatchesFilters) {
  const isOnline = useOnlineStatus()

  return useQuery({
    queryKey: queryKeys.batch.filters(filters),
    queryFn: async () => {
      const { data } = await getBatches({ filters })
      return data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // Offline
    networkMode: 'offlineFirst',
    placeholderData: keepPreviousData,
    retry: isOnline ? 3 : false,
    refetchOnReconnect: true,
  })
}
