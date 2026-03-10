import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { PaymentEntity } from '../../domain/entities';
import type { IPaymentRepository, PaginatedResult } from '../../domain/interfaces';
import { PAYMENT_REPOSITORY } from '../../domain/interfaces';
import { ListPaymentsQuery } from './list-payments.query';

@QueryHandler(ListPaymentsQuery)
export class ListPaymentsHandler implements IQueryHandler<ListPaymentsQuery> {
  constructor(@Inject(PAYMENT_REPOSITORY) private readonly paymentRepository: IPaymentRepository) {}

  async execute(query: ListPaymentsQuery): Promise<PaginatedResult<PaymentEntity>> {
    return this.paymentRepository.findAll({
      page: query.page,
      limit: query.limit,
    });
  }
}
