import { useTheme } from '@/src/context/ThemeContext';
import { RootState } from '@/src/store/store';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RideRequest } from '../types';

interface RideCardProps {
  rideRequest: RideRequest;
  onMenuPress?: (rideRequest: RideRequest) => void;
  onPress?: (rideRequest: RideRequest) => void;
}

const paymentMethodCopy: Record<RideRequest['paymentMethod'], string> = {
  cash: 'Cash',
  card: 'Card',
  wallet: 'Wallet',
};

const rideTypeCopy: Record<RideRequest['rideType'], { label: string; background: string; text: string }> = {
  scheduled: { label: 'Scheduled', background: '#FEEFC7', text: '#92400E' },
  standard: { label: 'Standard', background: '#D9F8EE', text: '#03543F' },
  hourly: { label: 'Hourly', background: '#E0E7FF', text: '#3730A3' },
};


const getBadgeColors = (rideType: RideRequest['rideType']) =>
  rideTypeCopy[rideType] || rideTypeCopy.standard;

const getAvatarSource = (rideRequest: RideRequest) =>
  rideRequest.profileImg
    ? { uri: rideRequest?.profileImg }
    : { uri: 'https://avatar.iran.liara.run/public/48' };

const getPassengerRides = (rideRequest: RideRequest) => {

  const passenger = rideRequest?.passenger as RideRequest['passenger'] & {
    totalRides?: number;
    totalRatings?: number;
  };
  return passenger?.totalRides ?? passenger?.totalRatings ?? 0;
};

