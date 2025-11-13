
import { apiClient } from "@/src/lib/axios";
import { IReceivedMessage, IsentMessage, webSocketService } from "../lib/socket/websocketService";

export interface SendMessageDto {
  senderId: string;
  receiverId: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  chatBoxId: string;
}

export interface ChatBox {
  id: string;
  sender_id: string;
  receiver_id: string;
  latestMessage?: string;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    name: string;
    phone: string;
    profile?: string;
  };
  receiver?: {
    id: string;
    name: string;
    phone: string;
    profile?: string;
  };
}

export const normalizeMessage = (message: any): ChatMessage => {
  return {
    id: message.id,
    text: message.text,
    senderId: message.senderId || message.sender_id,
    receiverId: message.receiverId || message.receiver_id,
    chatBoxId: message.chatBoxId || message.chat_box_id,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};


export const chatApi = {
  
  // 1️⃣ Send message (HTTP + WebSocket)
  sendMessage: async (messageData: SendMessageDto): Promise<ChatMessage> => {
    try {
      console.log('📤 Sending message:', messageData);
      
      // Send via HTTP to persist in database
      const response = await apiClient.post('/api/v1/chat/send', messageData);
      const responseData = response.data;
      
      console.log('📦 Backend response:', responseData);
      
      // Create message object from response
      const savedMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        text: messageData.text,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatBoxId: responseData.chatBoxId || `temp-${messageData.senderId}-${messageData.receiverId}`,
      };
      
      // Send via WebSocket for real-time delivery
      if (webSocketService.isSocketConnected()) {
        const socketMessage: IsentMessage = {
          sender: messageData.senderId,
          receiver: messageData.receiverId,
          text: messageData.text,
        };
        webSocketService.sendMessage(socketMessage);
        console.log('✅ Message sent via HTTP + WebSocket');
      } else {
        console.log('⚠️ WebSocket not connected, sent via HTTP only');
      }
      
      return savedMessage;
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  },

  // 2️⃣ Get messages in a chat box
  getMessages: async (chatBoxId: string): Promise<ChatMessage[]> => {
    try {
      console.log('📥 Fetching messages for chatBoxId:', chatBoxId);
      
      const response = await apiClient.get(`/api/v1/chat/messages/${chatBoxId}`);
      const messageData = response.data;
      
      // Handle different response formats
      let messages: any[] = [];
      if (Array.isArray(messageData)) {
        messages = messageData;
      } else if (messageData?.messages && Array.isArray(messageData.messages)) {
        messages = messageData.messages;
      }
      
      // Normalize all messages
      const normalizedMessages = messages.map(normalizeMessage);
      
      console.log('✅ Fetched', normalizedMessages.length, 'messages');
      return normalizedMessages;
      
    } catch (error) {
      console.error('❌ Failed to get messages:', error);
      return [];
    }
  },

  // 3️⃣ Get all chat boxes for a user
  getAllChats: async (userId: string): Promise<ChatBox[]> => {
    try {
      console.log('📥 Fetching all chats for userId:', userId);
      
      const response = await apiClient.get(`/api/v1/chat/${userId}`);
      const chatData = response.data;
      
      const chatList = chatData?.chatList || [];
      
      console.log('✅ Fetched', chatList.length, 'chats');
      return chatList;
      
    } catch (error) {
      console.error('❌ Failed to get chats:', error);
      return [];
    }
  },

  // 4️⃣ Initialize chat (find existing or create temp)
  initializeChat: async (
    driverId: string, 
    customerId: string
  ): Promise<{ chatBox: ChatBox; messages: ChatMessage[] }> => {
    try {
      console.log('🚀 Initializing chat between driver:', driverId, 'and customer:', customerId);
      
      // Connect to WebSocket if not connected
      if (!webSocketService.isSocketConnected() || webSocketService.getCurrentUserId() !== driverId) {
        await webSocketService.connect(driverId);
      }
      
      // Get all chats for the driver
      const allChats = await chatApi.getAllChats(driverId);
      
      // Find existing chat with customer
      const existingChat = allChats.find((chat) => {
        return (chat.sender_id === driverId && chat.receiver_id === customerId) ||
               (chat.sender_id === customerId && chat.receiver_id === driverId);
      });

      let chatBox: ChatBox;
      let messages: ChatMessage[] = [];

      if (existingChat) {
        chatBox = existingChat;
        console.log('✅ Found existing chat:', chatBox.id);
        
        // Load message history
        try {
          messages = await chatApi.getMessages(chatBox.id);
        } catch (error) {
          console.log('⚠️ Could not load chat history');
          messages = [];
        }
        
      } else {
        // Create temporary chatBox (will be created on first message)
        chatBox = {
          id: `temp-${driverId}-${customerId}`,
          sender_id: driverId,
          receiver_id: customerId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        messages = [];
        console.log('✅ Created temporary chat box');
      }

      return { chatBox, messages };
      
    } catch (error) {
      console.error('❌ Failed to initialize chat:', error);
      
      // Fallback: Always return a temp chat box
      const fallbackChatBox: ChatBox = {
        id: `temp-${driverId}-${customerId}`,
        sender_id: driverId,
        receiver_id: customerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return { chatBox: fallbackChatBox, messages: [] };
    }
  },

  // 5️⃣ WebSocket helpers
  connectToSocket: async (userId: string): Promise<boolean> => {
    return await webSocketService.connect(userId);
  },

  disconnectFromSocket: (): void => {
    webSocketService.disconnect();
  },

  onMessageReceived: (callback: (message: IReceivedMessage) => void): (() => void) => {
    return webSocketService.onMessage(callback);
  },

  onConnectionChange: (callback: (connected: boolean) => void): (() => void) => {
    return webSocketService.onConnectionChange(callback);
  },

  isSocketConnected: (): boolean => {
    return webSocketService.isSocketConnected();
  },

  getCurrentSocketUserId: (): string | null => {
    return webSocketService.getCurrentUserId();
  },

  reconnectSocket: (): void => {
    webSocketService.reconnect();
  },
};

export const convertWebSocketMessage = (
  wsMessage: IReceivedMessage, 
  chatBoxId?: string
): ChatMessage => {
  return {
    id: `ws-${Date.now()}`,
    text: wsMessage.text,
    senderId: wsMessage.sender,
    receiverId: wsMessage.receiver,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chatBoxId: chatBoxId || `temp-${wsMessage.sender}-${wsMessage.receiver}`,
  };
};

export type { IReceivedMessage, IsentMessage };
