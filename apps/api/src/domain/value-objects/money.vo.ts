export class Money {
  private constructor(private readonly _amount: number) {}

  static create(amount: number): Money {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }
    return new Money(Math.round(amount * 100) / 100);
  }

  get value(): number {
    return this._amount;
  }

  get cents(): number {
    return Math.round(this._amount * 100);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount;
  }

  toString(): string {
    return this._amount.toFixed(2);
  }
}
