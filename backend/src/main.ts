import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import 'module-alias/register';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AppConfigService } from './common/config/config.service';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    logger: false, // NestJS Pino will handle logging
    trustProxy: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      rawBody: true,
    },
  );

  const appConfig = app.get(AppConfigService);
  const isProd = appConfig.isProduction;
  // Set global prefix
  app.setGlobalPrefix('/api/v1');

  // 1. Cookie plugin (replaces cookie-parser)
  await app.register(fastifyCookie, {
    secret: process.env.JWT_SECRET ?? undefined,
    parseOptions: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
    },
  });

  // 2. Helmet plugin (replaces helmet middleware)
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: isProd ? undefined : false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'no-referrer' },
    hsts: isProd
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
    global: true,
  });

  // 3. CORS plugin (replaces app.enableCors)
  await app.register(fastifyCors, {
    origin: appConfig.security.backendCorsOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Virtual-Request-Id',
    ],
    exposedHeaders: ['Content-Disposition'],
  });

  // 4. Compression plugin (replaces compression middleware)
  await app.register(fastifyCompress);

  // 5. Multipart support (for file uploads)
  await app.register(fastifyMultipart);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: isProd,
    }),
  );

  // Logging setup
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Swagger documentation (only in non-production)
  if (!isProd) {
    // Register Fastify Swagger plugin
    await app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'JINAQ API',
          description: 'JINAQ API Documentation',
          version: '1.0.0',
        },
        tags: [{ name: 'jinaq', description: 'JINAQ endpoints' }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    });

    // Register Swagger UI
    await app.register(fastifySwaggerUi, {
      routePrefix: '/api',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
      },
      staticCSP: false,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject) => swaggerObject,
      transformSpecificationClone: true,
    });
  }

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
  signals.forEach((signal) => {
    process.on(signal, () => {
      logger.log(`Received ${signal}, closing application...`, 'Bootstrap');
      void app.close();
      process.exit(0);
    });
  });

  // Start server
  const port = process.env.SERVER_PORT ?? 8080;

  await app.listen(port, '0.0.0.0');

  logger.log(
    `🚀 Application is running on: http://0.0.0.0:${port}/api/v1`,
    'Bootstrap',
  );

  if (!isProd) {
    logger.log(
      `📚 Swagger documentation: http://0.0.0.0:${port}/api`,
      'Bootstrap',
    );
  }
}

void bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
