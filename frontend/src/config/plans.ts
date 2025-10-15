// Plan configurations and limits
export interface PlanFeatures {
  basicAnalytics: boolean;
  customization: boolean;
  emailSupport: boolean;
  advancedAnalytics: boolean;
  multiLanguage: boolean;
  prioritySupport: boolean;
  whiteLabel: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  chatbotLimit: number;
  messageLimit: number;
  connectionLimit: number;
  features: PlanFeatures;
}

export const PLANS: Record<string, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    chatbotLimit: 1,
    messageLimit: 5000,
    connectionLimit: 1,
    features: {
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
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
    messageLimit: 25000,
    connectionLimit: 2, // same as chatbot limit
    features: {
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
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
    messageLimit: 100000,
    connectionLimit: 999, // unlimited
    features: {
      basicAnalytics: true,
      customization: true,
      emailSupport: true,
      advancedAnalytics: true,
      multiLanguage: true,
      prioritySupport: true,
      whiteLabel: true,
      apiAccess: true,
      customIntegrations: true
    }
  }
};

export const getPlan = (planId: string): Plan => {
  return PLANS[planId] || PLANS.starter;
};

export const canCreateChatbot = (planId: string, currentCount: number): boolean => {
  const plan = getPlan(planId);
  return currentCount < plan.chatbotLimit;
};

export const canCreateConnection = (planId: string, currentCount: number): boolean => {
  const plan = getPlan(planId);
  return currentCount < plan.connectionLimit;
};

export const canSendMessage = (planId: string, monthlyCount: number): boolean => {
  const plan = getPlan(planId);
  return monthlyCount < plan.messageLimit;
};

export const hasFeature = (planId: string, featureName: keyof PlanFeatures): boolean => {
  const plan = getPlan(planId);
  return plan.features[featureName] === true;
};

export const getRemainingMessages = (planId: string, monthlyCount: number): number => {
  const plan = getPlan(planId);
  return Math.max(0, plan.messageLimit - monthlyCount);
};

export const getUsagePercentage = (planId: string, monthlyCount: number): number => {
  const plan = getPlan(planId);
  return Math.min(100, (monthlyCount / plan.messageLimit) * 100);
};

