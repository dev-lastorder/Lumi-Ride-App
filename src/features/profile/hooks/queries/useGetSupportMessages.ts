import { supportChatApi, SupportChatMessage } from '@/src/services/supportChatApi';
import { useQuery } from '@tanstack/react-query';

// Query keys for cache management
export const supportChatQueryKeys = {
  all: ['supportChat'] as const,
  messages: (chatBoxId: string) => [...supportChatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string) => [...supportChatQueryKeys.all, 'userChats', userId] as const,
};


interface UseGetSupportMessagesOptions {
  enabled?: boolean;  // Whether to run the query
}

export const useGetSupportMessages = (
  chatBoxId: string | null,
  options?: boolean
) => {
  return useQuery<SupportChatMessage[], Error>({
    queryKey: supportChatQueryKeys.messages(chatBoxId || ''),
    
    queryFn: async () => {
      console.log('📥 useGetSupportMessages - Fetching messages for:', chatBoxId);
      
      if (!chatBoxId) {
        throw new Error('Chat box ID is required');
      }
      
      const messages = await supportChatApi.getMessages(chatBoxId);
      console.log('✅ useGetSupportMessages - Fetched', messages.length, 'messages');
      return messages;
    },
    
    // Only run query if chatBoxId exists and doesn't start with "temp-"
    enabled: options !== false && 
             !!chatBoxId && 
             !chatBoxId.startsWith('temp-'),
    
    // Cache for 30 seconds
    staleTime: 30 * 1000,
    
    // Keep data in cache for 5 minutes even when unused
    gcTime: 5 * 60 * 1000,
    
    // Don't refetch on window focus (we use WebSocket for real-time)
    refetchOnWindowFocus: false,
    
    // Retry once on failure
    retry: 1,
  });
};

