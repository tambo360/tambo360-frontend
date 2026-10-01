import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { getTransferFormData } from '@/utils/api/transfer.api'
import { baseKeys } from '@/utils/queryKeys'

export function useTransferFormData(enabled = true) {
  const params = useParams()
  const idEstablecimiento = params.id as string

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
  })
}
