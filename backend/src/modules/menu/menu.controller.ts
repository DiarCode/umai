import { Controller, Get, Param, Query, Header } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuQueryDto } from './dto/menu-query.dto';
import { MenuParamDto } from './dto/menu-param.dto';
import { ProductParamDto } from './dto/product-param.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get(':restaurantSlug')
  @Header('Cache-Control', 'public, max-age=60')
  async getMenu(@Param() params: MenuParamDto, @Query() query: MenuQueryDto) {
    return this.menuService.getMenu(
      params.restaurantSlug,
      query.category,
      query.dietary,
    );
  }

  @Get(':restaurantSlug/products/:id')
  @Header('Cache-Control', 'public, max-age=60')
  async getProduct(@Param() params: ProductParamDto) {
    return this.menuService.getProduct(params.restaurantSlug, params.id);
  }
}
