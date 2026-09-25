import { getGraph } from '@/utils/api/dashboard.api'
import { GraphParams } from '@/types/dashboard'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/utils/queryKeys'
import { useParams } from 'next/navigation'

export function useGraph({ params }: { params: GraphParams }) {
  const routeParams = useParams()
  const orgId = routeParams?.orgId as string | undefined
  const estId = routeParams?.id as string | undefined
  const hasContext = !!orgId && !!estId

  return useQuery({
    queryKey: queryKeys.dashboard.graph(params),
    queryFn: async () => {
      const { data } = await getGraph(params)
      return data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: hasContext,
  })
}
