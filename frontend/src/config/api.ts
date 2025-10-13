// API Configuration for Y Combinator Demo
export const API_CONFIG = {
  // Backend URL
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: '/api/auth',
    CHATBOTS: '/api/chatbots',
    FAQS: '/api/faqs',
    DASHBOARD: '/api/dashboard',
    USERS: '/api/users',
    ANALYTICS: '/api/analytics',
    WORKFLOWS: '/api/workflows',
    SETTINGS: '/api/settings',
    NOTIFICATIONS: '/api/notifications',
    PAYMENTS: '/api/payments',
    SUPPORT: '/api/support',
    SECURITY: '/api/security',
    AUDIT: '/api/audit',
    PERFORMANCE: '/api/performance',
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    timeout: 10000,
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Unauthorized. Please log in again.',
    NOT_FOUND: 'Resource not found.',
    VALIDATION_ERROR: 'Validation error. Please check your input.',
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  return {
    ...API_CONFIG.REQUEST_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}; 