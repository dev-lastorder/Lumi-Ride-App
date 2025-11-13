
import { chatApi, ChatBox } from '@/src/services/chatApi';
import { useQuery } from '@tanstack/react-query';

// Query keys for cache management
export const chatQueryKeys = {
  all: ['chat'] as const,
  messages: (chatBoxId: string) => [...chatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string) => [...chatQueryKeys.all, 'userChats', userId] as const,
};


interface UseGetAllChatsOptions {
  enabled?: boolean;  
}

export const useGetAllChats = (
  userId: string | null,
  options?: UseGetAllChatsOptions
) => {
  return useQuery<ChatBox[], Error>({
    queryKey: chatQueryKeys.userChats(userId || ''),
    
    queryFn: async () => {
      console.log('📥 useGetAllChats - Fetching chats for userId:', userId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const chats = await chatApi.getAllChats(userId);
      console.log('✅ useGetAllChats - Fetched', chats.length, 'chats');
      return chats;
    },
    
    // Only run query if userId exists
    enabled: options?.enabled !== false && !!userId,
    
    // Cache for 1 minute
    staleTime: 60 * 1000,
    
    // Keep data in cache for 5 minutes even when unused
    gcTime: 5 * 60 * 1000,
    
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
    
    // Retry once on failure
    retry: 1,
  });
};

