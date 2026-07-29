import { getCurrentUser } from '@/utils/api/auth.api'
import { queryKeys } from '@/utils/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { User } from '@/types/types'

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async () => {
      const { data } = await getCurrentUser()
      return data as { success: boolean; message: string; data: User }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
