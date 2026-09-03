import { PeriodoCostosGenerales } from '@/types/generalCost'
import { getCostosGenerales } from '@/utils/api/generalCost.api'
import { queryKeys } from '@/utils/queryKeys'
import { useQuery } from '@tanstack/react-query'

export function useCostosGenerales(
  periodo: PeriodoCostosGenerales = {
    fechaDesde: '2026-09-01T00:00:00.000Z',
    fechaHasta: '2026-09-30T00:00:00.000Z',
  }
) {
  return useQuery({
    queryKey: queryKeys.generalCost.period(
      periodo.fechaDesde,
      periodo.fechaHasta
    ),
    queryFn: async () => {
      const { data } = await getCostosGenerales(periodo)
      return data
    },
    enabled:
      !!periodo.fechaDesde &&
      !!periodo.fechaHasta &&
      periodo.fechaDesde <= periodo.fechaHasta,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
