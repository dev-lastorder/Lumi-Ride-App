import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import { CustomIcon } from "@/src/components/ui/Icon";
import CustomText from "@/src/components/ui/Text";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Heading, PaymentMethodCard } from "../components";

const paymentMethods = () => {
  const theme = useTheme();

  const [showModal, setshowModal] = useState<boolean>(false);

  const handleSetAsDefault = () => {
    setshowModal(false);
  };

  const handleRemovePaymentMethod = () => {
    setshowModal(false);
  };

  const onPressHandler = () => {
    setshowModal(true);
  };

  const handleToggleModal = () => {
    setshowModal((prev) => !prev);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <CustomHeader title="Your Profile" />

        <ScrollView>
          <View style={styles.content}>
            <View style={[globalStyles.containerPadding]}>
              <Heading
                title="Payment methods"
                description="Add or Update your saved payment methods."
              />
              <PaymentMethodCard
                name="cc-visa"
                number="1234567812345678"
                isDefault={true}
                onPress={onPressHandler}
              />
              <PaymentMethodCard
                name="cc-mastercard"
                number="2039399494382039"
                onPress={onPressHandler}
              />
              <PaymentMethodCard
                name="apple-pay"
                number="8833849439003288"
                onPress={onPressHandler}
              />
            </View>
          </View>
        </ScrollView>

        <View style={[globalStyles.containerPadding, styles.buttonContainer]}>
          <Button
            icon={
              <CustomIcon
                icon={{
                  name: "plus",
                  type: "Feather",
                  color: theme.colors.white,
                }}
              />
            }
            title={"Add payment method"}
            variant="primary"
            size="medium"
            disabled={false}
            style={{ borderRadius: 100 }}
            fullWidth={true}
            onPress={() =>
              router.navigate("/(tabs)/(profile)/add-payment-methods")
            }
          />
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => handleToggleModal()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View>
              <CustomText style={styles.modalTitle}>More options</CustomText>
              <TouchableOpacity
                onPress={() => handleToggleModal()}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  backgroundColor: theme.colors.colorBgTertiary,
                  borderRadius: 50,
                  padding: 4,
                }}
              >
                <CustomIcon icon={{ name: "cross", type: "Entypo" }} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSetAsDefault}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 8,
              }}
            >
              <CustomIcon icon={{ name: "check", type: "Feather" }} />
              <CustomText>Set as default</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRemovePaymentMethod}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 8,
              }}
            >
              <CustomIcon
                icon={{
                  name: "delete-outline",
                  type: "MaterialIcons",
                  color: theme.colors.colorTextError,
                }}
              />
              <CustomText style={{ color: theme.colors.colorTextError }}>
                Remove payment method
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
};

export default paymentMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === "ios" ? 85 : 60,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1F2937",
  },
});
