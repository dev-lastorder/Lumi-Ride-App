// src/features/wallet/hooks/queries/useTransactionHistory.ts
import { getTransactionHistory, TransactionFilterType } from '@/src/services/wallet.service';
import { useQuery } from '@tanstack/react-query';
export const useTransactionHistory = (
  filter: TransactionFilterType = 'all',
  offset: number = 0,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ['transactionHistory', filter, offset, limit],
    queryFn: async () => {
      console.log('📤 Fetching transaction history...', { filter, offset, limit });
      const data = await getTransactionHistory(filter, offset, limit);
      console.log('✅ Transaction history fetched:', data.transactions.length, 'transactions');
      return data;
    },
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};