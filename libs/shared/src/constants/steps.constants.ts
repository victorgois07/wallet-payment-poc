import type { StepName } from '../types';

export interface StepTimingRange {
  min: number;
  max: number;
}

export const STEP_TIMING_RANGES: Record<StepName, StepTimingRange> = {
  account_validation: { min: 450, max: 730 },
  card_validation: { min: 300, max: 800 },
  anti_fraud: { min: 700, max: 1500 },
  acquirer_processing: { min: 1000, max: 2500 },
  payment: { min: 800, max: 1250 },
  notification: { min: 200, max: 300 },
};

export const PARALLEL_DAG: StepName[][] = [
  ['account_validation', 'card_validation', 'anti_fraud'],
  ['acquirer_processing'],
  ['payment', 'notification'],
];

export const SEQUENTIAL_ORDER: StepName[] = [
  'account_validation',
  'card_validation',
  'anti_fraud',
  'acquirer_processing',
  'payment',
  'notification',
];
