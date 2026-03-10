export const STEP_NAMES = [
  'account_validation',
  'card_validation',
  'anti_fraud',
  'acquirer_processing',
  'payment',
  'notification',
] as const;

export type StepName = (typeof STEP_NAMES)[number];

export const PAYMENT_STATUSES = ['approved', 'refused', 'error'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const STRATEGY_TYPES = ['sequential', 'parallel'] as const;
export type StrategyType = (typeof STRATEGY_TYPES)[number];

export interface PaymentStepResult {
  step: StepName;
  timeMs: number;
  order?: number;
}

export interface PaymentRequest {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardholderName: string;
  amount: number;
}

export interface PaymentResponse {
  status: PaymentStatus;
  transactionId: string;
  totalTimeMs: number;
  strategy: StrategyType;
  steps: PaymentStepResult[];
  amount?: number;
  cardLastFour?: string;
  createdAt?: string;
}

export interface PaymentStepEvent {
  step: StepName;
  timeMs: number;
  completedAt: string;
  order?: number;
}

export interface PaymentSseEvent {
  type: 'step_completed' | 'payment_completed' | 'payment_failed';
  data: PaymentStepEvent | PaymentResponse;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}
