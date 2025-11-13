// src/store/slices/auth.slice.ts
// ENHANCED VERSION - Now tracks THREE GATES for complete auth flow

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================
// TYPESCRIPT INTERFACES
// ============================================

// User basic information
interface User {
  id: string;
  email: string | null;
  name: string;
  phone: string;
}

// Rider profile information (from backend)
interface RiderProfile {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  vehicleType: string;
  licenseNumber: string;
  availabilityStatus: 'online' | 'offline';
  is_onboarding_completed: boolean;
}

// Complete authentication state
interface AuthState {
  // ========== GATE 1: AUTHENTICATED ==========
  isLoggedIn: boolean;           // Has valid JWT token?
  token: string | null;           // JWT token from backend

  // ========== USER DATA ==========
  user: User | null;              // Basic user information

  // ========== GATE 2: ONBOARDED ==========
  isOnboarded: boolean;           // Completed document submission?
  
  // ========== GATE 3: TERMS ACCEPTED ==========
  termsAccepted: boolean;         // Agreed to terms & conditions?

  // ========== RIDER PROFILE ==========
  riderProfile: RiderProfile | null; // Rider-specific data
  mainTablesData?: any[];
}

// ============================================
// INITIAL STATE
// ============================================
const initialState: AuthState = {
  // All gates closed initially
  isLoggedIn: false,
  token: null,
  user: null,
  isOnboarded: false,
  termsAccepted: false,
  riderProfile: null,
 mainTablesData: [],
};

// ============================================
// REDUX SLICE
// ============================================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ============================================
    // ACTION 1: setAuth (Complete Login/Signup)
    // ============================================
    // Called after successful OTP verification
    // Sets all auth data at once
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        isOnboarded: boolean;
        termsAccepted: boolean;
        riderProfile: RiderProfile;
        mainTablesData: any[];
      }>
    ) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isOnboarded = action.payload.isOnboarded;
      state.termsAccepted = action.payload.termsAccepted;
      state.riderProfile = action.payload.riderProfile;
      state.mainTablesData = action.payload.mainTablesData;
    },

    // ============================================
    // ACTION 2: setOnboarded (After Document Upload)
    // ============================================
    // Called after successful onboarding API call
    // Opens Gate 2
    setOnboarded: (state, action: PayloadAction<boolean>) => {
      state.isOnboarded = action.payload;
    },

    // ============================================
    // ACTION 3: setTermsAccepted (After Accepting Terms)
    // ============================================
    // Called when user accepts terms & conditions
    // Opens Gate 3
    setTermsAccepted: (state, action: PayloadAction<boolean>) => {
      state.termsAccepted = action.payload;
    },

    // ============================================
    // ACTION 4: updateRiderProfile
    // ============================================
    // Called to update rider-specific data
    updateRiderProfile: (
      state,
      action: PayloadAction<Partial<RiderProfile>>
    ) => {
      if (state.riderProfile) {
        state.riderProfile = { ...state.riderProfile, ...action.payload };
      }
    },

    // ============================================
    // ACTION 5: updateUser
    // ============================================
    // Called to update user information
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // ============================================
    // ACTION 6: logout
    // ============================================
    // Called when user logs out or token expires
    // Resets EVERYTHING back to initial state
    // Closes all three gates
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      state.isOnboarded = false;
      state.termsAccepted = false;
      state.riderProfile = null;
      state.mainTablesData=[];
    },
  },
});

// ============================================
// EXPORTS
// ============================================
export const {
  setAuth,
  setOnboarded,
  setTermsAccepted,
  updateRiderProfile,
  updateUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

// ============================================
// USAGE EXAMPLES
// ============================================
/*

// 1. After successful OTP verification (Signup/Login)
dispatch(setAuth({
  user: {
    id: "user-uuid",
    email: "user@email.com",
    name: "Ahmed Ali",
    phone: "+966501234567"
  },
  token: "eyJhbGci...",
  isOnboarded: false,  // Not yet onboarded
  termsAccepted: false, // Not yet accepted
  riderProfile: {
    id: "rider-uuid",
    status: "pending",
    vehicleType: "",
    licenseNumber: "",
    availabilityStatus: "online",
    is_onboarding_completed: false
  }
}));

// 2. After uploading documents (Onboarding complete)
dispatch(setOnboarded(true));

// 3. After accepting terms & conditions
dispatch(setTermsAccepted(true));

// 4. After updating rider availability
dispatch(updateRiderProfile({
  availabilityStatus: "offline"
}));

// 5. On logout
dispatch(logout());

*/