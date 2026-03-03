import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

async createFromQr(code: string) {
  try {
    const table = await this.prisma.restaurantTable.findUnique({
      where: { qrCode: code },
      include: { restaurant: true },
    });

    if (!table) {
      throw new NotFoundException('Invalid QR code');
    }

    if (!table.isActive) {
      throw new ForbiddenException('Table is inactive');
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 4);

    const session = await this.prisma.customerSession.create({
      data: {
        restaurantId: table.restaurantId,
        tableId: table.id,
        guestToken: randomUUID(),
        expiresAt,
      },
    });

    return { session, restaurant: table.restaurant, table };

  } catch (error) {
    console.error('REAL ERROR:', error);
    throw error;
  }
}
}