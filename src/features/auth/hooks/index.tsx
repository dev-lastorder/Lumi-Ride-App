// src/features/auth/hooks/index.ts
// Central export file for all auth hooks

// ============================================
// MUTATIONS (POST/PATCH/DELETE)
// ============================================
export {
    useCompleteOnboarding,
    // Logout
    useLogout,
    // Login Flow
    useSendLoginOtp,
    // Signup Flow
    useSendSignupOtp, useVerifyLoginOtp, useVerifySignupOtp
} from './mutations';
  
  // Export types
  export type {
    CompleteOnboardingRequest,
    SendLoginOtpRequest, SendSignupOtpRequest, VerifyLoginOtpRequest, VerifySignupOtpRequest
} from './mutations';
  
  // ============================================
  // QUERIES (GET)
  // ===========================================
//   export { } from './queries';
  
  // ============================================
  // USAGE EXAMPLES
  // ============================================
  /*
  
  // In your screens/components:
  import { 
    useSendSignupOtp,
    useVerifySignupOtp,
    useCompleteOnboarding,
    useSendLoginOtp,
    useVerifyLoginOtp,
    useLogout
  } from '@/src/features/auth/hooks';
  
  // Example usage:
  const MyScreen = () => {
    const sendOtp = useSendSignupOtp();
    const verifyOtp = useVerifySignupOtp();
    
    const handleSendOtp = () => {
      sendOtp.mutate({
        phone: "+966501234567",
        otp_type: "sms"
      });
    };
    
    return (
      <Button 
        onPress={handleSendOtp}
        loading={sendOtp.isPending}
      />
    );
  };
  
  */