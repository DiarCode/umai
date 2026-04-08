import { apiClient } from '@/api/apiClient'
import type { ProductResponse } from '../types/dish.type'

export async function fetchMenuBySlug(
  restaurantSlug: string,
  id: string,
): Promise<ProductResponse> {
  const response = await apiClient.get<ProductResponse>(`/v1/menu/${restaurantSlug}/product/${id}`)

  const data = response.data;
  console.log("API dish:", data)

  const product: ProductResponse = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: data.price,
    currency: data.currency,
    allergens: data.allergens,
    dietaryTags: data.dietaryTags,
    assets: data.assets,
    category: data.category,
  };

  return product;
}
