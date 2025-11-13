import { RootState } from "@/src/store/store";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  onAmountChange,
}) => {


  const { currency } = useSelector((state: RootState) => state.appConfig);

  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, "");
    onAmountChange(numericValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Offer your fare <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.helperText}>
        Enter an amount between {currency?.code} 10.00 and {currency?.code} 500
      </Text>

      <TextInput
        style={styles.input}
       placeholder={`${currency?.code} 0.00`}
        placeholderTextColor="#9CA3AF"
        value={amount ? `${currency?.code}  ${amount}` : ""}
        onChangeText={handleTextChange}
        keyboardType="decimal-pad"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  required: {
    color: "#EF4444",
  },
  helperText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 16,
  },
});

export default AmountInput;