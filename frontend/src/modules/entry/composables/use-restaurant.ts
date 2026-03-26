import { computed } from 'vue'
import type { Restaurant } from '../types/entry.type'
import { restaurants } from '../services/entry-service'

export const useRestaurant = (code: string) => {
  const normalizedCode = (code || '').trim().toLowerCase()

  const restaurant = computed<Restaurant | undefined>(() =>
    restaurants.find((r) => r.code === normalizedCode),
  )

  const isFound = computed(() => !!restaurant.value)

  const isOpen = computed(() => restaurant.value?.status === 'open')

  return {
    restaurant,
    isFound,
    isOpen,
  }
}
