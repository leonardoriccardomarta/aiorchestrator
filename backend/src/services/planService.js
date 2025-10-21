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

  // Set user plan - REAL implementation
  async setUserPlan(userId, planId) {
    console.log(`🔄 Setting user ${userId} to plan ${planId}`);
    
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      // Check if user exists first
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!existingUser) {
        console.error(`❌ User ${userId} not found in database`);
        return false;
      }
      
      console.log(`🔄 Current user plan: ${existingUser.planId}, updating to: ${planId}`);
      
      // Update user plan in database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { 
          planId: planId,
          isActive: true
        }
      });
      
      console.log(`✅ User ${userId} updated to plan ${updatedUser.planId} in database`);
      console.log(`✅ User isActive: ${updatedUser.isActive}`);
      
      await prisma.$disconnect();
      return true;
    } catch (error) {
      console.error(`❌ Failed to update user plan:`, error);
      return false;
    }
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

  // Get user plan (mock implementation - returns default starter plan)
  getUserPlan(userId) {
    console.log(`Getting plan for user ${userId}`);
    // In a real implementation, this would query the database
    // For now, return a default starter plan
    return {
      planId: 'starter',
      limits: this.getPlanLimits('starter')
    };
  }

  // Get usage stats (mock implementation)
  getUsageStats(userId) {
    console.log(`Getting usage stats for user ${userId}`);
    // In a real implementation, this would query the database
    return {
      chatbots: 0,
      messages: 0,
      websites: 0
    };
  }

  // Validate action (mock implementation)
  validateAction(userId, action, count = 1) {
    const userPlan = this.getUserPlan(userId);
    const limits = userPlan.limits;
    
    // Always allow for now (mock)
    return {
      allowed: true,
      remaining: limits.messages - count
    };
  }

  // Record usage (mock implementation)
  recordUsage(userId, action, count = 1) {
    console.log(`Recording usage for user ${userId}: ${action} x${count}`);
    // In a real implementation, this would update the database
    return true;
  }
}

module.exports = PlanService;








