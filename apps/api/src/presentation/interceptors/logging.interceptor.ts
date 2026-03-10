import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const correlationId = req.headers['x-correlation-id'] ?? 'unknown';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const elapsed = Date.now() - startTime;
          this.logger.log(
            `${method} ${url} ${res.statusCode} ${elapsed}ms | correlationId=${correlationId}`,
          );
        },
        error: (err) => {
          const elapsed = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} ${err.status ?? 500} ${elapsed}ms | correlationId=${correlationId} | error=${err.message}`,
          );
        },
      }),
    );
  }
}
