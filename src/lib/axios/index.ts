// src/lib/axios/index.ts
// Central export file for all axios-related functionality

// Export clients
export {
    apiClient, // Helper to check auth status
    default as client, // File upload client
    getCurrentToken, // Helper to get current token
    isAuthenticated, // Main API client (JSON requests)
    multipartClient
} from './client';
  
  // Export all API endpoints
  export { API_ENDPOINTS } from './endpoints';
  
  // ============================================
  // USAGE EXAMPLES
  // ============================================
  /*
  
  // Import in your components/hooks:
  import { apiClient, multipartClient, API_ENDPOINTS } from '@/src/lib/axios';
  
  // Use in API calls:
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN_SEND_OTP, data);
  
  // For file uploads:
  const uploadResponse = await multipartClient.post(API_ENDPOINTS.UPLOAD.SINGLE, formData);
  
  */