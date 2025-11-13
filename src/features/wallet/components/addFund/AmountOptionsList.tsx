import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

export interface AmountOption {
  id: string;
  value: number;
  label: string;
}

interface AmountOptionsListProps {
  options: AmountOption[];
  onSelectAmount: (value: number) => void;
}

const AmountOptionsList: React.FC<AmountOptionsListProps> = ({
  options,
  onSelectAmount,
}) => {
  return (
    <FlatList
      data={options}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onSelectAmount(item.value)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>{item.label}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    gap: 12,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});

export default AmountOptionsList;