// src/app/(auth)/verifyOtpLogin.tsx
import BackButton from "@/src/components/common/BackButton";
import GradientBackground from "@/src/components/common/GradientBackground";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

import { useSendLoginOtp, useVerifyLoginOtp } from '@/src/features/auth/hooks';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VerifyOTPLoginScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const phone = params.phone as string;
const insets = useSafeAreaInsets();
  const otpInputRef = useRef<any>(null);
  const [otp, setOtp] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const verifyLoginOtpMutation = useVerifyLoginOtp();
  const sendLoginOtpMutation = useSendLoginOtp();

  const isVerifying = verifyLoginOtpMutation.isPending;
  const isResending = sendLoginOtpMutation.isPending;

  const handleVerifyWithOtp = (otpValue: string) => {

  
    if (!userId) {
      setHasError(true);
      setErrorMessage("User ID not found. Please try again.");
      return;
    }
  
    verifyLoginOtpMutation.mutate(
      {
        sentOtp: otpValue,
        userId: userId,
        login_as: "Rider"
      },
      {
        onSuccess: (data) => {
          const riderData = data.mainTablesData.find((item) => item.key === 'Rider');
          const rider = riderData?.data;
          console.log(rider);
  
          if (rider?.is_onboarding_completed) {
            router.replace('/(tabs)/(rideRequests)');
          } else {

            router.replace('/(auth)/signupSecondStage');
          }
        },
        onError: (error: any) => {
          console.error('❌ LOGIN FAILED:', error);
          const errorMsg = error.response?.data?.message || "Invalid OTP. Please try again.";
          setHasError(true);
          setErrorMessage(errorMsg);
        }
      }
    );
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
    if (!canResend || !phone) return;

    console.log('📤 Resending OTP to:', phone);

    sendLoginOtpMutation.mutate(
      {
        phone: phone,
        otp_type: 'sms',
      },
      {
        onSuccess: (data) => {
          console.log('✅ OTP resent successfully');
          console.log('📝 User ID:', userId);
          
          // Clear OTP and reset state 
          setOtp("");
          setHasError(false);
          setErrorMessage("");
          setCanResend(false);
          setResendTimer(30);
          otpInputRef.current?.reset();
        },
        onError: (error: any) => {
          console.error('❌ Failed to resend OTP:', error);
          setHasError(true);
          setErrorMessage("Failed to resend OTP. Please try again.");
        }
      }
    );
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
              <View style={[styles.backButtonWrapper, { top:Platform.OS=='ios'? 0:  insets.top }]}>
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
                heading="Verify OTP"
                subheading={`Enter the 4-digit code sent to ${phone || "your phone"}`}
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
              {(hasError || verifyLoginOtpMutation.isError) && (
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
                hasError={hasError || verifyLoginOtpMutation.isError}
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
                  disabled={isVerifying || isResending}
                >
                  <Text style={[
                    styles.resendButton,
                    (isVerifying || isResending) && styles.resendButtonDisabled
                  ]}>
                    {isResending ? "Sending..." : "Resend Code"}
                  </Text>
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

export default VerifyOTPLoginScreen;

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
   
    paddingLeft: 20,
    marginBottom: 20,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop:20,
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
  resendButtonDisabled: {
    color: "#9CA3AF",
  },
  resendTimer: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});