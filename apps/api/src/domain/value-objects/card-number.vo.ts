import { isValidLuhn } from '@wallet/shared';

export class CardNumber {
  private constructor(private readonly _value: string) {}

  static create(cardNumber: string): CardNumber {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (!isValidLuhn(cleaned)) {
      throw new Error('Invalid card number');
    }
    return new CardNumber(cleaned);
  }

  get value(): string {
    return this._value;
  }

  get masked(): string {
    return `${this._value.slice(0, 4)} **** **** ${this._value.slice(-4)}`;
  }

  get lastFour(): string {
    return this._value.slice(-4);
  }

  equals(other: CardNumber): boolean {
    return this._value === other._value;
  }
}
