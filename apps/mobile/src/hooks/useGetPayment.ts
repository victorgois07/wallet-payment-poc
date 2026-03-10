import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '../services/api';

export function useGetPayment(transactionId: string | undefined) {
  return useQuery({
    queryKey: ['payment', transactionId],
    queryFn: () => {
      if (transactionId === undefined) {
        throw new Error('transactionId is required when query is enabled');
      }
      return paymentApi.getById(transactionId);
    },
    enabled: !!transactionId,
    staleTime: 30_000,
  });
}
