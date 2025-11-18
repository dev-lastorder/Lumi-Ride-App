// src/features/auth/screens/login/index.tsx
import BackButton from "@/src/components/common/BackButton";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import { useKeyboardPadding } from "@/src/hooks/useKeyboardPadding";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Keyboard, Platform, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import PhoneInput, { ICountry } from "react-native-international-phone-number";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Title from "../components/common/TitleHeader";

const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
const { androidPadding } = useKeyboardPadding(0);
  // Format phone number to international format (e.g., +923355183960)
  const formatPhoneNumber = (): string => {
    if (!phoneNumber || !selectedCountry) return "";

    // Remove all spaces and special characters except digits
    const cleanedNumber = phoneNumber.replace(/\s+/g, "").replace(/\D/g, "");

    // Get calling code and ensure it starts with +
    const callingCode = selectedCountry.callingCode.startsWith("+")
      ? selectedCountry.callingCode
      : `+${selectedCountry.callingCode}`;

    // Combine calling code with phone number
    const formattedNumber = `${callingCode}${cleanedNumber}`;

    return formattedNumber;
  };

  const handleRequestOTP = () => {
    const formattedPhoneNumber = formatPhoneNumber();
    console.log("📞 Requesting OTP for:", formattedPhoneNumber);
    if (!phoneNumber || !selectedCountry || formattedPhoneNumber.length < 5) {
      setPhoneError("Please enter a valid phone number before continuing.");
      return;
    }

    // Pass the formatted phone number to the next screen
    router.push({
      pathname: "/(auth)/verificationmethodLogin",
      params: { phoneNumber: formattedPhoneNumber }
    });
  };

  return (
    <GradientBackground>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
          {/* Top-left back button */}
          <View style={[styles.backButtonWrapper, { top:Platform.OS=='ios'? 0:  insets.top + 10 }]}>
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
              heading="Log in"
              subheading="Hello, Welcome back to your account."
              containerStyle={styles.titleContainer}
            />
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Sign in text */}
            <Text style={styles.signInText}>
              Sign in easily by your phone number!
            </Text>

            {/* Phone Number Input */}
            <View style={styles.phoneInputContainer}>
              <PhoneInput
                value={phoneNumber}
                onChangePhoneNumber={(phone) => {
                  console.log("📞 Phone changed:", phone);
                  setPhoneNumber(phone);
                }}
                selectedCountry={selectedCountry}
                onChangeSelectedCountry={(country) => {
                  setSelectedCountry(country);
                  console.log("📍 Country Code:", country?.callingCode);
                }}
                placeholder="Phone number"
                defaultCountry="QA"
                phoneInputStyles={{
                  container: styles.phoneContainer,
                  flagContainer: styles.flagContainer,
                  flag: {},
                  caret: styles.caret,
                  divider: styles.divider,
                  callingCode: styles.callingCode,
                  input: styles.phoneInput,
                }}
                modalStyles={{
                  modal:{marginBottom: Platform.OS === "android" ? androidPadding : 0},
                  backdrop: {},
                  countryName: styles.countryName,
                  searchInput: styles.searchInput,
                }}
              />
            </View>
            {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}

            {/* Info text */}
            <Text style={styles.infoText}>A code will be sent to your number</Text>
          </View>

          {/* Bottom Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Request OTP"
              onPress={handleRequestOTP}
              variant="primary"
              size="large"
              fullWidth
              style={styles.requestButton}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </GradientBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: "relative",
  },
  backButtonWrapper: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  titleWrapper: {
    marginTop: 80,
    paddingHorizontal: 20,
  },
  titleContainer: {},
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: -60,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#1F2937",
    marginBottom: 20,
  },
  phoneInputContainer: {
    marginBottom: 12,
  },
  phoneContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    height: 60,
  },
  flagContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  caret: {
    color: "#6B7280",
    fontSize: 16,
  },
  divider: {
    backgroundColor: "#E5E7EB",
  },
  callingCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  phoneInput: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  countryName: {
    color: "#111827",
  },
  searchInput: {
    borderColor: "#D1D5DB",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "400",
    color: "red",
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  requestButton: {
    backgroundColor: "#3853A4",
    height: 56,
  },
});