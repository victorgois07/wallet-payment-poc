import { describe, expect, it } from 'vitest';
import { CardNumber } from '../../../src/domain/value-objects/card-number.vo';

describe('CardNumber Value Object', () => {
  // Valid Luhn test card number: 4532015112830366
  const VALID_CARD = '4532015112830366';
  const INVALID_CARD = '1234567890123456';

  it('should create with valid Luhn card number', () => {
    const card = CardNumber.create(VALID_CARD);
    expect(card.value).toBe(VALID_CARD);
  });

  it('should strip non-digit characters', () => {
    const card = CardNumber.create('4532 0151 1283 0366');
    expect(card.value).toBe(VALID_CARD);
  });

  it('should throw for invalid Luhn', () => {
    expect(() => CardNumber.create(INVALID_CARD)).toThrow('Invalid card number');
  });

  it('should return masked value', () => {
    const card = CardNumber.create(VALID_CARD);
    expect(card.masked).toBe('4532 **** **** 0366');
  });

  it('should return last four digits', () => {
    const card = CardNumber.create(VALID_CARD);
    expect(card.lastFour).toBe('0366');
  });

  it('should compare equality', () => {
    const a = CardNumber.create(VALID_CARD);
    const b = CardNumber.create(VALID_CARD);
    expect(a.equals(b)).toBe(true);
  });
});
