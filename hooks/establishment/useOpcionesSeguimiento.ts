import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getOpcionesSeguimiento } from '../../utils/api/establishment/configuration.api'
import { baseKeys } from '../../utils/queryKeys'
import { useParams } from 'next/navigation'
import { useOnlineStatus } from '@/hooks/connection/useOnlineStatus'

export function useOpcionesSeguimiento() {
  // ✅ Obtenemos el ID del establecimiento desde la URL
  const params = useParams()
  const idEstablecimiento = params.id as string
  const isOnline = useOnlineStatus()

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
    // Offline: sirve rodeos/animales visitados (el form de lote y el
    // transfer dependen de esto tras un reload).
    networkMode: 'offlineFirst',
    placeholderData: keepPreviousData,
    retry: isOnline ? 3 : false,
    refetchOnReconnect: true,
  })
}
