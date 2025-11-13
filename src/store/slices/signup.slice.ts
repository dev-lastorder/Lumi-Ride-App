// src/store/slices/signup.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UploadedFile interface (matching FileUploadInput)
export interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

// Define the complete signup state interface for all 3 stages
interface SignupState {
  // Stage 1: Personal Information
  personalInfo: {
    fullName: string;
    phoneNumber: string;
    city: string;
    vehicleType: string;
  };

  // Stage 2: Document Submission
  documentSubmission: {
    profilePicture: UploadedFile[];
    driverLicenseFront: UploadedFile[];
    driverLicenseBack: UploadedFile[];
    nationalIdFront: UploadedFile[];
    nationalIdBack: UploadedFile[];
    vehicleRegistrationFront: UploadedFile[];
    vehicleRegistrationBack: UploadedFile[];
    companyRegistration: UploadedFile[]; // ✅ Single field
  };

  // Stage 3: Vehicle Requirements
  vehicleRequirements: {
    modelYearLimit: string;
    fourDoorCar: string;
    airConditioning: string;
    noCosmeticDamage: string;
    agreedToTerms: boolean;
    vehicleName: string;
    vehicleColor: string;
    vehicleNumber: string;
  };

  // Track completion only
  isComplete: boolean;
}

// Initial state
const initialState: SignupState = {
  personalInfo: {
    fullName: '',
    phoneNumber: '',
    city: '',
    vehicleType: '',
  },
  documentSubmission: {
    profilePicture: [],
    driverLicenseFront: [],
    driverLicenseBack: [],
    nationalIdFront: [],
    nationalIdBack: [],
    vehicleRegistrationFront: [],
    vehicleRegistrationBack: [],
    companyRegistration: [], // ✅ Single field
  },
  vehicleRequirements: {
    modelYearLimit: '',
    fourDoorCar: '',
    airConditioning: '',
    noCosmeticDamage: '',
    vehicleName: '',
    agreedToTerms: false,
    vehicleColor: '',
    vehicleNumber: '',
  },
  isComplete: false,
};

// Create the signup slice
const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    // Save Stage 1: Personal Info
    setPersonalInfo: (state, action: PayloadAction<SignupState['personalInfo']>) => {
      state.personalInfo = action.payload;
    },

    // Save Stage 2: Document Submission
    setDocumentSubmission: (state, action: PayloadAction<SignupState['documentSubmission']>) => {
      state.documentSubmission = action.payload;
    },

    // Save Stage 3: Vehicle Requirements
    setVehicleRequirements: (state, action: PayloadAction<SignupState['vehicleRequirements']>) => {
      state.vehicleRequirements = action.payload;
      state.isComplete = true;
    },

    // Reset all signup data (useful after successful submission or logout)
    resetSignup: (state) => {
      state.personalInfo = initialState.personalInfo;
      state.documentSubmission = initialState.documentSubmission;
      state.vehicleRequirements = initialState.vehicleRequirements;
      state.isComplete = false;
    },
  },
});

// Export actions
export const {
  setPersonalInfo,
  setDocumentSubmission,
  setVehicleRequirements,
  resetSignup,
} = signupSlice.actions;

// Export reducer
export default signupSlice.reducer;