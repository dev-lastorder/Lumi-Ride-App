// src/features/wallet/screens/wallet-main.tsx
import { GradientBackground } from "@/src/components/common";
import { TransactionFilterType } from "@/src/services/wallet.service";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Title from "../../auth/components/common/TitleHeader";
import TransactionFilterTabs from "../components/wallet-main/TransactionFilterTabs";
import TransactionsList from "../components/wallet-main/TransactionList";
import WalletBalanceCard from "../components/wallet-main/WalletBalanceCard";
import { useTransactionHistory } from "../hooks/queries/useTransactionHistory";
import { useWalletBalance } from "../hooks/queries/useWalletBalance";

// Map backend filter types to frontend filter types
const mapFilterToBackend = (
  filter: "all" | "money-in" | "money-out"
): TransactionFilterType => {
  switch (filter) {
    case "money-in":
      return "deposit";
    case "money-out":
      return "withdrawal";
    default:
      return "all";
  }
};

const WalletMain = () => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "money-in" | "money-out"
  >("all");
  const { refresh } = useLocalSearchParams();
  console.log("WalletMain refresh param:", refresh);
  // Fetch wallet balance
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
    isRefetching: isRefetchingBalance,
  } = useWalletBalance();

  // Fetch transaction history based on active filter
  const backendFilter = mapFilterToBackend(activeFilter);
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
    isRefetching: isRefetchingHistory,
  } = useTransactionHistory(backendFilter, 0, 20);

  useEffect(() => {
    console.log("WalletMain useEffect triggered with refresh:", refresh);
    if (refresh) {
      handleRefresh();
    }
    return () => {};
  }, [refresh]);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    await Promise.all([refetchBalance(), refetchHistory()]);
  };

  const isRefreshing = isRefetchingBalance || isRefetchingHistory;

  const handleAddFunds = () => {
    router.push("/(tabs)/(wallet)/addFund");
  };

  const handleTransactionPress = (transaction: any) => {
    console.log("Transaction pressed:", transaction);
    // Navigate to transaction detail screen if needed
  };

  // Format transactions for the UI
  const formattedTransactions =
    historyData?.transactions.map((tx) => {
      // Determine icon and isPositive based on transaction type
      let icon = "💳";
      let isPositive = false;
      let title: string = tx.type; // Explicitly type as string

      if (tx.type === "Deposit") {
        icon = "💳";
        isPositive = true;
        title = "Wallet Top up";
      } else if (tx.type === "Withdrawal") {
        icon = "💸";
        isPositive = false;
        title = "Withdrawal";
      } else if (tx.type === "Credit") {
        icon = "🚗";
        isPositive = false;
        title = "Ride Payment";
      }

      // Format date
      const date = new Date(tx.createdAt);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        id: tx.createdAt, // Use createdAt as unique ID
        type: tx.type.toLowerCase(),
        title,
        date: formattedDate,
        amount: Number(tx.amount),
        isPositive,
        icon,
      };
    }) || [];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Fixed Header Section */}
        <View style={styles.fixedHeader}>
          {/* Top-left back button */}
          <View style={styles.backButtonWrapper}></View>

          {/* Title Section */}
          <View style={styles.titleWrapper}>
            <Title
              heading="Wallet"
              subheading="View and manage your balance and transactions."
              containerStyle={styles.titleContainer}
            />
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#3853A4"
            />
          }
        >
          {/* Balance Card */}
          {isLoadingBalance ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3853A4" />
            </View>
          ) : (
            <WalletBalanceCard
              balance={Number(balanceData?.totalBalanceInWallet) || 0}
              onAddFunds={handleAddFunds}
            />
          )}

          {/* Transactions Section */}
          <View style={styles.transactionsSection}>
            <Text style={styles.transactionsTitle}>Transactions</Text>

            {/* Filter Tabs */}
            <TransactionFilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Transaction List */}
            {isLoadingHistory ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3853A4" />
              </View>
            ) : formattedTransactions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transactions found</Text>
              </View>
            ) : (
              <TransactionsList
                transactions={formattedTransactions}
                onTransactionPress={handleTransactionPress}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fixedHeader: {
    paddingTop: 10,
  },
  backButtonWrapper: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  titleWrapper: {
    marginBottom: 10,
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  transactionsSection: {
    paddingHorizontal: 20,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
});

export default WalletMain;
