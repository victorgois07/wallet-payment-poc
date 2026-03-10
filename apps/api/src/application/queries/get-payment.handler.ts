import { Inject, NotFoundException } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { PaymentEntity } from '../../domain/entities';
import type { IPaymentRepository } from '../../domain/interfaces';
import { PAYMENT_REPOSITORY } from '../../domain/interfaces';
import { GetPaymentQuery } from './get-payment.query';

@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler implements IQueryHandler<GetPaymentQuery> {
  constructor(@Inject(PAYMENT_REPOSITORY) private readonly paymentRepository: IPaymentRepository) {}

  async execute(query: GetPaymentQuery): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findByTransactionId(query.transactionId);
    if (!payment) {
      throw new NotFoundException(`Payment ${query.transactionId} not found`);
    }
    return payment;
  }
}
