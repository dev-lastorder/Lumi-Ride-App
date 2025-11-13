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
import PhoneInput, {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";
import { Heading } from "../components";
import { useUpdateRiderProfile } from "../hooks/mutations";
import { useFetchRiderProfile } from "../hooks/queries";

const editPhone = () => {
  const { data, isLoading, error, refetch } = useFetchRiderProfile();

  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateRiderProfile();

  const phone = data?.user?.phone || "";
  const [userPhone, setuserPhone] = useState(phone);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  console.log("🚀 ~ editPhone ~ userPhone:", userPhone)

  useEffect(() => {
    if (data?.user?.phone) {
      setuserPhone(data.user.phone);
    }
  }, [data?.user?.phone]);

  const isDisabled = () => {
    if (userPhone === phone || userPhone.length === 0 || isUpdating) {
      return true;
    }

    // Validate the number
    const isValid = isValidPhoneNumber(userPhone, selectedCountry?.cca2);

    console.log("📞 Valid phone number:", isValid, "for", userPhone);

    // Disable if invalid
    return !isValid;

    // return false;
  };
  console.log("🚀 ~ handleUpdateProfile ~ isDisabled():", isDisabled());

  const handleUpdateProfile = async () => {
    if (isDisabled() || isUpdating) {
      return;
    }
    try {
      await updateProfile({ phone: userPhone });
      router.back();
    } catch (error) {
      console.error("Failed to update phone:", error);
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
              title="Phone"
              description="This is the phone you would like other people to use when referring you."
            />
            <View style={globalStyles.containerPadding}>
              {/* Phone Number Input */}
              <View style={styles.inputContainer}>
                <PhoneInput
                  value={userPhone}
                  onChangePhoneNumber={(e) => {
                    setuserPhone(e);
                  }}
                  selectedCountry={selectedCountry}
                  onChangeSelectedCountry={(country) => {
                    setSelectedCountry(country);
                  }}
                  placeholder="Phone number"
                  defaultCountry="PK"
                  phoneInputStyles={{
                    container: styles.phoneContainer,
                    flagContainer: styles.flagContainer,
                    flag: {},
                    caret: styles.caret,
                    divider: styles.divider,
                    callingCode: styles.callingCode,
                    input: styles.phoneInput,
                  }}
                  modalStyles={{
                    backdrop: {},
                    countryName: styles.countryName,
                    searchInput: styles.searchInput,
                  }}
                />
              </View>
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

export default editPhone;

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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  // Phone Input Styles
  phoneContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 200,
    height: 52,
    overflow: "hidden",
  },
  flagContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  caret: {
    color: "#6B7280",
    fontSize: 16,
  },
  divider: {
    backgroundColor: "#E5E7EB",
  },
  callingCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  phoneInput: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
    borderRadius: 200
  },
  countryName: {
    color: "#111827",
  },
  searchInput: {
    borderColor: "#D1D5DB",
  },
});
