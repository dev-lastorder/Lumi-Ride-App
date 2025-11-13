// src/features/wallet/hooks/queries/useWalletBalance.ts
import { getWalletBalance } from '@/src/services/wallet.service';
import { useQuery } from '@tanstack/react-query';

// ============================================
// QUERY HOOK
// ============================================
export const useWalletBalance = () => {
  return useQuery({
    queryKey: ['walletBalance'],
    queryFn: async () => {
      console.log('📤 Fetching wallet balance...');
      const data = await getWalletBalance();
      console.log('✅ Wallet balance fetched:', data.totalBalanceInWallet);
      return data;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};