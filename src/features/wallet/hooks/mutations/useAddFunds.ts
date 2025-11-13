// src/features/wallet/hooks/mutations/useAddFunds.ts
import { TopupResponse, topupWallet } from '@/src/services/wallet.service';
import { RootState } from '@/src/store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';



export const useAddFunds = () => {
  const queryClient = useQueryClient();
  const { currency } = useSelector((state: RootState) => state.appConfig);


  return useMutation({
    mutationFn: async (amount: number) => {
      console.log('📤 Adding funds to wallet...', amount);
      
      if (amount < 10) {
        throw new Error(`Minimum amount is ${currency?.code} 10.00`);
      }
      
      if (amount > 500) {
        throw new Error(`Maximum amount is ${currency?.code} 500.00`);
      }

      const response = await topupWallet(amount);
      return response;
    },
    onSuccess: (data: TopupResponse) => {
      console.log('✅ Funds added successfully!');
      console.log('💰 New balance:', data.balance);

      // Invalidate wallet balance query to refetch
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
      
      // Invalidate transaction history to show new deposit
      queryClient.invalidateQueries({ queryKey: ['transactionHistory'] });

      Alert.alert(
        'Success',
        `${currency?.code} ${data.balance.toFixed(2)} added to your wallet successfully!`,
        [{ text: 'OK' }]
      );
    },
    onError: (error: any) => {
      console.error('❌ Failed to add funds:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add funds. Please try again.';
      
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    },
  });
};