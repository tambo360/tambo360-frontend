import { getCurrentMonth } from '@/utils/api/dashboard.api'
import { queryKeys } from '@/utils/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useParams } from 'next/navigation'

export function useCurrentMonth() {
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const estId = params?.id as string | undefined
  const hasContext = !!orgId && !!estId

  return useQuery<AxiosResponse, AxiosError<{ message: string }>>({
    queryKey: queryKeys.dashboard.current(),
    queryFn: async () => {
      const { data } = await getCurrentMonth()
      return data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: hasContext,
  })
}
