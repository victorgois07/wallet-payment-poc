export const ERROR_TYPES = {
  PAYMENT_REFUSED: 'https://api.wallet.com/errors/payment-refused',
  VALIDATION_ERROR: 'https://api.wallet.com/errors/validation-error',
  INTERNAL_ERROR: 'https://api.wallet.com/errors/internal-error',
  RATE_LIMIT: 'https://api.wallet.com/errors/rate-limit-exceeded',
  STEP_TIMEOUT: 'https://api.wallet.com/errors/step-timeout',
  CIRCUIT_OPEN: 'https://api.wallet.com/errors/circuit-open',
} as const;

export const ERROR_TITLES: Record<string, string> = {
  [ERROR_TYPES.PAYMENT_REFUSED]: 'Payment Refused',
  [ERROR_TYPES.VALIDATION_ERROR]: 'Validation Error',
  [ERROR_TYPES.INTERNAL_ERROR]: 'Internal Server Error',
  [ERROR_TYPES.RATE_LIMIT]: 'Rate Limit Exceeded',
  [ERROR_TYPES.STEP_TIMEOUT]: 'Step Timeout',
  [ERROR_TYPES.CIRCUIT_OPEN]: 'Circuit Breaker Open',
};
