export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    const char = digits.at(i);
    let n = Number.parseInt(char ?? '0', 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

export function isValidExpirationDate(expDate: string): boolean {
  const match = expDate.match(/^(\d{2})\/(\d{2})$/);
  if (!match || match[1] === undefined || match[2] === undefined) return false;

  const month = Number.parseInt(match[1], 10);
  const year = Number.parseInt(match[2], 10) + 2000;

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiration = new Date(year, month, 0);
  return expiration > now;
}

export function isValidCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

export function isValidAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}
