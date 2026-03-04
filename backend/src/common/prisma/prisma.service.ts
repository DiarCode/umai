import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const url = config.get<string>('DATABASE_URL');

    if (!url) {
      throw new Error('DATABASE_URL is undefined');
    }

    const adapter = new PrismaPg({ connectionString: url });

    super({ adapter });
  }
}
