import { CreateNewCostRequest } from '@/types/generalCost'
import { createGeneralCost } from '@/utils/api/generalCost.api'
import { queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'

export function useCreateGeneralCost() {
  const queryClient = useQueryClient()
  return useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    { values: CreateNewCostRequest }
  >({
    mutationFn: async ({ values }: { values: CreateNewCostRequest }) => {
      const { data } = await createGeneralCost(values)
      return data
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.generalCost.all,
      })
      const previous = queryClient.getQueryData(queryKeys.generalCost.lists())
      return { previous }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.generalCost.all,
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.current(),
      })
    },
  })
}
