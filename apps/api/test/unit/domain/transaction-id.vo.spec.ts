import { describe, expect, it } from 'vitest';
import { TransactionId } from '../../../src/domain/value-objects/transaction-id.vo';

describe('TransactionId Value Object', () => {
  it('should generate with txn_ prefix', () => {
    const id = TransactionId.generate();
    expect(id.value).toMatch(/^txn_[A-Z0-9]{26}$/);
  });

  it('should create from valid string', () => {
    const id = TransactionId.from('txn_01ARZ3NDEKTSV4RRFFQ69G5FAV');
    expect(id.value).toBe('txn_01ARZ3NDEKTSV4RRFFQ69G5FAV');
  });

  it('should throw for invalid prefix', () => {
    expect(() => TransactionId.from('invalid_123')).toThrow('Invalid transaction ID format');
  });

  it('should generate unique IDs', () => {
    const a = TransactionId.generate();
    const b = TransactionId.generate();
    expect(a.equals(b)).toBe(false);
  });

  it('should compare equality', () => {
    const value = 'txn_01ARZ3NDEKTSV4RRFFQ69G5FAV';
    const a = TransactionId.from(value);
    const b = TransactionId.from(value);
    expect(a.equals(b)).toBe(true);
  });

  it('should convert to string', () => {
    const id = TransactionId.generate();
    expect(id.toString()).toBe(id.value);
  });
});
