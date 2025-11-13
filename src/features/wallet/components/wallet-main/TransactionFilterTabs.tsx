import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type FilterType = "all" | "money-in" | "money-out";

interface TransactionFilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const TransactionFilterTabs: React.FC<TransactionFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "money-in", label: "Money in" },
    { id: "money-out", label: "Money out" },
  ];

  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              isActive && styles.filterButtonActive,
            ]}
            onPress={() => onFilterChange(filter.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                isActive && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  filterButtonActive: {
    backgroundColor: "#CFFAFE",
    borderColor: "#CFFAFE",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterTextActive: {
    color: "#0891B2",
    fontWeight: "600",
  },
});

export default TransactionFilterTabs;