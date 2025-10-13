import React, { useState } from 'react';
import { Icons } from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContextHooks';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onSwitchMode,
  onSuccess
}) => {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

         const handleSubmit = async (e: React.FormEvent) => {
           e.preventDefault();
           setIsLoading(true);
           setError('');

           console.log('🚀 AuthModal: Starting authentication...', { mode, email: formData.email });
           try {
             if (mode === 'login') {
               console.log('🔐 AuthModal: Attempting login...');
               await login(formData.email, formData.password);
               console.log('✅ AuthModal: Login successful!');
               console.log('🔍 AuthModal: Right after login - checking localStorage...');
               console.log('🔍 AuthModal: Token:', !!localStorage.getItem('authToken'));
               console.log('🔍 AuthModal: UserData:', !!localStorage.getItem('userData'));
             } else {
               console.log('📝 AuthModal: Attempting registration...');
               await register(formData.email, formData.password, formData.name);
               console.log('✅ AuthModal: Registration successful!');
             }
      
             // Only proceed if auth was successful (no exception thrown)
             console.log('🔍 AuthModal: Checking localStorage after login...');
             console.log('🔍 AuthModal: Token in localStorage:', !!localStorage.getItem('authToken'));
             console.log('🔍 AuthModal: UserData in localStorage:', !!localStorage.getItem('userData'));
             
             const userData = localStorage.getItem('userData');
             if (userData) {
               const user = JSON.parse(userData);
               console.log('✅ AuthModal: Auth successful, calling onSuccess with:', user);
        
        // Emit custom event to notify AuthContext of auth update
        console.log('Emitting authUpdate event...');
        window.dispatchEvent(new CustomEvent('authUpdate'));
        
        // Wait longer to ensure AuthContext processes the event
        setTimeout(() => {
          onSuccess(user);
          onClose();
        }, 500);
      } else {
        throw new Error('Authentication failed - no user data found');
      }
    } catch (err) {
      console.error('AuthModal: Authentication failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icons.X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-1">
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Start your 7-day free trial today'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              title="Please enter a valid email address"
              onInvalid={(e) => {
                e.target.setCustomValidity('Please enter a valid email address');
              }}
              onInput={(e) => {
                e.target.setCustomValidity('');
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
              title="Password must be at least 8 characters"
              onInvalid={(e) => {
                e.target.setCustomValidity('Password must be at least 8 characters');
              }}
              onInput={(e) => {
                e.target.setCustomValidity('');
              }}
            />
          </div>

          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
                title="Passwords must match"
                onInvalid={(e) => {
                  e.target.setCustomValidity('Passwords must match');
                }}
                onInput={(e) => {
                  e.target.setCustomValidity('');
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="text-center">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
              className="text-blue-600 hover:text-blue-700 font-medium mt-1"
            >
              {mode === 'login' ? 'Sign up for free' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
