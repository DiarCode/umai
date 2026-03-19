import { Controller, Post, Req, NotFoundException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Req() req: FastifyRequest) {
    const guestToken = req.cookies?.guest_token;

    if (!guestToken) {
      throw new NotFoundException('Session not found');
    }

    return this.ordersService.createOrder(guestToken);
  }
}
