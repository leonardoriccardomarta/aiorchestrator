// Stripe Configuration
// Replace these with your actual Stripe keys from https://dashboard.stripe.com/apikeys

export const STRIPE_CONFIG = {
  // Get this from Stripe Dashboard > Developers > API keys > Publishable key
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here',
  
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
};

// For development - you can temporarily use these test keys
export const TEST_STRIPE_KEYS = {
  publishableKey: 'pk_test_51234567890abcdef',
  // Note: Never put secret keys in frontend code!
};

// Helper function to get the current Stripe key
export const getStripeKey = () => {
  // In development, use test key if no environment variable is set
  if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return TEST_STRIPE_KEYS.publishableKey;
  }
  
  return STRIPE_CONFIG.publishableKey;
};
