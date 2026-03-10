import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Sse,
  UseInterceptors,
  Version,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: Nest DI requires runtime reference for CommandBus and QueryBus
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { type Observable, Subject } from 'rxjs';
import type { CreatePaymentResult } from '../../application/commands';
import { CreatePaymentCommand } from '../../application/commands';
import { GetPaymentQuery, ListPaymentsQuery } from '../../application/queries';
import type { PaymentEntity } from '../../domain/entities';
import type { PaginatedResult } from '../../domain/interfaces';
import type { CreatePaymentDto } from '../dto/create-payment.dto';
import type { ListPaymentsDto } from '../dto/list-payments.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  private readonly sseSubjects = new Map<string, Subject<MessageEvent>>();

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 402, description: 'Payment refused' })
  async createPayment(
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ): Promise<CreatePaymentResult> {
    const correlationId = (req.headers['x-correlation-id'] as string) ?? 'unknown';

    const result = await this.commandBus.execute<CreatePaymentCommand, CreatePaymentResult>(
      new CreatePaymentCommand(
        dto.cardNumber,
        dto.expirationDate,
        dto.cvv,
        dto.cardholderName,
        dto.amount,
        correlationId,
      ),
    );

    const subject = this.sseSubjects.get(result.transactionId);
    if (subject) {
      subject.complete();
      this.sseSubjects.delete(result.transactionId);
    }

    return result;
  }

  @Get()
  @Version('1')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'List all payments with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of payments' })
  async listPayments(@Query() dto: ListPaymentsDto): Promise<PaginatedResult<PaymentEntity>> {
    return this.queryBus.execute(new ListPaymentsQuery(dto.page, dto.limit));
  }

  @Get(':transactionId')
  @Version('1')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get payment by transaction ID' })
  @ApiParam({ name: 'transactionId', description: 'ULID transaction identifier' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(@Param('transactionId') transactionId: string): Promise<PaymentEntity> {
    return this.queryBus.execute(new GetPaymentQuery(transactionId));
  }

  @Sse(':transactionId/events')
  @Version('1')
  @ApiOperation({ summary: 'Subscribe to payment processing events via SSE' })
  sseEvents(@Param('transactionId') transactionId: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    this.sseSubjects.set(transactionId, subject);

    return subject.asObservable();
  }

  emitStepEvent(transactionId: string, data: Record<string, unknown>): void {
    const subject = this.sseSubjects.get(transactionId);
    if (subject) {
      subject.next({ data: JSON.stringify(data) } as MessageEvent);
    }
  }
}
