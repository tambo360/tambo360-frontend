import { useQuery } from '@tanstack/react-query'
import { getOpcionesSeguimiento } from '../../utils/api/establishment/configuration.api'
import { baseKeys } from '../../utils/queryKeys'
import { useParams } from 'next/navigation'

export function useOpcionesSeguimiento() {
  // ✅ Obtenemos el ID del establecimiento desde la URL
  const params = useParams()
  const idEstablecimiento = params.id as string

  return useQuery({
    // ✅ Al incluir el ID en la queryKey, React Query mantiene cachés
    // separadas por tambo. Ya no mezclará animales de otros establecimientos.
    queryKey: [
      ...baseKeys.establishment,
      idEstablecimiento,
      'opciones-seguimiento',
    ],
    queryFn: getOpcionesSeguimiento,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
