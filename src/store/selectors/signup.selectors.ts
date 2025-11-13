// src/store/selectors/signup.selectors.ts
import { AppState } from '../store';

// Select entire signup state
export const selectSignupState = (state: AppState) => state.signup;

// Select personal info
export const selectPersonalInfo = (state: AppState) => state.signup.personalInfo;

// Select document submission
export const selectDocumentSubmission = (state: AppState) => state.signup.documentSubmission;

// Select vehicle requirements
export const selectVehicleRequirements = (state: AppState) => state.signup.vehicleRequirements;

// Select completion status
export const selectIsSignupComplete = (state: AppState) => state.signup.isComplete;