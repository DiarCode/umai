import { Body, Controller, Get, Post, Req, Res, NotFoundException} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import type { FastifyReply, FastifyRequest} from 'fastify';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('qr')
  async createSession(
    @Body() body: { code: string },
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const result = await this.sessionsService.createFromQr(body.code);

  reply.setCookie('guest_token', result.session.guestToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 4,
  });

  return {
    restaurant: result.restaurant,
    table: result.table,
  };
}

@Get('me')
async getSession(@Req() req: FastifyRequest) {
  const token = req.cookies?.guest_token;

  if (!token) {
    throw new NotFoundException('Session not found');
  }

  return this.sessionsService.getSession(token);
}
}