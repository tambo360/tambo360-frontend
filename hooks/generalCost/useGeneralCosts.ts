import {
  DEFAULT_GENERAL_COST_PERIOD,
  GeneralCostPeriod,
} from '@/types/generalCost'
import { getGeneralCosts } from '@/utils/api/generalCost.api'
import { queryKeys } from '@/utils/queryKeys'
import { useQuery } from '@tanstack/react-query'

export function useGeneralCosts(
  period: GeneralCostPeriod = DEFAULT_GENERAL_COST_PERIOD
) {
  return useQuery({
    queryKey: queryKeys.generalCost.period(
      period.fechaDesde,
      period.fechaHasta
    ),
    queryFn: async () => {
      const { data } = await getGeneralCosts(period)
      return data
    },
    enabled:
      !!period.fechaDesde &&
      !!period.fechaHasta &&
      period.fechaDesde <= period.fechaHasta,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
