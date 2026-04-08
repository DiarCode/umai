import { useQuery } from '@tanstack/vue-query'
import { computed, watchEffect } from 'vue'
import { fetchRestaurantBySlug } from '../services/entry-service';


export const useRestaurantQuery = (restaurantSlug: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["restaurant", restaurantSlug],
    queryFn: () => fetchRestaurantBySlug(restaurantSlug),
    enabled: !!restaurantSlug,
    staleTime: 1000 * 60 * 5,
  });

  const isOpen = computed(() => data.value?.status === "open")

  return {
    data,
    isLoading,
    isError,
    isOpen,
  }
}
