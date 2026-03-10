import type { StepNameEnum } from '../enums';

export interface StepResult {
  step: StepNameEnum;
  timeMs: number;
}

export interface PipelineResult {
  steps: StepResult[];
  totalTimeMs: number;
}

export type StepCompletedCallback = (step: StepNameEnum, timeMs: number) => void;

export interface IPaymentPipeline {
  readonly strategy: string;
  execute(onStepCompleted?: StepCompletedCallback): Promise<PipelineResult>;
}

export const PAYMENT_PIPELINE = Symbol('IPaymentPipeline');
