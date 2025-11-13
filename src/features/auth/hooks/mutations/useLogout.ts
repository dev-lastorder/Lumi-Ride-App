// src/features/auth/hooks/mutations/useLogout.ts
import { API_ENDPOINTS, apiClient } from '@/src/lib/axios';
import { useAppDispatch } from '@/src/store/hooks';
import { logout } from '@/src/store/slices/auth.slice';
import { resetSignup } from '@/src/store/slices/signup.slice';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

// ============================================
// MUTATION HOOK
// ============================================
export const useLogout = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      console.log('📤 Logging out...');
      
      // Optionally call logout endpoint to invalidate token on server
      try {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        console.log('✅ Server logout successful');
      } catch (error) {
        // Ignore server error, logout locally anyway
        console.log('⚠️ Server logout failed, continuing with local logout');
      }
    },
    onSuccess: () => {
      console.log('✅ Logged out successfully');

      // Clear Redux state - ALL gates closed
      dispatch(logout());
      dispatch(resetSignup());

      console.log('🔒 Token cleared');
      console.log('🧹 Redux state cleared');

      // Navigate to welcome screen
      router.replace('/(auth)/welcome');
      
      console.log('👋 Redirected to welcome screen');
    },
    onError: (error: any) => {
      console.error('❌ Logout failed:', error);

      // Force logout locally anyway
      dispatch(logout());
      dispatch(resetSignup());
      router.replace('/(auth)/welcome');
      
      console.log('⚠️ Forced local logout completed');
    },
  });
};