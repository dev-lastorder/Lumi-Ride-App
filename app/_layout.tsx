import twilioService from "@/services/twilio.service";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { persistor, RootState, store } from "@/src/store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Alert, AppState } from "react-native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const appState = useRef(AppState.currentState);
  const isInitializedRef = useRef(false);
  const user = useSelector((state: RootState) => state.auth?.user);
  const userId = user?.id;

  useEffect(() => {
    // Initialize Twilio when app starts and user ID is available
    if (!isInitializedRef.current && userId) {
      initializeTwilio();
      isInitializedRef.current = true;
    }

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log('⚠️ App going to background');
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (!__DEV__) {
        twilioService.cleanup();
      }
    };
  }, [userId]);

  const initializeTwilio = async () => {
    try {
      if (!userId) {
        console.error('❌ No user ID available for Twilio initialization');
        return;
      }

      console.log('🔄 Initializing Twilio with user ID:', userId);
      await twilioService.initialize(userId, 'driver');
      console.log(`✅ App ready to make/receive calls as: ${userId}`);
      
      // Listen to incoming call events
      if (twilioService.onIncomingCall) {
        twilioService.onIncomingCall = (callInvite) => {
          const callerIdentity = callInvite.getFrom();
          console.log('📞 Incoming call from:', callerIdentity);
          Alert.alert(
            'Incoming Call',
            `Call from ${callerIdentity}`,
            [
              {
                text: 'Reject',
                style: 'cancel',
                onPress: () => {
                  twilioService.rejectCall();
                }
              },
              {
                text: 'Accept',
                onPress: async () => {
                  try {
                    await twilioService.acceptCall();
                    // Navigate to call screen - you'll need to import router
                    // router.push({
                    //   pathname: "/(tabs)/(rideRequests)/callScreen",
                    //   params: {
                    //     customerId: callerIdentity,
                    //     customerName: "Customer",
                    //     profileImage: "https://avatar.iran.liara.run/public/48",
                    //   },
                    // });
                  } catch (error) {
                    console.error('Failed to accept call:', error);
                    Alert.alert('Error', 'Failed to accept call');
                  }
                }
              }
            ]
          );
        };
      }
      
    } catch (error) {
      console.error('Failed to initialize Twilio:', error);
      Alert.alert('Error', 'Failed to initialize calling service');
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() 
{  
  const [loaded, error] = useFonts({

  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}