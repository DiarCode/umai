/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

jest.mock('./menu.mapper', () => ({
  mapProduct: jest.fn((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price.toString(),
    currency: product.currency,
    allergens: product.allergens,
    dietaryTags: product.dietaryTags,
    assets: [],
  })),
  mapMenuResponse: jest.fn((restaurant) => ({
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      currency: restaurant.currency,
    },
    categories: restaurant.categories || [],
  })),
}));

describe('MenuService', () => {
  let service: MenuService;
  let prisma: PrismaService;

  const mockPrisma = {
    restaurant: {
      findFirst: jest.fn(),
    },
    product: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMenu', () => {
    it('should return menu', async () => {
      mockPrisma.restaurant.findFirst.mockResolvedValue({
        id: '1',
        name: 'Test',
        slug: 'test',
        currency: 'USD',
        categories: [],
      });

      const result = await service.getMenu('test');

      expect(result).toBeDefined();
      expect(result.restaurant.slug).toBe('test');
    });

    it('should throw if restaurant not found', async () => {
      mockPrisma.restaurant.findFirst.mockResolvedValue(null);

      await expect(service.getMenu('wrong')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProduct', () => {
    it('should return product', async () => {
      mockPrisma.product.findFirst.mockResolvedValue({
        id: '1',
        name: 'Pizza',
        slug: 'pizza',
        description: '',
        price: { toString: () => '10.00' },
        currency: 'USD',
        allergens: [],
        dietaryTags: [],
        assets: [],
        category: null,
      });

      const result = await service.getProduct('test', 'uuid');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.name).toBe('Pizza');
    });

    it('should throw if product not found', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(null);

      await expect(service.getProduct('test', 'wrong')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
