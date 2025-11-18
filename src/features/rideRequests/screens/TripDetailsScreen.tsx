import twilioService from "@/services/twilio.service";
import { Colors } from "@/src/constants";
import { useDriverLocation } from "@/src/hooks/useDriverLocation";
import { webSocketService } from "@/src/services/socket/webSocketService";
import { setOnGoingRideData } from "@/src/store/slices/onGoingRideSlice";
import { RootState } from "@/src/store/store";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Linking,
    Platform,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "../components/ProfileModal";
import RatingModal from "../components/RatingModal";
import ReviewSubmittedModal from "../components/ReviewSubmittedModal";
import rideRequestsService from "../services";
import Shimmer from "../utils/Shimmer";

const { height } = Dimensions.get("window");

export const TripDetailsScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [rideStatus, setRideStatus] = useState("in_progress");
    const [modalRatingVisible, setModalRatingVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [loadingRide, setLoadingRide] = useState(false)
    const [rideData, setRideData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [waitingTime, setWaitingTime] = useState(900); // 15 * 60
    const [isCallLoading, setIsCallLoading] = useState(false);
    const { currency } = useSelector((state: RootState) => state.appConfig);
    const user = useSelector((state: RootState) => state.auth?.user);
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [modalReveiwSubmitted, setModalReveiwSubmitted] = useState(false)

    const dispatch = useDispatch()
    const { startLocationTracking, stopLocationTracking } = useDriverLocation();



    const onGoingRideData = useSelector(
        (state: RootState) => state.onGoingRide.onGoingRideData
    );


    const driverId = user?.id;
    const customerId = onGoingRideData?.passengerUser?.id || "f5258cbe-d593-440d-9d9c-1203aa003513"; // Hardcoded for testing


    const handleChatButtonPress = () => {
        router.push("/(tabs)/(rideRequests)/chatScreen");
    };

    const handleCallButtonPress = async () => {
        if (!customerId) {
            Alert.alert('Error', 'Customer ID not available');
            return;
        }

        setIsCallLoading(true);
        try {
            console.log('📞 Calling customer:', customerId);
            await twilioService.makeCall(customerId);

            // Navigate to call screen with customer details
            router.push({
                pathname: "/(tabs)/(rideRequests)/callScreen",
                params: {
                    customerId: customerId,
                    customerName: rideData?.passengerUser?.name || "Customer",
                    profileImage: rideData?.passengerUser?.profile_image || "https://avatar.iran.liara.run/public/48",
                },
            });
        } catch (error) {
            console.error('Failed to make call:', error);
            Alert.alert('Call Failed', (error as Error).message);
        } finally {
            setIsCallLoading(false);
        }
    };

    const rideStart = async (rideId: any, rideData: any) => {
        console.log("calling ride start:", rideData)



        try {
            const data = await rideRequestsService.startMyRide(rideId);
            console.log("my ride data", data)
            webSocketService.startRide({
                rideId: rideId,
                genericUserId: rideData?.passengerUser?.id,
            })

            if (data?.message === 'Ride status updated to IN_PROGRESS successfully') {
                setRideStatus("completed");
                setLoadingRide(false);

            }
            setLoadingRide(false);

        } catch (error: any) {
            console.log("Starting a ride error:", error.response)
            setLoadingRide(false);
        }
    }
    const rideCompleted = async (rideId: any, rideData: any) => {
        console.log("calling ride start:", rideId)

        try {
            const data = await rideRequestsService.completeMyRide(rideId);
            console.log("my ride data", data);
            setLoadingRide(true)

            webSocketService.rideCompleted({
                rideId: rideId,
                genericUserId: rideData?.passengerUser?.id,
            })

            if (data?.message === "Ride completed successfully") {
                router.push("/(tabs)/(rideRequests)");
                setLoadingRide(false);
                // Show the rating modal after 10 seconds
                setTimeout(() => {
                    setModalRatingVisible(true);
                }, 10000);
            }

            try {
                stopLocationTracking();
            } catch (error) {
                console.log("Error stopping location tracking:", error);
            }

            setLoadingRide(false);

        } catch (error: any) {
            console.log("completing a ride error:", error.response)
            setLoadingRide(false);
        }
    }

    const fetchActiveRide = useCallback(async () => {
        try {
            const data = await rideRequestsService.acceptRideRequest();
            console.log("✅ Ride result:", data);

            setRideData(data);
            dispatch(setOnGoingRideData(data));


        } catch (err) {
            console.error("❌ Error fetching active ride:", err);
        } finally {
            setLoading(false);
        }
    }, []); // dependencies here if it depends on something (e.g. userId)


    const giveRating = async (ratingData: { comment: string; rating: number }) => {
        setLoadingSubmit(true);
        try {

            console.log("Rating submitted:", ratingData);
            console.log("id is :", onGoingRideData?.passengerUser?.id)
            console.log('rating data', ratingData)


            const rideId = await rideRequestsService.getMyRiderId();
            console.log("Rider ID response:", rideId);
            const reviewerId = rideId?.riderId;

            const payload = {
                description: ratingData.comment,
                rating: ratingData.rating,
                reviewedId: onGoingRideData?.passengerUser?.id,
                rideId: onGoingRideData?.riderId,
                // reviewerId: rideId?.riderId,
            };

            const result = await rideRequestsService.giveDriverRating(payload, reviewerId);
            console.log("Server response:", result);
            if (result) {
                // router.replace("/(tabs)/(rideRequests)/rideRequest")
                setModalReveiwSubmitted(true);
                setLoadingSubmit(false);
                setModalRatingVisible(false);
            }
            setLoadingSubmit(false);

        } catch (error: any) {
            console.log("Error giving rating:", error.response);
            setLoadingSubmit(false);
        }
    };

    const handleOpenInMaps = (lat: number, lng: number) => {
        const label = "Destination";
        const url =
            Platform.select({
                ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`,
                android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
            }) || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        Linking.openURL(url).catch(() => {
            // fallback to Google Maps in browser if app not available
            const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            Linking.openURL(fallbackUrl);
        });
    };


    const handleShareRide = async () => {
        if (!rideData) return;

        try {
            const shareMessage = `
                        🚗 Ride Details:
                        📍 Pickup: ${rideData.pickup_location}
                        🏁 Drop-off: ${rideData.dropoff_location}
                        💰 Fare: £${rideData.agreed_price}
                        💳 Payment: ${rideData.payment_via}
                        👤 Passenger: ${rideData.passengerUser?.name}

                        Track on map:
                        Pickup → https://www.google.com/maps?q=${rideData.pickup?.lat},${rideData.pickup?.lng}
                        Drop-off → https://www.google.com/maps?q=${rideData.dropoff?.lat},${rideData.dropoff?.lng}
                            `.trim();

                                    await Share.share({
                                        message: shareMessage,
                                        title: "Share My Ride",
                                    });
                                } catch (error) {
                                    console.error("❌ Error sharing ride:", error);
                                }
                            };



    useFocusEffect(
        // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
        useCallback(() => {
            // Invoked whenever the route is focused.
            console.log("Hello, I'm focused!");
            startLocationTracking();

            // Return function is invoked whenever the route gets out of focus.
            return () => {
                console.log('This route is now unfocused.');
            };
        }, []),
    );



    useEffect(() => {
        fetchActiveRide()

    }, [fetchActiveRide])

    useEffect(() => {
        if (!rideData) {
            return;
        }
        if (rideData.status === "ASSIGNED") {
            setRideStatus("started")

        } else if (rideData.status === 'IN_PROGRESS') {
            setRideStatus("completed");
        }

    }, [rideData])


    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (rideStatus === "in_progress") {
            interval = setInterval(() => {
                setWaitingTime((prev) => prev + 1);
            }, 100);
        } else {
            if (interval) clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [rideStatus]);


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };
    const origin = useMemo(() => {
        return {
            latitude: rideData?.pickup?.lat ?? 0,
            longitude: rideData?.pickup?.lng ?? 0,
        };
    }, [rideData]);

    const destination = useMemo(() => {
        return {
            latitude: rideData?.dropoff?.lat ?? 0,
            longitude: rideData?.dropoff?.lng ?? 0,
        };
    }, [rideData]);






    return (
        <View style={{ flex: 1, }}>

            {/* <RideMap
                origin={origin}
                destination={destination}
                rideRequest={rideData} /> */}


            {rideStatus === 'in_progess' && (


                <View style={[styles.etaBar, { paddingTop: insets.top }]}>


                    <View style={styles.leftEtaSection}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </View>
                    <View style={styles.timerWrapper}>
                        <Text style={styles.etaText}>{formatTime(waitingTime)}</Text>
                    </View>




                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.cancelText}>Waiting time </Text>
                                <Text style={styles.etaText}>{formatTime(waitingTime)}</Text>
                            </View> */}


                </View>
            )

            }


            {/* Navigate Button */}
            <TouchableOpacity style={styles.navigateButton} onPress={() => handleOpenInMaps(rideData?.dropoff?.lat, rideData?.dropoff?.lng)}>
                <Ionicons name="navigate" size={24} color="#fff" />
                <Text style={{ color: "#fff", marginTop: 4, fontSize: 16, fontWeight: "600" }}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShareRide}>
                <Feather name="share" size={24} color="black" />
            </TouchableOpacity>

            {/* Bottom Card */}
            <View style={styles.bottomCard}>
                <View style={styles.bottomCardStyle}>
                    <View style={styles.leftSection}>
                        {loading ? (
                            <Shimmer width={60} height={60} borderRadius={30} />
                        ) : (
                            <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
                                <Image
                                    source={{ uri: rideData?.passengerUser?.profile_image || "https://avatar.iran.liara.run/public/48" }}
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                        )

                        }
                        {loading ? (

                            <Shimmer width="70%" height={18} />
                        ) : (
                            <Text style={styles.name}>{rideData?.passengerUser?.name}</Text>
                        )

                        }
                        <Text style={styles.rating}>⭐ {rideData?.passengerUser?.averageRating || '0'}</Text>
                        <Text style={styles.rides}>{rideData?.passengerUser?.noOfReviewsReceived || '0'}</Text>
                    </View>

                    {/* Middle Section */}
                    <View style={styles.middleSection}>
                        <View style={styles.section}>
                            <Image
                                source={require("@/assets/images/toIcon.png")}
                                style={styles.iconImage}
                            />
                            {loading ? (
                                <Shimmer width="90%" height={24} />
                            ) : (

                                <Text numberOfLines={3} style={styles.value}>{rideData?.pickup_location}</Text>
                            )

                            }
                        </View>

                        <View style={styles.section}>
                            <Image
                                source={require("@/assets/images/fromIcon.png")}
                                style={styles.iconImage}
                            />
                            {loading ? (
                                <Shimmer width="90%" height={24} />
                            ) : (

                                <Text numberOfLines={3} style={styles.value}>{rideData?.dropoff_location}</Text>
                            )

                            }
                        </View>
                        {loading ? (
                            <Shimmer width="70%" height={18} />
                        ) : (

                            <Text style={styles.priceTxt}>{currency?.code} {rideData?.agreed_price}</Text>
                        )

                        }


                    </View>

                    {/* Right Section */}
                    <View style={styles.rightSection}>
                        <TouchableOpacity
                            style={[styles.iconButton, isCallLoading && styles.iconButtonDisabled]}
                            onPress={handleCallButtonPress}
                            disabled={isCallLoading}
                        >
                            <Ionicons name="call-outline" size={18} color="#27272A" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={handleChatButtonPress}>
                            <MaterialCommunityIcons name="message-reply-text-outline" size={18} color="#27272A" />
                        </TouchableOpacity>
                    </View>




                </View>


                <RatingModal
                    visible={modalRatingVisible}
                    rideData={rideData}
                    onClose={() => setModalRatingVisible(false)}
                    loading={loadingSubmit}
                    onSubmit={(rating) => {
                        console.log("Rating submitted:", rating);

                        giveRating(rating);



                    }}
                />

                <ReviewSubmittedModal visible={modalReveiwSubmitted} onClose={() => setModalReveiwSubmitted(false)} />


                <ProfileModal
                    visible={profileModalVisible}
                    onClose={() => setProfileModalVisible(false)}
                    userData={rideData?.passengerUser}
                />
                {loading ? (
                    <View style={{ marginBottom: insets.bottom + 60, alignItems: "center", }}>
                        <Shimmer width="90%" height={40} borderRadius={20} />
                    </View>

                ) : (
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { marginBottom: insets.bottom + 90 },
                            rideStatus === "started" || rideStatus === "completed"
                                ? { backgroundColor: Colors.light.primary }
                                : { backgroundColor: Colors.light.success },
                        ]}
                        onPress={() => {
                            if (loadingRide) return; // prevent multiple taps
                            if (rideStatus === "in_progress") {
                                setRideStatus("started");
                            } else if (rideStatus === "started") {
                                rideStart(rideData?.rideId, rideData);
                            } else if (rideStatus === "completed") {
                                rideCompleted(rideData?.rideId, rideData);
                            }
                        }}
                        activeOpacity={0.8}
                    >
                        {loadingRide ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : rideStatus === "in_progress" ? (
                            <Text style={styles.buttonText}>I’m Here</Text>
                        ) : rideStatus === "started" ? (
                            <Text style={styles.buttonText}>Start Ride</Text>
                        ) : (
                            <Text style={styles.buttonText}>Ride Completed</Text>
                        )}
                    </TouchableOpacity>

                )

                }

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    etaBar: {
        position: "absolute",
        top: 20,
        alignSelf: "center",
        width: "90%",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    etaText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    etaSubText: {
        fontSize: 12,
        color: "#666",
    },
    leftEtaSection: {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 10,
    },
    bottomCardStyle: {
        backgroundColor: Colors.dark.text,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        paddingTop: 20,
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 5,
    },
    bottomCard: {
        position: "absolute",
        bottom: 0,
        height: height * 0.42,
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 6,
        elevation: 6,
    },
    section: {
        marginBottom: 15,
        flexDirection: "row",
        gap: 4,
        width: "80%",
    },
    title: {
        fontSize: 14,
        color: "#888",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        flex: 1,
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: Colors.light.success,
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    leftSection: {
        alignItems: "center",
        marginRight: 15,
        width: 80,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 30,
        marginBottom: 6,
    },
    iconImage: {
        width: 15,
        height: 15,
        marginTop: 2,
    },
    name: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    rating: {
        fontSize: 13,
        color: "#333",
    },
    rides: {
        fontSize: 12,
        color: "grey",
    },
    middleSection: {
        flex: 1,
        justifyContent: "center",
    },
    rightSection: {
        justifyContent: "space-around",
        alignItems: "center",
    },
    iconButton: {
        marginVertical: 6,
        borderWidth: 1,
        borderRadius: 20,
        padding: 5,
        borderColor: "#1691BF",
    },
    icon: {
        fontSize: 22,
    },
    priceTxt: {
        fontSize: 16,
        marginLeft: 20,
        color: Colors.light.danger,
        fontWeight: "bold",
    },
    cancelText: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },
    timerWrapper: {
        alignItems: "center",
    },
    navigateButton: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        gap: "2",
        bottom: height * 0.42 + 10,
        left: 20,
        backgroundColor: "#000000",
        width: 140,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    shareButton: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        gap: "2",
        bottom: height * 0.42 + 10,
        right: 20,
        backgroundColor: "#ffff",
        padding: 10,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    }
});
