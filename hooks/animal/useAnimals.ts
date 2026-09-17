import { useQuery } from '@tanstack/react-query'
import { getAnimals, Animal } from '@/utils/api/animal.api'

export const useAnimals = () => {
  return useQuery<Animal[]>({
    queryKey: ['animals'],
    queryFn: getAnimals,
    staleTime: 5 * 60 * 1000,
  })
}
