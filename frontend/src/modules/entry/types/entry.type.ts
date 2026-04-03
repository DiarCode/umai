export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  currency: string
  assets: {
    photo: string | null
  }
  status: 'open' | 'closed'
}

export interface Category {
  id: string
  name: string
  slug: string
  products: Product[]
}

export interface RestaurantInfo {
  id: string
  name: string
  slug: string
  currency: string
}

export interface RestaurantApiResponse {
  restaurant: RestaurantInfo
  categories: Category[]
}

export interface RestaurantResponse {
  id: string
  code: string
  name: string
  status: 'open' | 'closed'
  description: string
  logo?: string
  restaurant: RestaurantInfo
}