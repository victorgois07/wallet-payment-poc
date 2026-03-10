import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ERROR_TYPES } from '@wallet/shared';
import type { Response } from 'express';

function getDetailFromResponse(exceptionResponse: unknown, fallback: string): string {
  if (typeof exceptionResponse !== 'object' || exceptionResponse === null) {
    return fallback;
  }
  const resp = exceptionResponse as Record<string, unknown>;
  const msg = resp.message;
  if (typeof msg === 'string') return msg;
  if (Array.isArray(msg)) return msg.join(', ');
  return fallback;
}

const VALIDATION_ERROR_MESSAGES = [
  'Invalid card number',
  'Invalid amount',
  'Invalid expiration date',
  'Invalid CVV',
];

function getTypeAndTitleForStatus(status: number): { type: string; title: string } | null {
  if (status === HttpStatus.BAD_REQUEST) {
    return { type: ERROR_TYPES.VALIDATION_ERROR, title: 'Validation Error' };
  }
  if (status === HttpStatus.PAYMENT_REQUIRED) {
    return { type: ERROR_TYPES.PAYMENT_REFUSED, title: 'Payment Refused' };
  }
  if (status === HttpStatus.TOO_MANY_REQUESTS) {
    return { type: ERROR_TYPES.RATE_LIMIT, title: 'Rate Limit Exceeded' };
  }
  if (status === HttpStatus.NOT_FOUND) {
    return { type: 'https://api.wallet.com/errors/not-found', title: 'Not Found' };
  }
  return null;
}

function resolveErrorAsValidation(message: string): {
  status: number;
  type: string;
  title: string;
} | null {
  if (!VALIDATION_ERROR_MESSAGES.includes(message)) return null;
  return {
    status: HttpStatus.BAD_REQUEST,
    type: ERROR_TYPES.VALIDATION_ERROR,
    title: 'Validation Error',
  };
}

interface ResolvedProblem {
  status: number;
  type: string;
  title: string;
  detail: string;
}

function resolveFromHttpException(exception: HttpException): ResolvedProblem {
  const status = exception.getStatus();
  const exceptionResponse = exception.getResponse();
  const detail = getDetailFromResponse(
    exceptionResponse,
    exception instanceof Error ? exception.message : String(exception),
  );
  const resolved = getTypeAndTitleForStatus(status);
  const type = resolved?.type ?? ERROR_TYPES.INTERNAL_ERROR;
  const title = resolved?.title ?? 'Internal Server Error';
  return { status, type, title, detail };
}

function resolveFromError(exception: Error): ResolvedProblem {
  const detail = exception.message;
  const validation = resolveErrorAsValidation(detail);
  if (validation !== null) {
    return { ...validation, detail };
  }
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ERROR_TYPES.INTERNAL_ERROR,
    title: 'Internal Server Error',
    detail,
  };
}

function resolveProblem(exception: unknown): ResolvedProblem {
  const fallback: ResolvedProblem = {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ERROR_TYPES.INTERNAL_ERROR,
    title: 'Internal Server Error',
    detail: 'An unexpected error occurred',
  };
  if (exception instanceof HttpException) {
    return resolveFromHttpException(exception);
  }
  if (exception instanceof Error) {
    return resolveFromError(exception);
  }
  return fallback;
}

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const { status, type, title, detail } = resolveProblem(exception);

    const path = (request.path ?? String(request.url ?? '').split('?')[0] ?? '') as string;
    const isIgnoredNotFound =
      status === HttpStatus.NOT_FOUND &&
      (path === '/favicon.ico' || path === '/mockServiceWorker.js');

    if (isIgnoredNotFound) {
      this.logger.debug(`Not found (browser request): ${path}`);
    } else {
      this.logger.error(
        `${title}: ${detail}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      type,
      title,
      status,
      detail,
      instance: request.url,
    });
  }
}
