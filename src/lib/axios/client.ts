
import { BACKEND_URL } from '@/environment';
import { logout } from '@/src/store/slices/auth.slice';
import { store } from '@/src/store/store';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';


const BASE_URL = BACKEND_URL.PRODUCTION || 'http://localhost:3000';

console.log('🌐 API Base URL:', BASE_URL);

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Multipart client (for file uploads)
export const multipartClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000, // 60 seconds for file uploads
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// Automatically add JWT token to every request

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Get token from Redux store
  const token = store.getState().auth.token;

  // If token exists, add it to Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Token added to request:', config.url);
  } else {
    console.log('⚠️ No token available for request:', config.url);
  }


  console.log('📤 API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    hasToken: !!token,
  });

  return config;
};

// Add interceptor to both clients
apiClient.interceptors.request.use(requestInterceptor);
multipartClient.interceptors.request.use(requestInterceptor);



const responseInterceptor = {
  // On success, just return the response
  onSuccess: (response: any) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },

  onError: (error: AxiosError<any>) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    // Network error (no internet, server down)
    if (!error.response) {
      Alert.alert(
        'Connection Error',
        'Unable to connect to server. Please check your internet connection.',
        [{ text: 'OK' }]
      );
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response.data?.message || error.message;

    // Handle different HTTP status codes
    switch (status) {
      case 401:
        // Unauthorized - Token expired or invalid
        console.log('🔒 401 Unauthorized - Logging out user');
        
        // Clear Redux state
        store.dispatch(logout());
        
        // Navigate to welcome screen
        router.replace('/(auth)/welcome');
        
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [{ text: 'OK' }]
        );
        break;

      case 403:
        // Forbidden - User doesn't have permission
        Alert.alert(
          'Access Denied',
          'You do not have permission to perform this action.',
          [{ text: 'OK' }]
        );
        break;

      case 404:
        // Not Found
        Alert.alert(
          'Not Found',
          typeof message === 'string' ? message : 'The requested resource was not found.',
          [{ text: 'OK' }]
        );
        break;

      case 409:
        // Conflict (e.g., phone already exists)
        // Don't show alert, let the component handle it
        console.log('⚠️ 409 Conflict:', message);
        break;

      case 422:
        // Validation Error
        const errors = Array.isArray(message) ? message.join('\n') : message;
        Alert.alert('Validation Error', errors, [{ text: 'OK' }]);
        break;

      case 500:
      case 502:
      case 503:
        // Server Error
        Alert.alert(
          'Server Error',
          'Something went wrong on the server. Please try again later.',
          [{ text: 'OK' }]
        );
        break;

      default:
        // Other errors
        const errorMsg = Array.isArray(message) ? message.join('\n') : message;
        Alert.alert('Error', errorMsg, [{ text: 'OK' }]);
    }

    return Promise.reject(error);
  },
};

// Add interceptor to both clients
apiClient.interceptors.response.use(
  responseInterceptor.onSuccess,
  responseInterceptor.onError
);

multipartClient.interceptors.response.use(
  responseInterceptor.onSuccess,
  responseInterceptor.onError
);

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get current token (useful for debugging)
export const getCurrentToken = () => {
  return store.getState().auth.token;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!store.getState().auth.token;
};

// ============================================
// EXPORTS
// ============================================
export default apiClient;

// ============================================
// USAGE EXAMPLES
// ============================================
/*

// 1. Simple GET request (token added automatically)
const response = await apiClient.get('/api/v1/users/profile');

// 2. POST request with data
const response = await apiClient.post('/api/v1/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// 3. File upload (use multipartClient)
const formData = new FormData();
formData.append('file', {
  uri: fileUri,
  name: 'photo.jpg',
  type: 'image/jpeg'
});

const response = await multipartClient.post('/api/v1/upload', formData);

// 4. Request with custom headers
const response = await apiClient.get('/api/v1/data', {
  headers: {
    'X-Custom-Header': 'value'
  }
});

// Token is AUTOMATICALLY added to all requests!
// No need to manually add Authorization header!

*/