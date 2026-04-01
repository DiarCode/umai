import { IsOptional, IsString } from 'class-validator';

export class MenuQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  dietary?: string;
}