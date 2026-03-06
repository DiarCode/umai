import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


import { SecurityMiddleware } from './common/middleware/security.middleware';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppConfigModule } from './common/config/config.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './modules/menu/sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(),
    AppConfigModule,
    PrismaModule,
    AuthModule,
    SessionsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}



