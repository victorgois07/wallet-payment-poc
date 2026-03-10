import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get(ConfigService);
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Security (CSP relaxed for /docs – Scalar loads scripts from CDN and uses inline scripts)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          'script-src-attr': ["'unsafe-inline'"],
        },
      },
    }),
  );
  app.use(compression());

  // CORS
  const origins = config.get<string>('CORS_ORIGINS', 'http://localhost:8081');
  app.enableCors({
    origin: origins.split(',').map((o) => o.trim()),
    methods: 'GET,POST',
    credentials: true,
  });

  // Versioning
  app.enableVersioning({ type: VersioningType.URI });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger + Scalar
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Wallet Payment API')
    .setDescription('Payment processing PoC with dual strategy pipeline (sequential & parallel)')
    .setVersion('1.0')
    .addTag('Payments', 'Payment processing endpoints')
    .addTag('Health', 'Health check endpoint')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  // Scalar UI
  const { apiReference } = await import('@scalar/nestjs-api-reference');
  app.use(
    '/docs',
    apiReference({
      spec: { content: document },
    }),
  );

  const port = config.get<number>('API_PORT', 3000);
  const host = config.get<string>('API_HOST', '0.0.0.0');

  await app.listen(port, host);
  logger.log(`API running on http://${host}:${port}`);
  logger.log(`Swagger: http://localhost:${port}/api-docs`);
  logger.log(`Scalar: http://localhost:${port}/docs`);
  logger.log(`Strategy: ${config.get('PAYMENT_STRATEGY', 'parallel')}`);
}

bootstrap();
