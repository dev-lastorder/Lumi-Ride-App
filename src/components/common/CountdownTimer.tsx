import React, { useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

interface CountdownTimerProps {
  scheduledFor: string | Date;
  startBeforeMinutes?: number;
  onTimerTick?: (timeLeft: TimeLeft, isPickupTime: boolean) => void;
  showLabel?: boolean;
  compact?: boolean;
  hideWhenNotActive?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  scheduledFor,
  startBeforeMinutes = 30,
  onTimerTick,
  showLabel = true,
  compact = false,
  hideWhenNotActive = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isPickupTime, setIsPickupTime] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCalledStartRef = useRef(false);
  const hasCalledEndRef = useRef(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      try {
        const now = Date.now();
        const pickupTime = new Date(scheduledFor).getTime();

        // Validate the date
        if (isNaN(pickupTime)) {
          console.error("❌ Invalid scheduledFor date:", scheduledFor);
          return null;
        }

        const startTime = pickupTime - startBeforeMinutes * 60 * 1000;

        // Before the timer window
        if (now < startTime) {
          return null;
        }

        // Past the pickup time
        if (now >= pickupTime) {
          return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
        }

        // Calculate remaining time
        const diff = pickupTime - now;
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return { hours, minutes, seconds, totalSeconds };
      } catch (error) {
        console.error("❌ Error calculating time left:", error);
        return null;
      }
    };

    const updateTimer = () => {
      const calculatedTimeLeft = calculateTimeLeft();

      // Before start window - hide timer
      if (calculatedTimeLeft === null) {
        setShowTimer(false);
        setTimeLeft(null);
        setIsPickupTime(false);
        hasCalledStartRef.current = false;
        hasCalledEndRef.current = false;
        return;
      }

      // In timer window - show timer
      if (!showTimer) {
        setShowTimer(true);
      }

      const isNowPickupTime = calculatedTimeLeft.totalSeconds === 0;
      setTimeLeft(calculatedTimeLeft);
      setIsPickupTime(isNowPickupTime);

      // Call tick callback on every update
      onTimerTick?.(calculatedTimeLeft, isNowPickupTime);
    };

    // Initial calculation
    updateTimer();

    // Set up interval for updates every second
    intervalRef.current = setInterval(updateTimer, 1000);

    // Handle app state changes
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        console.log("🔄 App became active - recalculating timer");
        updateTimer();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription.remove();
    };
  }, [scheduledFor, startBeforeMinutes, onTimerTick]);

  // Hide component if not in timer window and hideWhenNotActive is true
  if (!showTimer || timeLeft === null) {
    return hideWhenNotActive ? null : (
      <View
        style={[
          styles.notActiveContainer,
          compact && styles.compactNotActiveContainer,
        ]}
      >
        <Text
          style={[styles.notActiveText, compact && styles.compactNotActiveText]}
        >
          Timer not started
        </Text>
      </View>
    );
  }

  // Format time with leading zeros
  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <View style={[styles.timerContainer, compact && styles.compactContainer]}>
      <View
        style={[styles.timeContainer, compact && styles.compactTimeContainer]}
      >
        {timeLeft.hours > 0 && (
          <>
            <Text style={[styles.time, compact && styles.compactTime]}>
              {formatTime(timeLeft.hours)}
            </Text>
            <Text
              style={[
                styles.timeSeparator,
                compact && styles.compactTimeSeparator,
              ]}
            >
              :
            </Text>
          </>
        )}
        <Text style={[styles.time, compact && styles.compactTime]}>
          {formatTime(timeLeft.minutes)}
        </Text>
        <Text
          style={[styles.timeSeparator, compact && styles.compactTimeSeparator]}
        >
          :
        </Text>
        <Text style={[styles.time, compact && styles.compactTime]}>
          {formatTime(timeLeft.seconds)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  compactContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notActiveContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  compactNotActiveContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notActiveText: {
    color: "#757575",
    fontSize: 12,
    fontWeight: "600",
  },
  compactNotActiveText: {
    fontSize: 10,
  },
  label: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 6,
  },
  compactLabel: {
    fontSize: 10,
    marginRight: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactTimeContainer: {},
  time: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    minWidth: 22,
    textAlign: "center",
  },
  compactTime: {
    fontSize: 12,
    minWidth: 18,
  },
  timeSeparator: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 2,
  },
  compactTimeSeparator: {
    fontSize: 12,
    marginHorizontal: 1,
  },
  pickupText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  compactPickupText: {
    fontSize: 12,
  },
});

export default CountdownTimer;
