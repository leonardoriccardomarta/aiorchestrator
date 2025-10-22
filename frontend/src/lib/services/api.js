import { requestThrottle } from '../requestThrottle';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://aiorchestrator-vtihz.ondigitalocean.app/api';

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const isExpired = payload.exp < currentTime;
    
    console.log('🔐 Token expiration check:', {
      exp: payload.exp,
      currentTime: currentTime,
      isExpired: isExpired,
      timeLeft: payload.exp - currentTime
    });
    
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Clear invalid token
const clearInvalidToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  // Redirect to login if not already there
  if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
    window.location.href = '/login';
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  return requestThrottle.throttle(endpoint, async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    // Check if token is expired
    if (token && isTokenExpired(token)) {
      console.warn('Token expired, clearing and redirecting to login');
      clearInvalidToken();
      throw new Error('Token expired. Please login again.');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    console.log('🔐 Making API request to:', endpoint);
    console.log('🔐 Token present:', !!token);

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('🔐 API Error:', errorData);
      
      // If token is invalid or expired, clear it and redirect
      // BUT NOT for payment endpoints - they handle expired tokens differently
      if (res.status === 401 && !endpoint.includes('/payments/')) {
        console.warn('🔐 401 Unauthorized - clearing token and redirecting');
        clearInvalidToken();
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(errorData.error || 'Errore API');
    }

    return res.json();
  });
};
