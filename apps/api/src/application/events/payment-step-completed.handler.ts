import { Logger } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';
import { PaymentStepCompletedEvent } from './payment-step-completed.event';

@EventsHandler(PaymentStepCompletedEvent)
export class PaymentStepCompletedHandler implements IEventHandler<PaymentStepCompletedEvent> {
  private readonly logger = new Logger(PaymentStepCompletedHandler.name);

  handle(event: PaymentStepCompletedEvent): void {
    this.logger.log(
      `Step completed: ${event.step} (${event.timeMs}ms) | txn=${event.transactionId} | correlationId=${event.correlationId}`,
    );
  }
}
