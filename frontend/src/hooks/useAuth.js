export const useAuth = () => {
  return {
    user: {
      id: '1',
      name: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    isAuthenticated: true,
    isLoading: false,
    login: async (email, password) => {
      console.log('Mock login:', email, password);
    },
    register: async (userData) => {
      console.log('Mock register:', userData);
    },
    logout: () => {
      console.log('Mock logout');
    },
    updateProfile: async (data) => {
      console.log('Mock updateProfile:', data);
    }
  };
}; 