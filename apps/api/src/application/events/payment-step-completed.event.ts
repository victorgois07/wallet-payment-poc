import type { StepNameEnum } from '../../domain/enums';

export class PaymentStepCompletedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly step: StepNameEnum,
    public readonly timeMs: number,
    public readonly correlationId: string,
  ) {}
}
