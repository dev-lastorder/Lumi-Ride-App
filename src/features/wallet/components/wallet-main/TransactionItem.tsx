// src/features/wallet/components/wallet-main/TransactionItem.tsx
import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export interface Transaction {
  id: string;
  type: string;
  title: string;
  date: string;
  amount: number;
  isPositive: boolean;
  icon: string;
}

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {

  const { currency } = useSelector((state: RootState) => state.appConfig);

  // Safely convert amount to number and format
  const amount = Number(transaction.amount) || 0;
  const formattedAmount = amount.toFixed(2);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{transaction.icon}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{transaction.title}</Text>
          <Text style={styles.date}>{transaction.date}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text
          style={[
            styles.amount,
            transaction.isPositive && styles.amountPositive,
          ]}
        >
          {transaction.isPositive ? "+" : "-"} {currency?.code} {formattedAmount}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  icon: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  amountPositive: {
    color: "#10B981",
  },
});

export default TransactionItem;