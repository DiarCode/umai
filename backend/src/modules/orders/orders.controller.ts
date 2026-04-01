import {Controller, Post, Req, NotFoundException, Get, Query} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';

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

  /* @Get('restaurant')
  async getRestaurantOrders(
    @Query('status') status?: OrderStatus,  
  ) {
    const restaurantId = Req.user.restaurantId; // пока jwt нету не будет работать, потом нужно будет юзера доставать из реквеста и оттуда брать ресторан айди  

    return this.ordersService.getRestaurantOrders(
      restaurantId,
      status,
    );
  }
    */
}