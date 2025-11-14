import { CountdownTimer } from "@/src/components/common";
import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UpcomingScheduledRideCardProps {
  scheduledFor: string | Date;
  onIAmHere?: () => void;
}

const UpcomingScheduledRideCard: React.FC<UpcomingScheduledRideCardProps> = ({
  scheduledFor,
  onIAmHere,
}) => {
  const { colors } = useTheme();
  const [isPickupTime, setIsPickupTime] = useState(false);

  const handleTimerTick = (timeLeft: any, isNowPickupTime: boolean) => {
    // Update pickup time state on every tick
    if (isNowPickupTime !== isPickupTime) {
      setIsPickupTime(isNowPickupTime);
    }
  };

  return (
    <View
      style={[
        styles.upcomingRideCard,
        { backgroundColor: colors.primaryGradient },
      ]}
    >
      <View style={styles.leftSection}>
        <CustomText style={styles.upcomingRideTitle}>
          Start ride after
        </CustomText>
        <CountdownTimer
          scheduledFor={scheduledFor}
          startBeforeMinutes={30}
          onTimerTick={handleTimerTick}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.imHereButton,
          isPickupTime && {
            backgroundColor: "#FFF",
            borderColor: "#FFF",
          },
          !isPickupTime && {
            opacity: 0.5,
          },
        ]}
        activeOpacity={0.7}
        disabled={!isPickupTime}
        onPress={onIAmHere}
      >
        <Text
          style={[
            styles.imHereText,
            isPickupTime && { color: colors.primaryGradient },
          ]}
        >
          I'm here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpcomingScheduledRideCard;

const styles = StyleSheet.create({
  upcomingRideCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 100,
    marginBottom: 16,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  leftSection: {
    flex: 1,
  },
  upcomingRideTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  imHereButton: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  imHereText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
