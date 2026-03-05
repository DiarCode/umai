import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { mapMenuResponse } from './menu.mapper'
import { MenuResponseDto } from './dto/menu-response.dto'
import { ProductAssetsDto } from './dto/menu-response.dto'

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getMenu(
    restaurantSlug: string,
    category?: string,
    dietary?: string,
  ): Promise<MenuResponseDto> {

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
            ...(category && { slug: category }),
          },
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            products: {
              where: {
                isAvailable: true,
                ...(dietary && {
                  dietaryTags: {
                    has: dietary,
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
    })

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found')
    }

    return mapMenuResponse(restaurant)
  }

  async getProduct(restaurantSlug: string, productId: string) {

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        isAvailable: true,
        restaurant: {
          slug: restaurantSlug,
        },
      },
      include: {
        assets: {
          include: {
            asset: true,
          },
        },
        category: true,
      },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const assets: ProductAssetsDto= {
      photo: null,
      model3d: null,
      thumbnail: null,
    }

    for (const a of product.assets) {
      if (a.kind === 'PHOTO') {
        assets.photo = a.asset.storageKey
      }

      if (a.kind === 'MODEL_3D') {
        assets.model3d = a.asset.storageKey
      }

      if (a.kind === 'THUMBNAIL') {
        assets.thumbnail = a.asset.storageKey
      }
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      currency: product.currency,
      allergens: product.allergens,
      dietaryTags: product.dietaryTags,
      assets,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
    }
  }
}