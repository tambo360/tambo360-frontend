import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { getTransferFormData } from '@/utils/api/transfer.api'
import { baseKeys } from '@/utils/queryKeys'
import { useOnlineStatus } from '@/hooks/connection/useOnlineStatus'

export function useTransferFormData(enabled = true) {
  const params = useParams()
  const idEstablecimiento = params.id as string
  const isOnline = useOnlineStatus()

  return useQuery({
    queryKey: [
      ...baseKeys.establishment,
      idEstablecimiento,
      'transferir-form-data',
    ],
    queryFn: getTransferFormData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled,
    // Offline: sirve el form visitado; sin caché el modal muestra su error.
    networkMode: 'offlineFirst',
    placeholderData: keepPreviousData,
    retry: isOnline ? 3 : false,
    refetchOnReconnect: true,
  })
}
