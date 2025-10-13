import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextHooks';

export function withAuthProtection<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, user } = useAuth();
    
    console.log('🔒 withAuthProtection: isAuthenticated:', isAuthenticated);
    console.log('🔒 withAuthProtection: user:', user);
    console.log('🔒 withAuthProtection: user?.isTrialActive:', user?.isTrialActive);
    console.log('🔒 withAuthProtection: user?.isPaid:', user?.isPaid);
    
    if (!isAuthenticated) {
      console.log('🔒 withAuthProtection: Redirecting to / (not authenticated)');
      return <Navigate to="/" replace />;
    }
    
    // Check if user has active plan or trial
    if (!user?.isTrialActive && !user?.isPaid) {
      console.log('🔒 withAuthProtection: Redirecting to /pricing (no active plan)');
      return <Navigate to="/pricing" replace />;
    }
    
    console.log('🔒 withAuthProtection: Access granted');
    return <WrappedComponent {...props} />;
  };
}

// Middleware per componenti che richiedono solo autenticazione (senza piano)
export function withBasicAuthProtection<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, user } = useAuth();
    
    console.log('🔓 withBasicAuthProtection: isAuthenticated:', isAuthenticated);
    console.log('🔓 withBasicAuthProtection: user:', user);
    
    if (!isAuthenticated) {
      console.log('🔓 withBasicAuthProtection: Redirecting to / (not authenticated)');
      return <Navigate to="/" replace />;
    }
    
    console.log('🔓 withBasicAuthProtection: Access granted');
    return <WrappedComponent {...props} />;
  };
}