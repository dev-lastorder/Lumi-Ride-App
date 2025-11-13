

import { chatApi, ChatBox, ChatMessage } from '@/src/services/chatApi';
import { useQuery } from '@tanstack/react-query';

// Query keys for cache management
export const chatQueryKeys = {
  all: ['chat'] as const,
  messages: (chatBoxId: string) => [...chatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string) => [...chatQueryKeys.all, 'userChats', userId] as const,
  initChat: (driverId: string, customerId: string) => 
    [...chatQueryKeys.all, 'initChat', driverId, customerId] as const,
};


interface InitializeChatResponse {
  chatBox: ChatBox;
  messages: ChatMessage[];
}

interface UseInitializeChatOptions {
  enabled?: boolean;  // Whether to run the query
}

export const useInitializeChat = (
  driverId: string | null,
  customerId: string | null,
  options?: UseInitializeChatOptions
) => {
  return useQuery<InitializeChatResponse, Error>({
    queryKey: chatQueryKeys.initChat(driverId || '', customerId || ''),
    
    queryFn: async () => {
      console.log('🚀 useInitializeChat - Initializing chat');
      console.log('   Driver ID:', driverId);
      console.log('   Customer ID:', customerId);
      
      if (!driverId || !customerId) {
        throw new Error('Driver ID and Customer ID are required');
      }
      
      const result = await chatApi.initializeChat(driverId, customerId);
      
      console.log('✅ useInitializeChat - Chat initialized');
      console.log('   Chat Box ID:', result.chatBox.id);
      console.log('   Messages:', result.messages.length);
      
      return result;
    },
    
    // Only run query if both IDs exist
    enabled: options?.enabled !== false && !!driverId && !!customerId,
    
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    
    // Keep data in cache for 10 minutes even when unused
    gcTime: 10 * 60 * 1000,
    
    // Don't refetch on window focus (WebSocket handles updates)
    refetchOnWindowFocus: false,
    
    // Retry once on failure
    retry: 1,
  });
};

