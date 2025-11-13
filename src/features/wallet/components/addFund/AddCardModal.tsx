import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface AddCardModalProps {
  visible: boolean;
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
  onClose: () => void;
  onCardNumberChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
  onSecurityCodeChange: (value: string) => void;
  onSave: () => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  cardNumber,
  expiryDate,
  securityCode,
  onClose,
  onCardNumberChange,
  onExpiryDateChange,
  onSecurityCodeChange,
  onSave,
}) => {
  const isSaveEnabled =
    cardNumber.length > 0 && expiryDate.length > 0 && securityCode.length > 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.title}>Choose payment method</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Card Number Input */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Card number"
                  placeholderTextColor="#9CA3AF"
                  value={cardNumber}
                  onChangeText={onCardNumberChange}
                  keyboardType="number-pad"
                />
                <View style={styles.inputIcon}>
                  <Ionicons name="card-outline" size={24} color="#999" />
                </View>
              </View>

              {/* Expiration Date Input */}
              <TextInput
                style={styles.input}
                placeholder="Expiration date (MM / YY)"
                placeholderTextColor="#9CA3AF"
                value={expiryDate}
                onChangeText={onExpiryDateChange}
                keyboardType="number-pad"
              />

              {/* Security Code Input */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Security code"
                  placeholderTextColor="#9CA3AF"
                  value={securityCode}
                  onChangeText={onSecurityCodeChange}
                  keyboardType="number-pad"
                  secureTextEntry
                />
                <View style={styles.inputIcon}>
                  <Ionicons name="help-circle-outline" size={24} color="#999" />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !isSaveEnabled && styles.saveButtonDisabled,
                ]}
                onPress={onSave}
                disabled={!isSaveEnabled}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.saveButtonText,
                    !isSaveEnabled && styles.saveButtonTextDisabled,
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    maxHeight: "90%",
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
    marginHorizontal: 24,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  saveButton: {
    backgroundColor: "#3853A4",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  saveButtonTextDisabled: {
    color: "#9CA3AF",
  },
});

export default AddCardModal;