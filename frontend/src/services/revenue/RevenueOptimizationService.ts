import { analyticsService } from '../analytics/AnalyticsService';

// Revenue Optimization Types
export enum PricingModel {
  FIXED = 'fixed',
  USAGE_BASED = 'usage_based',
  TIERED = 'tiered',
  DYNAMIC = 'dynamic',
  FREEMIUM = 'freemium'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  USAGE = 'usage'
}

export enum CustomerSegment {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
  PREMIUM = 'premium'
}

// Pricing Plan
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  pricingModel: PricingModel;
  billingCycle: BillingCycle;
  basePrice: number;
  currency: string;
  features: Array<{
    name: string;
    description: string;
    included: boolean;
    limit?: number;
    overagePrice?: number;
  }>;
  usageLimits: {
    apiCalls?: number;
    storage?: number; // in GB
    users?: number;
    chatbots?: number;
    messages?: number;
  };
  discounts: Array<{
    type: 'percentage' | 'fixed' | 'volume';
    value: number;
    conditions: Record<string, any>;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Dynamic Pricing Rule
export interface DynamicPricingRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    customerSegment?: CustomerSegment[];
    usageThreshold?: number;
    timeOfDay?: string;
    dayOfWeek?: string[];
    seasonality?: string;
    demandLevel?: 'low' | 'medium' | 'high';
  };
  pricingAdjustment: {
    type: 'percentage' | 'fixed';
    value: number;
    direction: 'increase' | 'decrease';
  };
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

// Usage-based Billing
export interface UsageBilling {
  customerId: string;
  planId: string;
  billingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  usage: {
    apiCalls: number;
    storage: number; // in GB
    messages: number;
    users: number;
    chatbots: number;
  };
  charges: {
    baseCharge: number;
    overageCharges: number;
    discountAmount: number;
    totalCharge: number;
  };
  status: 'pending' | 'billed' | 'paid' | 'overdue';
  billedAt?: Date;
  paidAt?: Date;
}

// Customer Lifetime Value
export interface CustomerLTV {
  customerId: string;
  customerName: string;
  customerEmail: string;
  currentValue: number;
  predictedValue: number;
  churnRisk: number; // 0-100
  segment: CustomerSegment;
  metrics: {
    totalRevenue: number;
    averageOrderValue: number;
    purchaseFrequency: number;
    customerAge: number; // in days
    lastPurchaseDate: Date;
    nextPurchasePrediction: Date;
  };
  factors: {
    usageIntensity: number; // 0-100
    featureAdoption: number; // 0-100
    supportInteractions: number;
    satisfactionScore: number; // 0-100
    paymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
  };
  recommendations: Array<{
    type: 'upsell' | 'cross_sell' | 'retention' | 'win_back';
    title: string;
    description: string;
    expectedValue: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  updatedAt: Date;
}

// Churn Prediction
export interface ChurnPrediction {
  customerId: string;
  churnRisk: number; // 0-100
  churnProbability: number; // 0-1
  predictedChurnDate: Date;
  riskFactors: Array<{
    factor: string;
    weight: number;
    value: number;
    impact: 'positive' | 'negative';
  }>;
  retentionScore: number; // 0-100
  recommendations: Array<{
    action: string;
    description: string;
    expectedImpact: number;
    cost: number;
    roi: number;
  }>;
  lastUpdated: Date;
}

// Revenue Analytics
export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  averageRevenuePerUser: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  churnRate: number;
  expansionRevenue: number;
  contractionRevenue: number;
  netRevenueRetention: number;
  grossRevenueRetention: number;
  revenueGrowth: number;
  metrics: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    churnedCustomers: number;
    upgradedCustomers: number;
    downgradedCustomers: number;
  };
  trends: {
    revenue: Array<{ date: string; value: number }>;
    customers: Array<{ date: string; value: number }>;
    churn: Array<{ date: string; value: number }>;
  };
}

// Revenue Optimization Service
export class RevenueOptimizationService {
  private pricingPlans: Map<string, PricingPlan> = new Map();
  private dynamicPricingRules: Map<string, DynamicPricingRule> = new Map();
  private usageBilling: Map<string, UsageBilling> = new Map();
  private customerLTV: Map<string, CustomerLTV> = new Map();
  private churnPredictions: Map<string, ChurnPrediction> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (this.isInitialized) return;
    
