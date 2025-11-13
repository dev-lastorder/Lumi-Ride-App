import React from "react";
import { StyleSheet, View } from "react-native";
import TransactionItem, { Transaction } from "./TransactionItem";

interface TransactionsListProps {
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onTransactionPress,
}) => {
  return (
    <View style={styles.container}>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onPress={() => onTransactionPress?.(transaction)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingBottom: 40,
  },
});

export default TransactionsList;