import { QueryClient } from '@tanstack/react-query';

// Create a singleton QueryClient instance for the whole app
export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      // Adjust as needed for caching and refetch behavior
      staleTime: 1000 * 60, // 1 minute
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClientInstance;