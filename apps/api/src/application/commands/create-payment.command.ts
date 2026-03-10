export class CreatePaymentCommand {
  constructor(
    public readonly cardNumber: string,
    public readonly expirationDate: string,
    public readonly cvv: string,
    public readonly cardholderName: string,
    public readonly amount: number,
    public readonly correlationId: string,
  ) {}
}
