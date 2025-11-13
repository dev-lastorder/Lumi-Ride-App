// src/store/selectors/authSelectors.ts
// ENHANCED VERSION - Selectors for Three Gates System

import { AppState } from '../store';

// ============================================
// BASIC SELECTORS
// ============================================

// Select if user is logged in (GATE 1)
export const selectIsLoggedIn = (state: AppState) => state.auth.isLoggedIn;

// Select user information
export const selectUser = (state: AppState) => state.auth.user;

// Select JWT token
export const selectToken = (state: AppState) => state.auth.token;

// ============================================
// THREE GATES SELECTORS
// ============================================

// Select if user is onboarded (GATE 2)
export const selectIsOnboarded = (state: AppState) => state.auth.isOnboarded;

// Select if user accepted terms (GATE 3)
export const selectTermsAccepted = (state: AppState) => state.auth.termsAccepted;

// ============================================
// RIDER PROFILE SELECTORS
// ============================================

// Select complete rider profile
export const selectRiderProfile = (state: AppState) => state.auth.riderProfile;

// Select rider status (pending/approved/rejected)
export const selectRiderStatus = (state: AppState) => 
  state.auth.riderProfile?.status;

// Select rider availability (online/offline)
export const selectRiderAvailability = (state: AppState) => 
  state.auth.riderProfile?.availabilityStatus;

// ============================================
// COMPOSITE SELECTORS
// ============================================

// Check if ALL THREE GATES are passed
// Returns true only if user can access main app
export const selectCanAccessMainApp = (state: AppState) => {
  return (
    state.auth.isLoggedIn &&
    state.auth.isOnboarded &&
    state.auth.termsAccepted
  );
};

// Determine which screen user should see
// This is THE MOST IMPORTANT selector for navigation!
export const selectRedirectPath = (state: AppState): string => {
  // Gate 1 check: Not logged in?
  if (!state.auth.isLoggedIn) {
    return '/(auth)/welcome';
  }

  // Gate 2 check: Logged in but not onboarded?
  if (!state.auth.isOnboarded) {
    return '/(auth)/signupSecondStage';
  }

  // Gate 3 check: Onboarded but terms not accepted?
  if (!state.auth.termsAccepted) {
    return '/(auth)/terms&service';
  }

  // All gates passed! Go to main app
  return '/(tabs)/(rideRequests)/rideRequest';
};

// Get user's full name (with fallback)
export const selectUserName = (state: AppState) => 
  state.auth.user?.name || 'User';

// Get user's phone number
export const selectUserPhone = (state: AppState) => 
  state.auth.user?.phone;

// Check if rider is approved
export const selectIsRiderApproved = (state: AppState) => 
  state.auth.riderProfile?.status === 'approved';

// ============================================
// USAGE EXAMPLES
// ============================================
/*

// In components:
import { useAppSelector } from '@/src/store/hooks';
import { selectIsLoggedIn, selectRedirectPath, selectCanAccessMainApp } from '@/src/store/selectors/authSelectors';

function MyComponent() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const redirectPath = useAppSelector(selectRedirectPath);
  const canAccessMainApp = useAppSelector(selectCanAccessMainApp);
  const riderStatus = useAppSelector(selectRiderStatus);
  
  // Use them in your logic...
}

// In root index.tsx:
const redirectPath = useAppSelector(selectRedirectPath);
useEffect(() => {
  router.replace(redirectPath);
}, [redirectPath]);

*/