import { CacheModule } from '@nestjs/cache-manager';
import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
// Application
import { CreatePaymentHandler } from './application/commands';
import { PaymentCompletedHandler, PaymentStepCompletedHandler } from './application/events';
import { GetPaymentHandler, ListPaymentsHandler } from './application/queries';
import { validateEnv } from './config/env.config';
// Domain
import { PaymentEntity, PaymentStepEntity } from './domain/entities';
import { PAYMENT_PIPELINE, PAYMENT_REPOSITORY } from './domain/interfaces';
import { ResiliencePolicy } from './infrastructure/policies/resilience.policy';
// Infrastructure
import { PaymentRepository } from './infrastructure/repositories/payment.repository';
import { MockStepService } from './infrastructure/services/mock-step.service';
import { ParallelPipelineStrategy } from './infrastructure/services/parallel-pipeline.strategy';
import { PipelineFactory } from './infrastructure/services/pipeline.factory';
import { SequentialPipelineStrategy } from './infrastructure/services/sequential-pipeline.strategy';
import { HealthController } from './presentation/controllers/health.controller';
// Presentation
import { PaymentController } from './presentation/controllers/payment.controller';
import { ProblemDetailsFilter } from './presentation/filters/problem-details.filter';
import { LoggingInterceptor } from './presentation/interceptors/logging.interceptor';
import { CorrelationIdMiddleware } from './presentation/middleware/correlation-id.middleware';

const commandHandlers = [CreatePaymentHandler];
const queryHandlers = [GetPaymentHandler, ListPaymentsHandler];
const eventHandlers = [PaymentStepCompletedHandler, PaymentCompletedHandler];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: '../../.env',
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = process.env.NODE_ENV === 'production';
        return {
          pinoHttp: {
            level: config.get('LOG_LEVEL', 'info'),
            ...(isProd
              ? {}
              : { transport: { target: 'pino-pretty', options: { colorize: true } } }),
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType =
          (process.env.DB_TYPE as 'sqlite' | 'sqljs') ??
          config.get<'sqlite' | 'sqljs'>('DB_TYPE', 'sqlite');
        const base = {
          entities: [PaymentEntity, PaymentStepEntity],
          synchronize: true,
        };
        if (dbType === 'sqljs') {
          return { ...base, type: 'sqljs' as const };
        }
        return {
          ...base,
          type: 'better-sqlite3' as const,
          database: config.get<string>('DB_DATABASE', 'wallet.sqlite') as string,
        };
      },
    }),
    TypeOrmModule.forFeature([PaymentEntity, PaymentStepEntity]),
    CqrsModule,
    TerminusModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 10),
          },
        ],
      }),
    }),
    CacheModule.register({ isGlobal: true, ttl: 5000 }),
  ],
  controllers: [PaymentController, HealthController],
  providers: [
    // CQRS Handlers
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,

    // Infrastructure
    MockStepService,
    ResiliencePolicy,
    SequentialPipelineStrategy,
    ParallelPipelineStrategy,
    PipelineFactory,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentRepository,
    },
    {
      provide: PAYMENT_PIPELINE,
      useFactory: (factory: PipelineFactory, config: ConfigService) => {
        const strategy = config.get('PAYMENT_STRATEGY', 'parallel');
        return factory.create(strategy);
      },
      inject: [PipelineFactory, ConfigService],
    },

    // Global providers
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: ProblemDetailsFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
