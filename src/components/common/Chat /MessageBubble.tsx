import CustomText from "@/src/components/ui/Text";
import React from "react";
import { StyleSheet, View } from "react-native";

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isIncoming?: boolean;
  showTimestamp?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  timestamp,
  isIncoming = true,
  showTimestamp = true,
}) => {
  return (
    <View
      style={[
        styles.container,
        isIncoming ? styles.incomingContainer : styles.outgoingContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isIncoming ? styles.incomingBubble : styles.outgoingBubble,
        ]}
      >
        <CustomText
          style={[
            styles.messageText,
            isIncoming ? styles.incomingText : styles.outgoingText,
          ]}
        >
          {message}
        </CustomText>
      </View>
      {showTimestamp && (
        <CustomText
          style={[
            styles.timestamp,
            isIncoming ? styles.timestampLeft : styles.timestampRight,
          ]}
        >
          {timestamp}
        </CustomText>
      )}
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  incomingContainer: {
    alignItems: "flex-start",
  },
  outgoingContainer: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  incomingBubble: {
    backgroundColor: "#F4F4F5",
    borderBottomLeftRadius: 4,
  },
  outgoingBubble: {
    backgroundColor: "#D3F2FA",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  incomingText: {
    color: "#09090B",
  },
  outgoingText: {
    color: "#27272A",
  },
  timestamp: {
    fontSize: 12,
    color: "#71717A",
    marginTop: 4,
  },
  timestampLeft: {
    alignSelf: "flex-start",
  },
  timestampRight: {
    alignSelf: "flex-end",
  },
});