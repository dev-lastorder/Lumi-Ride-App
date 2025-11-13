import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

interface RideInfoCardProps {
  rideRequest: any;
  defaultFare: number;
  colors: any;
}

const RideInfoCard: React.FC<RideInfoCardProps> = ({ rideRequest, defaultFare, colors }) => {

  const { currency } = useSelector((state: RootState) => state.appConfig);

  
  return (
    <View style={styles.rideInfo}>
      {/* Fare + Passenger Section */}
      <View style={styles.fareSection}>
        <Image
          source={{ uri: rideRequest?.profileImg || "https://avatar.iran.liara.run/public/48" }}
          style={styles.passengerAvatar}
        />
        <View style={styles.fareDetails}>
          <Text style={[styles.fareAmount, { color: colors.text }]}>
            {currency?.code} {defaultFare.toFixed(2)}
          </Text>
          <Text style={[styles.passengerName, { color: colors.textSecondary }]}>
            {rideRequest?.passenger?.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FACC15" />
            <Text style={[styles.rating, { color: colors.textSecondary }]}>
              {rideRequest?.passenger?.rating?.toFixed(1) ?? "0.0"}
            </Text>
          </View>
        </View>
      </View>

      {/* Route Details */}
      <View style={styles.routeDetails}>
        <View style={styles.routeItem}>
          <View
            style={[styles.routeDot, styles.routeDotWithHole, { borderColor: colors.success }]}
          />
          <Text
            style={[styles.routeAddress, { color: colors.text }]}
            numberOfLines={1}
          >
            {rideRequest?.pickupLocation?.address}
          </Text>
        </View>
        <View style={styles.routeItem}>
          <View
            style={[styles.routeDot, styles.routeDotWithHole, { borderColor: colors.danger }]}
          />
          <Text
            style={[styles.routeAddress, { color: colors.text }]}
            numberOfLines={1}
          >
            {rideRequest?.dropoffLocation?.address}
          </Text>
        </View>
      </View>

      {/* Meta Info (time + distance) */}
      <View style={styles.metaInfo}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>Just now</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="bicycle-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {rideRequest?.distance?.toFixed(1)} Km
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RideInfoCard;

const styles = StyleSheet.create({
  rideInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  fareSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  passengerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  fareDetails: {
    flex: 1,
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  passengerName: {
    fontSize: 14,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  routeDetails: {
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  routeDotWithHole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  routeAddress: {
    fontSize: 14,
    flex: 1,
  },
  metaInfo: {
    flexDirection: "row",
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
