
import { SendSupportMessageDto, supportChatApi, SupportChatMessage } from '@/src/services/supportChatApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

// Query keys for cache invalidation
export const supportChatQueryKeys = {
  all: ['supportChat'] as const,
  messages: (chatBoxId: string) => [...supportChatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string) => [...supportChatQueryKeys.all, 'userChats', userId] as const,
};

export const useSendSupportMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<SupportChatMessage, Error, SendSupportMessageDto>({
    mutationFn: async (messageData: SendSupportMessageDto) => {
      console.log('📤 useSendSupportMessage - Sending:', messageData);
      return await supportChatApi.sendMessage(messageData);
    },

    // Optimistic update - show message immediately
    onMutate: async (messageData: SendSupportMessageDto) => {
      // Create optimistic message
      const optimisticMessage: SupportChatMessage = {
        id: `temp-${Date.now()}`,
        text: messageData.text,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatBoxId: 'pending',
      };

      return { optimisticMessage };
    },

    // On success - update cache with real message
    onSuccess: (data: SupportChatMessage, variables: SendSupportMessageDto) => {
      console.log('✅ useSendSupportMessage - Success:', data);
      
      const realChatBoxId = data.chatBoxId;
      
      // Set the real message in cache
      queryClient.setQueryData(
        supportChatQueryKeys.messages(realChatBoxId),
        (old: SupportChatMessage[] | undefined) => {
          const existing = old || [];
          // Check if message already exists
          if (existing.some(msg => msg.id === data.id)) {
            return existing;
          }
          return [...existing, data];
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: supportChatQueryKeys.userChats(variables.senderId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: supportChatQueryKeys.all
      });
    },

    // On error - show error to user
    onError: (error: Error) => {
      console.error('❌ useSendSupportMessage - Error:', error);

      // Show error to user
      Alert.alert(
        'Failed to Send',
        'Could not send message to support. Please try again.',
        [{ text: 'OK' }]
      );
    },

    // Always refetch after success or error
    onSettled: (data: SupportChatMessage | undefined) => {
      if (data?.chatBoxId) {
        queryClient.invalidateQueries({ 
          queryKey: supportChatQueryKeys.messages(data.chatBoxId) 
        });
      }
    },
  });
};

