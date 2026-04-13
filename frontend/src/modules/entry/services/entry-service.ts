import { apiClient } from "@/api/apiClient";
import type { RestaurantApiResponse, RestaurantResponse } from "../types/entry.type";

export async function fetchRestaurantBySlug(restaurantSlug: string): Promise<RestaurantResponse> {
  const response = await apiClient.get<RestaurantApiResponse>(`/v1/menu/${restaurantSlug}`);
  const data = response.data;

  return {
    id: data.restaurant.id,
    code: data.restaurant.slug,
    name: data.restaurant.name,
    status: "open",
    description: data.restaurant.name,
    logo: undefined,
    restaurant: data.restaurant,
    categories: data.categories || [],
  };
}
