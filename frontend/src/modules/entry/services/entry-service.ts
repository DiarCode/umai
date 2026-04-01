import {useQuery} from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';

export function useRestaurants() {
  return useQuery(['restaurants'], async () => {
    const {data} = await apiClient.get('/v1/restaurants');
    return data;
  })
}