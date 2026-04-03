import { apiClient } from '@/api/apiClient'
import type { RestaurantResponse, RestaurantApiResponse } from '../types/entry.type'

export async function fetchRestaurantBySlug(restaurantSlug: string): Promise<RestaurantResponse> {
  const response = await apiClient.get<RestaurantApiResponse>(`/v1/menu/${restaurantSlug}`)

  const data = response.data
  console.log('API Response:', data)

  const restaurant: RestaurantResponse = {
    id: data.restaurant.id,
    code: data.restaurant.slug,
    name: data.restaurant.name,
    status: 'open',
    description: data.restaurant.name,
    restaurant: data.restaurant,
  }

  return restaurant
}