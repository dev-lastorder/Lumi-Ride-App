import BackButton from "@/src/components/common/BackButton";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import { useSendSignupOtp } from '@/src/features/auth/hooks';
import { useAppSelector } from '@/src/store/hooks';
import { selectPersonalInfo } from '@/src/store/selectors/signup.selectors';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Title from "../components/common/TitleHeader";

const VerificationMethodScreen: React.FC = () => {
  const personalInfo = useAppSelector(selectPersonalInfo);
  const phone = personalInfo.phoneNumber;
    const insets = useSafeAreaInsets();
  

  const sendOtpMutation = useSendSignupOtp();
  
  // Track which button is loading
  const [activeMethod, setActiveMethod] = useState<'sms' | 'call' | null>(null);

  const handleSendSMS = () => {
    if (activeMethod) return; // Prevent double clicks
    
    console.log('📤 Sending OTP via SMS to:', phone);
    setActiveMethod('sms');
    
    sendOtpMutation.mutate(
      {
        phone: phone,
        otp_type: 'sms'
      },
      {
        onSettled: () => {
          setActiveMethod(null);
        }
      }
    );
  };

  const handleSendCall = () => {
    if (activeMethod) return; // Prevent double clicks
    
    console.log('📤 Sending OTP via Call to:', phone);
    setActiveMethod('call');
    
    sendOtpMutation.mutate(
      {
        phone: phone,
        otp_type: 'call'
      },
      {
        onSettled: () => {
          setActiveMethod(null);
        }
      }
    );
  };

  const isSmsLoading = activeMethod === 'sms';
  const isCallLoading = activeMethod === 'call';
  const isAnyLoading = activeMethod !== null;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
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
            heading="Choose Verification Method"
            subheading="How would you like to receive your OTP? Call or SMS."
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

        {/* Main Content - Buttons */}
        <View style={styles.content}>
          {/* SMS Button */}
          <Button
            title={isSmsLoading ? "Sending SMS..." : "Send code by SMS"}
            onPress={handleSendSMS}
            variant="outline"
            size="large"
            disabled={isAnyLoading}
            loading={isSmsLoading}
            fullWidth
            icon={
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color="#1F2937"
                style={{ marginRight: 8 }}
              />
            }
            style={styles.smsButton}
            textStyle={styles.smsButtonText}
          />

          {/* "or" Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Call Button */}
          <Button
            title={isCallLoading ? "Calling..." : "Send code by Call"}
            onPress={handleSendCall}
            variant="primary"
            size="large"
            disabled={isAnyLoading}
            loading={isCallLoading}
            fullWidth
            icon={
              <Ionicons
                name="call-outline"
                size={20}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
            }
            style={styles.callButton}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default VerificationMethodScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backButtonWrapper: {
    paddingTop: 10,
    paddingLeft: 20,
    marginBottom: 20,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  titleContainer: {},
  imageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  image: {
    width: 320,
    height: 256,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  smsButton: {
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
    borderRadius: 50,
  },
  smsButtonText: {
    color: "#1F2937",
  },
  callButton: {
    backgroundColor: "#3853A4",
    borderRadius: 50,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#3853A4",
  },
});