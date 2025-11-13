import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

interface WalletBalanceCardProps {
  balance: number;
  onAddFunds: () => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  onAddFunds,
}) => {
  const { currency } = useSelector((state: RootState) => state.appConfig);



  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your balance</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.balanceAmount}>{currency?.code} {balance.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.addFundsButton}
          onPress={onAddFunds}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.addFundsText}>Add funds</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "rgba(56, 83, 164, 0.3)",
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  addFundsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#323F4F",
  },
  addFundsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});

export default WalletBalanceCard;