// src/features/auth/hooks/mutations/index.ts
// Export all authentication mutations

// ============================================
// SIGNUP FLOW MUTATIONS
// ============================================
export { useSendSignupOtp } from './useSendSignupOtp';
export type { SendSignupOtpRequest } from './useSendSignupOtp';

export { useVerifySignupOtp } from './useVerifySignupOtp';
export type { VerifySignupOtpRequest } from './useVerifySignupOtp';

export { useCompleteOnboarding } from './useCompleteOnboarding';
export type { CompleteOnboardingRequest } from './useCompleteOnboarding';

// ============================================
// LOGIN FLOW MUTATIONS
// ============================================
export { useSendLoginOtp } from './useSendLoginOtp';
export type { SendLoginOtpRequest } from './useSendLoginOtp';

export { useVerifyLoginOtp } from './useVerifyLoginOtp';
export type { VerifyLoginOtpRequest } from './useVerifyLoginOtp';

// ============================================
// LOGOUT MUTATION
// ============================================
export { useLogout } from './useLogout';
