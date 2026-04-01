import { IsString, Matches } from 'class-validator';

export class MenuParamDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  restaurantSlug: string;
}