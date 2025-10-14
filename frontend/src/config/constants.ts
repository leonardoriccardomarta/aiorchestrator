/**
 * Application Constants
 * Centralized configuration for the entire frontend
 */

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://aiorchestrator-vtihz.ondigitalocean.app';
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.aiorchestrator.dev';

// Payment Configuration
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

// Export as default for easier imports
export default {
  API_URL,
  FRONTEND_URL,
  STRIPE_PUBLIC_KEY,
  PAYPAL_CLIENT_ID,
};

