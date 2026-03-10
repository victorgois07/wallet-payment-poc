import { Injectable, Logger } from '@nestjs/common';
import { PARALLEL_DAG } from '@wallet/shared';
import type { StepNameEnum } from '../../domain/enums';
import type {
  IPaymentPipeline,
  PipelineResult,
  StepCompletedCallback,
  StepResult,
} from '../../domain/interfaces';
import { ResiliencePolicy } from '../policies/resilience.policy';
import { MockStepService } from './mock-step.service';

@Injectable()
export class ParallelPipelineStrategy implements IPaymentPipeline {
  public readonly strategy = 'parallel';
  private readonly logger = new Logger(ParallelPipelineStrategy.name);

  constructor(
    private readonly mockStepService: MockStepService,
    private readonly resiliencePolicy: ResiliencePolicy,
  ) { }

  async execute(onStepCompleted?: StepCompletedCallback): Promise<PipelineResult> {
    const steps: StepResult[] = [];
    const startTime = Date.now();

    for (const group of PARALLEL_DAG) {
      this.logger.log(`Executing parallel group: [${group.join(', ')}]`);

      const groupResults = await Promise.all(
        group.map(async (stepName) => {
          const step = stepName as unknown as StepNameEnum;
          const timeMs = await this.resiliencePolicy.execute(async () => {
            return this.mockStepService.executeStep(step);
          });

          onStepCompleted?.(step, timeMs);
          return { step, timeMs };
        }),
      );

      steps.push(...groupResults);
    }

    return {
      steps,
      totalTimeMs: Date.now() - startTime,
    };
  }
}
