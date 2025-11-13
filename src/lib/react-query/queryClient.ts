// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

// Create a single shared instance of QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // retry failed requests once
      refetchOnWindowFocus: false, // don't refetch when window refocuses
      staleTime: 1000 * 60 * 5, // cache for 5 mins
    },
  },
});
