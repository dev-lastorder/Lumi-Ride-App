
import { supportChatApi, SupportChatBox } from '@/src/services/supportChatApi';
import { useQuery } from '@tanstack/react-query';

// Query keys for cache management
export const supportChatQueryKeys = {
  all: ['supportChat'] as const,
  messages: (chatBoxId: string) => [...supportChatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string, submittedBy?: string[], statusFilter?: string[]) => 
    [...supportChatQueryKeys.all, 'userChats', userId, submittedBy, statusFilter] as const,
};

interface UseGetAllSupportChatsOptions {
  enabled?: boolean;  // Whether to run the query
  submittedBy?: string[];  // Filter by user type (e.g., ['Rider', 'Vendor'])
  statusFilter?: string[];  // Filter by status (e.g., ['opened', 'closed'])
}

export const useGetAllSupportChats = (
  userId: string | null,
  options?: UseGetAllSupportChatsOptions
) => {
  return useQuery<SupportChatBox[], Error>({
    queryKey: supportChatQueryKeys.userChats(
      userId || '', 
      options?.submittedBy, 
      options?.statusFilter
    ),
    
    queryFn: async () => {
      console.log('📥 useGetAllSupportChats - Fetching support chats');
      console.log('   User ID:', userId);
      console.log('   Submitted By:', options?.submittedBy);
      console.log('   Status Filter:', options?.statusFilter);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const chats = await supportChatApi.getAllChats(
        userId,
        options?.submittedBy,
        options?.statusFilter
      );
      
      console.log('✅ useGetAllSupportChats - Fetched', chats.length, 'support chats');
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
