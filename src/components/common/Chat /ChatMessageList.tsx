import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MessageBubble from "./MessageBubble";
import QuickReplyButtons from "./QuickReplyButton";

export interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isIncoming: boolean;
  showTimestamp?: boolean;
}

interface QuickReplyButton {
  id: string;
  text: string;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  showQuickReplies?: boolean;
  quickReplies?: QuickReplyButton[];
  onQuickReply?: (button: QuickReplyButton) => void;
  onScroll?: () => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  showQuickReplies = false,
  quickReplies = [],
  onQuickReply,
  onScroll,
}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to end when keyboard appears
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      keyboardDidShow.remove();
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble
      message={item.message}
      timestamp={item.timestamp}
      isIncoming={item.isIncoming}
      showTimestamp={item.showTimestamp ?? true}
    />
  );

  const renderFooter = () => {
    // Only show quick replies in footer when there ARE messages
    if (messages.length > 0 && showQuickReplies && quickReplies.length > 0 && onQuickReply) {
      return (
        <View style={styles.footerContainer}>
          <QuickReplyButtons buttons={quickReplies} onPress={onQuickReply} />
        </View>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    // Only show quick replies in empty state when there are NO messages
    if (messages.length === 0 && showQuickReplies && quickReplies.length > 0 && onQuickReply) {
      return (
        <View style={styles.emptyContainer}>
          <QuickReplyButtons buttons={quickReplies} onPress={onQuickReply} />
        </View>
      );
    }
    return <View style={styles.emptyContainer} />;
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatMessageList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  footerContainer: {
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
});