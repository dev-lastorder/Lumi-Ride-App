import { API_ENDPOINTS, apiClient } from '@/src/lib/axios';
import { useAppDispatch } from '@/src/store/hooks';
import { setAuth } from '@/src/store/slices/auth.slice';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';

export interface VerifyLoginOtpRequest {
  userId: string;
  sentOtp: string;
  login_as: 'Rider' | 'Customer' | 'Store' | 'Admin';
}

interface VerifyLoginOtpResponse {
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
  };
  mainTablesData: Array<{
    key: string;
    data: any;
  }>;
  accessToken: string;
}

export const useVerifyLoginOtp = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: VerifyLoginOtpRequest) => {
      console.log('📤 Verifying login OTP:', { 
        userId: data.userId,
        otp: '****', 
        login_as: data.login_as 
      });
      
      const response = await apiClient.post<VerifyLoginOtpResponse>(
        API_ENDPOINTS.AUTH.LOGIN_VERIFY_OTP,
        data 
      );
      console.log("🚀 ~ useVerifyLoginOtp ~ response:", response.data)
      
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Login successful!');
      console.log('🔐 Token received');
      console.log('👤 User:', data.user.name);

      // Find rider data from mainTablesData
      const riderData = data.mainTablesData.find((item) => item.key === 'Rider');
      const rider = riderData?.data;

      if (!rider) {
        console.error('❌ Rider profile not found');
        Alert.alert('Error', 'Rider profile not found', [{ text: 'OK' }]);
        return;
      }

      console.log("rider data verify :", rider)
      console.log('🚗 Rider Status:', rider.status);
      console.log('📋 Onboarded:', rider.is_onboarding_completed);

      // Save auth data to Redux
      dispatch(
        setAuth({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            phone: data.user.phone,
          },
          token: data.accessToken,
          isOnboarded: rider.is_onboarding_completed,
          termsAccepted: true,
          riderProfile: {
            id: rider.id,
            status: rider.status,
            vehicleType: rider.vehicleType,
            licenseNumber: rider.licenseNumber,
            availabilityStatus: rider.availabilityStatus,
            is_onboarding_completed: rider.is_onboarding_completed,
          },
          mainTablesData: data.mainTablesData,
        })
      );

      console.log('🎯 Navigation will be handled by root index.tsx');
    },
    onError: (error: any) => {
      console.error('❌ Login failed:', error);
    },
  });
};
