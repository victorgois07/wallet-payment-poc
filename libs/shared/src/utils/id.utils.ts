import { ulid } from 'ulid';

export function generateTransactionId(): string {
  return `txn_${ulid()}`;
}

export function generateCorrelationId(): string {
  return ulid();
}
