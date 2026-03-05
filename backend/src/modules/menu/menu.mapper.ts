
import {MenuResponseDto, ProductAssetsDto, CategoryDto, ProductDto,} from './dto/menu-response.dto'

const ASSETS_BASE_URL = process.env.ASSETS_BASE_URL || ''

function assetUrl(key: string | null): string | null {
  if (!key) return null
  return `${ASSETS_BASE_URL}/${key}`
}

function mapAssets(assets): ProductAssetsDto {
  const result: ProductAssetsDto = {
    photo: null,
    model3d: null,
    thumbnail: null,
  }

  for (const a of assets) {
    if (a.kind === 'PHOTO') {
      result.photo = assetUrl(a.asset.storageKey)
    }

    if (a.kind === 'MODEL_3D') {
      result.model3d = assetUrl(a.asset.storageKey)
    }

    if (a.kind === 'THUMBNAIL') {
      result.thumbnail = assetUrl(a.asset.storageKey)
    }
  }

  return result
}

function mapProduct(product): ProductDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    currency: product.currency,
    allergens: product.allergens,
    dietaryTags: product.dietaryTags,
    assets: mapAssets(product.assets),
  }
}

function mapCategory(category): CategoryDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    products: category.products.map(mapProduct),
  }
}

export function mapMenuResponse(restaurant): MenuResponseDto {
  return {
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      currency: restaurant.currency,
    },
    categories: restaurant.categories.map(mapCategory),
  }
}