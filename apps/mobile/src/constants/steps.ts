import type { StepName } from '@wallet/shared';

export const STEP_LABELS: Record<StepName, string> = {
  account_validation: 'Validacao de Conta',
  card_validation: 'Validacao de Cartao',
  anti_fraud: 'Analise Anti-Fraude',
  acquirer_processing: 'Processamento Adquirente',
  payment: 'Pagamento',
  notification: 'Notificacao',
};