const formatRelativeTime = (requestTime?: string) => {
  if (!requestTime) {
    return 'Just now';
  }
  const parsed = new Date(requestTime);
  if (Number.isNaN(parsed.getTime())) {
    return requestTime;
  }

  const now = new Date().getTime();
  const diffMs = now - parsed.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatScheduledLabel = (requestTime?: string) => {
  if (!requestTime) {
    return 'Scheduled ride';
  }
  const parsed = new Date(requestTime);
  if (Number.isNaN(parsed.getTime())) {
    return requestTime;
  }
  return parsed.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatTimeUntil = (requestTime?: string) => {
  if (!requestTime) return undefined;
  const parsed = new Date(requestTime);
  if (Number.isNaN(parsed.getTime())) return undefined;

  const diffMs = parsed.getTime() - Date.now();
  if (diffMs <= 0) {
    const elapsedMinutes = Math.abs(Math.floor(diffMs / 60000));
    if (elapsedMinutes < 1) return 'starting now';
    if (elapsedMinutes < 60) return `started ${elapsedMinutes} min ago`;
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    return `started ${elapsedHours}h ago`;
  }

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'starting now';
  if (minutes < 60) return `in ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) {
    return remainingMinutes > 0 ? `in ${hours}h ${remainingMinutes}m` : `in ${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return remHours > 0 ? `in ${days}d ${remHours}h` : `in ${days}d`;
};

const getTravelTimeLabel = (rideRequest: RideRequest) => {
  const scheduleText = formatScheduledLabel(rideRequest.requestTime);
  if (!scheduleText) {
    return undefined;
  }

  const timeUntil = formatTimeUntil(rideRequest.requestTime);
  if (rideRequest.status === 'accepted' && timeUntil) {
    return `Scheduled for ${timeUntil}`;
  }

  if (rideRequest.rideType === 'scheduled') {
    return `Scheduled for ${scheduleText}`;
  }

  return `Requested for ${scheduleText}`;
};

export const RideCard: React.FC<RideCardProps> = ({ rideRequest, onMenuPress, onPress }) => {
  const { colors } = useTheme();
  const { currency } = useSelector((state: RootState) => state.appConfig);
  const badge = useMemo(() => getBadgeColors(rideRequest.rideType), [rideRequest.rideType]);
  const avatarSource = useMemo(() => getAvatarSource(rideRequest), [rideRequest]);
  const totalRides = useMemo(() => getPassengerRides(rideRequest), [rideRequest]);
  const showRequestTime = rideRequest.rideType === 'standard';
  const requestTimeLabel = useMemo(() => formatRelativeTime(rideRequest.requestTime), [
    rideRequest.requestTime,
  ]);
  const travelTimeLabel = useMemo(() => getTravelTimeLabel(rideRequest), [rideRequest]);

  // console.log("ride request card is :", rideRequest);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => onPress?.(rideRequest)}
      activeOpacity={1.0}
    >
      <View style={styles.headerRow}>
        <View style={styles.profileContainer}>
          <Image source={avatarSource} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.passengerName, { color: colors.text }]} numberOfLines={1}>
                {rideRequest?.passenger?.name}
              </Text>
              <View style={[styles.badge, { backgroundColor: badge.background }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
              </View>
            </View>
            <View style={styles.ratingRow}>
              <View style={[styles.ratingChip, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name="star" size={14} color="#FACC15" />
                <Text style={[styles.ratingValue, { color: colors.text }]}>
                  {rideRequest?.passenger?.rating?.toFixed(1)}
                </Text>
              </View>
              <Text style={[styles.ratingTotal, { color: colors.textSecondary }]}>
                {totalRides?totalRides:0} total ratings
              </Text>
            </View>
          </View>
        </View>
        {/* {onMenuPress && (
          <TouchableOpacity style={styles.menuButton} onPress={() => onMenuPress(rideRequest)}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )} */}
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeIconColumn}>
          {/* Pickup dot */}
          <View style={[styles.routeDot, styles.routeDotPrimary, { borderColor: colors.primary }]} />

          {/* Dynamic vertical line */}
          <View style={[styles.routeLine, { backgroundColor: colors.border }]} />

          {/* Add extra dots for stops if any */}
          {rideRequest.stops?.length > 0 && rideRequest.stops.map((_, index) => (
            <React.Fragment key={`stop-dot-${index}`}>
              <View style={[styles.routeDot, { borderColor: colors.secondary || colors.primary, marginVertical: 4 }]} />
              <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
            </React.Fragment>
          ))}

          {/* Drop-off dot */}
          <View style={[styles.routeDot, { borderColor: colors.textSecondary }]} />
        </View>

        <View style={styles.routeDetails}>
          {/* Pickup */}
          <View style={styles.routeRow}>
            <Text style={[styles.routeLabel, { color: colors.textSecondary }]}>Pickup</Text>
            <Text style={[styles.routeText, { color: colors.text }]} numberOfLines={1}>
              {rideRequest?.pickupLocation?.address}
            </Text>
          </View>

          {/* Stops */}
          {rideRequest?.stops?.length > 0 && rideRequest?.stops.map((stop, index) => (
            <View style={styles.routeRow} key={`stop-${index}`}>
              <Text style={[styles.routeLabel, { color: colors.textSecondary }]}>
                Stop {index + 1}
              </Text>
              <Text style={[styles.routeText, { color: colors.text }]} numberOfLines={1}>
                {stop.address}
              </Text>
            </View>
          ))}

          {/* Drop-off */}
          <View style={styles.routeRow}>
            <Text style={[styles.routeLabel, { color: colors.textSecondary }]}>Drop-off</Text>
            <Text style={[styles.routeText, { color: colors.text }]} numberOfLines={1}>
              {rideRequest?.dropoffLocation?.address}
            </Text>
          </View>
        </View>
      </View>


      {travelTimeLabel && (
        <View style={[styles.instructionsChip, { backgroundColor: colors.backgroundSecondary }]}>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
          <Text style={[styles.instructionsText, { color: colors.textSecondary }]} numberOfLines={1}>
            {travelTimeLabel}
          </Text>
        </View>
      )}

      <View style={[styles.metaRow, { borderTopColor: colors.border }]}>
        {showRequestTime && (
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{requestTimeLabel}</Text>
          </View>
        )}
        <View style={styles.metaItem}>
          <Ionicons name="wallet-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {paymentMethodCopy[rideRequest.paymentMethod]}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="navigate-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {rideRequest?.distance?.toFixed(1)} km
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="speedometer-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {rideRequest?.estimatedDuration} min
          </Text>
        </View>
        <Text style={[styles.fare, { color: colors.text }]}>{currency?.code} {rideRequest?.estimatedFare?.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 8,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passengerName: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 6,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 6,
  },
  ratingValue: {
    marginLeft: 3,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingTotal: {
    fontSize: 11,
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  routeIconColumn: {
    alignItems: 'center',
    marginRight: 8,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  routeDotPrimary: {
    marginTop: 2,
    marginBottom: 6,
  },
  routeLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  routeDetails: {
    flex: 1,
    // gap: 2,
  },
  routeRow: {
    paddingVertical: 4,
  },
  routeLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  routeText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  instructionsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  instructionsText: {
    fontSize: 11,
    flex: 1,
    marginLeft: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 11,
  },
  fare: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 'auto',
  },
});

export default RideCard;
