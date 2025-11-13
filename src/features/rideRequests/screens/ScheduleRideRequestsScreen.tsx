import { CustomHeader, GradientBackground } from "@/src/components/common";
import { globalStyles } from "@/src/constants";
import { useDriverStatus } from "@/src/hooks/useDriverStatus";
import React, { useMemo, useRef, useState } from "react";
import { Animated, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { OfflineScreen, RideCard } from "../components";
import { useScheduledRideRequests } from "../hooks/queries";

export const ScheduleRideRequestsScreen: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { driverStatus } = useDriverStatus();
  const swipeableRefs = useRef(new Map());

  // Fetch ride requests from API
  const {
    data: rideRequests = [],
    isRefetching,
    refetch,
  } = useScheduledRideRequests();

  const requests = useMemo(() => {
    if (!rideRequests?.data) return [];
    return rideRequests?.data?.map((item: any) => ({
      id: item.rideId,
      profileImg: item?.passenger?.profile,
      passenger: {
        id: item.passenger?.id,
        name: item.passenger?.name,
        phoneNumber: item.passenger?.phone ?? "",
        rating: 0, // Not present in response
        totalRides: 0, // Not present in response
      },
      passengerId: item.passenger?.id,
      pickupLocation: {
        latitude: item.pickup?.coordinates?.lat,
        longitude: item.pickup?.coordinates?.lng,
        address: item.pickup?.location || "Pickup Location",
      },
      dropoffLocation: {
        latitude: item.dropoff?.coordinates?.lat,
        longitude: item.dropoff?.coordinates?.lng,
        address: item.dropoff?.location || "Dropoff Location",
      },
      requestTime: item.scheduledAt ?? item.createdAt,
      estimatedFare:
        typeof item.agreedPrice === "number" ? item.agreedPrice : 0,
      distance: 0, // Not present in response
      estimatedDuration: 0, // Not present in response
      status: item.status ? item.status.toLowerCase() : "",
      rideType: item.isHourly
        ? "hourly"
        : item.isFamily
        ? "family"
        : item.rideType?.name?.toLowerCase() || "standard",
      paymentMethod: item.paymentVia ? item.paymentVia.toLowerCase() : "",
      specialInstructions: null,
      rideTypeId: item.rideType?.id,
    }));
  }, [rideRequests]);

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

  // Close other swipeables when one is opened
  const handleSwipeableOpen = (id: string) => {
    swipeableRefs.current.forEach((ref, key) => {
      if (key !== id && ref) {
        ref.close();
      }
    });
  };

  // Render right actions (swipe left)
  const renderRightActions = (progress: any, dragX: any, item: any) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });

    return (
      <View style={styles.swipeActionsContainer}>
        <View style={styles.swipeActions}>
          {/* Accept Button */}
          <Animated.View
            style={[
              styles.swipeAction,
              styles.acceptAction,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.swipeActionButton}
              onPress={() => {
                swipeableRefs.current.get(item.id)?.close();
                console.log("Accept ride:", item.id);
                // Add your accept logic here
              }}
            >
              <Text style={styles.swipeActionText}>Accept</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Reject Button */}
          <Animated.View
            style={[
              styles.swipeAction,
              styles.rejectAction,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.swipeActionButton}
              onPress={() => {
                swipeableRefs.current.get(item.id)?.close();
                console.log("Reject ride:", item.id);
                // Add your reject logic here
              }}
            >
              <Text style={styles.swipeActionText}>Reject</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  };

  const renderSwipeableItem = ({ item }: { item: any }) => (
    <Swipeable
      ref={(ref) => {
        if (ref) {
          swipeableRefs.current.set(item.id, ref);
        } else {
          swipeableRefs.current.delete(item.id);
        }
      }}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
      onSwipeableOpen={() => handleSwipeableOpen(item.id)}
      onSwipeableClose={() => {
        // Optional: handle close if needed
      }}
    >
      <RideCard
        rideRequest={item}
        onMenuPress={(rideRequest) =>
          console.log("Menu pressed for ride:", rideRequest.id)
        }
        onPress={() => console.log("Ride pressed", item.id)}
      />
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GradientBackground style={{ flex: 1 }}>
        <CustomHeader title="Scheduled Rides" showBackButton={false} />
        <View style={[styles.container, globalStyles.containerPadding]}>
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={renderSwipeableItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing || isRefetching}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              <OfflineScreen
                isOnline={driverStatus === "online"}
                title="No Scheduled Requests"
                description="Currently you do not have any scheduled ride."
              />
            }
          />
        </View>
      </GradientBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 64,
    paddingTop: 8,
    gap: 8,
  },
  swipeActionsContainer: {
    width: 180,
    flexDirection: "row",
  },
  swipeActions: {
    flex: 1,
    flexDirection: "row",
  },
  swipeAction: {
    width: 90,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  swipeActionButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  acceptAction: {
    backgroundColor: "#4CAF50", // Green
  },
  rejectAction: {
    backgroundColor: "#F44336", // Red
  },
  swipeActionText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ScheduleRideRequestsScreen;