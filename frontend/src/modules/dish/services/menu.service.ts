import {useQuery} from '@tanstack/vue-query';
import {apiClient} from '@/api/apiClient';

export function useMenu( restaurantSlug: string){
  return useQuery['menu', restaurantSlug], async () => {
    const {data} = await apiClient.get(`/v1/menu/${restaurantSlug}`)
    return data
  }
}