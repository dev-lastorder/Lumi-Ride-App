// src/features/auth/hooks/mutations/useSendSignupOtp.ts
import { API_ENDPOINTS, apiClient } from '@/src/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

export interface SendSignupOtpRequest {
  phone: string;
  otp_type: 'sms' | 'call';
}

interface SendSignupOtpResponse {
  userId(arg0: string, userId: any): unknown;
  message: string;
}

export const useSendSignupOtp = () => {
  return useMutation({
    mutationFn: async (data: SendSignupOtpRequest) => {
      console.log('📤 Sending signup OTP:', data);
      
      const response = await apiClient.post<SendSignupOtpResponse>(
        API_ENDPOINTS.LUMI_RIDER_AUTH.SIGNUP_SEND_OTP,
        data
      );
      
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Signup OTP sent successfully:', data.message);

      router.push('/(auth)/verifyOtpSignup');
    },
    onError: (error: any) => {
      console.error('❌ Failed to send signup OTP:', error);
    },
  });
};