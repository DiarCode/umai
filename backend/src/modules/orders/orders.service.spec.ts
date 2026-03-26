import { Test, TestingModule } from '@nestjs/testing'
import { OrdersService } from './orders.service'
import { PrismaService } from '../../common/prisma/prisma.service'
import { NotFoundException, BadRequestException } from '@nestjs/common'

describe('OrdersService', () => {
  let service: OrdersService
  let prisma: any

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile()

    service = module.get<OrdersService>(OrdersService)
  })

  it('should throw if session not found', async () => {
    prisma.$transaction.mockImplementation(async (cb) =>
      cb({
        customerSession: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      }),
    )

    await expect(service.createOrder('token')).rejects.toThrow(
      NotFoundException,
    )
  })

  it('should throw if cart is empty', async () => {
    prisma.$transaction.mockImplementation(async (cb) =>
      cb({
        customerSession: {
          findUnique: jest.fn().mockResolvedValue({
            id: '1',
            restaurantId: 'r1',
            cartItems: [],
          }),
        },
      }),
    )

    await expect(service.createOrder('token')).rejects.toThrow(
      BadRequestException,
    )
  })

  it('should create order successfully', async () => {
    const mockSession = {
      id: '1',
      restaurantId: 'r1',
      restaurant: { currency: 'USD' },
      cartItems: [
        {
          productId: 'p1',
          quantity: 2,
          product: {
            name: 'Pizza',
            price: 10,
          },
        },
      ],
    }

    const tx = {
      customerSession: {
        findUnique: jest.fn().mockResolvedValue(mockSession),
      },
      order: {
        findFirst: jest.fn().mockResolvedValue({ orderNumber: 5 }),
        create: jest.fn().mockResolvedValue({ id: 'order1' }),
      },
      cartItem: {
        deleteMany: jest.fn(),
      },
    }

    prisma.$transaction.mockImplementation(async (cb) => cb(tx))

    const result = await service.createOrder('token')

    expect(tx.order.create).toHaveBeenCalled()
    expect(tx.cartItem.deleteMany).toHaveBeenCalled()
    expect(result).toEqual({ id: 'order1' })
  })
})