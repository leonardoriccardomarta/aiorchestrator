// Plan configurations and limits
const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    chatbotLimit: 1,
    messageLimit: 5000, // per month
    connectionLimit: 1, // same as chatbot limit
    features: {
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
      // Premium features disabled
      advancedAnalytics: false,
      multiLanguage: false,
      prioritySupport: false,
      whiteLabel: false,
      apiAccess: false,
      customIntegrations: false
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 99,
    chatbotLimit: 2,
    messageLimit: 25000, // per month
    connectionLimit: 2, // same as chatbot limit
    features: {
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
      // Premium features
      advancedAnalytics: true,
      multiLanguage: true,
      prioritySupport: true,
      whiteLabel: false,
      apiAccess: true,
      customIntegrations: true
    }
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 299,
    chatbotLimit: 999, // unlimited
    messageLimit: 100000, // per month
    connectionLimit: 999, // unlimited
    features: {
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
      // All premium features
      advancedAnalytics: true,
      multiLanguage: true,
      prioritySupport: true,
      whiteLabel: true,
      apiAccess: true,
      customIntegrations: true
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

