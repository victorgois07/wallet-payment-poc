import { Injectable, Logger } from '@nestjs/common';
import {
  ConsecutiveBreaker,
  circuitBreaker,
  ExponentialBackoff,
  handleAll,
  retry,
  TimeoutStrategy,
  timeout,
  wrap,
} from 'cockatiel';

@Injectable()
export class ResiliencePolicy {
  private readonly logger = new Logger(ResiliencePolicy.name);
  private readonly composedPolicy;
  private readonly cbPolicy;

  constructor() {
    const retryPolicy = retry(handleAll, {
      maxAttempts: 3,
      backoff: new ExponentialBackoff({ initialDelay: 100, maxDelay: 2000 }),
    });

    retryPolicy.onRetry((data) => {
      this.logger.warn(`Retry attempt ${data.attempt} after error`);
    });

    this.cbPolicy = circuitBreaker(handleAll, {
      halfOpenAfter: 10_000,
      breaker: new ConsecutiveBreaker(5),
    });

    this.cbPolicy.onStateChange((state) => {
      this.logger.warn(`Circuit breaker state changed to: ${state}`);
    });

    const timeoutPolicy = timeout(5_000, TimeoutStrategy.Aggressive);

    this.composedPolicy = wrap(retryPolicy, this.cbPolicy, timeoutPolicy);
  }

  async execute<T>(fn: (context: { signal: AbortSignal }) => Promise<T>): Promise<T> {
    return this.composedPolicy.execute(fn);
  }

  getCircuitState(): string {
    return String(this.cbPolicy.state);
  }
}
