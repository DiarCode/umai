import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SecurityMiddleware } from './common/middleware/security.middleware';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppConfigModule } from './common/config/config.module';
import { LoggerModule } from 'nestjs-pino';
import { SessionsModule } from './modules/sessions/sessions.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(),
    AppConfigModule,
    PrismaModule,
    SessionsModule,
    MenuModule,
    OrdersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
