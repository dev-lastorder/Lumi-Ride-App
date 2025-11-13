import * as Location from "expo-location";
import { useCallback, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { updateRiderCurrentLocation } from "../services/currentLocationApi";
import {
  IRiderLocation,
  webSocketService,
} from "../services/socket/webSocketService";
import { useAppDispatch } from "../store/hooks";
import {
  setDriverLocation,
  setHasLocation,
} from "../store/slices/driverLocation.slice";
import { setDriverStatus } from "../store/slices/driverStatus.slice";

interface LocationHookResult {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  isTracking: boolean;
 requestPermissionAndFetchLocation: (options?: { checkOnly?: boolean }) => Promise<boolean>;

  startLocationTracking: () => void;
  stopLocationTracking: () => void;
}

export const useDriverLocation = (): LocationHookResult => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const dispatch = useAppDispatch();

  // Use ref to store subscription so it persists across renders
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // Replace your requestPermissionAndFetchLocation function
  // const requestPermissionAndFetchLocation = useCallback(async () => {
  //   try {
  //     // Step 1: Check if location services are enabled
  //     const servicesEnabled = await Location.hasServicesEnabledAsync();
  //     if (!servicesEnabled) {
  //       setErrorMsg(
  //         "Location services are disabled. Please enable GPS in Settings."
  //       );
  //       dispatch(setDriverStatus("offline"));
  //       dispatch(setHasLocation(false));
  //       return false;
  //     }

  //     // Step 2: Request foreground permission FIRST
  //     console.log("📍 Requesting foreground location permission...");
  //     const foregroundStatus =
  //       await Location.requestForegroundPermissionsAsync();
  //     console.log("Foreground permission status:", foregroundStatus);

  //     if (foregroundStatus.status !== "granted") {
  //       setErrorMsg(
  //         "Foreground Location permission was denied. Please enable it in Settings."
  //       );
  //       dispatch(setDriverStatus("offline"));
  //       dispatch(setHasLocation(false));
  //       console.log(
  //         `⚠️ Foreground location permission denied in ${Platform.OS}`
  //       );
  //       return false;
  //     }

  //     // Only request background permission on iOS
  //     if (Platform.OS === "ios") {
  //       console.log(
  //         "📍 Requesting background location permission (iOS only)..."
  //       );
  //       const backgroundStatus =
  //         await Location.requestBackgroundPermissionsAsync();
  //       console.log("Background permission status:", backgroundStatus);

  //       if (backgroundStatus.status !== "granted") {
  //         setErrorMsg(
  //           "Background Location permission was denied. Please enable it in Settings."
  //         );
  //         dispatch(setDriverStatus("offline"));
  //         dispatch(setHasLocation(false));
  //         console.log(`⚠️ Background location permission denied on iOS`);
  //         return false;
  //       }
  //     } else {
  //       console.log(
  //         "ℹ️ Skipping background permission request on Android (use ACCESS_BACKGROUND_LOCATION in app.json)"
  //       );
  //     }

  //     // Step 4: Get initial location
  //     const currentLocation = await Location.getCurrentPositionAsync({
  //       accuracy: Location.Accuracy.High,
  //       mayShowUserSettingsDialog: true, // helps on Android
  //     });

  //     console.log("✅ Initial location obtained:", {
  //       lat: currentLocation.coords.latitude,
  //       lng: currentLocation.coords.longitude,
  //     });

  //     setLocation(currentLocation);
  //     setErrorMsg(null);

  //     // Store in Redux
  //     dispatch(
  //       setDriverLocation({
  //         latitude: currentLocation.coords.latitude,
  //         longitude: currentLocation.coords.longitude,
  //       })
  //     );

  //     try {
  //       // Update in backend
  //       await updateRiderCurrentLocation(
  //         currentLocation.coords.latitude,
  //         currentLocation.coords.longitude
  //       );
  //     } catch (error) {
  //       console.log("⚠️ Backend update failed:", error);
  //     }

  //     return true;
  //   } catch (error) {
  //     dispatch(setDriverStatus("offline"));
  //     dispatch(setHasLocation(false));
  //     console.error("❌ Failed to fetch location:", error);
  //     setErrorMsg("Failed to fetch location. Please check your permissions.");
  //     return false;
  //   }
  // }, [dispatch]);


const requestPermissionAndFetchLocation = useCallback(
  async ({ checkOnly = false } = {}) => {
    try {
      // Step 1: Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable GPS in Settings to use location features."
        );
        dispatch(setDriverStatus("offline"));
        dispatch(setHasLocation(false));
        return false;
      }

      let foregroundStatus;

      if (checkOnly) {
        foregroundStatus = await Location.getForegroundPermissionsAsync();
      } else {
        console.log("📍 Requesting foreground location permission...");
        foregroundStatus = await Location.requestForegroundPermissionsAsync();
      }

      console.log("Foreground permission status:", foregroundStatus);

      if (foregroundStatus.status !== "granted") {
        if (!foregroundStatus.canAskAgain) {
          Alert.alert(
            "Permission Denied",
            "Location permission is denied and cannot be requested again. Please enable it manually from Settings.",
            [{ text: "Open Settings", onPress: () => Location.enableNetworkProviderAsync?.() }, { text: "OK" }]
          );
        } else {
          Alert.alert(
            "Permission Needed",
            "Please allow location permission to continue."
          );
        }
        dispatch(setDriverStatus("offline"));
        dispatch(setHasLocation(false));
        return false;
      }

      // Step 2: Handle background permission (iOS only)
      if (Platform.OS === "ios") {
        let backgroundStatus;

        if (checkOnly) {
          backgroundStatus = await Location.getBackgroundPermissionsAsync();
        } else {
          console.log("📍 Requesting background location permission (iOS only)...");
          backgroundStatus = await Location.requestBackgroundPermissionsAsync();
        }

        console.log("Background permission status:", backgroundStatus);

        if (backgroundStatus.status !== "granted") {
          if (!backgroundStatus.canAskAgain) {
            Alert.alert(
              "Background Permission Denied",
              "Background location permission is permanently denied. Please go to Settings and allow 'Always' access."
            );
          } else {
            Alert.alert(
              "Background Permission Required",
              "Please grant background location access ('Always Allow') to keep your status active while using the app."
            );
          }
          dispatch(setDriverStatus("offline"));
          dispatch(setHasLocation(false));
          return false;
        }
      }

      // ✅ Permission check-only mode
      if (checkOnly) {
        console.log("✅ Permission check passed (check-only mode).");
        setErrorMsg(null);
        dispatch(setDriverStatus("online"));
        dispatch(setHasLocation(true));
        return true;
      }

      // Step 3: Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: true,
      });

      console.log("✅ Initial location obtained:", {
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
      });

      setLocation(currentLocation);
      setErrorMsg(null);
      dispatch(
        setDriverLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        })
      );

      try {
        await updateRiderCurrentLocation(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
      } catch (error) {
        console.log("⚠️ Backend update failed:", error);
      }

      return true;
    } catch (error) {
      console.error("❌ Failed to fetch/check location:", error);
      Alert.alert(
        "Error",
        "Failed to fetch or check location. Please check permissions in Settings."
      );
      dispatch(setDriverStatus("offline"));
      dispatch(setHasLocation(false));
      return false;
    }
  },
  [dispatch]
);


  // 🎯 Start only foreground tracking
  const startLocationTracking = useCallback(async () => {
    try {
      console.log("🔄 Starting FOREGROUND location tracking...");

      // Start foreground location watching
      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 10000,
        },
        (newLocation) => {
          console.log("📍 FOREGROUND Location update:", {
            lat: newLocation.coords.latitude,
            lng: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy,
          });

          setLocation(newLocation);

          // Update Redux
          dispatch(
            setDriverLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            })
          );

          if (webSocketService.isSocketConnected()) {
            const riderLocationParams: IRiderLocation = {
              // Todo: replace with actual IDs
              riderId: "rider123",
              customerId: "customer456",
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            };
            console.log("Socket connected, now updating rider's location");
            webSocketService.updateRiderLocation(riderLocationParams);
          } else {
            console.log("Socket not connected, cannot update rider's location");
          }
        }
      );

      console.log("✅ Foreground location tracking started");
    } catch (error) {
      console.error("❌ Failed to start foreground tracking:", error);
      throw error;
    }
  }, [dispatch]);

  // 🎯 Stop foreground tracking
  const stopLocationTracking = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
      console.log("✅ Foreground location tracking stopped");
    }
  }, []);

  return {
    location,
    errorMsg,
    isTracking,
    requestPermissionAndFetchLocation,
    startLocationTracking,
    stopLocationTracking,
  };
};
