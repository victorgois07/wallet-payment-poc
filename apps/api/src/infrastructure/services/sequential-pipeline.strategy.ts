import { Injectable, Logger } from '@nestjs/common';
import { SEQUENTIAL_ORDER } from '@wallet/shared';
import type { StepNameEnum } from '../../domain/enums';
import type {
  IPaymentPipeline,
  PipelineResult,
  StepCompletedCallback,
  StepResult,
} from '../../domain/interfaces';
// biome-ignore lint/style/useImportType: Nest DI requires runtime reference
import { ResiliencePolicy } from '../policies/resilience.policy';
// biome-ignore lint/style/useImportType: Nest DI requires runtime reference
import { MockStepService } from './mock-step.service';

@Injectable()
export class SequentialPipelineStrategy implements IPaymentPipeline {
  public readonly strategy = 'sequential';
  private readonly logger = new Logger(SequentialPipelineStrategy.name);

  constructor(
    private readonly mockStepService: MockStepService,
    private readonly resiliencePolicy: ResiliencePolicy,
  ) {}

  async execute(onStepCompleted?: StepCompletedCallback): Promise<PipelineResult> {
    const steps: StepResult[] = [];
    const startTime = Date.now();

    for (const stepName of SEQUENTIAL_ORDER) {
      const step = stepName as unknown as StepNameEnum;
      this.logger.log(`Executing step: ${step}`);

      const timeMs = await this.resiliencePolicy.execute(async () => {
        return this.mockStepService.executeStep(step);
      });

      steps.push({ step, timeMs });
      onStepCompleted?.(step, timeMs);
    }

    return {
      steps,
      totalTimeMs: Date.now() - startTime,
    };
  }
}
