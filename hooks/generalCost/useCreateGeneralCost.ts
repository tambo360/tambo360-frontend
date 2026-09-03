import { reqNewGasto } from '@/types/generalCost'
import { createNewGasto } from '@/utils/api/generalCost.api'
import { queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'

export function useCreateGeneralCost() {
  const queryClient = useQueryClient()
  return useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    { values: reqNewGasto }
  >({
    mutationFn: async ({ values }: { values: reqNewGasto }) => {
      const { data } = await createNewGasto(values)
      console.log('New general cost created:', data)
      return data
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.generalCost.lists(),
      })
      const previous = queryClient.getQueryData(queryKeys.generalCost.lists())
      return { previous }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.generalCost.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.current(),
      })
    },
  })
}
