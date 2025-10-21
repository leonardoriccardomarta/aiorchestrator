import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/constants';

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

  const refreshUser = async () => {
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
        const userData = result.data || result; // Handle both {data: {...}} and direct {...} formats
        console.log('🔄 RefreshUser: User data:', userData);
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
      } else if (response.status === 401) {
        // Token expired or invalid - this should not happen with authenticatePayment middleware
        console.error('⚠️ RefreshUser: 401 Unauthorized - token issue');
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
      // Fallback to localStorage on error
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log('⚠️ RefreshUser: Using localStorage as fallback after error');
        const userData = JSON.parse(storedUser);
        const trialStatus = calculateTrialStatus(userData.trialEndDate);
        
        setUser({
          ...userData,
          trialDaysLeft: trialStatus.daysLeft
        });
        
        setIsTrialExpired(trialStatus.isExpired);
        setIsTrialExpiringSoon(trialStatus.isExpiringSoon);
      }
    }
  };

  useEffect(() => {
    // Initialize user from localStorage or create demo user
    const storedUser = localStorage.getItem('userData');
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
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Fallback to demo user
        initializeDemoUser();
      }
    } else {
      // Initialize demo user if no stored data
      initializeDemoUser();
    }
  }, []);

  const initializeDemoUser = () => {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    
    const demoUser = {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      planId: 'starter',
      isTrialActive: true,
      trialEndDate: trialEndDate.toISOString(),
      isPaid: false,
      hasCompletedOnboarding: true,
      isNewUser: false,
      trialDaysLeft: 7
    };
    
    setUser(demoUser);
    setIsTrialExpired(false);
    setIsTrialExpiringSoon(false);
    
    // Store in localStorage
    localStorage.setItem('userData', JSON.stringify(demoUser));
  };

  const value = {
    user,
    updateUser,
    refreshUser,
    isTrialExpired,
    isTrialExpiringSoon
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
