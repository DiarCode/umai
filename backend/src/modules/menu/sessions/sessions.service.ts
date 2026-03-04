import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { QrResponse } from './sessions.types';
import { mapToQrResponse } from './sessions.mapper';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromQr(code: string): Promise<QrResponse> {
    const table = await this.prisma.restaurantTable.findUnique({
      where: { qrCode: code },
      include: { restaurant: true },
    });

    if (!table) {
      throw new NotFoundException('Invalid QR code');
    }

    if (!table.isActive) {
      throw new ForbiddenException('Table inactive');
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

    return mapToQrResponse(table, session.guestToken);
  }

  async getSession(token: string): Promise<QrResponse> {
    const session = await this.prisma.customerSession.findUnique({
      where: { guestToken: token },
      include: {
        restaurant: true,
        table: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.expiresAt < new Date()) {
      throw new ForbiddenException('Session expired');
    }

    return {
      guestToken: session.guestToken,
      restaurant: {
        id: session.restaurant.id,
        name: session.restaurant.name,
      },
      table: {
        id: session.table.id,
        label: session.table.label,
      },
    };
  }
}