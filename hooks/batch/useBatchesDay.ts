import { getBatchesDay } from '@/utils/api/batch.api'
import { queryKeys } from '@/utils/queryKeys'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useOnlineStatus } from '@/hooks/connection/useOnlineStatus'

export function useBatchesDay() {
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const estId = params?.id as string | undefined
  const hasContext = !!orgId && !!estId

  const isOnline = useOnlineStatus()

  return useQuery({
    queryKey: queryKeys.batch.day(),
    queryFn: async () => {
      const { data } = await getBatchesDay()
      return data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // Offline
    networkMode: 'offlineFirst',
    placeholderData: keepPreviousData,
    retry: isOnline ? 3 : false,
    enabled: hasContext,
  })
}
