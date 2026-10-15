import { Lote } from '@/types/batch'
import { getBatch } from '@/utils/api/batch.api'
import { queryKeys } from '@/utils/queryKeys'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useOnlineStatus } from '@/hooks/connection/useOnlineStatus'

export function useBatch({ id }: { id: string }) {
  const isOnline = useOnlineStatus()
  return useQuery<{ data: Lote }>({
    queryKey: queryKeys.batch.detail(id),
    queryFn: async () => {
      const { data } = await getBatch(id)
      return data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!id,
    // Offline: sirve el detalle visitado sin reintentos ni errores.
    networkMode: 'offlineFirst',
    placeholderData: keepPreviousData,
    retry: isOnline ? 3 : false,
    refetchOnReconnect: true,
  })
}
