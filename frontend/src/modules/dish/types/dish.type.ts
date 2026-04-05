export interface ProductResponse {
  id: string
  name: string
  slug: string
  description: string
  price: number
  currency: string

  allergens: {
    contains: string[]
  }

  dietaryTags: string[]

  assets: {
    photo: string | null
    model3d: string | null
    thumbnail: string | null
  }

  category: {
    id: string
    name: string
    slug: string
  }
}