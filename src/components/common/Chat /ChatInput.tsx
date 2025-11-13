import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface ChatInputProps {
  onSend: (message: string) => void;
  onCameraPress?: () => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onCameraPress,
  placeholder = "Enter your concern...",
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      // Removed Keyboard.dismiss() - keyboard stays open
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {/* <TouchableOpacity
          style={styles.cameraButton}
          onPress={onCameraPress}
          activeOpacity={0.7}
        >
          <Ionicons name="camera-outline" size={24} color="#27272A" />
        </TouchableOpacity> */}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A1A1AA"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={!message.trim()}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E4E4E7",
  },
  cameraButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#27272A",
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3853A4",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});