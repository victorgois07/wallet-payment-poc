import { describe, expect, it } from 'vitest';
import { Money } from '../../../src/domain/value-objects/money.vo';

describe('Money Value Object', () => {
  it('should create with valid amount', () => {
    const money = Money.create(100.5);
    expect(money.value).toBe(100.5);
  });

  it('should round to 2 decimal places', () => {
    const money = Money.create(10.999);
    expect(money.value).toBe(11);
  });

  it('should throw for zero amount', () => {
    expect(() => Money.create(0)).toThrow('Amount must be greater than zero');
  });

  it('should throw for negative amount', () => {
    expect(() => Money.create(-10)).toThrow('Amount must be greater than zero');
  });

  it('should throw for Infinity', () => {
    expect(() => Money.create(Number.POSITIVE_INFINITY)).toThrow('Amount must be a finite number');
  });

  it('should throw for NaN', () => {
    expect(() => Money.create(Number.NaN)).toThrow('Amount must be a finite number');
  });

  it('should convert to cents correctly', () => {
    const money = Money.create(29.99);
    expect(money.cents).toBe(2999);
  });

  it('should compare equality', () => {
    const a = Money.create(10);
    const b = Money.create(10);
    const c = Money.create(20);
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('should format toString', () => {
    expect(Money.create(5).toString()).toBe('5.00');
    expect(Money.create(99.9).toString()).toBe('99.90');
  });
});
