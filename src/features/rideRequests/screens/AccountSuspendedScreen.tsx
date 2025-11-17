import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IAccountSuspendedScreen {
  reason: string;
  isPending?: boolean;
}

const AccountSuspendedScreen = ({
  reason,
  isPending,
}: IAccountSuspendedScreen) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image
          resizeMode="contain"
          source={require("@/assets/images/personWithCar.png")}
          style={styles.iconImage}
        />
        <CustomText
          variant="h4"
          weight="semibold"
          style={{ color: theme.colors.colorText }}
        >
          {isPending ? "Waiting for Approval" : "Account Has Been Suspended"}
        </CustomText>

        {!isPending && (
          <CustomText
            variant="bodySmall"
            style={{
              marginTop: 10,
              paddingHorizontal: 20,
              textAlign: "center",
              color: theme.colors.colorText,
              opacity: 0.7,
            }}
          >
            {reason}
          </CustomText>
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          // router.push("/(tabs)/(profile)", { isBack: true });
          router.push({
            pathname: "/(tabs)/(profile)",
            params: { isBack: "true", userId: "123" },
          });
        }}
        style={{
          position: "absolute",
          bottom: insets.bottom,
          minHeight: 45,
          minWidth: "80%",
          backgroundColor: theme.colors.contactSupportBg,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <CustomText
          variant="bodySmall"
          weight="bold"
          style={{
            paddingHorizontal: 20,
            textAlign: "center",
            color: theme.colors.white,
          }}
        >
          Contact Support
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    marginBottom: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 215,
    height: 215,
    marginTop: 2,
  },
});

export default AccountSuspendedScreen;