    this.setupDefaultData();
    this.setupEventListeners();
    this.startRevenueMonitoring();
    
    this.isInitialized = true;
  }

  private setupDefaultData(): void {
    this.setupDefaultPricingPlans();
    this.setupDefaultDynamicPricingRules();
    this.setupDefaultCustomerLTV();
    this.setupDefaultChurnPredictions();
  }

  private setupDefaultPricingPlans(): void {
    const defaultPlans: Omit<PricingPlan, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Free',
        description: 'Perfect for getting started',
        pricingModel: PricingModel.FREEMIUM,
        billingCycle: BillingCycle.MONTHLY,
        basePrice: 0,
        currency: 'USD',
        features: [
          { name: 'Basic Chatbot', description: 'Create one basic chatbot', included: true },
          { name: '100 API Calls', description: '100 API calls per month', included: true, limit: 100, overagePrice: 0.01 },
          { name: '1GB Storage', description: '1GB storage for your data', included: true, limit: 1, overagePrice: 0.10 },
          { name: 'Email Support', description: 'Email support', included: true },
          { name: 'Advanced Analytics', description: 'Advanced analytics dashboard', included: false },
          { name: 'Custom Integrations', description: 'Custom integrations', included: false }
        ],
        usageLimits: {
          apiCalls: 100,
          storage: 1,
          users: 1,
          chatbots: 1,
          messages: 1000
        },
        discounts: [],
        isActive: true
      },
      {
        name: 'Pro',
        description: 'For growing businesses',
        pricingModel: PricingModel.USAGE_BASED,
        billingCycle: BillingCycle.MONTHLY,
        basePrice: 29,
        currency: 'USD',
        features: [
          { name: 'Unlimited Chatbots', description: 'Create unlimited chatbots', included: true },
          { name: '10,000 API Calls', description: '10,000 API calls per month', included: true, limit: 10000, overagePrice: 0.005 },
          { name: '10GB Storage', description: '10GB storage for your data', included: true, limit: 10, overagePrice: 0.05 },
          { name: 'Priority Support', description: 'Priority email and chat support', included: true },
          { name: 'Advanced Analytics', description: 'Advanced analytics dashboard', included: true },
          { name: 'Custom Integrations', description: 'Custom integrations', included: true }
        ],
        usageLimits: {
          apiCalls: 10000,
          storage: 10,
          users: 5,
          chatbots: 10,
          messages: 50000
        },
        discounts: [
          {
            type: 'percentage',
            value: 20,
            conditions: { billingCycle: 'yearly' }
          }
        ],
        isActive: true
      },
      {
        name: 'Enterprise',
        description: 'For large organizations',
        pricingModel: PricingModel.DYNAMIC,
        billingCycle: BillingCycle.MONTHLY,
        basePrice: 199,
        currency: 'USD',
        features: [
          { name: 'Everything in Pro', description: 'All Pro features included', included: true },
          { name: 'Unlimited API Calls', description: 'Unlimited API calls', included: true },
          { name: 'Unlimited Storage', description: 'Unlimited storage', included: true },
          { name: 'Dedicated Support', description: 'Dedicated support manager', included: true },
          { name: 'Custom Features', description: 'Custom feature development', included: true },
          { name: 'SLA Guarantee', description: '99.9% uptime SLA', included: true }
        ],
        usageLimits: {
          apiCalls: -1, // Unlimited
          storage: -1, // Unlimited
          users: -1, // Unlimited
          chatbots: -1, // Unlimited
          messages: -1 // Unlimited
        },
        discounts: [
          {
            type: 'percentage',
            value: 25,
            conditions: { billingCycle: 'yearly' }
          },
          {
            type: 'volume',
            value: 10,
            conditions: { users: 100 }
          }
        ],
        isActive: true
      }
    ];

    defaultPlans.forEach((plan, index) => {
      const planId = `plan-${index + 1}`;
      const now = new Date();
      
      this.pricingPlans.set(planId, {
        ...plan,
        id: planId,
        createdAt: now,
        updatedAt: now
      });
    });
  }

  private setupDefaultDynamicPricingRules(): void {
    const defaultRules: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'High Demand Pricing',
        description: 'Increase prices during high demand periods',
        conditions: {
          demandLevel: 'high',
          timeOfDay: '09:00-17:00'
        },
        pricingAdjustment: {
          type: 'percentage',
          value: 10,
          direction: 'increase'
        },
        isActive: true,
        priority: 1
      },
      {
        name: 'Volume Discount',
        description: 'Discount for high volume customers',
        conditions: {
          customerSegment: [CustomerSegment.ENTERPRISE, CustomerSegment.PREMIUM],
          usageThreshold: 10000
        },
        pricingAdjustment: {
          type: 'percentage',
          value: 15,
          direction: 'decrease'
        },
        isActive: true,
        priority: 2
      },
      {
        name: 'Seasonal Pricing',
        description: 'Adjust pricing based on seasonality',
        conditions: {
          seasonality: 'holiday'
        },
        pricingAdjustment: {
          type: 'percentage',
          value: 5,
          direction: 'increase'
        },
        isActive: true,
        priority: 3
      }
    ];

    defaultRules.forEach((rule, index) => {
      const ruleId = `rule-${index + 1}`;
      const now = new Date();
      
      this.dynamicPricingRules.set(ruleId, {
        ...rule,
        id: ruleId,
        createdAt: now,
        updatedAt: now
      });
    });
  }

  private setupDefaultCustomerLTV(): void {
    const defaultCustomers: Omit<CustomerLTV, 'updatedAt'>[] = [
      {
        customerId: 'customer-1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        currentValue: 348,
        predictedValue: 1250,
        churnRisk: 15,
        segment: CustomerSegment.PRO,
        metrics: {
          totalRevenue: 348,
          averageOrderValue: 29,
          purchaseFrequency: 12,
          customerAge: 365,
          lastPurchaseDate: new Date(Date.now() - 2592000000), // 30 days ago
          nextPurchasePrediction: new Date(Date.now() + 2592000000) // 30 days from now
        },
        factors: {
          usageIntensity: 85,
          featureAdoption: 75,
          supportInteractions: 2,
          satisfactionScore: 92,
          paymentHistory: 'excellent'
        },
        recommendations: [
          {
            type: 'upsell',
            title: 'Upgrade to Enterprise',
            description: 'Upgrade to Enterprise plan for unlimited features',
            expectedValue: 170,
            priority: 'high'
          },
          {
            type: 'cross_sell',
            title: 'Add Custom Integration',
            description: 'Add custom integration service',
            expectedValue: 50,
            priority: 'medium'
          }
        ]
      },
      {
        customerId: 'customer-2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        currentValue: 58,
        predictedValue: 200,
        churnRisk: 45,
        segment: CustomerSegment.BASIC,
        metrics: {
          totalRevenue: 58,
          averageOrderValue: 29,
          purchaseFrequency: 2,
          customerAge: 90,
          lastPurchaseDate: new Date(Date.now() - 5184000000), // 60 days ago
          nextPurchasePrediction: new Date(Date.now() + 7776000000) // 90 days from now
        },
        factors: {
          usageIntensity: 30,
          featureAdoption: 25,
          supportInteractions: 5,
          satisfactionScore: 65,
          paymentHistory: 'fair'
        },
        recommendations: [
          {
            type: 'retention',
            title: 'Engagement Campaign',
            description: 'Send personalized engagement campaign',
            expectedValue: 20,
            priority: 'high'
          },
          {
            type: 'upsell',
            title: 'Feature Training',
            description: 'Provide feature training session',
            expectedValue: 15,
            priority: 'medium'
          }
        ]
      }
    ];

    defaultCustomers.forEach(customer => {
      this.customerLTV.set(customer.customerId, {
        ...customer,
        updatedAt: new Date()
      });
    });
  }

  private setupDefaultChurnPredictions(): void {
    const defaultPredictions: Omit<ChurnPrediction, 'lastUpdated'>[] = [
      {
        customerId: 'customer-1',
        churnRisk: 15,
        churnProbability: 0.15,
        predictedChurnDate: new Date(Date.now() + 7776000000), // 90 days from now
        riskFactors: [
          {
            factor: 'Low Usage',
            weight: 0.3,
            value: 0.2,
            impact: 'negative'
          },
          {
            factor: 'High Satisfaction',
            weight: 0.4,
            value: 0.9,
            impact: 'positive'
          },
          {
            factor: 'Payment History',
            weight: 0.3,
            value: 0.95,
            impact: 'positive'
          }
        ],
        retentionScore: 85,
        recommendations: [
          {
            action: 'Engagement Campaign',
            description: 'Send personalized engagement emails',
            expectedImpact: 0.2,
            cost: 50,
            roi: 4.0
          },
          {
            action: 'Feature Training',
            description: 'Provide feature training session',
            expectedImpact: 0.15,
            cost: 100,
            roi: 2.5
          }
        ]
      },
      {
        customerId: 'customer-2',
        churnRisk: 45,
        churnProbability: 0.45,
        predictedChurnDate: new Date(Date.now() + 2592000000), // 30 days from now
        riskFactors: [
          {
            factor: 'Very Low Usage',
            weight: 0.4,
            value: 0.1,
            impact: 'negative'
          },
          {
            factor: 'Low Satisfaction',
            weight: 0.3,
            value: 0.3,
            impact: 'negative'
          },
          {
            factor: 'Payment Issues',
            weight: 0.3,
            value: 0.4,
            impact: 'negative'
          }
        ],
        retentionScore: 55,
        recommendations: [
          {
            action: 'Win-back Campaign',
            description: 'Aggressive win-back campaign with discounts',
            expectedImpact: 0.3,
            cost: 200,
            roi: 1.5
          },
          {
            action: 'Account Review',
            description: 'Conduct account review and optimization',
            expectedImpact: 0.25,
            cost: 150,
            roi: 2.0
          }
        ]
      }
    ];

    defaultPredictions.forEach(prediction => {
      this.churnPredictions.set(prediction.customerId, {
        ...prediction,
        lastUpdated: new Date()
      });
    });
  }

  private setupEventListeners(): void {
    // Listen for revenue events
    document.addEventListener('subscription-created', (event: any) => {
      this.handleSubscriptionCreated(event.detail);
    });

    document.addEventListener('usage-tracked', (event: any) => {
      this.handleUsageTracked(event.detail);
    });

    document.addEventListener('payment-processed', (event: any) => {
      this.handlePaymentProcessed(event.detail);
    });
  }

  private startRevenueMonitoring(): void {
    // Monitor revenue metrics
    setInterval(() => {
      this.updateRevenueMetrics();
    }, 3600000); // Every hour

    // Update churn predictions
    setInterval(() => {
      this.updateChurnPredictions();
    }, 86400000); // Every day
  }

  private handleSubscriptionCreated(subscriptionData: any): void {
    analyticsService.track('subscription_created', {
      customerId: subscriptionData.customerId,
      planId: subscriptionData.planId,
      amount: subscriptionData.amount
    });
  }

  private handleUsageTracked(usageData: any): void {
    analyticsService.track('usage_tracked', {
      customerId: usageData.customerId,
      usageType: usageData.type,
      amount: usageData.amount
    });
  }

  private handlePaymentProcessed(paymentData: any): void {
    analyticsService.track('payment_processed', {
      customerId: paymentData.customerId,
      amount: paymentData.amount,
      status: paymentData.status
    });
  }

  private updateRevenueMetrics(): void {
    // Update revenue analytics
    const analytics = this.getRevenueAnalytics();
    
    // Track revenue metrics
    analyticsService.track('revenue_metrics_updated', {
      mrr: analytics.monthlyRecurringRevenue,
      arr: analytics.annualRecurringRevenue,
      churnRate: analytics.churnRate,
      growth: analytics.revenueGrowth
    });
  }

  private updateChurnPredictions(): void {
    this.churnPredictions.forEach((prediction, customerId) => {
      const customer = this.customerLTV.get(customerId);
      if (customer) {
        const newChurnRisk = this.calculateChurnRisk(customer);
        const newPrediction = this.calculateChurnPrediction(customer);
        
        this.churnPredictions.set(customerId, {
          ...prediction,
          churnRisk: newChurnRisk,
          churnProbability: newChurnRisk / 100,
          predictedChurnDate: newPrediction,
          lastUpdated: new Date()
        });
      }
    });
  }

  private calculateChurnRisk(customer: CustomerLTV): number {
    let risk = 50; // Base risk

    // Usage intensity impact
    if (customer.factors.usageIntensity < 30) risk += 25;
    else if (customer.factors.usageIntensity > 80) risk -= 20;

    // Feature adoption impact
    if (customer.factors.featureAdoption < 30) risk += 20;
    else if (customer.factors.featureAdoption > 80) risk -= 15;

    // Support interactions impact
    if (customer.factors.supportInteractions > 5) risk += 15;
    else if (customer.factors.supportInteractions === 0) risk -= 5;

    // Satisfaction score impact
    if (customer.factors.satisfactionScore < 50) risk += 30;
    else if (customer.factors.satisfactionScore > 90) risk -= 25;

    // Payment history impact
    if (customer.factors.paymentHistory === 'poor') risk += 20;
    else if (customer.factors.paymentHistory === 'excellent') risk -= 15;

    return Math.max(0, Math.min(100, risk));
  }

  private calculateChurnPrediction(customer: CustomerLTV): Date {
    const baseDays = 365; // Base prediction
    const riskMultiplier = customer.churnRisk / 50; // Normalize to 0-2 range
    
    const predictedDays = Math.floor(baseDays / riskMultiplier);
    return new Date(Date.now() + predictedDays * 24 * 60 * 60 * 1000);
  }

  // Public Methods

  public createPricingPlan(planData: Omit<PricingPlan, 'id' | 'createdAt' | 'updatedAt'>): PricingPlan {
    const planId = this.generateId();
    const now = new Date();
    
    const plan: PricingPlan = {
      ...planData,
      id: planId,
      createdAt: now,
      updatedAt: now
    };

    this.pricingPlans.set(planId, plan);
    return plan;
  }

  public getPricingPlan(planId: string): PricingPlan | null {
    return this.pricingPlans.get(planId) || null;
  }

  public getAllPricingPlans(): PricingPlan[] {
    return Array.from(this.pricingPlans.values())
      .filter(plan => plan.isActive)
      .sort((a, b) => a.basePrice - b.basePrice);
  }

  public updatePricingPlan(planId: string, updates: Partial<PricingPlan>): PricingPlan | null {
    const plan = this.pricingPlans.get(planId);
    if (!plan) return null;

    const updatedPlan: PricingPlan = {
      ...plan,
      ...updates,
      updatedAt: new Date()
    };

    this.pricingPlans.set(planId, updatedPlan);
    return updatedPlan;
  }

  public createDynamicPricingRule(ruleData: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'updatedAt'>): DynamicPricingRule {
    const ruleId = this.generateId();
    const now = new Date();
    
    const rule: DynamicPricingRule = {
      ...ruleData,
      id: ruleId,
      createdAt: now,
      updatedAt: now
    };

    this.dynamicPricingRules.set(ruleId, rule);
    return rule;
  }

  public getDynamicPricingRule(ruleId: string): DynamicPricingRule | null {
    return this.dynamicPricingRules.get(ruleId) || null;
  }

  public getAllDynamicPricingRules(): DynamicPricingRule[] {
    return Array.from(this.dynamicPricingRules.values())
      .filter(rule => rule.isActive)
      .sort((a, b) => a.priority - b.priority);
  }

  public calculateDynamicPrice(basePrice: number, customerSegment: CustomerSegment, usage: number, demandLevel: 'low' | 'medium' | 'high' = 'medium'): number {
    let finalPrice = basePrice;

    // Apply dynamic pricing rules
    const applicableRules = this.getAllDynamicPricingRules().filter(rule => {
      const conditions = rule.conditions;
      
      // Check customer segment
      if (conditions.customerSegment && !conditions.customerSegment.includes(customerSegment)) {
        return false;
      }
      
      // Check usage threshold
      if (conditions.usageThreshold && usage < conditions.usageThreshold) {
        return false;
      }
      
      // Check demand level
      if (conditions.demandLevel && conditions.demandLevel !== demandLevel) {
        return false;
      }
      
      return true;
    });

    // Apply rules in priority order
    applicableRules.forEach(rule => {
      if (rule.pricingAdjustment.type === 'percentage') {
        const adjustment = (finalPrice * rule.pricingAdjustment.value) / 100;
        if (rule.pricingAdjustment.direction === 'increase') {
          finalPrice += adjustment;
        } else {
          finalPrice -= adjustment;
        }
      } else {
        if (rule.pricingAdjustment.direction === 'increase') {
          finalPrice += rule.pricingAdjustment.value;
        } else {
          finalPrice -= rule.pricingAdjustment.value;
        }
      }
    });

    return Math.max(0, finalPrice);
  }

  public createUsageBilling(billingData: Omit<UsageBilling, 'charges' | 'status'>): UsageBilling {
    const billingId = this.generateId();
    const plan = this.pricingPlans.get(billingData.planId);
    
    if (!plan) {
      throw new Error('Pricing plan not found');
    }

    // Calculate charges
    const baseCharge = plan.basePrice;
    let overageCharges = 0;
    let discountAmount = 0;

    // Calculate overage charges
    if (plan.usageLimits.apiCalls && billingData.usage.apiCalls > plan.usageLimits.apiCalls) {
      const overage = billingData.usage.apiCalls - plan.usageLimits.apiCalls;
      const overageFeature = plan.features.find(f => f.name.includes('API Calls'));
      if (overageFeature?.overagePrice) {
        overageCharges += overage * overageFeature.overagePrice;
      }
    }

    if (plan.usageLimits.storage && billingData.usage.storage > plan.usageLimits.storage) {
      const overage = billingData.usage.storage - plan.usageLimits.storage;
      const overageFeature = plan.features.find(f => f.name.includes('Storage'));
      if (overageFeature?.overagePrice) {
        overageCharges += overage * overageFeature.overagePrice;
      }
    }

    // Apply discounts
    plan.discounts.forEach(discount => {
      if (discount.type === 'percentage') {
        discountAmount += (baseCharge + overageCharges) * (discount.value / 100);
      } else if (discount.type === 'fixed') {
        discountAmount += discount.value;
      }
    });

    const totalCharge = Math.max(0, baseCharge + overageCharges - discountAmount);

    const billing: UsageBilling = {
      ...billingData,
      charges: {
        baseCharge,
        overageCharges,
        discountAmount,
        totalCharge
      },
      status: 'pending'
    };

    this.usageBilling.set(billingId, billing);
    return billing;
  }

  public getUsageBilling(billingId: string): UsageBilling | null {
    return this.usageBilling.get(billingId) || null;
  }

  public getCustomerUsageBilling(customerId: string): UsageBilling[] {
    return Array.from(this.usageBilling.values())
      .filter(billing => billing.customerId === customerId)
      .sort((a, b) => b.billingPeriod.startDate.getTime() - a.billingPeriod.startDate.getTime());
  }

  public getCustomerLTV(customerId: string): CustomerLTV | null {
    return this.customerLTV.get(customerId) || null;
  }

  public getAllCustomerLTV(): CustomerLTV[] {
    return Array.from(this.customerLTV.values())
      .sort((a, b) => b.predictedValue - a.predictedValue);
  }

  public updateCustomerLTV(customerId: string, updates: Partial<CustomerLTV>): CustomerLTV | null {
    const customer = this.customerLTV.get(customerId);
    if (!customer) return null;

    const updatedCustomer: CustomerLTV = {
      ...customer,
      ...updates,
      updatedAt: new Date()
    };

    this.customerLTV.set(customerId, updatedCustomer);
    return updatedCustomer;
  }

  public getChurnPrediction(customerId: string): ChurnPrediction | null {
    return this.churnPredictions.get(customerId) || null;
  }

  public getAllChurnPredictions(): ChurnPrediction[] {
    return Array.from(this.churnPredictions.values())
      .sort((a, b) => b.churnRisk - a.churnRisk);
  }

  public getHighRiskCustomers(threshold: number = 30): ChurnPrediction[] {
    return this.getAllChurnPredictions()
      .filter(prediction => prediction.churnRisk >= threshold);
  }

  public getRevenueAnalytics(): RevenueAnalytics {
    const customers = Array.from(this.customerLTV.values());

    
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.currentValue, 0);
    const monthlyRecurringRevenue = totalRevenue / 12; // Simplified calculation
    const annualRecurringRevenue = monthlyRecurringRevenue * 12;
    const averageRevenuePerUser = customers.length > 0 ? totalRevenue / customers.length : 0;
    
    const churnedCustomers = this.getAllChurnPredictions()
      .filter(prediction => prediction.churnRisk > 50).length;
    const churnRate = customers.length > 0 ? (churnedCustomers / customers.length) * 100 : 0;
    
    const expansionRevenue = customers
      .filter(customer => customer.segment === CustomerSegment.PRO || customer.segment === CustomerSegment.ENTERPRISE)
      .reduce((sum, customer) => sum + customer.predictedValue - customer.currentValue, 0);
    
    const contractionRevenue = customers
      .filter(customer => customer.churnRisk > 70)
      .reduce((sum, customer) => sum + customer.currentValue, 0);
    
    const netRevenueRetention = ((totalRevenue + expansionRevenue - contractionRevenue) / totalRevenue) * 100;
    const grossRevenueRetention = ((totalRevenue - contractionRevenue) / totalRevenue) * 100;
    
    const revenueGrowth = ((annualRecurringRevenue - (totalRevenue * 0.8)) / (totalRevenue * 0.8)) * 100;

    return {
      totalRevenue,
      monthlyRecurringRevenue,
      annualRecurringRevenue,
      averageRevenuePerUser,
      customerAcquisitionCost: 150, // Estimated
      customerLifetimeValue: customers.length > 0 ? customers.reduce((sum, c) => sum + c.predictedValue, 0) / customers.length : 0,
      churnRate,
      expansionRevenue,
      contractionRevenue,
      netRevenueRetention,
      grossRevenueRetention,
      revenueGrowth,
      metrics: {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.factors.usageIntensity > 30).length,
        newCustomers: Math.floor(customers.length * 0.1), // Estimated
        churnedCustomers,
        upgradedCustomers: customers.filter(c => c.segment === CustomerSegment.PRO || c.segment === CustomerSegment.ENTERPRISE).length,
        downgradedCustomers: Math.floor(customers.length * 0.05) // Estimated
      },
      trends: {
        revenue: [
          { date: '2024-01', value: totalRevenue * 0.8 },
          { date: '2024-02', value: totalRevenue * 0.9 },
          { date: '2024-03', value: totalRevenue }
        ],
        customers: [
          { date: '2024-01', value: Math.floor(customers.length * 0.8) },
          { date: '2024-02', value: Math.floor(customers.length * 0.9) },
          { date: '2024-03', value: customers.length }
        ],
        churn: [
          { date: '2024-01', value: churnRate * 1.2 },
          { date: '2024-02', value: churnRate * 1.1 },
          { date: '2024-03', value: churnRate }
        ]
      }
    };
  }

  public getRevenueOptimizationRecommendations(): Array<{
    type: 'pricing' | 'retention' | 'expansion' | 'acquisition';
    title: string;
    description: string;
    expectedImpact: number;
    implementationCost: number;
    roi: number;
    priority: 'high' | 'medium' | 'low';
  }> {
    const analytics = this.getRevenueAnalytics();
    const recommendations = [];

    // Pricing recommendations
    if (analytics.churnRate > 10) {
      recommendations.push({
        type: 'pricing' as const,
        title: 'Implement Dynamic Pricing',
        description: 'Implement dynamic pricing to optimize revenue based on demand and customer segments',
        expectedImpact: 15,
        implementationCost: 5000,
        roi: 3.0,
        priority: 'high'
      });
    }

    // Retention recommendations
    if (analytics.churnRate > 5) {
      recommendations.push({
        type: 'retention',
        title: 'Churn Prevention Campaign',
        description: 'Launch targeted campaigns to prevent high-risk customers from churning',
        expectedImpact: 8,
        implementationCost: 2000,
        roi: 4.0,
        priority: 'high'
      });
    }

    // Expansion recommendations
    if (analytics.expansionRevenue < analytics.totalRevenue * 0.1) {
      recommendations.push({
        type: 'expansion' as const,
        title: 'Upsell Campaign',
        description: 'Launch upsell campaigns to increase revenue from existing customers',
        expectedImpact: 12,
        implementationCost: 3000,
        roi: 4.0,
        priority: 'medium'
      });
    }

    return recommendations.sort((a, b) => b.roi - a.roi) as any;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export const revenueOptimizationService = new RevenueOptimizationService();
export default revenueOptimizationService; 