
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
      const chatBoxId = `temp-support-${messageData.senderId}-${messageData.receiverId}`;
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: supportChatQueryKeys.messages(chatBoxId) 
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(
        supportChatQueryKeys.messages(chatBoxId)
      );

      // Create optimistic message
      const optimisticMessage: SupportChatMessage = {
        id: `temp-${Date.now()}`,
        text: messageData.text,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatBoxId: chatBoxId,
      };

      // Optimistically update cache
      queryClient.setQueryData(
        supportChatQueryKeys.messages(chatBoxId),
        (old: SupportChatMessage[] | undefined) => [...(old || []), optimisticMessage]
      );

      return { previousMessages, optimisticMessage };
    },

    // On success - replace optimistic with real message
    onSuccess: (data: SupportChatMessage, variables: SendSupportMessageDto, context: any) => {
      console.log('✅ useSendSupportMessage - Success:', data);
      
      const realChatBoxId = data.chatBoxId;
      
      // Replace optimistic message with real one
      queryClient.setQueryData(
        supportChatQueryKeys.messages(realChatBoxId),
        (old: SupportChatMessage[] | undefined) => {
          if (!old || !context) return [data];
          
          return old.map(msg => 
            msg.id === context.optimisticMessage.id ? data : msg
          );
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: supportChatQueryKeys.userChats(variables.senderId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: supportChatQueryKeys.messages(realChatBoxId) 
      });
    },

    // On error - rollback optimistic update
    onError: (error: Error, variables: SendSupportMessageDto, context: any) => {
      console.error('❌ useSendSupportMessage - Error:', error);
      
      // Rollback to previous state
      if (context?.previousMessages) {
        const chatBoxId = `temp-support-${variables.senderId}-${variables.receiverId}`;
        queryClient.setQueryData(
          supportChatQueryKeys.messages(chatBoxId), 
          context.previousMessages
        );
      }

      // Show error to user
      Alert.alert(
        'Failed to Send',
        'Could not send message to support. Please try again.',
        [{ text: 'OK' }]
      );
    },

    // Always refetch after success or error
    onSettled: (data: SupportChatMessage | undefined, error: Error | null, variables: SendSupportMessageDto) => {
      const chatBoxId = data?.chatBoxId || `temp-support-${variables.senderId}-${variables.receiverId}`;
      queryClient.invalidateQueries({ 
        queryKey: supportChatQueryKeys.messages(chatBoxId) 
      });
    },
  });
};

