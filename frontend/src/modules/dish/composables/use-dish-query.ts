import { useQuery } from "@tanstack/vue-query";
import { fetchMenuBySlug } from "../services/dish-service";

export const useDishQuery = (restaurantSlug: string, id: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["menu", restaurantSlug, id],
    queryFn: () => fetchMenuBySlug(restaurantSlug, id),
    enabled: !!restaurantSlug && !!id,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
