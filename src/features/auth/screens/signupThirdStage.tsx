// src/features/auth/screens/signupThirdStage.tsx - REVERTED company registration
import BackButton from "@/src/components/common/BackButton";
import GradientBackground from "@/src/components/common/GradientBackground";
import { router } from "expo-router";
import React from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import Title from "../components/common/TitleHeader";
import Stepper from "../components/common/stepper";
import VehicleRequirementsForm, {
  VehicleRequirementsFormValues,
} from "../components/forms/vechileRequirementsForm";

import { useCompleteOnboarding } from '@/src/features/auth/hooks';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectDocumentSubmission, selectPersonalInfo } from '@/src/store/selectors/signup.selectors';
import { setVehicleRequirements } from '@/src/store/slices/signup.slice';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignupThirdScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const documents = useAppSelector(selectDocumentSubmission);
  const personalInfo = useAppSelector(selectPersonalInfo);
  const insets = useSafeAreaInsets();

  const completeOnboardingMutation = useCompleteOnboarding();

  const handleVehicleRequirementsSubmit = (values: VehicleRequirementsFormValues) => {
    console.log("🚗 Vehicle Requirements Values:", values);

    dispatch(setVehicleRequirements(values));

    // Helper function to convert file array to single file object
    const prepareFile = (fileArray: any[]) => {
      if (!fileArray || fileArray.length === 0) {
        return null;
      }
      const file = fileArray[0];
      return {
        uri: file.uri,
        name: file.name,
        type: file.type,
      };
    };

    console.log('📤 Preparing onboarding data...');
    console.log('📄 Documents:', {
      driverLicenseFront: documents.driverLicenseFront?.length > 0,
      driverLicenseBack: documents.driverLicenseBack?.length > 0,
      nationalIdFront: documents.nationalIdFront?.length > 0,
      nationalIdBack: documents.nationalIdBack?.length > 0,
      vehicleRegFront: documents.vehicleRegistrationFront?.length > 0,
      vehicleRegBack: documents.vehicleRegistrationBack?.length > 0,
      companyReg: documents.companyRegistration?.length > 0, // ✅ Single field
    });

    // Validate required documents
    const requiredDocs = [
      { name: 'Driver License Front', data: documents.driverLicenseFront },
      { name: 'Driver License Back', data: documents.driverLicenseBack },
      { name: 'National ID Front', data: documents.nationalIdFront },
      { name: 'National ID Back', data: documents.nationalIdBack },
      { name: 'Vehicle Registration Front', data: documents.vehicleRegistrationFront },
      { name: 'Vehicle Registration Back', data: documents.vehicleRegistrationBack },
    ];

    const missingDocs = requiredDocs.filter(doc => !doc.data || doc.data.length === 0);

    if (missingDocs.length > 0) {
      console.error('❌ Missing documents:', missingDocs.map(d => d.name));
      alert(`Please upload all required documents: ${missingDocs.map(d => d.name).join(', ')}`);
      return;
    }

    // Call mutation
    completeOnboardingMutation.mutate({
      // Required documents
      driver_license_front: prepareFile(documents.driverLicenseFront) as any,
      driver_license_back: prepareFile(documents.driverLicenseBack) as any,
      national_id_passport_front: prepareFile(documents.nationalIdFront) as any,
      national_id_passport_back: prepareFile(documents.nationalIdBack) as any,
      vehicle_registration_front: prepareFile(documents.vehicleRegistrationFront) as any,
      vehicle_registration_back: prepareFile(documents.vehicleRegistrationBack) as any,

      // ✅ REVERTED: Optional company registration - single field
      company_commercial_registration: documents.companyRegistration?.length > 0
        ? prepareFile(documents.companyRegistration) as any
        : undefined,

      // Vehicle requirements
      model_year_limit: parseInt(values.modelYearLimit),
      is_four_wheeler: values.fourDoorCar === 'yes',
      air_conditioning: values.airConditioning === 'yes',
      no_cosmetic_damage: values.noCosmeticDamage === 'yes',
      licenseNumber: '',
      ride_type_id: personalInfo.vehicleType,
      vehicle_name: values.vehicleName,
      vehicle_colour: values.vehicleColor,
      vehicle_no: values.vehicleColor
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.fixedHeader}>
            <View style={[styles.backButtonWrapper, { top:Platform.OS=='ios'? 0:  insets.top + 10 }]}>
            <BackButton
              size={48}
              iconSize={20}
              borderColor="#D1D5DB"
              iconColor="#000000"
              backgroundColor="rgba(255,255,255,0.1)"
            />
          </View>

          <View style={styles.titleWrapper}>
            <Title
              heading="Sign up"
              subheading="Complete your vehicle requirements."
              containerStyle={styles.titleContainer}
            />
          </View>
        </View>

        <View style={styles.stepperWrapper}>
          <Stepper
            steps={[
              { number: "01", title: "Personal Info" },
              { number: "02", title: "Document Submission" },
              { number: "03", title: "Vehicle Requirements" },
            ]}
            currentStep={3}
          />
        </View>

        <VehicleRequirementsForm
          onSubmit={handleVehicleRequirementsSubmit}
          onBack={handleBack}
          isSubmitting={completeOnboardingMutation.isPending}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default SignupThirdScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fixedHeader: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  backButtonWrapper: {
    marginBottom: 20,
  },
  titleWrapper: {
    marginBottom: 10,
    marginTop:20,
  },
  titleContainer: {},
  stepperWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
});