import { Injectable } from '@nestjs/common';
import { STEP_TIMING_RANGES } from '@wallet/shared';
import type { StepNameEnum } from '../../domain/enums';

@Injectable()
export class MockStepService {
  async executeStep(step: StepNameEnum): Promise<number> {
    const range = STEP_TIMING_RANGES[step];
    const delay = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

    await new Promise((resolve) => setTimeout(resolve, delay));
    return delay;
  }
}
