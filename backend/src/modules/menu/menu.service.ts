import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { mapMenuResponse } from './menu.mapper';
import { MenuResponseDto } from './dto/menu-response.dto';
import * as menuMapper from './menu.mapper';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getMenu(
    restaurantSlug: string,
    category?: string,
    dietary?: string,
  ): Promise<MenuResponseDto> {
    const normalizedCategory = category?.toLowerCase().trim();
    const normalizedDietary = dietary?.toLowerCase().trim();

    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        slug: restaurantSlug,
        isActive: true,
        deletedAt: null,
      },
      include: {
        categories: {
          where: {
            isActive: true,
            ...(normalizedCategory && { slug: normalizedCategory }),
          },
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            products: {
              where: {
                isAvailable: true,
                ...(normalizedDietary && {
                  dietaryTags: {
                    has: normalizedDietary,
                  },
                }),
              },
              orderBy: {
                sortOrder: 'asc',
              },
              include: {
                assets: {
                  include: {
                    asset: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return mapMenuResponse(restaurant);
  }

  async getProduct(restaurantSlug: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        isAvailable: true,
        restaurant: {
          slug: restaurantSlug,
          isActive: true,
          deletedAt: null,
        },
        OR: [
          { category: null },
          {
            category: {
              isActive: true,
            },
          },
        ],
      },
      include: {
        assets: {
          orderBy: {
            id: 'asc',
          },
          include: {
            asset: true,
          },
        },
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      ...menuMapper.mapProduct(product),
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
    };
  }
}
