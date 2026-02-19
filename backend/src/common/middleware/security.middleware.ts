import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private readonly appConfigService: AppConfigService) {}

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const { allowedHosts } = this.appConfigService.security;
    const host = req.headers.host?.split(':')[0]; // Remove port if present

    if (allowedHosts.length > 0 && host && !allowedHosts.includes(host)) {
      throw new BadRequestException('Invalid Host Header');
    }
    next();
  }
}
