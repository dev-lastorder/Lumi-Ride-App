import Button from '@/src/components/ui/Button /index';
import { Colors } from '@/src/constants';
import { useTheme } from '@/src/context/ThemeContext';
import { webSocketService } from '@/src/services/socket/webSocketService';
import { selectUser } from '@/src/store/selectors/authSelectors';
import { RootState } from '@/src/store/store';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView from "react-native-maps";
import { useSelector } from 'react-redux';
import rideRequestsService from '../services';
import { RideRequest } from '../types';
import RideInfoCard from './RideInfoCard';
import RideMap from './RideMap';
import SuccessModal from '@/src/components/common/SuccessModal';

interface RideDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  rideRequest: RideRequest | null;
  onAccept?: (fare: number) => void;
  onOfferFare?: (fare: number) => void;
  onEditFare?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RideDetailsModal: React.FC<RideDetailsModalProps> = ({
  visible,
  onClose,
  rideRequest,
  onAccept,
  onOfferFare,
  onEditFare,
}) => {
  const { colors } = useTheme();
  const mapRef = useRef<MapView | null>(null);
  const [isOffering, setIsOffering] = useState(false);
  const progress = useRef(new Animated.Value(100)).current;
  const user = useSelector(selectUser);
  const { currency } = useSelector((state: RootState) => state.appConfig);
  const [loadingRequest, setLoadingRequest] = useState(false);

  const zoneId = useSelector((state: RootState) => state.zone);

  const [region, setRegion] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedFare, setSelectedFare] = useState<number | null>(null);
  const [myRiderId, setMyRiderId] = useState("");
  const [showScheduledModal, setShowScheduledModal] = useState(false);


  const defaultFare = rideRequest?.estimatedFare || 0;
  const fareOptions = [
    { label: `${currency?.code}${Math.round(defaultFare * 1.1)}`, value: Math.round(defaultFare * 1.1) },
    { label: `${currency?.code}${Math.round(defaultFare * 1.2)}`, value: Math.round(defaultFare * 1.2) },
    { label: `${currency?.code}${Math.round(defaultFare * 1.3)}`, value: Math.round(defaultFare * 1.3) },
  ];


  useEffect(() => {
    const fetchRiderData = async () => {
      try {
        const data = await rideRequestsService.getMyRiderId();
        console.log("Rider ID response:", data);
        setMyRiderId(data?.riderId);
      } catch (error) {
        console.error("Error fetching rider ID:", error);
      }
    };

    fetchRiderData();
  }, []);


  const handleAccept = async (rideRequest: any) => {

    setLoadingRequest(true)

    console.log('i am handling accept', user?.id)
    if (!user?.id || !rideRequest?.id || !rideRequest?.passenger?.id) {
      console.warn("🚫 Missing required IDs for placing bid");
      setLoadingRequest(false)
      return;
    }
    const result = await rideRequestsService.checkRideAmount(
      rideRequest?.id,
      zoneId.zoneId
    );


    if (result?.haveEnoughAmountInWallet === true) {
      setLoadingRequest(false)
      webSocketService.placeBid({
        riderId: myRiderId || "1ba44a89-16d1-4280-820c-3f66262bb843",
        rideRequestId: rideRequest?.id,
        price: defaultFare,
        startType: rideRequest?.rideType
      });

      setIsOffering(true);
      Animated.timing(progress, {
        toValue: 0,
        duration: 10000,
        useNativeDriver: false,
      }).start(() => {
        setIsOffering(false);
        onClose();
      });
    }


    // 🧩 Handle failed API safely
    if (result?.error) {
      setLoadingRequest(false)
      Alert.alert(
        "Ride Amount Check Failed",
        result?.error?.message?.[0] ||
        result?.error?.message ||
        "Could not verify your account balance. Please try again.",
        [{ text: "OK" }]
      );
      return;
    }

    // ✅ Handle insufficient wallet balance (corrected key)
    if (result?.haveEnoughAmountInWallet === false) {
      setLoadingRequest(false)
      Alert.alert(
        "Insufficient Balance",
        "You don’t have enough balance in your wallet to accept this ride. Please recharge your account.",
        [{ text: "OK" }]
      );
      return;
    }


  };


  const handleOfferFare = async (fare: number) => {
    onOfferFare?.(fare);
    console.log('i am handling accept', user?.id)
    if (!user?.id || !rideRequest?.id || !rideRequest?.passenger?.id) {
      console.warn("🚫 Missing required IDs for placing bid");
      return;
    }

    const result = await rideRequestsService.checkRideAmount(
      rideRequest?.id,
      zoneId.zoneId
    );


    if (result?.haveEnoughAmountInWallet === true) {
      webSocketService.placeBid({
        riderId: myRiderId || "1ba44a89-16d1-4280-820c-3f66262bb843",

        rideRequestId: rideRequest?.id,
        price: fare,
        startType: rideRequest?.rideType
        // userId: rideRequest?.passenger?.id,
      });
      
      setIsOffering(true);
      Animated.timing(progress, {
        toValue: 0,
        duration: 10000,
        useNativeDriver: false,
      }).start(() => {
        setIsOffering(false);
        onClose();
      });

    }
    // 🧩 Handle failed API safely
    if (result?.error) {
      setLoadingRequest(false)
      Alert.alert(
        "Ride Amount Check Failed",
        result?.error?.message?.[0] ||
        result?.error?.message ||
        "Could not verify your account balance. Please try again.",
        [{ text: "OK" }]
      );
      return;
    }

    // ✅ Handle insufficient wallet balance (corrected key)
    if (result?.haveEnoughAmountInWallet === false) {
      setLoadingRequest(false)
      Alert.alert(
        "Insufficient Balance",
        "You don’t have enough balance in your wallet to accept this ride. Please recharge your account.",
        [{ text: "OK" }]
      );
      return;
    }

  };





  // useEffect(() => {
  //   // ✅ Listen for bid accepted event
  //   const unsubscribe = webSocketService.onBidAccepted((data) => {
  //     console.log('🎯 Bid accepted event received:', data);

  //     // Example data: { rideRequestId, ride_request_is_now_ride, message }

  //     if (data.message === 'Your bid was accepted. Ride started!') {
  //       console.log("Your bid was accepted. Ride started!")
  //       // ✅ Navigate and update UI
  //       router.push('/tripDetail');
  //       onClose?.();
  //       // Optional: set offering state if needed
  //       // setIsOffering(true);
  //     }
  //   });

  //   return () => {
  //     unsubscribe(); // Cleanup listener on unmount
  //   };
  // }, []);


  const origin = {
    latitude: rideRequest?.pickupLocation?.latitude ?? 0,
    longitude: rideRequest?.pickupLocation?.longitude ?? 0,
  };

  const destination = {
    latitude: rideRequest?.dropoffLocation?.latitude ?? 0,
    longitude: rideRequest?.dropoffLocation?.longitude ?? 0,
  };


  // console.log("ride request in detail screen :", rideRequest)


  if (!rideRequest) return null;



  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <Text style={[styles.headerTitle, { color: colors.text }]}>Ride Details</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Map Container */}
          <View style={[styles.mapContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.mapPlaceholder}>
              <RideMap
                origin={origin}
                destination={destination}
                rideRequest={rideRequest}
              />
              {/* Route visualization */}
              {/* <View style={styles.routeVisualization}>
              <View style={[styles.carIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="car" size={20} color="#FFF" />
              </View>
              <View style={styles.routePath}>
                <View style={[styles.routeSegment, { backgroundColor: colors.primary }]} />
                <View style={[styles.routeSegment, { backgroundColor: colors.success }]} />
              </View>
              <View style={[styles.destinationIcon, { backgroundColor: colors.danger }]} />
            </View> */}

              {/* Distance and time badges */}
              <View style={[styles.distanceBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>10 min</Text>
                <Text style={styles.badgeSubtext}>3.9 km</Text>
              </View>
              <View style={[styles.timeBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.badgeText}>7 min</Text>
                <Text style={styles.badgeSubtext}>3.8 km</Text>
              </View>
            </View>
          </View>

          {/* Ride Info */}
          <RideInfoCard
            rideRequest={rideRequest}
            defaultFare={defaultFare}
            colors={colors}
          />

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Button
              title={`Accept for ${currency?.code}${defaultFare.toFixed(0)}`}
              onPress={() => handleAccept(rideRequest)}
              variant="primary"
              loading={loadingRequest}
              fullWidth
              style={[styles.acceptButton, { backgroundColor: colors.primary }]}
            />
            


            <Text style={[styles.offerText, { color: colors.textSecondary }]}>
              Offer your fare
            </Text>

            <View style={styles.fareOptions}>
              {fareOptions.map((option, index) => (
                <TouchableOpacity
                  key={`${option.value}-${index}`} // ensures uniqueness even if value is 0
                  style={[
                    styles.fareOption,
                    {
                      borderColor: colors.border,
                      backgroundColor: selectedFare === option.value ? colors.primary : colors.background
                    }
                  ]}
                  onPress={() => {
                    setSelectedFare(option.value);
                    handleOfferFare(option.value, rideRequest);
                  }}
                >
                  <Text style={[
                    styles.fareOptionText,
                    { color: selectedFare === option.value ? '#FFF' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.fareOption, styles.editOption, { borderColor: colors.border }]}
                onPress={() => {
                  console.log('Edit button pressed in modal');
                  onEditFare?.();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>


          {isOffering && (
            <View style={styles.offerOverlay}>
              {/* Centered text */}
              <View style={styles.overlayTextContainer}>
                <Text style={styles.offerTitle}>Offering your fare</Text>
                <Text style={styles.offerFare}>{currency?.code} {selectedFare || defaultFare}</Text>
                <Text style={styles.offerSubtext}>Wait for the reply</Text>
              </View>

              {/* Bottom card */}
              <Animated.View style={styles.bottomCard}>
                <View >
                  <RideInfoCard
                    rideRequest={rideRequest}
                    defaultFare={defaultFare}
                    colors={colors}
                  />
                </View>

                <View style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: progress.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
              </Animated.View>
            </View>
          )}


          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <SuccessModal
        visible={showScheduledModal}
        onClose={() => setShowScheduledModal(false)}
        title="Ride Scheduled!"
        subtitle="See all scheduled rides"
        buttonText="Scheduled Rides"
        onButtonPress={() => {
          setShowScheduledModal(false);
          setTimeout(() => {
            onClose();
            setTimeout(() => {
              router.replace('/(tabs)/(scheduledRides)');
            }, 100);
          }, 100);
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width:'110%',


  },
  header: {
    paddingTop: 30,
    position: 'absolute',
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
    padding: 8,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  mapContainer: {
    height: screenHeight * 0.35,
    borderRadius: 0,  // remove rounding
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: screenWidth,
  },
  mapPlaceholder: {
    flex: 1,
    position: 'relative',
  },
  routeVisualization: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    right: '20%',
    height: '60%',
    alignItems: 'center',
  },
  carIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  routePath: {
    flex: 1,
    width: 4,
    justifyContent: 'space-between',
  },
  routeSegment: {
    flex: 1,
    width: 4,
    marginVertical: 2,
  },
  destinationIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  distanceBadge: {
    position: 'absolute',
    top: 40,
    right: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBadge: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeSubtext: {
    color: '#FFF',
    fontSize: 10,
  },
  rideInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  fareSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  passengerName: {
    fontSize: 14,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'transparent',
  },
  routeAddress: {
    fontSize: 14,
    flex: 1,
  },
  metaInfo: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionSection: {
    paddingHorizontal: 20,
  },
  acceptButton: {
    borderRadius: "6%",
    marginBottom: 16,
  },
  offerText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 12,
  },
  fareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fareOption: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editOption: {
    maxWidth: 50,
  },
  fareOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },


  iconContainer: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  badges: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },



  offerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  overlayTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  offerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },

  offerFare: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },

  offerSubtext: {
    color: '#CCCCCC',
    fontSize: 16,
  },

  bottomCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },

  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.common.progressFill,
    borderRadius: 10,
  },

});

export default RideDetailsModal;