import {
  DEFAULT_GENERAL_COST_PERIOD,
  EconomicSummary,
  GeneralCostPeriod,
} from '@/types/generalCost'
import { getGeneralCostsSummary } from '@/utils/api/generalCost.api'
import { queryKeys } from '@/utils/queryKeys'
import { useQuery } from '@tanstack/react-query'

export function useGeneralCostsSummary(
  period: GeneralCostPeriod = DEFAULT_GENERAL_COST_PERIOD
) {
  return useQuery({
    queryKey: queryKeys.generalCost.summary(
      period.fechaDesde,
      period.fechaHasta
    ),
    queryFn: async (): Promise<EconomicSummary> => {
      const { data } = await getGeneralCostsSummary(period)
      console.log(data)
      return data.data as EconomicSummary
    },
    enabled:
      !!period.fechaDesde &&
      !!period.fechaHasta &&
      period.fechaDesde <= period.fechaHasta,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
