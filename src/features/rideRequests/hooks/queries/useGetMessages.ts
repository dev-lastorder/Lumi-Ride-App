
import { chatApi, ChatMessage } from '@/src/services/chatApi';
import { useQuery } from '@tanstack/react-query';

export const chatQueryKeys = {
  all: ['chat'] as const,
  messages: (chatBoxId: string) => [...chatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string) => [...chatQueryKeys.all, 'userChats', userId] as const,
};

interface UseGetMessagesOptions {
  enabled?: boolean;  
}

export const useGetMessages = (
  chatBoxId: string | null,
  options?: UseGetMessagesOptions
) => {
  return useQuery<ChatMessage[], Error>({
    queryKey: chatQueryKeys.messages(chatBoxId || ''),
    
    queryFn: async () => {
      console.log('📥 useGetMessages - Fetching messages for:', chatBoxId);
      
      if (!chatBoxId) {
        throw new Error('Chat box ID is required');
      }
      
      const messages = await chatApi.getMessages(chatBoxId);
      console.log('✅ useGetMessages - Fetched', messages.length, 'messages');
      return messages;
    },
    

    enabled: options?.enabled !== false && 
             !!chatBoxId && 
             !chatBoxId.startsWith('temp-'),
    

    staleTime: 30 * 1000,
 
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

