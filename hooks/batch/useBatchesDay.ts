import { getBatchesDay } from '@/utils/api/batch.api'
import { queryKeys } from '@/utils/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export function useBatchesDay() {
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const estId = params?.id as string | undefined
  const hasContext = !!orgId && !!estId

  return useQuery({
    queryKey: queryKeys.batch.day(),
    queryFn: async () => {
      const { data } = await getBatchesDay()
      return data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: hasContext,
  })
}
