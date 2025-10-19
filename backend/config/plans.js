// Plan configurations and limits
const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    chatbotLimit: 1,
    messageLimit: 5000, // per month
    connectionLimit: 1,
    features: {
      // Basic features
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
      multiLanguage: true, // Changed: multi-language is basic now (50+ languages)
      productRecommendations: true, // Basic product search
      // Premium features disabled
      advancedAnalytics: false,
      prioritySupport: false,
      whiteLabel: false,
      apiAccess: false,
      customIntegrations: false,
      // E-commerce Advanced - DISABLED
      addToCart: false,
      checkoutAssistance: false,
      mlPersonalization: false,
      // Enterprise features - DISABLED
      stripePayments: false,
      aiUpselling: false,
      abandonedCartRecovery: false,
      fullMLSuite: false
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 99,
    chatbotLimit: 2,
    messageLimit: 25000, // per month
    connectionLimit: 2,
    features: {
      // Basic features
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
      multiLanguage: true,
      productRecommendations: true,
      // Premium features
      advancedAnalytics: true,
      prioritySupport: true,
      apiAccess: true,
      customIntegrations: true,
      // E-commerce Advanced - ENABLED
      addToCart: true,
      checkoutAssistance: true,
      mlPersonalization: true, // 5 segments
      // Enterprise features - DISABLED
      whiteLabel: false,
      stripePayments: false,
      aiUpselling: false,
      abandonedCartRecovery: false,
      fullMLSuite: false
    }
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 299,
    chatbotLimit: 3,
    messageLimit: 100000, // per month
    connectionLimit: 3,
    features: {
      // Basic features
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
      multiLanguage: true,
      productRecommendations: true,
      // All premium features
      advancedAnalytics: true,
      prioritySupport: true,
      whiteLabel: true,
      apiAccess: true,
      customIntegrations: true,
      // E-commerce Advanced - ENABLED
      addToCart: true,
      checkoutAssistance: true,
      mlPersonalization: true,
      // Enterprise features - ALL ENABLED
      stripePayments: true,
      aiUpselling: true,
      abandonedCartRecovery: true,
      fullMLSuite: true
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    chatbotLimit: 3,
    messageLimit: 100000, // per month
    connectionLimit: 5,
    features: {
      // All features enabled
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
      multiLanguage: true,
      productRecommendations: true,
      advancedAnalytics: true,
      prioritySupport: true,
      whiteLabel: true,
      apiAccess: true,
      customIntegrations: true,
      addToCart: true,
      checkoutAssistance: true,
      mlPersonalization: true,
      stripePayments: true,
      aiUpselling: true,
      abandonedCartRecovery: true,
      fullMLSuite: true,
      // Enterprise exclusives
      dedicatedSupport: true,
      accountManager: true
    }
  }
};

// Helper functions
const getPlan = (planId) => {
  return PLANS[planId] || PLANS.starter;
};

const canCreateChatbot = (planId, currentCount) => {
  const plan = getPlan(planId);
  return currentCount < plan.chatbotLimit;
};

const canCreateConnection = (planId, currentCount) => {
  const plan = getPlan(planId);
  return currentCount < plan.connectionLimit;
};

const canSendMessage = (planId, monthlyCount) => {
  const plan = getPlan(planId);
  return monthlyCount < plan.messageLimit;
};

const hasFeature = (planId, featureName) => {
  const plan = getPlan(planId);
  return plan.features[featureName] === true;
};

const getRemainingMessages = (planId, monthlyCount) => {
  const plan = getPlan(planId);
  return Math.max(0, plan.messageLimit - monthlyCount);
};

const getUsagePercentage = (planId, monthlyCount) => {
  const plan = getPlan(planId);
  return Math.min(100, (monthlyCount / plan.messageLimit) * 100);
};

module.exports = {
  PLANS,
  getPlan,
  canCreateChatbot,
  canCreateConnection,
  canSendMessage,
  hasFeature,
  getRemainingMessages,
  getUsagePercentage
};

