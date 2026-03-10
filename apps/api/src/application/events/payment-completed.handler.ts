import { Logger } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';
import { PaymentCompletedEvent } from './payment-completed.event';

@EventsHandler(PaymentCompletedEvent)
export class PaymentCompletedHandler implements IEventHandler<PaymentCompletedEvent> {
  private readonly logger = new Logger(PaymentCompletedHandler.name);

  handle(event: PaymentCompletedEvent): void {
    this.logger.log(
      `Payment completed: ${event.status} | txn=${event.transactionId} | totalTime=${event.totalTimeMs}ms | strategy=${event.strategy} | correlationId=${event.correlationId}`,
    );
  }
}
