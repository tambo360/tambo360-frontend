import { getFreeLiters } from '@/utils/api/dashboard.api'
import { FreeLiters } from '@/types/dashboard'
import { queryKeys } from '@/utils/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useParams } from 'next/navigation'

export function useFreeLiters() {
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const estId = params?.id as string | undefined
  const hasContext = !!orgId && !!estId

  return useQuery<FreeLiters, AxiosError<{ message: string }>>({
    queryKey: queryKeys.dashboard.freeLiters(),
    queryFn: async () => {
      const { data } = await getFreeLiters()
      return data.data as FreeLiters
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: hasContext,
  })
}
