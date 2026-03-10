import { describe, expect, it } from 'vitest';
import { ResiliencePolicy } from '../../../src/infrastructure/policies/resilience.policy';

describe('ResiliencePolicy', () => {
  it('should execute a successful function', async () => {
    const policy = new ResiliencePolicy();
    const result = await policy.execute(async () => 42);
    expect(result).toBe(42);
  });

  it('should retry on transient failure and eventually succeed', async () => {
    const policy = new ResiliencePolicy();
    let attempt = 0;

    const result = await policy.execute(async () => {
      attempt++;
      if (attempt < 3) throw new Error('transient');
      return 'success';
    });

    expect(result).toBe('success');
    expect(attempt).toBe(3);
  });

  it('should throw after max retries exceeded', async () => {
    const policy = new ResiliencePolicy();

    await expect(
      policy.execute(async () => {
        throw new Error('persistent failure');
      }),
    ).rejects.toThrow();
  });

  it('should report circuit state', () => {
    const policy = new ResiliencePolicy();
    const state = policy.getCircuitState();
    expect(typeof state).toBe('string');
  });

  it('should timeout long-running operations', async () => {
    const policy = new ResiliencePolicy();

    // This will timeout (5s) + retry 3 times, so ~20s max
    await expect(
      policy.execute(async () => {
        await new Promise((resolve) => setTimeout(resolve, 60_000));
        return 'unreachable';
      }),
    ).rejects.toThrow();
  }, 30_000);
});
