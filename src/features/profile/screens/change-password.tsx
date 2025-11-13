import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Heading, ProfileFormTextField } from "../components";
import { useUpdateRiderPassword } from "../hooks/mutations";

const ChangePassword = () => {
  const theme = useTheme();

  const {
    mutateAsync: updatePassword,
    isPending: isUpdating,
    status,
  } = useUpdateRiderPassword();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isDisabled = () => {
    if (formData.currentPassword.length === 0 ||
      formData.newPassword.length === 0 ||
      formData.confirmPassword.length === 0 ||
      isUpdating
    ) {
      return {mesage: "Please fill all fields", disabled: true};
    } else if (formData.newPassword !== formData.confirmPassword) {
      return {mesage: "New password and confirm password do not match", disabled: true};
    } else if (formData.currentPassword === formData.newPassword) {
      return {mesage: "New password must be different from current password", disabled: true};
    }
    return {mesage: "", disabled: false};
  };


  const handleInputChange = (
    text: string,
    field: "currentPassword" | "newPassword" | "confirmPassword"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: text,
    }));
  };

  const handleUpdateProfile = async () => {
    // if (isDisabled() || isUpdating) {
    //   return;
    // }
    try {
      await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      if (!isUpdating) {
        router.back();
      }
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <CustomHeader isTitleVisible={false} />
        <View style={styles.content}>
          <View style={[globalStyles.containerPadding]}>
            <Heading
              title="Change Password"
              description="Change your password by entering your current and new password."
            />
            <View style={globalStyles.containerPadding}>
              <ProfileFormTextField
                label="Current password"
                input={formData.currentPassword}
                setinput={(text) => handleInputChange(text, "currentPassword")}
                placeholder="Enter current password"
                instructions="wrong password"
              />
              <ProfileFormTextField
                label="New password"
                input={formData.newPassword}
                setinput={(text) => handleInputChange(text, "newPassword")}
                placeholder="Enter new password"
              />
              <ProfileFormTextField
                label="Confirm new password"
                input={formData.confirmPassword}
                setinput={(text) => handleInputChange(text, "confirmPassword")}
                placeholder="Enter confirm new password"
              />
            </View>
          </View>
        </View>

        <View style={[globalStyles.containerPadding, styles.buttonContainer]}>
          <Button
            title={isUpdating ? "Updating..." : "Update"}
            variant="primary"
            size="medium"
            // disabled={isDisabled()}
            style={{ borderRadius: 100 }}
            fullWidth={true}
            onPress={()=> handleUpdateProfile()}
          />
        </View>
      </View>
    </GradientBackground>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
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
