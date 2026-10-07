import { getProducts } from '@/utils/api/products.api'
import { queryKeys } from '@/utils/queryKeys'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useOnlineStatus } from '@/hooks/connection/useOnlineStatus'

export function useProducts() {
  const isOnline = useOnlineStatus()
  return useQuery({
    queryKey: queryKeys.product.lists(),
    queryFn: async () => {
      const { data } = await getProducts()
      return data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // Offline: sirve los productos visitados (el form de lote los necesita).
    networkMode: 'offlineFirst',
    placeholderData: keepPreviousData,
    retry: isOnline ? 3 : false,
    refetchOnReconnect: true,
  })
}
