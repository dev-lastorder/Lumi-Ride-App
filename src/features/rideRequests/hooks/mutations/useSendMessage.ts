
import { chatApi, ChatMessage, SendMessageDto } from '@/src/services/chatApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

// Query keys for cache invalidation
export const chatQueryKeys = {
  all: ['chat'] as const,
  messages: (chatBoxId: string) => [...chatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string) => [...chatQueryKeys.all, 'userChats', userId] as const,
};


export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, Error, SendMessageDto>({
    mutationFn: async (messageData: SendMessageDto) => {
      console.log('📤 useSendMessage - Sending:', messageData);
      return await chatApi.sendMessage(messageData);
    },

    // Optimistic update - show message immediately
    onMutate: async (messageData: SendMessageDto) => {
      const chatBoxId = `temp-${messageData.senderId}-${messageData.receiverId}`;
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: chatQueryKeys.messages(chatBoxId) 
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(
        chatQueryKeys.messages(chatBoxId)
      );

      // Create optimistic message
      const optimisticMessage: ChatMessage = {
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
        chatQueryKeys.messages(chatBoxId),
        (old: ChatMessage[] | undefined) => [...(old || []), optimisticMessage]
      );

      return { previousMessages, optimisticMessage };
    },

    // On success - replace optimistic with real message
    onSuccess: (data: ChatMessage, variables: SendMessageDto, context: any) => {
      console.log('✅ useSendMessage - Success:', data);
      
      const realChatBoxId = data.chatBoxId;
      
      // Replace optimistic message with real one
      queryClient.setQueryData(
        chatQueryKeys.messages(realChatBoxId),
        (old: ChatMessage[] | undefined) => {
          if (!old || !context) return [data];
          
          return old.map(msg => 
            msg.id === context.optimisticMessage.id ? data : msg
          );
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: chatQueryKeys.userChats(variables.senderId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: chatQueryKeys.messages(realChatBoxId) 
      });
    },

    // On error - rollback optimistic update
    onError: (error: Error, variables: SendMessageDto, context: any) => {
      console.error('❌ useSendMessage - Error:', error);
      
      // Rollback to previous state
      if (context?.previousMessages) {
        const chatBoxId = `temp-${variables.senderId}-${variables.receiverId}`;
        queryClient.setQueryData(
          chatQueryKeys.messages(chatBoxId), 
          context.previousMessages
        );
      }

      // Show error to user
      Alert.alert(
        'Failed to Send',
        'Could not send message. Please try again.',
        [{ text: 'OK' }]
      );
    },

    // Always refetch after success or error
    onSettled: (data: ChatMessage | undefined, error: Error | null, variables: SendMessageDto) => {
      const chatBoxId = data?.chatBoxId || `temp-${variables.senderId}-${variables.receiverId}`;
      queryClient.invalidateQueries({ 
        queryKey: chatQueryKeys.messages(chatBoxId) 
      });
    },
  });
};
