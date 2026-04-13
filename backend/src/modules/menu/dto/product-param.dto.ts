import { IsUUID, IsString, Matches } from 'class-validator';

export class ProductParamDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  restaurantSlug: string;

  @IsUUID()
  id: string;
}