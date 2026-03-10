import type { PaymentEntity } from '../entities';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IPaymentRepository {
  save(payment: PaymentEntity): Promise<PaymentEntity>;
  findByTransactionId(transactionId: string): Promise<PaymentEntity | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<PaymentEntity>>;
}

export const PAYMENT_REPOSITORY = Symbol('IPaymentRepository');
