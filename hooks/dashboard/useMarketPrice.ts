import { getMarketPrice } from '@/utils/api/dashboard.api'
import { MarketPrice } from '@/types/dashboard'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useParams } from 'next/navigation'

export function useMarketPrice() {
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const estId = params?.id as string | undefined
  const hasContext = !!orgId && !!estId

  return useQuery<MarketPrice, AxiosError<{ message: string }>>({
    queryKey: ['dashboard', 'market-price', estId],
    queryFn: async () => {
      const { data } = await getMarketPrice()
      return data.data as MarketPrice
    },
    // El precio nacional se actualiza una vez al mes, no hace falta
    // consultarlo seguido.
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    // El backend responde 503 si todavía no hay un precio válido guardado;
    // reintentar no cambia nada.
    retry: false,
    enabled: hasContext,
  })
}
