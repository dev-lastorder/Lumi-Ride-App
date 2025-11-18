// src/screens/auth/SignupSecondScreen.tsx
import GradientBackground from "@/src/components/common/GradientBackground";
import { useAppDispatch } from "@/src/store/hooks";
import { setDocumentSubmission } from "@/src/store/slices/signup.slice";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Title from "../components/common/TitleHeader";
import Stepper from "../components/common/stepper";
import DocumentSubmissionForm, {
  DocumentSubmissionFormValues,
} from "../components/forms/documentSubmissionForm";

const SignupSecondScreen: React.FC = () => {
  const dispatch = useAppDispatch();
    const inest = useSafeAreaInsets();
  

  const handleDocumentSubmit = (values: DocumentSubmissionFormValues) => {
    console.log("📄 Document Submission Values:", values);

    // Save to Redux store
    dispatch(setDocumentSubmission(values));

    // Navigate to next screen (Vehicle Requirements - Step 3)
    router.push("/(auth)/signupThirdStage");

    // You can also call API here to upload documents to backend
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Fixed Header Section */}
        <View style={[styles.fixedHeader,{paddingTop:inest.top} ]}>
          {/* Top-left back button */}
           {/* <View style={[styles.backButtonWrapper, { top:Platform.OS=='ios'? 0:  inest.top + 10 }]}>
            <BackButton
              size={48}
              iconSize={20}
              borderColor="#D1D5DB"
              iconColor="#000000"
              backgroundColor="rgba(255,255,255,0.1)"
            />
          </View> */}

          {/* Title Section */}
          <View style={styles.titleWrapper}>
            <Title
              heading="Sign up"
              subheading="Upload your documents for verification."
              containerStyle={styles.titleContainer}
            />
          </View>
        </View>

        {/* Fixed Stepper - Showing step 2 */}
        <View style={styles.stepperWrapper}>
          <Stepper
            steps={[
              { number: "01", title: "Personal Info" },
              { number: "02", title: "Document Submission" },
              { number: "03", title: "Vehicle Requirements" },
            ]}
            currentStep={2}
          />
        </View>

        {/* Document Submission Form */}
        <DocumentSubmissionForm onSubmit={handleDocumentSubmit} />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default SignupSecondScreen;

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
  },
  titleContainer: {},
  stepperWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});