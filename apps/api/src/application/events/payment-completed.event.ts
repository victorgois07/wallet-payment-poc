import type { PaymentStatusEnum, StrategyTypeEnum } from '../../domain/enums';
import type { StepResult } from '../../domain/interfaces';

export class PaymentCompletedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly status: PaymentStatusEnum,
    public readonly totalTimeMs: number,
    public readonly strategy: StrategyTypeEnum,
    public readonly steps: StepResult[],
    public readonly correlationId: string,
  ) {}
}
