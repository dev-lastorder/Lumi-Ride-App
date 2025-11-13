// src/features/auth/hooks/mutations/useSendLoginOtp.ts
import { API_ENDPOINTS, apiClient } from '@/src/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

export interface SendLoginOtpRequest {
  phone: string;
  otp_type: 'sms' | 'call';
}

interface SendLoginOtpResponse {
  message?: string; 
  userId: string;
}

export const useSendLoginOtp = () => {
  return useMutation({
    mutationFn: async (data: SendLoginOtpRequest) => {
      
      const response = await apiClient.post<SendLoginOtpResponse>(
        API_ENDPOINTS.AUTH.LOGIN_SEND_OTP,
        data
      );

      return response.data;
    },
    onSuccess: (data, variables) => {
      

      router.push({
        pathname: '/(auth)/verifyOtpLogin',
        params: {
          userId: data.userId,
          phone: variables.phone,
        }
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to send login OTP:', error);
    },
  });
};