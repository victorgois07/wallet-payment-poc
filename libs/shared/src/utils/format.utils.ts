export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 8) return cleaned;
  const first4 = cleaned.slice(0, 4);
  const last4 = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 8);
  return `${first4} ${masked.match(/.{1,4}/g)?.join(' ') ?? masked} ${last4}`;
}
