import { updateEstablishment } from '@/utils/api/establishment.api'
import { UpdateEstablishmentPayload } from '@/types/establishment'
import { queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'

export function useUpdateEstablishment() {
  const queryClient = useQueryClient()
  return useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    UpdateEstablishmentPayload
  >({
    mutationFn: async (payload: UpdateEstablishmentPayload) => {
      const { data } = await updateEstablishment(payload)
      return data
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.currentUser })
      const previous = queryClient.getQueryData(queryKeys.auth.currentUser)
      queryClient.setQueryData(queryKeys.auth.currentUser, () => previous)
      return { previous }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser })
    },
  })
}
