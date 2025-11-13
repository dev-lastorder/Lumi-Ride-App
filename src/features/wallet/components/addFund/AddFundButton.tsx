import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AddFundButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const AddFundButton: React.FC<AddFundButtonProps> = ({
  onPress,
  disabled = false,
  isLoading = false,
}) => {

const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, {marginBottom:insets.bottom+10}]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Add funds</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3853A4",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddFundButton;