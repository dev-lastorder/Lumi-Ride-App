import Button from "@/src/components/ui/Button ";
import { useTheme } from "@/src/context/ThemeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const AuthActionButtons: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme(); // Get theme colors

  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setSignupLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/(auth)/signup");
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoginLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  const anyLoading = signupLoading || loginLoading;

  // Dynamic styles using theme colors
  const dynamicStyles = {
    signupButton: {
      ...styles.signupButton,
      backgroundColor: colors.PRIMARY, // Dynamic brand color
    },
    loginButton: {
      ...styles.loginButton,
      borderColor: colors.PRIMARY, // Dynamic brand color
    },
    loginButtonText: {
      ...styles.loginButtonText,
      color: colors.PRIMARY, // Dynamic brand color
    },
  };

  return (
    <View style={styles.container}>
      {/* Signup Button */}
      <Button
        title="Signup"
        onPress={handleSignup}
        variant="primary"
        size="large"
        loading={signupLoading}
        disabled={anyLoading}
        fullWidth
        style={dynamicStyles.signupButton}
        textStyle={styles.signupButtonText}
      />

      {/* Login Button */}
      <Button
        title="Login"
        onPress={handleLogin}
        variant="outline"
        size="large"
        loading={loginLoading}
        disabled={anyLoading}
        fullWidth
        style={dynamicStyles.loginButton}
        textStyle={dynamicStyles.loginButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  signupButton: {
    // backgroundColor moved to dynamic styles
    borderRadius: 9999,
    marginVertical: 0,
    marginBottom: 16,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "transparent",
    // borderColor moved to dynamic styles
    borderWidth: 2,
    borderRadius: 9999,
    marginVertical: 0,
  },
  loginButtonText: {
    // color moved to dynamic styles
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AuthActionButtons;
