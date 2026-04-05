import { apiClient } from '@/api/apiClient'
import type { RestaurantResponse, RestaurantApiResponse } from '../types/entry.type'

export async function fetchRestaurantBySlug(restaurantSlug: string): Promise<RestaurantResponse> {
  const response = await apiClient.get<RestaurantApiResponse>(`/v1/menu/${restaurantSlug}`)
  const data = response.data

  console.log("API:", data)

  const restaurant: RestaurantResponse = {
    status: "open",
    description: data.restaurant.name,
    logo: data.restaurant.logo || null,
    restaurant: data.restaurant,
    categories: data.categories || [],
  };

  return restaurant;
}
