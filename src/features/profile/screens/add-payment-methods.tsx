import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import { CustomIcon } from "@/src/components/ui/Icon";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Heading, ProfileFormTextField } from "../components";

const AddPaymentMethods = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const isAllFilled =
    formData.cardNumber.trim().length > 0 &&
    formData.expDate.trim().length > 0 &&
    formData.cvv.trim().length > 0;

  const handleInputChange = (
    text: string,
    field: "cardNumber" | "expDate" | "cvv"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: text,
    }));
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <CustomHeader isTitleVisible={false} />
        <View style={styles.content}>
          <View style={[globalStyles.containerPadding]}>
            <Heading
              title="Add payment methods"
              description="Add a credit or debit card to quickly complete purchases."
            />
            <ScrollView>
              <View style={globalStyles.containerPadding}>
                <ProfileFormTextField
                  label="Card Number"
                  input={formData.cardNumber}
                  setinput={(text) => handleInputChange(text, "cardNumber")}
                  placeholder="Card number"
                  iconName="lock"
                  type="number"
                />
                <ProfileFormTextField
                  label="Expiration Date"
                  input={formData.expDate}
                  setinput={(text) => handleInputChange(text, "expDate")}
                  placeholder="Expiration date (MM/YY)"
                  type="number"
                />
                <ProfileFormTextField
                  label="CVV"
                  input={formData.cvv}
                  setinput={(text) => handleInputChange(text, "cvv")}
                  placeholder="Security code"
                  iconName="question-circle"
                  type="number"
                />
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={[globalStyles.containerPadding, styles.buttonContainer]}>
          <Button
            icon={
              <CustomIcon
                icon={{
                  name: "plus",
                  type: "Feather",
                  color: theme.colors.colorIconPrimary,
                }}
              />
            }
            title={"Add payment method"}
            variant="primary"
            size="medium"
            disabled={!isAllFilled}
            style={{
              borderRadius: 100,
              backgroundColor: theme.colors.colorBgSecondary,
            }}
            textStyle={{ color: theme.colors.colorTextPrimary }}
            fullWidth={true}
            onPress={() => router.back()}
          />
        </View>
      </View>
    </GradientBackground>
  );
};

export default AddPaymentMethods;

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
