import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { API_URL } from '../config/constants';

interface User {
  id: string;
  email: string;
  name: string;
  planId: string;
  isTrialActive: boolean;
  trialEndDate: string;
  isPaid: boolean;
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Debug: Log when user state changes (can be removed in production)
  useEffect(() => {
    // console.log('👤 AuthContext: User state changed:', user);
  }, [user]);

  // Memoize checkAuth to prevent infinite loops
  const checkAuth = useCallback(async () => {
    console.log('🔍 AuthContext: Starting auth check...');
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    console.log('🔑 AuthContext: Token found:', !!token);
    console.log('👤 AuthContext: User data found:', !!userData);
    console.log('📊 AuthContext: Token value:', token);
    console.log('📊 AuthContext: User data value:', userData);
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log('✅ AuthContext: Using localStorage user data:', parsedUserData);
        console.log('✅ AuthContext: User isTrialActive:', parsedUserData.isTrialActive);
        console.log('✅ AuthContext: User isPaid:', parsedUserData.isPaid);
        setUser(parsedUserData);
        setIsAuthenticated(true);
        console.log('✅ AuthContext: User authenticated successfully');
      } catch (error) {
        console.error('AuthContext: Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      // No token or user data, user not authenticated
      setUser(null);
      setIsAuthenticated(false);
      console.log('❌ AuthContext: No token or user data found, user not authenticated');
    }
    
    setLoading(false);
    console.log('🏁 AuthContext: Auth check completed');
  }, []); // Empty dependency array since we don't want this to re-run

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Listen for storage changes to sync auth state
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        console.log('Storage change detected, checking auth...');
        checkAuth();
      }
    };

    // Also listen for custom events for same-tab updates
    const handleAuthUpdate = () => {
      console.log('Auth update event received, checking auth...');
      setTimeout(() => {
        checkAuth();
      }, 100);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authUpdate', handleAuthUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authUpdate', handleAuthUpdate);
    };
  }, [checkAuth]); // Only depend on checkAuth

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process...');
      
      // Try to connect to backend first
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          // Check if account needs verification
          if (data.needsVerification) {
            throw new Error('Account not verified. Please check your email and click the verification link.');
          }
          throw new Error(data.error || 'Login failed');
        }

        console.log('AuthContext: Login successful, storing data...');
        console.log('AuthContext: Response data:', data);
        console.log('AuthContext: User data from API:', data.data.user);
        
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        
        setUser(data.data.user);
        
        // Redirect to dashboard after successful login
        window.location.href = '/dashboard';
        return;
      } catch (fetchError) {
        console.error('AuthContext: Backend not available - cannot login without backend');
        throw new Error('Backend server is not available. Please make sure the server is running on port 4000.');
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw new Error('Login failed');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      // Try to connect to backend first
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            password, 
            name 
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Registration failed');
        }

        const data = await response.json();
        console.log('AuthContext: Registration successful, storing data...', data);
        
        // Handle both response formats
        const userData = data.data?.user || data.user;
        const token = data.data?.token || data.token;
        
        localStorage.setItem('authToken', token);
        if (data.data?.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        
        // Redirect based on user status
        if (data.data.user.isNewUser) {
          window.location.href = '/onboarding';
        } else {
          window.location.href = '/dashboard';
        }
        return;
      } catch (fetchError) {
        console.error('AuthContext: Backend connection failed:', fetchError);
        
        // NO MORE DEMO MODE - If backend fails, throw error
        // This prevents trial resets and ensures production behavior
        throw new Error('Unable to connect to server. Please try again.');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Update user data from localStorage with fresh data
          const userData = localStorage.getItem('userData');
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            // Update plan info if available
            if (data.data.planInfo) {
              parsedUserData.planId = data.data.planInfo.planId;
              parsedUserData.isPaid = data.data.planInfo.isPaid;
            }
            localStorage.setItem('userData', JSON.stringify(parsedUserData));
            setUser(parsedUserData);
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
    window.location.href = '/'; // Redirect to landing page after logout
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 