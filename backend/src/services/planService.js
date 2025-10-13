class PlanService {
  constructor() {
    this.plans = {
      starter: {
        name: 'Starter',
        price: { monthly: 29, yearly: 290 },
        features: ['1 AI Chatbot', '1K messages/month', 'Basic analytics', 'Email support'],
        limitations: ['No custom branding', 'No API access', 'Limited to 1 chatbot']
      },
      professional: {
        name: 'Professional',
        price: { monthly: 99, yearly: 990 },
        features: ['2 AI Chatbots', '5K messages/month', 'Advanced analytics', 'Priority support', 'Custom branding', 'API access'],
        limitations: ['No white-label solution', 'No dedicated account manager', 'Limited to 2 chatbots']
      },
      enterprise: {
        name: 'Enterprise',
        price: { monthly: 199, yearly: 1990 },
        features: ['3 AI Chatbots', '25K messages/month', 'Enterprise analytics', '24/7 support', 'White-label solution', 'All connections', 'Full API access', 'Dedicated account manager'],
        limitations: ['Limited to 3 chatbots', 'No unlimited conversations']
      }
    };
  }

  // Get plan details
  getPlan(planId) {
    return this.plans[planId] || this.plans.starter;
  }

  // Get all plans
  getAllPlans() {
    return Object.keys(this.plans).map(planId => ({
      id: planId,
      ...this.plans[planId]
    }));
  }

  // Set user plan (mock implementation)
  setUserPlan(userId, planId) {
    console.log(`Setting user ${userId} to plan ${planId}`);
    // In a real implementation, this would update the database
    return true;
  }

  // Check if user can access feature
  canAccessFeature(userPlan, feature) {
    const plan = this.getPlan(userPlan);
    
    switch (feature) {
      case 'custom_branding':
        return userPlan === 'professional' || userPlan === 'enterprise';
      case 'white_label':
        return userPlan === 'enterprise';
      case 'api_access':
        return userPlan === 'professional' || userPlan === 'enterprise';
      case 'priority_support':
        return userPlan === 'professional' || userPlan === 'enterprise';
      case 'dedicated_manager':
        return userPlan === 'enterprise';
      default:
        return true;
    }
  }

  // Get plan limits
  getPlanLimits(planId) {
    const limits = {
      starter: {
        chatbots: 1,
        messages: 1000,
        websites: 1,
        connections: ['shopify']
      },
      professional: {
        chatbots: 2,
        messages: 5000,
        websites: 2,
        connections: ['shopify', 'woocommerce']
      },
      enterprise: {
        chatbots: 3,
        messages: 25000,
        websites: 3,
        connections: ['shopify', 'woocommerce', 'custom']
      }
    };

    return limits[planId] || limits.starter;
  }
}

module.exports = PlanService;








