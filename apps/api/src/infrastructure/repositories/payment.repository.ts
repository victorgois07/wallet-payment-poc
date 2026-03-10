import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { PaymentEntity } from '../../domain/entities';
import type {
  IPaymentRepository,
  PaginatedResult,
  PaginationOptions,
} from '../../domain/interfaces';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly repo: Repository<PaymentEntity>,
  ) {}

  async save(payment: PaymentEntity): Promise<PaymentEntity> {
    return this.repo.save(payment);
  }

  async findByTransactionId(transactionId: string): Promise<PaymentEntity | null> {
    return this.repo.findOne({
      where: { transactionId },
      relations: ['steps'],
      order: { steps: { order: 'ASC' } },
    });
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<PaymentEntity>> {
    const [data, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      take: options.limit,
      skip: (options.page - 1) * options.limit,
      relations: ['steps'],
    });

    return {
      data,
      meta: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }
}
