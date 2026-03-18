import {
  MenuResponseDto,
  ProductAssetsDto,
  CategoryDto,
  ProductDto,
} from './dto/menu-response.dto';
import { Prisma } from '../../common/generated/prisma';

const ASSETS_BASE_URL = process.env.ASSETS_BASE_URL || '';

function assetUrl(key: string | null): string | null {
  if (!key) return null;
  return `${ASSETS_BASE_URL}/${key}`;
}

type AssetItem = {
  kind: 'PHOTO' | 'MODEL_3D' | 'THUMBNAIL';
  asset: {
    storageKey: string | null;
  };
};

type ProductInput = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: Prisma.Decimal;
  currency: string;
  allergens: Prisma.JsonValue;
  dietaryTags: Prisma.JsonValue;
  assets: AssetItem[];
};

type CategoryInput = {
  id: string;
  name: string;
  slug: string;
  products: ProductInput[];
};

type RestaurantInput = {
  id: string;
  name: string;
  slug: string;
  currency: string;
  categories: CategoryInput[];
};

function mapAssets(assets: AssetItem[]): ProductAssetsDto {
  const result: ProductAssetsDto = {
    photo: null,
    model3d: null,
    thumbnail: null,
  };

  for (const a of assets) {
    if (a.kind === 'PHOTO') {
      result.photo = assetUrl(a.asset.storageKey);
    }

    if (a.kind === 'MODEL_3D') {
      result.model3d = assetUrl(a.asset.storageKey);
    }

    if (a.kind === 'THUMBNAIL') {
      result.thumbnail = assetUrl(a.asset.storageKey);
    }
  }

  return result;
}

export function mapProduct(product: ProductInput): ProductDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    currency: product.currency,
    allergens: (product.allergens ?? []) as string[],
    dietaryTags: (product.dietaryTags ?? []) as string[],
    assets: mapAssets(product.assets),
  };
}

function mapCategory(category: CategoryInput): CategoryDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    products: category.products.map(mapProduct),
  };
}

export function mapMenuResponse(restaurant: RestaurantInput): MenuResponseDto {
  return {
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      currency: restaurant.currency,
    },
    categories: restaurant.categories.map(mapCategory),
  };
}
