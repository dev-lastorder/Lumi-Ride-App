import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface PaymentCard {
  id: string;
  type: "visa" | "mastercard";
  lastFour: string;
  selected: boolean;
}

interface SelectedPaymentCardProps {
  card: PaymentCard;
  onPress: () => void;
}

const SelectedPaymentCard: React.FC<SelectedPaymentCardProps> = ({
  card,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardInfo}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>
            {card.type === "visa" ? "VISA" : "MC"}
          </Text>
        </View>
        <Text style={styles.cardNumber}>**** {card.lastFour}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    width: 48,
    height: 32,
    backgroundColor: "#2563EB",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
});

export default SelectedPaymentCard;