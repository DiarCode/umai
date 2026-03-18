import { ProductAssetsDto } from './menu-response.dto';

export class ProductCategoryDto {
  id: string;
  name: string;
  slug: string;
}

export class ProductResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  allergens: string[];
  dietaryTags: string[];
  assets: ProductAssetsDto;
  category: ProductCategoryDto | null;
}
