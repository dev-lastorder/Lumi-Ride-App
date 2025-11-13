// src/app/(tabs)/(rideRequests)/driverChat.tsx
// FIXED: UI handling matches support.tsx exactly

import ChatHeader from "@/src/components/common/Chat /ChatHeader";
import ChatInput from "@/src/components/common/Chat /ChatInput";
import ChatMessageList, { ChatMessage } from "@/src/components/common/Chat /ChatMessageList";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import CustomText from "@/src/components/ui/Text";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { useAppSelector } from "@/src/store/hooks";
import { selectUser } from "@/src/store/selectors/authSelectors";
import { RootState } from "@/src/store/store";

import { useSendMessage } from "../../hooks/mutations/useSendMessage";
import { useGetMessages } from "../../hooks/queries/useGetMessages";
import { useInitializeChat } from "../../hooks/queries/useInitializeChatHook";

import {
  chatApi,
  convertWebSocketMessage,
  IReceivedMessage,
} from "@/src/services/chatApi";

const DriverChatScreen = () => {
  const params = useLocalSearchParams();


  const currentUser = useAppSelector(selectUser);
  const driverId = currentUser?.id;

  const onGoingRideData = useAppSelector((state: RootState) => state.onGoingRide.onGoingRideData);
  const customerId = onGoingRideData?.passengerUser?.id;
  console.log('🚖 Ongoing ride customer ID:', customerId,driverId);
  const customerName = params.customerName as string || "Customer";
  const profileImage = params.profileImage as string || "https://avatar.iran.liara.run/public/48";

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [realtimeMessages, setRealtimeMessages] = useState<any[]>([]);
  const [chatBoxId, setChatBoxId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Quick reply buttons
  const quickReplies = [
    { id: "1", text: "I'm on my way" },
    { id: "2", text: "I'll be there in 5 minutes" },
    { id: "3", text: "I have arrived" },
    { id: "4", text: "Please come to the car" },
    { id: "5", text: "Running a bit late, sorry" },
  ];


  const {
    data: chatData,
    isLoading: isInitializing,
    error: initError,
    isSuccess: isChatInitialized,
  } = useInitializeChat(driverId, customerId, !!driverId && !!customerId);

  const {
    data: historyMessages = [],
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useGetMessages(
    chatBoxId,
    isChatInitialized && !!chatBoxId && !chatBoxId?.startsWith('temp-')
  );

  // 3️⃣ Send message mutation
  const {
    mutate: sendMessage,
    isPending: isSendingMessage,
  } = useSendMessage();

  // ============================================
  // Keyboard listeners
  // ============================================
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (isChatInitialized && chatData?.chatBox) {
      const newChatBoxId = chatData.chatBox.id;

      console.log('✅ Chat initialized');
      console.log('📦 Chat Box ID:', newChatBoxId);
      console.log('📦 Initial messages from init:', chatData.messages?.length || 0);
      console.log('🔍 Is temp chat?', newChatBoxId.startsWith('temp-'));

      setChatBoxId(newChatBoxId);

      // If this is a REAL chat (not temp), refetch messages
      if (!newChatBoxId.startsWith('temp-') && refetchMessages) {
        console.log('🔄 Refetching messages for real chat...');
        setTimeout(() => {
          refetchMessages();
        }, 500);
      }
    }
  }, [isChatInitialized, chatData]);

  // ============================================
  // WebSocket connection
  // ============================================
  useEffect(() => {
    if (!driverId || !customerId || !chatBoxId) {
      return;
    }

    console.log('🔌 Setting up WebSocket for driver:', driverId, 'customer:', customerId);

    const connectWebSocket = async () => {
      try {
        const isConnected = chatApi.isSocketConnected();

        if (!isConnected) {
          await chatApi.connectToSocket(driverId);
          console.log('✅ WebSocket connected');
        } else {
          console.log('✅ WebSocket already connected');
        }
      } catch (error) {
        console.error('❌ Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    const unsubscribeMessages = chatApi.onMessageReceived((wsMessage: IReceivedMessage) => {
      console.log('📥 Received WebSocket message:', wsMessage);

      // ONLY process messages for THIS specific conversation
      const isRelevantMessage =
        (wsMessage.sender === customerId && wsMessage.receiver === driverId) ||
        (wsMessage.sender === driverId && wsMessage.receiver === customerId);

      if (isRelevantMessage) {
        console.log('✅ Message is for this conversation');
        const chatMessage = convertWebSocketMessage(wsMessage, chatBoxId || undefined);

        setRealtimeMessages((prev) => {
          if (prev.some((msg) => msg.id === chatMessage.id)) {
            console.log('⚠️ Duplicate message, skipping');
            return prev;
          }

          return [...prev, chatMessage];
        });

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        console.log('❌ Message not for this conversation');
      }
    });

    return () => {
      console.log('🧹 Cleaning up WebSocket listeners');
      unsubscribeMessages();
    };
  }, [driverId, customerId, chatBoxId]);

  const allMessages = [
    ...(chatData?.messages || []),      // From initialization
    ...historyMessages,                  // From fetch query (persisted messages)
    ...realtimeMessages,                 // From WebSocket
  ]
    .filter(
      (message, index, array) =>
        array.findIndex(
          (m) =>
            m.id === message.id ||
            (m.text === message.text &&
              m.senderId === message.senderId &&
              Math.abs(
                new Date(m.createdAt).getTime() -
                  new Date(message.createdAt).getTime()
              ) < 1000)
        ) === index
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  console.log('📊 Message sources:', {
    fromInit: chatData?.messages?.length || 0,
    fromHistory: historyMessages.length,
    fromRealtime: realtimeMessages.length,
    total: allMessages.length,
  });

  // Convert to UI format (ChatMessage interface)
  const messages: ChatMessage[] = allMessages.map((msg) => ({
    id: msg.id,
    message: msg.text,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isIncoming: msg.senderId !== driverId, // Messages from customer are incoming
    showTimestamp: true,
  }));


  const hasDriverSentMessage = allMessages.some(
    (msg) => msg.senderId === driverId
  );

  console.log('🎯 Quick replies visible:', !hasDriverSentMessage);


  useEffect(() => {
    if (messages.length > 0 && !isLoadingMessages) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length, isLoadingMessages]);


  const handleBackPress = () => {
    router.back();
  };

  const handlePhonePress = () => {
    router.push({
      pathname: "/(tabs)/(rideRequests)/callScreen",
      params: {
        profileImage: profileImage,
        driverName: customerName,
      },
    });
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim() || isSendingMessage || !driverId || !customerId) {
      return;
    }

    console.log('📤 Sending message:', message);

    sendMessage(
      {
        senderId: driverId,
        receiverId: customerId,
        text: message.trim(),
      },
      {
        onSuccess: () => {
          console.log('✅ Message sent successfully');

          // Scroll to bottom after sending
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        },
        onError: (error: any) => {
          console.error('❌ Send message error:', error);
          Alert.alert('Error', 'Failed to send message. Please try again.');
        },
      }
    );
  };

  const handleQuickReply = (button: { id: string; text: string }) => {
    handleSendMessage(button.text);
  };

  const handleCameraPress = () => {
    Alert.alert("Camera", "Camera functionality will be implemented");
  };

  if (!driverId) {
    return (
      <GradientBackground>
        <View style={styles.centerContainer}>
          <CustomText>Driver ID not found. Please login again.</CustomText>
          <Button
            title="Go Back"
            variant="primary"
            onPress={() => router.back()}
          />
        </View>
      </GradientBackground>
    );
  }

  if (!customerId) {
    return (
      <GradientBackground>
        <View style={styles.centerContainer}>
          <CustomText>Customer ID not provided. Invalid route.</CustomText>
          <Button
            title="Go Back"
            variant="primary"
            onPress={() => router.back()}
          />
        </View>
      </GradientBackground>
    );
  }

  if (isInitializing) {
    return (
      <GradientBackground>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#DAD5FB" />
          <CustomText style={{ marginTop: 12 }}>Loading chat...</CustomText>
        </View>
      </GradientBackground>
    );
  }

  if (initError) {
    return (
      <GradientBackground>
        <View style={styles.errorContainer}>
          <CustomText>Failed to load chat</CustomText>
          <Button title="Retry" variant="primary" onPress={() => router.back()} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ChatHeader
          name={customerName}
          profileImage={profileImage}
          showBackButton={true}
          showPhoneButton={false}
          onBackPress={handleBackPress}
          onPhonePress={handlePhonePress}
        />

        <ChatMessageList
          messages={messages}
          showQuickReplies={!hasDriverSentMessage}
          quickReplies={quickReplies}
          onQuickReply={handleQuickReply}
        />

        <View
          style={[
            styles.inputWrapper,
            {
              paddingBottom: isKeyboardVisible
                ? 0
                : Platform.OS === "ios"
                ? 85
                : 60,
            },
          ]}
        >
          <ChatInput
            onSend={handleSendMessage}
            onCameraPress={handleCameraPress}
            placeholder="Type a message..."
          />
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

export default DriverChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 20,
  },
  inputWrapper: {
    // Dynamic paddingBottom based on keyboard visibility
  },
});