import { useQuery } from '@tanstack/react-query'
import { getOpcionesSeguimiento } from '../../utils/api/establishment/configuration.api'
import { baseKeys } from '../../utils/queryKeys'

export function useOpcionesSeguimiento() {
  return useQuery({
    queryKey: [...baseKeys.establishment, 'opciones-seguimiento'],
    queryFn: getOpcionesSeguimiento,
    staleTime: 5 * 60 * 1000, // 5 minutos de caché
    refetchOnWindowFocus: false,
  })
}
