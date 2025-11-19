
import { SUPPORT_TEAM_ID, supportChatApi, SupportChatBox, SupportChatMessage } from '@/src/services/supportChatApi';
import { useQuery } from '@tanstack/react-query';

// Query keys for cache management
export const supportChatQueryKeys = {
  all: ['supportChat'] as const,
  messages: (chatBoxId: string) => [...supportChatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string) => [...supportChatQueryKeys.all, 'userChats', userId] as const,
  initChat: (userId: string, supportId: string) => 
    [...supportChatQueryKeys.all, 'initChat', userId, supportId] as const,
};


interface InitializeSupportChatResponse {
  chatBox: SupportChatBox | null;
  messages: SupportChatMessage[];
}


interface UseInitializeSupportChatOptions {
  enabled?: boolean;  // Whether to run the query
  supportId?: string;  // Custom support ID (optional, defaults to SUPPORT_TEAM_ID)
}

export const useInitializeSupportChat = (
  userId: string | undefined,
  options?: UseInitializeSupportChatOptions
) => {
  const supportId = options?.supportId || SUPPORT_TEAM_ID;

  return useQuery<InitializeSupportChatResponse, Error>({
    queryKey: supportChatQueryKeys.initChat(userId || '', supportId),
    
    queryFn: async () => {
      console.log('🚀 useInitializeSupportChat - Initializing support chat');
      console.log('   User ID:', userId);
      console.log('   Support ID:', supportId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const result = await supportChatApi.initializeSupportChat(userId, supportId);
      
      console.log('✅ useInitializeSupportChat - Chat initialized');
      console.log('   Chat Box ID:', result.chatBox.id);
      console.log('   Messages:', result.messages.length);
      console.log('   Status:', result.chatBox.status);
      
      return result;
    },
    
    // Only run query if userId exists
    enabled: options?.enabled !== false && !!userId,
    
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

