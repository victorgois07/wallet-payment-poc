import { generateTransactionId } from '@wallet/shared';

export class TransactionId {
  private constructor(private readonly _value: string) {}

  static generate(): TransactionId {
    return new TransactionId(generateTransactionId());
  }

  static from(id: string): TransactionId {
    if (!id.startsWith('txn_')) {
      throw new Error('Invalid transaction ID format');
    }
    return new TransactionId(id);
  }

  get value(): string {
    return this._value;
  }

  equals(other: TransactionId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
