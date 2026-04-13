import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { fetchRestaurantBySlug } from "../services/entry-service";

export const useRestaurantQuery = (restaurantSlug: string) => {
  const query = useQuery({
    queryKey: ["restaurant", restaurantSlug],
    queryFn: () => fetchRestaurantBySlug(restaurantSlug),

    enabled: !!restaurantSlug,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isOpen = computed(() => query.data.value?.status === "open");

  return {
    ...query,
    isOpen,
  };
};
