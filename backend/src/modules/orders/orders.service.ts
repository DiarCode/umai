import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TAX_RATE, SERVICE_FEE_RATE, OrderStatus } from './orders.constants';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(guestToken: string) {
    return this.prisma.$transaction(async (tx) => {
      const session = await tx.customerSession.findUnique({
        where: { guestToken },
        include: {
          restaurant: true,
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      if (!session.cartItems.length) {
        throw new BadRequestException('Cart is empty');
      }

      const subtotal = session.cartItems.reduce((sum, item) => {
        return sum + item.quantity * Number(item.product.price);
      }, 0);

      const tax = subtotal * TAX_RATE;
      const serviceFee = subtotal * SERVICE_FEE_RATE;
      const total = subtotal + tax + serviceFee;

      const lastOrder = await tx.order.findFirst({
        where: { restaurantId: session.restaurantId },
        orderBy: { orderNumber: 'desc' },
        select: { orderNumber: true },
      });

      const orderNumber = (lastOrder?.orderNumber || 0) + 1;

      const order = await tx.order.create({
        data: {
          restaurantId: session.restaurantId,
          tableSessionId: session.id,
          orderNumber,
          status: OrderStatus.PLACED,
          currency: session.restaurant.currency,
          subtotal: new Prisma.Decimal(subtotal),
          tax: new Prisma.Decimal(tax),
          serviceFee: new Prisma.Decimal(serviceFee),
          total: new Prisma.Decimal(total),
          items: {
            create: session.cartItems.map((item) => {
              const unitPrice = new Prisma.Decimal(item.product.price);
              const quantity = new Prisma.Decimal(item.quantity);
              return {
              productId: item.productId,
              quantity: item.quantity,
              nameSnapshot: item.product.name,
              unitPriceSnapshot: unitPrice,
              totalPriceSnapshot: unitPrice.mul(quantity),
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      await tx.cartItem.deleteMany({
        where: { sessionId: session.id },
      });

      return order;
    });
  }
}
