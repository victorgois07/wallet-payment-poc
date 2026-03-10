import { BadRequestException, Inject, Logger } from '@nestjs/common';
// biome-ignore lint/style/useImportType: Nest DI requires runtime reference for ConfigService
import { ConfigService } from '@nestjs/config';
// biome-ignore lint/style/useImportType: Nest DI requires runtime reference for EventBus
import { CommandHandler, EventBus, type ICommandHandler } from '@nestjs/cqrs';
import { PaymentEntity, PaymentStepEntity } from '../../domain/entities';
import { PaymentStatusEnum } from '../../domain/enums';
import type { IPaymentPipeline, IPaymentRepository, StepResult } from '../../domain/interfaces';
import { PAYMENT_PIPELINE, PAYMENT_REPOSITORY } from '../../domain/interfaces';
import { CardNumber, Money, TransactionId } from '../../domain/value-objects';
import { PaymentCompletedEvent } from '../events/payment-completed.event';
import { PaymentStepCompletedEvent } from '../events/payment-step-completed.event';
import { CreatePaymentCommand } from './create-payment.command';

export interface CreatePaymentResult {
  transactionId: string;
  status: PaymentStatusEnum;
  totalTimeMs: number;
  strategy: string;
  steps: StepResult[];
}

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  private readonly logger = new Logger(CreatePaymentHandler.name);
  private readonly failureRate: number;

  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_PIPELINE) private readonly pipeline: IPaymentPipeline,
    private readonly eventBus: EventBus,
    private readonly configService: ConfigService,
  ) {
    this.failureRate = this.configService.get<number>('PAYMENT_FAILURE_RATE', 0.1);
  }

  async execute(command: CreatePaymentCommand): Promise<CreatePaymentResult> {
    let money: ReturnType<typeof Money.create>;
    let cardNumber: ReturnType<typeof CardNumber.create>;
    try {
      money = Money.create(command.amount);
      cardNumber = CardNumber.create(command.cardNumber);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid payment data';
      throw new BadRequestException({ message });
    }
    const transactionId = TransactionId.generate();

    this.logger.log(
      `Processing payment ${transactionId.value} | amount=${money.value} | correlationId=${command.correlationId}`,
    );

    const shouldRefuse = Math.random() < this.failureRate;

    const payment = new PaymentEntity();
    payment.transactionId = transactionId.value;
    payment.amount = money.value;
    payment.cardLastFour = cardNumber.lastFour;
    payment.cardholderName = command.cardholderName;
    payment.strategy = this.pipeline.strategy as PaymentEntity['strategy'];
    payment.status = PaymentStatusEnum.PROCESSING;
    payment.steps = [];

    await this.paymentRepository.save(payment);

    try {
      const result = await this.pipeline.execute((step, timeMs) => {
        this.eventBus.publish(
          new PaymentStepCompletedEvent(transactionId.value, step, timeMs, command.correlationId),
        );
      });

      payment.status = shouldRefuse ? PaymentStatusEnum.REFUSED : PaymentStatusEnum.APPROVED;
      payment.totalTimeMs = result.totalTimeMs;

      payment.steps = result.steps.map((s, index) => {
        const stepEntity = new PaymentStepEntity();
        stepEntity.step = s.step;
        stepEntity.timeMs = s.timeMs;
        stepEntity.order = index;
        stepEntity.completedAt = new Date();
        return stepEntity;
      });

      await this.paymentRepository.save(payment);

      this.eventBus.publish(
        new PaymentCompletedEvent(
          transactionId.value,
          payment.status,
          result.totalTimeMs,
          payment.strategy,
          result.steps,
          command.correlationId,
        ),
      );

      return {
        transactionId: transactionId.value,
        status: payment.status,
        totalTimeMs: result.totalTimeMs,
        strategy: payment.strategy,
        steps: result.steps,
      };
    } catch (error) {
      payment.status = PaymentStatusEnum.ERROR;
      await this.paymentRepository.save(payment);
      throw error;
    }
  }
}
