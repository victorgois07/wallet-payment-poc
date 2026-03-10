import { describe, expect, it } from 'vitest';
import { isValidAmount, isValidCvv, isValidExpirationDate, isValidLuhn } from './validation.utils';

describe('Validation Utils', () => {
  describe('isValidLuhn', () => {
    it('should validate correct Luhn numbers', () => {
      expect(isValidLuhn('4532015112830366')).toBe(true);
      expect(isValidLuhn('5425233430109903')).toBe(true);
    });

    it('should reject invalid Luhn numbers', () => {
      expect(isValidLuhn('1234567890123456')).toBe(false);
      expect(isValidLuhn('1234567890123457')).toBe(false);
    });

    it('should reject too short numbers', () => {
      expect(isValidLuhn('123')).toBe(false);
    });

    it('should strip non-digit characters', () => {
      expect(isValidLuhn('4532-0151-1283-0366')).toBe(true);
    });
  });

  describe('isValidExpirationDate', () => {
    it('should validate future dates', () => {
      expect(isValidExpirationDate('12/30')).toBe(true);
    });

    it('should reject past dates', () => {
      expect(isValidExpirationDate('01/20')).toBe(false);
    });

    it('should reject invalid month', () => {
      expect(isValidExpirationDate('13/30')).toBe(false);
      expect(isValidExpirationDate('00/30')).toBe(false);
    });

    it('should reject invalid format', () => {
      expect(isValidExpirationDate('1230')).toBe(false);
      expect(isValidExpirationDate('12/2030')).toBe(false);
    });
  });

  describe('isValidCvv', () => {
    it('should accept 3-digit CVV', () => {
      expect(isValidCvv('123')).toBe(true);
    });

    it('should accept 4-digit CVV', () => {
      expect(isValidCvv('1234')).toBe(true);
    });

    it('should reject too short', () => {
      expect(isValidCvv('12')).toBe(false);
    });

    it('should reject too long', () => {
      expect(isValidCvv('12345')).toBe(false);
    });

    it('should reject non-digits', () => {
      expect(isValidCvv('abc')).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    it('should accept positive amounts', () => {
      expect(isValidAmount(100)).toBe(true);
      expect(isValidAmount(0.01)).toBe(true);
    });

    it('should reject zero', () => {
      expect(isValidAmount(0)).toBe(false);
    });

    it('should reject negative', () => {
      expect(isValidAmount(-10)).toBe(false);
    });

    it('should reject Infinity', () => {
      expect(isValidAmount(Number.POSITIVE_INFINITY)).toBe(false);
    });
  });
});
