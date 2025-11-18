import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import CustomText from "@/src/components/ui/Text";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import { canCancelRide, isInTimerWindow } from "@/src/utils/helper";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomModal from "../components/BottomModal";
import InstructionDetailsCard from "../components/InstructionDetailsCard";
import PassengerDetailsCard from "../components/PassengerDetailsCard";
import PaymentDetailsCard from "../components/PaymentDetailsCard";
import RideDetailsCard from "../components/RideDetailsCard";
import RideRoutesDetailsCard from "../components/RideRoutesDetailsCard";
import RideStatusDetailsCard from "../components/RideStatusDetailsCard";
import SchedualDetailsCard from "../components/SchedualDetailsCard";
import UpcomingScheduledRideCard from "../components/UpcomingScheduledRideCard";
import { useCancelScheduledRideRequest } from "../hooks/mutations/useCancelScheduledRide";

const OrderDetail = () => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const [isVisible, setisVisible] = useState(false);
  const { request } = useLocalSearchParams<{ request: string }>();
  const rideRequest = JSON.parse(request);
  console.log(
    "🚀 ~ OrderDetail ~ rideRequest:",
    JSON.stringify(rideRequest, null, 2)
  );

  const { mutate: cancelRide, isPending: isCanceling } =
    useCancelScheduledRideRequest();

  const handleCancel = () => {
    cancelRide(rideRequest.id, {
      onSuccess: () => {
        console.log("Ride cancelled successfully");
        setisVisible(false); // ✅ Close modal only after success
      },
      onError: (error) => {
        console.error("Error canceling ride request:", error);
        setisVisible(false); // ✅ Close modal only after error
      },
    });
  };

  const riderDetailsObj = {
    type: rideRequest.is_hourly ? "Hourly Ride" : "Ride",
    price: `QAR ${rideRequest.estimatedFare}`,
    image: rideRequest.rideImage,
  };

  const passengerDetailsObj = {
    name: rideRequest.passenger?.name,
    image: rideRequest.passenger?.passengerImage,
    phoneNumber: rideRequest.passenger?.phoneNumber,
  };

  const schedualDetailsObj = {
    day: new Date(rideRequest?.requestTime).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: new Date(rideRequest?.requestTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };

  const paymentDetailsObj = {
    method: rideRequest?.paymentMethod,
  };

  const rideRoutesDetailsObj = {
    startLocation: rideRequest.pickupLocation.address,
    endLocation: rideRequest.dropoffLocation.address,
  };

  const rideStatusDetailsObj = {
    status: rideRequest.status,
  };

  const shouldShowTimerCard = isInTimerWindow(rideRequest.scheduledFor, 30);

  const shouldShowCancelButton = canCancelRide(rideRequest.scheduledAt, 5);

  return (
    <>
      <GradientBackground>
        <View style={styles.container}>
          <CustomHeader title="Ride Detail" />
          <View
            className="bg-white border border-[#E4E4E7] w-10 h-10 rounded-full items-center justify-center"
            style={{
              position: "absolute",
              top: inset.top,
              right: 15,
              zIndex: 50,
              elevation: 10,
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          ></View>

          <ScrollView
            style={[globalStyles.containerPadding]}
            contentContainerStyle={{ paddingBottom: inset.bottom }}
            showsVerticalScrollIndicator={false}
          >
            {shouldShowTimerCard && (
              <UpcomingScheduledRideCard
                scheduledFor={rideRequest.scheduledFor}
              />
            )}
            <RideDetailsCard details={riderDetailsObj} />
            <PassengerDetailsCard details={passengerDetailsObj} />
            <SchedualDetailsCard details={schedualDetailsObj} />
            <PaymentDetailsCard details={paymentDetailsObj} />
            <RideRoutesDetailsCard details={rideRoutesDetailsObj} />
            <RideStatusDetailsCard details={rideStatusDetailsObj} />
            <InstructionDetailsCard />
            {rideRequest.status !== "cancelled" && shouldShowCancelButton && (
              <View
                style={[globalStyles.containerPadding, styles.buttonContainer]}
              >
                <Button
                  title={isCanceling ? "Cancelling..." : "Cancel the ride"}
                  variant="outline"
                  size="medium"
                  disabled={isCanceling}
                  style={{
                    borderRadius: 100,
                    borderColor: theme.colors.colorTextError,
                  }}
                  textStyle={{ color: theme.colors.colorTextError }}
                  fullWidth={true}
                  onPress={() => setisVisible(true)}
                />
              </View>
            )}
          </ScrollView>
        </View>
        <BottomModal
          visible={isVisible}
          onClose={() => setisVisible(false)}
          title="Are you sure?"
        >
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.colorTextError },
            ]}
            onPress={handleCancel}
            disabled={isCanceling}
          >
            <CustomText style={styles.cancelButtonText}>
              {isCanceling ? "Cancelling..." : "Yes, cancel the ride"}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            onPress={() => setisVisible(false)}
            disabled={isCanceling}
          >
            <CustomText style={styles.continueButtonText}>
              No, Continue the ride
            </CustomText>
          </TouchableOpacity>
        </BottomModal>
      </GradientBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  button: {
    flexDirection: "row",
    borderRadius: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  // cancelButton: {
  //   backgroundColor: useTheme().colors.colorTextError,
  // },
  continueButton: {
    backgroundColor: "#F4F4F5",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
  },
  continueButtonText: {
    textAlign: "center",
    flex: 1,
  },
});

export default OrderDetail;
