// src/features/auth/screens/verifyOtpSignUpScreen.tsx
import BackButton from "@/src/components/common/BackButton";
import GradientBackground from "@/src/components/common/GradientBackground";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Title from "../components/common/TitleHeader";
import OTPInput from "../components/verifyScreens/OTPInput";

import { useVerifySignupOtp } from '@/src/features/auth/hooks';
import { useAppSelector } from '@/src/store/hooks';
import { selectPersonalInfo } from '@/src/store/selectors/signup.selectors';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VerifyOtpSignUpScreen: React.FC = () => {
  const otpInputRef = useRef<any>(null);
  const [otp, setOtp] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const personalInfo = useAppSelector(selectPersonalInfo);
  const inest = useSafeAreaInsets();

  const verifyOtpMutation = useVerifySignupOtp();


  const isVerifying = verifyOtpMutation.isPending;

  const handleVerify = () => {
    // Reset error state
    setHasError(false);
    setErrorMessage("");

    // Validate OTP length
    if (otp.length !== 4) {
      setHasError(true);
      setErrorMessage("Please enter a valid 4-digit OTP");
      return;
    }

    console.log('📤 Verifying OTP:', '****');
    console.log('📱 Phone:', personalInfo.phoneNumber);
    console.log('👤 Name:', personalInfo.fullName);
    console.log('🏙️ City:', personalInfo.city);

    // Call mutation
    verifyOtpMutation.mutate({
      phone: personalInfo.phoneNumber,
      sentOtp: otp,
      name: personalInfo.fullName,
      city: personalInfo.city,
      ride_type_id: personalInfo.vehicleType, // This is the ride_type_id UUID
    });

  };

  const handleOtpChange = (value: string) => {
    setOtp(value);

    // Clear error when user types
    if (hasError) {
      setHasError(false);
      setErrorMessage("");
    }

    // Auto-verify when 4 digits entered
    if (value.length === 4) {
      // Small delay to show the last digit
      setTimeout(() => {
        handleVerifyWithOtp(value);
      }, 100);
    }
  };


  const handleVerifyWithOtp = (otpValue: string) => {
    console.log('📤 Auto-verifying OTP:', '****');

    verifyOtpMutation.mutate({
      phone: personalInfo.phoneNumber,
      sentOtp: otpValue,
      name: personalInfo.fullName,
      city: personalInfo.city,
      ride_type_id: personalInfo.vehicleType,
    });
  };

  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleResend = () => {
    if (!canResend) return;

    // TODO: Call useSendSignupOtp mutation again
    console.log("🔄 Resend OTP requested");
    setOtp("");
    setHasError(false);
    setErrorMessage("");
    setCanResend(false);
    setResendTimer(30);
    otpInputRef.current?.clear?.();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top-left back button */}
            <View style={[styles.backButtonWrapper, { paddingTop: inest.top + 2 }]}>
              <BackButton
                size={48}
                iconSize={20}
                borderColor="#D1D5DB"
                iconColor="#000000"
                backgroundColor="rgba(255,255,255,0.1)"
              />
            </View>

            {/* Title Section */}
            <View style={styles.titleWrapper}>
              <Title
                heading="OTP"
                subheading="We have sent OTP code verification to your mobile no"
                containerStyle={styles.titleContainer}
              />
            </View>

            {/* Image Section - Below Title */}
            <View style={styles.imageContainer}>
              <Image
                source={require("@/src/assets/images/chatImage.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* OTP Section */}
            <View style={styles.otpSection}>
              {/* Error message */}
              {(hasError || verifyOtpMutation.isError) && (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>
                    {errorMessage || "Invalid OTP. Please try again."}
                  </Text>
                </View>
              )}

              {/* OTP Input */}
              <OTPInput
                ref={otpInputRef}
                onChangeText={handleOtpChange}
                hasError={hasError || verifyOtpMutation.isError}
                numberOfDigits={4}
                disabled={isVerifying}
              />

              {/* Verifying Indicator */}
              {isVerifying && (
                <View style={styles.verifyingContainer}>
                  <ActivityIndicator size="small" color="#3853A4" />
                  <Text style={styles.verifyingText}>Verifying...</Text>
                </View>
              )}
            </View>

            {/* Resend Section */}
            <View style={styles.resendSection}>
              <Text style={styles.resendLabel}>
                Didn't receive the code?
              </Text>

              {canResend ? (
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={isVerifying}
                >
                  <Text style={styles.resendButton}>Resend Code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendTimer}>
                  Resend in {resendTimer}s
                </Text>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default VerifyOtpSignUpScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButtonWrapper: {
    paddingTop: 10,
    paddingLeft: 20,
    marginBottom: 20,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleContainer: {},
  imageContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  image: {
    width: 320,
    height: 256,
  },
  otpSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  verifyingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  verifyingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#3853A4",
    fontWeight: "600",
  },
  resendSection: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  resendLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  resendButton: {
    fontSize: 16,
    color: "#3853A4",
    fontWeight: "600",
  },
  resendTimer: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});