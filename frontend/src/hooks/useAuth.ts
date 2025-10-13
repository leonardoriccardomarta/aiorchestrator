import { useState, useEffect } from 'react';
import type { User } from '../store/types';

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement actual authentication check
    const checkAuth = async () => {
      try {
        // Simulate auth check
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string) => {
    // TODO: Implement actual login logic
    const mockUser: User = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      isVerified: true,
      tenantId: '1',
      roles: ['user'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // TODO: Implement actual profile update logic
    const updatedUser: User = {
      ...user,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      updatedAt: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return {
    user,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };
}; 