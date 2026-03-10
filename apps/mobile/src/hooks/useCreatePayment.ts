import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaymentRequest } from '@wallet/shared';
import { paymentApi } from '../services/api';
import { usePaymentStore } from '../stores/payment.store';

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const { startProcessing, setPayment, setError } = usePaymentStore();

  return useMutation({
    mutationFn: (data: PaymentRequest) => paymentApi.create(data),
    onMutate: () => {
      usePaymentStore.getState().clearError();
    },
    onSuccess: (payment) => {
      startProcessing(payment.transactionId);
      setPayment(payment);
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Erro ao processar pagamento');
    },
  });
}
