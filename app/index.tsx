// app/index.tsx
// Root Navigation with Three-Gate Authentication System

import { useAppSelector } from "@/src/store/hooks";
import {
  selectIsLoggedIn,
  selectIsOnboarded,
  selectTermsAccepted,
} from "@/src/store/selectors/authSelectors";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";



export default function RootIndex() {

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isOnboarded = useAppSelector(selectIsOnboarded);
  const termsAccepted = useAppSelector(selectTermsAccepted);


  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {

    const checkAuthState = async () => {
      try {

        await new Promise((resolve) => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error('❌ Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, [isLoggedIn, isOnboarded, termsAccepted]);


  useEffect(() => {
    if (!isLoading) {
      console.log('🔄 Gate status changed!');
      console.log(`  Authenticated: ${isLoggedIn}`);
      console.log(`  Onboarded: ${isOnboarded}`);
      console.log(`  Terms: ${termsAccepted}`);
    }
  }, [isLoggedIn, isOnboarded, termsAccepted, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3853A4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {

    return <Redirect href="/(auth)/welcome" />;
  }

  if (!isOnboarded) {

    return <Redirect href="/(auth)/signupSecondStage" />;
  }


  if (!termsAccepted) {

    return <Redirect href="/(auth)/terms&service" />;
  }


  
  return <Redirect href="/(tabs)/(rideRequests)" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
});