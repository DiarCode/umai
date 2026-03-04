import { Body, Controller, Get, Post, Req, Res, NotFoundException} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import type { FastifyReply, FastifyRequest} from 'fastify';
import { CreateSessionFromQrDto } from './dto/sessions.dto';
import { SESSION_MAX_AGE } from './constants/session.constants';
import { CookieService } from '../../../common/cookies/cookie.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('qr')
  async createSession(
    @Body() body: CreateSessionFromQrDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const result = await this.sessionsService.createFromQr(body.code);

    CookieService.assignGuestToken(reply, result.guestToken);

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