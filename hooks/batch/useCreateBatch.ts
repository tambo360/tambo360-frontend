import { BatchData } from '@/types/batch'
import { createBatch } from '@/utils/api/batch.api'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useCreateBatch() {
  const queryClient = useQueryClient()
  return useMutation<any, AxiosError<{ message: string }>, BatchData>({
    mutationFn: async (values: BatchData) => {
      const { data } = await createBatch(values)
      return data.data
    },

    onError: () => {
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.batch, 'filters'],
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.batch.day() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.current() })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.dashboard, 'graph'],
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.batch, 'filters'],
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.batch.day() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.current() })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.dashboard, 'graph'],
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.batch, 'filters'],
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.batch.day() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.current() })
      queryClient.invalidateQueries({
        queryKey: [...baseKeys.dashboard, 'graph'],
      })
    },
  })
}
