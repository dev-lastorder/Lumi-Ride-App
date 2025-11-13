import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Heading, ProfileFormTextField } from "../components";
import { useUpdateRiderProfile } from "../hooks/mutations";
import { useFetchRiderProfile } from "../hooks/queries";

const editName = () => {
  const { data, isLoading, error, refetch } = useFetchRiderProfile();

  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateRiderProfile();

  const name = data?.user?.name || "";
  const [userName, setuserName] = useState(name);

  useEffect(() => {
    if (data?.user?.name) {
      setuserName(data.user.name);
    }
  }, [data?.user?.name]);

  const isDisabled = () => {
    if (userName === name || userName.length === 0 || isUpdating) {
      return true;
    }
    return false;
  };

  const handleUpdateProfile = async () => {
    if (isDisabled() || isUpdating) {
      return;
    }
    try {
      await updateProfile({ name: userName });
      if (!isUpdating) {
        router.back();
      }
    } catch (error) {
      console.error("Failed to update name:", error);
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
        <Text>Something went wrong</Text>
        <Button
          title="Retry"
          variant="primary"
          onPress={() => {
            refetch;
          }}
        />
      </View>
    );
  }

  const theme = useTheme();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <CustomHeader isTitleVisible={false} />

        <View style={styles.content}>
          <View style={[globalStyles.containerPadding]}>
            <Heading
              title="Name"
              description="This is the name you would like other people to use when referring you."
            />
            <View style={globalStyles.containerPadding}>
              <ProfileFormTextField
                label="Full name"
                input={userName}
                setinput={setuserName}
              />
            </View>
          </View>
        </View>

        <View style={[globalStyles.containerPadding, styles.buttonContainer]}>
          <Button
            title={isUpdating ? "Updating..." : "Update"}
            variant="primary"
            size="medium"
            disabled={isDisabled()}
            style={{ borderRadius: 100 }}
            fullWidth={true}
            onPress={handleUpdateProfile}
          />
        </View>
      </View>
    </GradientBackground>
  );
};

export default editName;

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
