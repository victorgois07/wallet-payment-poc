import { describe, expect, it } from 'vitest';
import { StepNameEnum } from '../../../src/domain/enums';
import { MockStepService } from '../../../src/infrastructure/services/mock-step.service';

describe('MockStepService', () => {
  const service = new MockStepService();

  it('should return a delay within the expected range for account_validation', async () => {
    const delay = await service.executeStep(StepNameEnum.ACCOUNT_VALIDATION);
    expect(delay).toBeGreaterThanOrEqual(450);
    expect(delay).toBeLessThanOrEqual(730);
  });

  it('should return a delay within the expected range for anti_fraud', async () => {
    const delay = await service.executeStep(StepNameEnum.ANTI_FRAUD);
    expect(delay).toBeGreaterThanOrEqual(700);
    expect(delay).toBeLessThanOrEqual(1500);
  });

  it('should return a delay within the expected range for notification', async () => {
    const delay = await service.executeStep(StepNameEnum.NOTIFICATION);
    expect(delay).toBeGreaterThanOrEqual(200);
    expect(delay).toBeLessThanOrEqual(300);
  });

  it('should return a number', async () => {
    const delay = await service.executeStep(StepNameEnum.PAYMENT);
    expect(typeof delay).toBe('number');
    expect(Number.isInteger(delay)).toBe(true);
  });
});
