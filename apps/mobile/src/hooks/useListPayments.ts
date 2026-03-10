import { useInfiniteQuery } from '@tanstack/react-query';
import { paymentApi } from '../services/api';

export function useListPayments(limit = 10) {
  return useInfiniteQuery({
    queryKey: ['payments', limit],
    queryFn: ({ pageParam }) => paymentApi.list(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 10_000,
  });
}
