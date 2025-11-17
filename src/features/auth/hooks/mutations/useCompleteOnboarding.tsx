// src/features/auth/hooks/mutations/useCompleteOnboarding.ts
import { API_ENDPOINTS, multipartClient } from '@/src/lib/axios';
import { useAppDispatch } from '@/src/store/hooks';
import { setOnboarded } from '@/src/store/slices/auth.slice';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';

// ============================================
// TYPES
// ============================================
export interface CompleteOnboardingRequest {
  driver_license_front: File | any;
  driver_license_back: File | any;
  national_id_passport_front: File | any;
  national_id_passport_back: File | any;
  vehicle_registration_front: File | any;
  vehicle_registration_back: File | any;
  company_commercial_registration?: File | any;
  model_year_limit: number;
  is_four_wheeler: boolean;
  air_conditioning: boolean;
  no_cosmetic_damage: boolean;
  licenseNumber: string;
  ride_type_id: string;
  vehicle_name: string;
  vehicle_colour: string;
  vehicle_no: string;
}

interface CompleteOnboardingResponse {
  message: string;
  rider: {
    id: string;
    is_onboarding_completed: boolean;
    status: string;
    driver_license_front: string;
    driver_license_back: string;
    national_id_passport_front: string;
    national_id_passport_back: string;
    vehicle_registration_front: string;
    vehicle_registration_back: string;
    company_commercial_registration: string | null;
    model_year_limit: number;
    is_four_wheeler: boolean;
    air_conditioning: boolean;
    no_cosmetic_damage: boolean;
    licenseNumber: string;
  };
}

// ============================================
// MUTATION HOOK
// ============================================
export const useCompleteOnboarding = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: CompleteOnboardingRequest) => {
      console.log('📤 Uploading onboarding documents...');

      // Create FormData for file upload
      const formData = new FormData();

      // Add all files
      formData.append('driver_license_front', data.driver_license_front);
      formData.append('driver_license_back', data.driver_license_back);
      formData.append('national_id_passport_front', data.national_id_passport_front);
      formData.append('national_id_passport_back', data.national_id_passport_back);
      formData.append('vehicle_registration_front', data.vehicle_registration_front);
      formData.append('vehicle_registration_back', data.vehicle_registration_back);

      if (data.company_commercial_registration) {
        formData.append('company_commercial_registration', data.company_commercial_registration);
      }

      // Add other fields
      formData.append('model_year_limit', String(data.model_year_limit));
      formData.append('is_four_wheeler', String(data.is_four_wheeler));
      formData.append('air_conditioning', String(data.air_conditioning));
      formData.append('no_cosmetic_damage', String(data.no_cosmetic_damage));
      formData.append('licenseNumber', data.licenseNumber);
      formData.append('ride_type_id', data.ride_type_id);
      formData.append('vehicle_name', data.vehicle_name);
      formData.append('vehicle_colour', data.vehicle_colour);
      formData.append('vehicle_no', data.vehicle_no);

      // Use multipart client for file upload (token added automatically!)
      const response = await multipartClient.patch<CompleteOnboardingResponse>(
        API_ENDPOINTS.LUMI_RIDER_AUTH.ONBOARDING,
        formData
      );
      console.log("my form data", formData)
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Onboarding completed successfully!');
      console.log('📄 Documents uploaded to S3');
      console.log('🎯 Onboarded:', data.rider.is_onboarding_completed);
      console.log("data of sign up is :", data)

      // Update Redux - Mark as onboarded (GATE 2 PASSED! ✅)
      dispatch(setOnboarded(true));

      // Navigate to terms & conditions
      router.push('/(auth)/terms&service');

      Alert.alert('Success', 'Documents uploaded successfully!', [
        { text: 'OK' },
      ]);
    },
    onError: (error: any) => {
      console.error('❌ Failed to complete onboarding:', error);
      // Error already handled by axios interceptor (shows Alert)
    },
  });
};