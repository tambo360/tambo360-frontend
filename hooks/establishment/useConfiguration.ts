import { getConfiguration } from '@/utils/api/establishment/configuration.api'
import { queryKeys } from '@/utils/queryKeys'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useOnlineStatus } from '@/hooks/connection/useOnlineStatus'

export function useConfiguration() {
  const isOnline = useOnlineStatus()
  return useQuery({
    queryKey: queryKeys.establishment.configuration(),
    queryFn: async () => {
      const { data } = await getConfiguration()
      return data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // Offline: sirve la última configuración sin reintentos ni errores.
    networkMode: 'offlineFirst',
    placeholderData: keepPreviousData,
    retry: isOnline ? 3 : false,
    refetchOnReconnect: true,
  })
}
