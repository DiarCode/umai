import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { fetchRestaurantBySlug } from '../services/entry-service'

export const useRestaurantQuery = (restaurantSlug: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['restaurant', restaurantSlug],
    queryFn: () => fetchRestaurantBySlug(restaurantSlug),
    enabled: !!restaurantSlug,
  })

  const isOpen = computed(() => data.value?.status === 'open')

  return {
    data,
    isLoading,
    isError,
    isOpen,
  }
}
