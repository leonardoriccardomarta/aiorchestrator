import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/constants';
// import { requestThrottle } from '../lib/requestThrottle';

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const isExpired = payload.exp < currentTime;
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

interface UserState {
  id: string;
  email: string;
  name: string;
  planId: string;
  isTrialActive: boolean;
  trialEndDate: string;
  isPaid: boolean;
  trialDaysLeft: number;
  hasCompletedOnboarding: boolean;
  isNewUser: boolean;
}

interface UserContextType {
  user: UserState | null;
  updateUser: (userData: Partial<UserState>) => void;
  refreshUser: () => Promise<void>;
  isTrialExpired: boolean;
  isTrialExpiringSoon: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isTrialExpiringSoon, setIsTrialExpiringSoon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const calculateTrialStatus = (trialEndDate: string) => {
    const now = new Date();
    const endDate = new Date(trialEndDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      daysLeft: Math.max(0, diffDays),
      isExpired: diffTime <= 0,
      isExpiringSoon: diffDays <= 3 && diffDays > 0
    };
  };

  const updateUser = (userData: Partial<UserState>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      
      // Recalculate trial status
      if (updated.trialEndDate) {
        const trialStatus = calculateTrialStatus(updated.trialEndDate);
        updated.trialDaysLeft = trialStatus.daysLeft;
        setIsTrialExpired(trialStatus.isExpired);
        setIsTrialExpiringSoon(trialStatus.isExpiringSoon);
      }
      
      return updated;
    });
  };

  const refreshUser = useCallback(async () => {
    try {
      console.log('🔄 RefreshUser: Starting...');
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('🔄 RefreshUser: No token found');
        return;
      }

      console.log('🔄 RefreshUser: Fetching user profile...');
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('🔄 RefreshUser: Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('🔄 RefreshUser: Raw response:', result);
        console.log('🔄 RefreshUser: Has token?', !!result.token);
        console.log('🔄 RefreshUser: Token value:', result.token ? result.token.substring(0, 50) + '...' : 'none');
        
        const userData = result.data || result; // Handle both {data: {...}} and direct {...} formats
        console.log('🔄 RefreshUser: User data:', userData);
        
        // Prioritize server data over localStorage
        console.log('🔍 Comparing server vs localStorage data:', {
          serverPlanId: userData.planId,
          serverIsPaid: userData.isPaid,
          serverIsTrialActive: userData.isTrialActive
        });
        
        // Save new token if provided
        if (result.token) {
          localStorage.setItem('authToken', result.token);
          console.log('🔑 New token saved to localStorage');
        } else {
          console.log('⚠️ No token in response, keeping existing token');
        }
        
        const trialStatus = calculateTrialStatus(userData.trialEndDate);
        
        const updatedUser = {
          ...userData,
          trialDaysLeft: trialStatus.daysLeft
        };
        
        console.log('🔄 RefreshUser: Setting user:', updatedUser);
        setUser(updatedUser);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ RefreshUser: User updated in state and localStorage');
        
        setIsTrialExpired(trialStatus.isExpired);
        setIsTrialExpiringSoon(trialStatus.isExpiringSoon);
      } else if (response.status === 404) {
        // Endpoint not available yet, use localStorage data
        console.log('⚠️ RefreshUser: Endpoint not available (404), using localStorage data');
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const trialStatus = calculateTrialStatus(userData.trialEndDate);
          
          setUser({
            ...userData,
            trialDaysLeft: trialStatus.daysLeft
          });
          
          setIsTrialExpired(trialStatus.isExpired);
          setIsTrialExpiringSoon(trialStatus.isExpiringSoon);
        }
      } else if (response.status === 403) {
        // User is blocked (subscription cancelled)
        const errorData = await response.json();
        if (errorData.subscriptionCancelled) {
          console.log('🚫 User subscription cancelled, redirecting to pricing');
        // Clear user data and redirect to pricing
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        setIsLoading(false);
        window.location.href = '/pricing';
        return;
        }
      } else if (response.status === 401) {
        // Token expired or invalid - try to get fresh data from database
        console.error('⚠️ RefreshUser: 401 Unauthorized - trying to get fresh data');
        
        try {
          // Try to get fresh user data using the refresh endpoint
          const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
          if (currentUser.id) {
            const freshResponse = await fetch(`${API_URL}/api/user/refresh?userId=${currentUser.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (freshResponse.ok) {
              const freshResult = await freshResponse.json();
              const freshUserData = freshResult.data || freshResult;
              console.log('✅ RefreshUser: Got fresh data from database:', freshUserData);
              
              // Save new token if provided
              if (freshResult.token) {
                localStorage.setItem('authToken', freshResult.token);
                console.log('🔑 New token saved to localStorage');
              }
              
              const trialStatus = calculateTrialStatus(freshUserData.trialEndDate);
              const updatedUser = {
                ...freshUserData,
                trialDaysLeft: trialStatus.daysLeft
              };
              
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setIsTrialExpired(trialStatus.isExpired);
              setIsTrialExpiringSoon(trialStatus.isExpiringSoon);
              return;
            }
          }
        } catch (freshError) {
          console.error('❌ RefreshUser: Failed to get fresh data:', freshError);
        }
        
        // Fallback to localStorage if fresh data fails
        console.log('⚠️ RefreshUser: Using localStorage as fallback');
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const trialStatus = calculateTrialStatus(userData.trialEndDate);
          
          setUser({
            ...userData,
            trialDaysLeft: trialStatus.daysLeft
          });
          
          setIsTrialExpired(trialStatus.isExpired);
          setIsTrialExpiringSoon(trialStatus.isExpiringSoon);
        }
      } else {
        console.error('⚠️ RefreshUser: Unexpected status:', response.status);
      }
    } catch (error) {
      console.error('❌ RefreshUser: Error:', error);
      // Clear invalid data on error
      console.log('⚠️ RefreshUser: Error occurred, clearing user data');
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, []); // Remove user dependency to prevent circular dependency

  useEffect(() => {
    // Initialize user from localStorage and refresh from server
    const initializeUser = async () => {
      // First check if there's already authenticated user data from AuthContext
      const authUserData = localStorage.getItem('userData');
      const authToken = localStorage.getItem('authToken');
      
      if (authUserData && authToken) {
        try {
          const userData = JSON.parse(authUserData);
          console.log('🔄 UserContext: Found authenticated user data:', userData);
          
          // Calculate trial status
          const trialStatus = calculateTrialStatus(userData.trialEndDate);
          console.log('🔄 UserContext: Trial status calculated:', trialStatus);
          
          setUser({
            ...userData,
            trialDaysLeft: trialStatus.daysLeft
          });
          
          setIsTrialExpired(trialStatus.isExpired);
          setIsTrialExpiringSoon(trialStatus.isExpiringSoon);
          
          // Try to refresh user data from server to get latest info
          try {
            await refreshUser();
            console.log('🔄 UserContext: User data refreshed from server');
          } catch (error) {
            console.log('🔄 UserContext: Could not refresh from server, using cached data');
          }
          
          return; // Exit early, we have authenticated user
        } catch (error) {
          console.error('Error parsing authenticated user data:', error);
        }
      }
      
      // Check legacy user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const trialStatus = calculateTrialStatus(userData.trialEndDate);
        
        setUser({
          ...userData,
          trialDaysLeft: trialStatus.daysLeft
        });
        
        setIsTrialExpired(trialStatus.isExpired);
        setIsTrialExpiringSoon(trialStatus.isExpiringSoon);
        setIsLoading(false);
        
        // Check for data synchronization issues
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token && !isTokenExpired(token)) {
          // Decode token to check for discrepancies
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log('🔍 Token payload:', tokenPayload);
            console.log('🔍 Stored user data:', userData);
            
              // Check if planId or isPaid are different
              if (tokenPayload.planId !== userData.planId || tokenPayload.isPaid !== userData.isPaid) {
                console.log('🔄 Data mismatch detected, refreshing user data from server...');
                console.log('🔍 Token planId:', tokenPayload.planId, 'vs stored planId:', userData.planId);
                console.log('🔍 Token isPaid:', tokenPayload.isPaid, 'vs stored isPaid:', userData.isPaid);
                // Force refresh immediately and update localStorage
                await refreshUser();
                console.log('🔄 User data refreshed successfully');
              } else {
                console.log('🔄 Initializing: Data synchronized, skipping refresh');
              }
          } catch (tokenError) {
            console.error('Error decoding token:', tokenError);
            console.log('🔄 Initializing: Token decode failed, refreshing user data from server...');
            refreshUser();
          }
        } else {
          console.log('🔄 Initializing: Token expired or missing, refreshing user data from server...');
          refreshUser();
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data and require authentication
        localStorage.removeItem('user');
        setUser(null);
        setIsLoading(false);
      }
      } else {
        // No user data found, user not authenticated
        console.log('🔄 UserContext: No user data found, user not authenticated');
        setUser(null);
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []); // Rimuoviamo refreshUser dalle dipendenze per evitare il loop infinito

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('🔄 UserContext: No authenticated user, redirecting to login');
      // Clear any invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      setIsLoading(false);
      // Redirect to login page
      window.location.href = '/';
    }
  }, [user, isLoading]);


  const value = {
    user,
    updateUser,
    refreshUser,
    isTrialExpired,
    isTrialExpiringSoon,
    isLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
