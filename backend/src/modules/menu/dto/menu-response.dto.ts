export class ProductAssetsDto {
  photo: string | null
  model3d: string | null
  thumbnail: string | null
}

export class ProductDto {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  currency: string
  allergens: string[]
  dietaryTags: string[]
  assets: ProductAssetsDto
}

export class CategoryDto {
  id: string
  name: string
  slug: string
  products: ProductDto[]
}

export class RestaurantDto {
  id: string
  name: string
  slug: string
  currency: string
}

export class MenuResponseDto {
  restaurant: RestaurantDto
  categories: CategoryDto[]
}