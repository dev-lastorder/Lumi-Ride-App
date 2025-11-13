import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import CustomText from "@/src/components/ui/Text";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useLogout } from "../../auth/hooks";
import { InfoCard, MiniPofileCard } from "../components";
import { useFetchRiderProfile } from "../hooks/queries";

const profileScreen = () => {
  const { data, isLoading, error, refetch } = useFetchRiderProfile();
  const { mutate: logout, isPending, isError } = useLogout();
  const theme = useTheme();

  console.log("🚀 Profile data:", data);

  const userObject = {
    name: data?.user?.name || "",
    email: data?.user?.email || "",
    profile: data?.user?.profile || "",
    rating: data?.reviewsData?.averageRating || "",
    totalReviews: data?.reviewsData?.totalReviews || "",
  };

  const handleLogout = async () => {
    if (isPending) {
      return;
    }
    try {
      logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      router.navigate("/(tabs)/(rideRequests)");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#DAD5FB" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <CustomText>Something went wrong</CustomText>
        <Button
          title="Retry"
          variant="primary"
          onPress={() => {
            refetch();
          }}
        />
      </View>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <CustomHeader title="Your Profile" showBackButton={false} />
        <ScrollView>
          <View style={globalStyles.containerPadding}>
            <MiniPofileCard userDetails={userObject} />
            <InfoCard
              title="Personal info"
              description="Update your personal and contact details."
              icon="user"
              onPress={() => {
                router.navigate("/(tabs)/(profile)/personal-info");
              }}
            />
            <InfoCard
              title="Payment methods"
              description="Add or Update your saved payment methods."
              icon="card"
              onPress={() => {
                router.navigate("/(tabs)/(profile)/payment-methods");
              }}
            />
            <InfoCard
              title="Support and feedback"
              description="Reach out for help or give feedback on your experience."
              icon="support"
              onPress={() => {
                router.navigate("/(tabs)/(profile)/support");
              }}
            />
            {/* <InfoCard
              title="Security and settings"
              description="Update your password and change app preferences."
              icon="security"
              onPress={() => {
                router.navigate("/(tabs)/(profile)/security");
              }}
            /> */}
          </View>
        </ScrollView>

        <View style={[globalStyles.containerPadding, styles.buttonContainer]}>
          <Button
            title={isPending ? "Logging out..." : "Logout"}
            variant="outline"
            size="medium"
            disabled={isPending}
            style={{ borderRadius: 100, borderColor: theme.colors.colorTextError }}
            textStyle={{color: theme.colors.colorTextError}}
            fullWidth={true}
            onPress={handleLogout}
          />
        </View>
      </View>
    </GradientBackground>
  );
};

export default profileScreen;

const styles = StyleSheet.create({
  image: {
    borderRadius: 200,
    width: 96,
    height: 96,
  },
  imageContainer: {
    display: "flex",
    position: "relative",
    alignItems: "flex-start",
    justifyContent: "center",
    width: 96,
    height: 96,
  },
  icon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 100,
    padding: 6,
  },
  container: {
    flex: 1,
    paddingBottom: Platform.OS === "ios" ? 85 : 60,
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
});
