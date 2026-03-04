import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionFromQrDto } from './dto/sessions.dto';
import type { FastifyReply } from 'fastify';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('qr')
  async createSession(
    @Body() body: CreateSessionFromQrDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const result = await this.sessionsService.createFromQr(body.code);

    reply.setCookie('guest_token', result.session.guestToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires: result.session.expiresAt,
    });

    return {
      restaurant: result.restaurant,
      table: result.table,
    };
  }
}