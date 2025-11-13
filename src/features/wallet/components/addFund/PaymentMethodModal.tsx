import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PaymentCard } from "./SelectedPaymentCard";

interface PaymentMethodModalProps {
  visible: boolean;
  cards: PaymentCard[];
  selectedCardId: string;
  onClose: () => void;
  onSelectCard: (card: PaymentCard) => void;
  onAddPaymentMethod: () => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  visible,
  cards,
  selectedCardId,
  onClose,
  onSelectCard,
  onAddPaymentMethod,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose payment method</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Card List */}
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.cardItem}
              onPress={() => onSelectCard(card)}
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
              {selectedCardId === card.id && (
                <Ionicons name="checkmark" size={24} color="#1691BF" />
              )}
            </TouchableOpacity>
          ))}

          {/* Add Payment Method */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddPaymentMethod}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="#000" />
            <Text style={styles.addButtonText}>Add payment method</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});

export default PaymentMethodModal;