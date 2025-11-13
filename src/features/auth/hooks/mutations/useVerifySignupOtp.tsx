// src/features/auth/hooks/mutations/useVerifySignupOtp.ts
import { API_ENDPOINTS, apiClient } from '@/src/lib/axios';
import { useAppDispatch } from '@/src/store/hooks';
import { setAuth } from '@/src/store/slices/auth.slice';
import { resetSignup } from '@/src/store/slices/signup.slice';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';

// ============================================
// TYPES
// ============================================
export interface VerifySignupOtpRequest {
  phone: string;
  sentOtp: string;
  name: string;
  email?: string;
  city: string;
  ride_type_id: string;
}

interface VerifySignupOtpResponse {
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    phone_is_verified: boolean;
  };
  profileTypeData: {
    id: string;
    user_id: string;
    user_type_id: string;
  };
  rider: {
    id: string;
    user_profile_id: string;
    vehicleType: string;
    licenseNumber: string;
    availabilityStatus: 'online' | 'offline';
    type: string;
    ride_type_id: string;
    status: 'pending' | 'approved' | 'rejected';
    is_onboarding_completed: boolean;
  };
  accessToken: string;
}

// ============================================
// MUTATION HOOK
// ============================================
export const useVerifySignupOtp = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: VerifySignupOtpRequest) => {
      console.log('📤 Verifying signup OTP:', { ...data, sentOtp: '****' });
      
      const response = await apiClient.post<VerifySignupOtpResponse>(
        API_ENDPOINTS.LUMI_RIDER_AUTH.SIGNUP_VERIFY_OTP,
        data
      );
      
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Account created successfully!');
      console.log('🔐 Token received');
      console.log('👤 User:', data.user.name);

      // Save auth data to Redux (GATE 1 PASSED!)
      dispatch(
        setAuth({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            phone: data.user.phone,
          },
          token: data.accessToken,
          isOnboarded: data.rider.is_onboarding_completed, // false initially
          termsAccepted: false, // Not accepted yet
          riderProfile: {
            id: data.rider.id,
            status: data.rider.status,
            vehicleType: data.rider.vehicleType,
            licenseNumber: data.rider.licenseNumber,
            availabilityStatus: data.rider.availabilityStatus,
            is_onboarding_completed: data.rider.is_onboarding_completed,
          },
        })
      );

      // Clear signup form data from Redux
      dispatch(resetSignup());

      // Navigate to document submission (Stage 2)
      router.push('/(auth)/signupSecondStage');

      Alert.alert('Success', 'Account created! Please complete your profile.', [
        { text: 'OK' },
      ]);
    },
    onError: (error: any) => {
      console.error('❌ Failed to verify signup OTP:', error);
      // Error already handled by axios interceptor (shows Alert)
    },
  });
};