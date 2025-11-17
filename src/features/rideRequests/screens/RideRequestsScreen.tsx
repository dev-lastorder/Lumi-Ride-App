import {
  CountdownTimer,
  GradientBackground,
  RideRequestsHeader,
} from "@/src/components/common";
import { useTheme } from "@/src/context/ThemeContext";
import { useDriverLocation } from "@/src/hooks/useDriverLocation";
import { useDriverStatus } from "@/src/hooks/useDriverStatus";
import { useHiddenRides } from "@/src/hooks/useHiddenRides";
import { RootState } from "@/src/store/store";
import { isInTimerWindow } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  AppState,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import {
  FareInputModal,
  OfflineScreen,
  RideCard,
  RideDetailsModal,
} from "../components";
import {
  useActiveRideRequests,
  useScheduledRideRequests,
} from "../hooks/queries";
import rideRequestsService from "../services";
import { RideRequest } from "../types";
import AccountSuspendedScreen from "./AccountSuspendedScreen";

const LIST_HORIZONTAL_PADDING = 16;
const ACTION_RAIL_MAX_WIDTH = 320;
const ACTION_GAP = 8;

export const RideRequestsScreen: React.FC = () => {
  const { requestPermissionAndFetchLocation } = useDriverLocation();
  const { colors } = useTheme();
  const { currency } = useSelector((state: RootState) => state.appConfig);
  const { driverStatus } = useDriverStatus();
  const { hideRide, isRideHidden } = useHiddenRides();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fareInputVisible, setFareInputVisible] = useState(false);
  const [openSwipeableId, setOpenSwipeableId] = useState<string | null>(null);
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());
  const appState = useRef(AppState.currentState);

  const myRideRequest = useSelector(
    (state: RootState) => state.auth.mainTablesData
  );
  const isDriverApproved = myRideRequest?.[0]?.data?.is_approved;
  const rejectionReason = myRideRequest?.[0]?.data?.rejection_reason;
  const isPending = myRideRequest?.[0]?.data?.status == "pending" ? true : false;
  console.log("ride status", myRideRequest,isDriverApproved, rejectionReason);

  const { width: windowWidth } = useWindowDimensions();
  const cardRailWidth = useMemo(
    () => Math.max(0, windowWidth - LIST_HORIZONTAL_PADDING * 2),
    [windowWidth]
  );
  const actionWidth = useMemo(
    () => Math.min(ACTION_RAIL_MAX_WIDTH, Math.max(120, cardRailWidth * 0.2)),
    [cardRailWidth]
  );

  // Fetch ride requests from API
  const {
    data: rideRequests = [],
    isRefetching,
    refetch,
  } = useActiveRideRequests();

  // Fetch scheduled ride requests
  const {
    data: scheduledRideRequests = { data: [] },
    isRefetching: isRefetchingScheduledRideRequests,
  } = useScheduledRideRequests();

  const upcomingRide = scheduledRideRequests?.data[0] ?? null;
  const scheduledFor = upcomingRide?.scheduledFor ?? null;

  // Check if we should show the timer card (60 minutes before pickup)
  const shouldShowTimerCard = isInTimerWindow(scheduledFor, 30);

  // Ensure rideRequests is always an array for FlatList and filter out hidden rides
  const safeRideRequests: RideRequest[] = Array.isArray(rideRequests)
    ? rideRequests.filter((ride) => !isRideHidden(ride.id))
    : [];

  const rightOpenValue = -actionWidth;

  // First fetch driver location on mount
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("Hello, I'm focused!");
      requestPermissionAndFetchLocation();

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log(
            "🔄 App came to foreground — checking location permission..."
          );

          // ✅ Check if permissions are granted without requesting again
          await requestPermissionAndFetchLocation({ checkOnly: true });
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing ride requests:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const activeRequests: RideRequest[] =
    driverStatus === "online" ? safeRideRequests : [];

  const closeRow = (id: string) => {
    const swipeable = swipeableRefs.current.get(id);
    if (swipeable) {
      swipeable.close();
    }
    setOpenSwipeableId(null);
  };

  const handleComplain = (id: string) => {
    closeRow(id);
    const rideRequest = safeRideRequests.find((ride) => ride.id === id);
    if (rideRequest) {
      const rideDetails = {
        rideId: rideRequest.id,
        passengerName: rideRequest.passenger.name,
        passengerPhone: rideRequest.passenger.phoneNumber,
        pickupAddress: rideRequest.pickupLocation.address,
        dropoffAddress: rideRequest.dropoffLocation.address,
        estimatedFare: rideRequest.estimatedFare,
        distance: rideRequest.distance,
        requestTime: rideRequest.requestTime,
        rideType: rideRequest.rideType,
        paymentMethod: rideRequest.paymentMethod,
      };
      router.push({
        pathname: "/(tabs)/(profile)/support",
        params: { rideComplaint: JSON.stringify(rideDetails) },
      });
    } else {
      router.push("/(tabs)/(profile)/support");
    }
  };

  const handleHide = async (id: string) => {
    closeRow(id);
    await hideRide(id);
  };

  const handleChooseOnMap = (id: string) => {
    closeRow(id);
    console.log("Choose on map for ride:", id);
  };

  const handleRideCardPress = (rideRequest: RideRequest) => {
    // Close any open swipeable before opening modal
    if (openSwipeableId) {
      closeRow(openSwipeableId);
    }
    setSelectedRide(rideRequest);
    setModalVisible(true);
  };

  const handleAcceptRide = (fare: number) => {
    console.log("Accept ride with fare:", fare);
    // Handle ride acceptance logic
  };

  const handleOfferFare = (fare: number) => {
    console.log("Offer fare:", fare);
    // Handle fare offer logic
  };

  const handleEditFare = () => {
    setModalVisible(false);
    setTimeout(() => setFareInputVisible(true), 100);
  };

  const handleCustomFareOffer = (fare: number) => {
    console.log("Custom fare offer:", fare);
    setFareInputVisible(false);
    setTimeout(() => setModalVisible(true), 100);
  };

  const handleSwipeableWillOpen = (id: string) => {
    // Close previously opened swipeable
    if (openSwipeableId && openSwipeableId !== id) {
      closeRow(openSwipeableId);
    }
    setOpenSwipeableId(id);
  };

  const fetchActiveRide = useCallback(async () => {
    try {
      const data = await rideRequestsService.acceptRideRequest();
      console.log("✅ Ride result:", data);
      console.log("ride is ::", data?.isActiveRide);
      if (data?.isActiveRide === "true") {
        router.push("/tripDetail");
      }
    } catch (err) {
      console.error("❌ Error fetching active ride:", err);
    }
  }, []);

  useEffect(() => {
    fetchActiveRide();
  }, [fetchActiveRide]);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    item: RideRequest
  ) => {
    const actions = [
      {
        key: "complain",
        label: "Complain",
        icon: "warning-outline" as const,
        accent: colors.danger,
        handler: () => handleComplain(item.id),
      },
      {
        key: "hide",
        label: "Hide Ride",
        icon: "eye-off-outline" as const,
        accent: colors.textSecondary,
        handler: () => handleHide(item.id),
      },
      {
        key: "map",
        label: "Choose on Map",
        icon: "location-outline" as const,
        accent: colors.primary,
        handler: () => handleChooseOnMap(item.id),
      },
    ];

    const effectiveRailWidth = actionWidth - 16;
    const actionButtonWidth = Math.max(
      (effectiveRailWidth - ACTION_GAP * (actions.length - 1)) / actions.length,
      68
    );

    return (
      <View
        style={[
          styles.hiddenActions,
          {
            width: actionWidth,
          },
        ]}
      >
        {actions.map((action, index) => {
          const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [actionWidth, 0],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={action.key}
              style={[
                {
                  transform: [{ translateX: trans }],
                  opacity: progress,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    width: actionButtonWidth,
                    height: 52,
                    borderColor: action.accent,
                    marginHorizontal: ACTION_GAP / 2,
                  },
                ]}
                onPress={action.handler}
                activeOpacity={0.7}
              >
                <Ionicons name={action.icon} size={12} color={action.accent} />
                <Text style={[styles.actionText, { color: action.accent }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }: { item: RideRequest }) => (
    <Swipeable
      ref={(ref) => {
        if (ref) {
          swipeableRefs.current.set(item.id, ref);
        } else {
          swipeableRefs.current.delete(item.id);
        }
      }}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
      overshootRight={false}
      rightThreshold={40}
      onSwipeableWillOpen={() => handleSwipeableWillOpen(item.id)}
      containerStyle={styles.swipeableContainer}
    >
      <RideCard
        rideRequest={item}
        onMenuPress={(rideRequest) =>
          console.log("Menu pressed for ride:", rideRequest.id)
        }
        onPress={() => handleRideCardPress(item)}
      />
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GradientBackground style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          {/* Custom Header */}
          <RideRequestsHeader />

          {/* Upcoming Ride Card */}
          {!isDriverApproved ? (
            <AccountSuspendedScreen reason={rejectionReason || "N/A"} isPending={isPending} />
          ) : (
            !isRefetchingScheduledRideRequests &&
            driverStatus === "online" &&
            upcomingRide &&
            shouldShowTimerCard && (
              <View
                style={[
                  styles.upcomingRideCard,
                  { backgroundColor: colors.primaryGradient },
                ]}
              >
                <View style={styles.upcomingRideHeader}>
                  <Text style={styles.upcomingRideTitle}>Upcoming ride</Text>
                  <View style={styles.timerContainer}>
                    <CountdownTimer
                      scheduledFor={scheduledFor}
                      startBeforeMinutes={30}
                    />
                  </View>
                </View>

                <View style={styles.upcomingRideContent}>
                  <View style={styles.carIconContainer}>
                    <Image
                      source={{ uri: upcomingRide?.rider?.rideType?.image }}
                      width={50}
                      height={50}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.upcomingRideInfo}>
                    <Text style={styles.upcomingRideLabel}>
                      {upcomingRide?.rider?.rideType?.name.replace(/_/g, " ") ??
                        "Ride"}
                    </Text>
                    <View style={styles.upcomingRideLocation}>
                      <Ionicons name="location" size={14} color="#FFF" />
                      <Text
                        style={styles.upcomingRideAddress}
                        numberOfLines={1}
                      >
                        {upcomingRide?.dropoff?.location ??
                          "No address available"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.upcomingRideFare}>
                    {currency?.code} {upcomingRide?.agreedPrice}
                  </Text>
                </View>
              </View>
            )
          )}

          {/* Ride Requests List */}
          {isDriverApproved && (
            <>
              <FlatList
                data={activeRequests}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing || isRefetching}
                    onRefresh={handleRefresh}
                  />
                }
                ListEmptyComponent={
                  <OfflineScreen isOnline={driverStatus === "online"} />
                }
              />

              <RideDetailsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                rideRequest={selectedRide}
                onAccept={handleAcceptRide}
                onOfferFare={handleOfferFare}
                onEditFare={handleEditFare}
              />

              <FareInputModal
                visible={fareInputVisible}
                onClose={() => {
                  setFareInputVisible(false);
                  setTimeout(() => setModalVisible(true), 100);
                }}
                onOffer={handleCustomFareOffer}
                passengerOffer={selectedRide?.estimatedFare}
              />
            </>
          )}
        </SafeAreaView>
      </GradientBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upcomingRideCard: {
    minHeight: 140,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  upcomingRideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  upcomingRideTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  upcomingRideContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  carIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  upcomingRideInfo: {
    flex: 1,
  },
  upcomingRideLabel: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  upcomingRideLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  upcomingRideAddress: {
    color: "#FFF",
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  upcomingRideFare: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: LIST_HORIZONTAL_PADDING,
    paddingBottom: 64,
    paddingTop: 8,
  },
  swipeableContainer: {
    marginBottom: 12,
  },
  hiddenActions: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 22,
    gap: 4,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 9,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default RideRequestsScreen;
