import { analyticsService, AnalyticsEventType } from './AnalyticsService';

// Revenue Types
export enum RevenueType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME_PAYMENT = 'one_time_payment',
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
  REFUND = 'refund',
  CHARGEBACK = 'chargeback',
  COMMISSION = 'commission',
  AFFILIATE = 'affiliate',
  PARTNERSHIP = 'partnership',
  LICENSING = 'licensing'
}

// Subscription Plan
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'quarterly';
  features: string[];
  maxUsers?: number;
  maxChatbots?: number;
  maxMessages?: number;
}

// Revenue Event
export interface RevenueEvent {
  id: string;
  type: RevenueType;
  userId: string;
  amount: number;
  currency: string;
  planId?: string;
  planName?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  metadata: Record<string, any>;
}

// Customer Metrics
export interface CustomerMetrics {
  userId: string;
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  firstPurchaseDate: Date;
  lastPurchaseDate: Date;
  subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPlan?: string;
  lifetimeValue: number;
  churnRisk: 'low' | 'medium' | 'high';
  engagementScore: number;
}

// Revenue Analytics Service
export class RevenueAnalyticsService {
  private revenueEvents: RevenueEvent[] = [];
  private subscriptionPlans: Map<string, SubscriptionPlan> = new Map();
  private customerMetrics: Map<string, CustomerMetrics> = new Map();

  constructor() {
    this.initialize();
  }

  // Initialize revenue analytics
  private initialize(): void {
    this.setupDefaultPlans();
    this.setupEventListeners();
  }

  // Setup default subscription plans
  private setupDefaultPlans(): void {
    const plans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'Free Plan',
        price: 0,
        currency: 'USD',
        interval: 'monthly',
        features: ['1 Chatbot', '100 Messages/month', 'Basic Support'],
        maxUsers: 1,
        maxChatbots: 1,
        maxMessages: 100
      },
      {
        id: 'starter',
        name: 'Starter Plan',
        price: 29,
        currency: 'USD',
        interval: 'monthly',
        features: ['5 Chatbots', '1000 Messages/month', 'Email Support', 'Custom Branding'],
        maxUsers: 5,
        maxChatbots: 5,
        maxMessages: 1000
      },
      {
        id: 'professional',
        name: 'Professional Plan',
        price: 99,
        currency: 'USD',
        interval: 'monthly',
        features: ['25 Chatbots', '10000 Messages/month', 'Priority Support', 'Advanced Analytics', 'API Access'],
        maxUsers: 25,
        maxChatbots: 25,
        maxMessages: 10000
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 299,
        currency: 'USD',
        interval: 'monthly',
        features: ['Unlimited Chatbots', 'Unlimited Messages', 'Dedicated Support', 'Custom Integration', 'SLA'],
        maxUsers: -1,
        maxChatbots: -1,
        maxMessages: -1
      }
    ];

    plans.forEach(plan => {
      this.subscriptionPlans.set(plan.id, plan);
    });
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Listen to payment events from analytics service
    analyticsService.on('event', (event: any) => {
      if (event.type === AnalyticsEventType.PAYMENT_COMPLETED) {
        this.trackRevenueEvent(event);
      }
    });
  }

  // Track revenue event
  private trackRevenueEvent(event: any): void {
    const revenueEvent: RevenueEvent = {
      id: this.generateId(),
      type: this.mapEventTypeToRevenueType(event.type),
      userId: event.userId,
      amount: event.properties?.amount || 0,
      currency: event.properties?.currency || 'USD',
      planId: event.properties?.planId,
      planName: event.properties?.planName,
      timestamp: event.timestamp,
      status: 'completed',
      paymentMethod: event.properties?.paymentMethod,
      transactionId: event.properties?.transactionId,
      metadata: event.properties || {}
    };

    this.revenueEvents.push(revenueEvent);
    this.updateCustomerMetrics(revenueEvent);

    console.log('Revenue event tracked:', revenueEvent);
  }

  // Map event type to revenue type
  private mapEventTypeToRevenueType(eventType: string): RevenueType {
    const mapping: Record<string, RevenueType> = {
      [AnalyticsEventType.PAYMENT_COMPLETED]: RevenueType.SUBSCRIPTION,
      [AnalyticsEventType.SUBSCRIPTION_STARTED]: RevenueType.SUBSCRIPTION,
      [AnalyticsEventType.SUBSCRIPTION_CANCELLED]: RevenueType.DOWNGRADE
    };

    return mapping[eventType] || RevenueType.ONE_TIME_PAYMENT;
  }

  // Update customer metrics
  private updateCustomerMetrics(revenueEvent: RevenueEvent): void {
    const existingMetrics = this.customerMetrics.get(revenueEvent.userId);
    
    if (existingMetrics) {
      // Update existing customer metrics
      existingMetrics.totalRevenue += revenueEvent.amount;
      existingMetrics.totalOrders += 1;
      existingMetrics.lastPurchaseDate = revenueEvent.timestamp;
      existingMetrics.averageOrderValue = existingMetrics.totalRevenue / existingMetrics.totalOrders;
      existingMetrics.lifetimeValue = this.calculateLTV(revenueEvent.userId);
      existingMetrics.churnRisk = this.calculateChurnRisk(revenueEvent.userId);
      existingMetrics.engagementScore = this.calculateEngagementScore(revenueEvent.userId);
    } else {
      // Create new customer metrics
      const newMetrics: CustomerMetrics = {
        userId: revenueEvent.userId,
        totalRevenue: revenueEvent.amount,
        averageOrderValue: revenueEvent.amount,
        totalOrders: 1,
        firstPurchaseDate: revenueEvent.timestamp,
        lastPurchaseDate: revenueEvent.timestamp,
        subscriptionStatus: 'active',
        currentPlan: revenueEvent.planId,
        lifetimeValue: revenueEvent.amount,
        churnRisk: 'low',
        engagementScore: 0
      };

      this.customerMetrics.set(revenueEvent.userId, newMetrics);
    }
  }

  // Calculate Customer Lifetime Value
  private calculateLTV(userId: string): number {
    const customerEvents = this.revenueEvents.filter(event => event.userId === userId);
    const totalRevenue = customerEvents.reduce((sum, event) => sum + event.amount, 0);
    
    // Simple LTV calculation (could be enhanced with predictive models)
    const averageOrderValue = totalRevenue / customerEvents.length;
    const purchaseFrequency = this.calculatePurchaseFrequency(userId);
    const customerLifespan = this.calculateCustomerLifespan(userId);
    
    return averageOrderValue * purchaseFrequency * customerLifespan;
  }

  // Calculate purchase frequency
  private calculatePurchaseFrequency(userId: string): number {
    const customerEvents = this.revenueEvents.filter(event => event.userId === userId);
    if (customerEvents.length < 2) return 1;

    const firstPurchase = new Date(Math.min(...customerEvents.map(e => e.timestamp.getTime())));
    const lastPurchase = new Date(Math.max(...customerEvents.map(e => e.timestamp.getTime())));
    const daysBetween = (lastPurchase.getTime() - firstPurchase.getTime()) / (1000 * 60 * 60 * 24);
    
    return customerEvents.length / Math.max(daysBetween / 365, 1); // Purchases per year
  }

  // Calculate customer lifespan
  private calculateCustomerLifespan(userId: string): number {
    const customerEvents = this.revenueEvents.filter(event => event.userId === userId);
    if (customerEvents.length === 0) return 1;

    const firstPurchase = new Date(Math.min(...customerEvents.map(e => e.timestamp.getTime())));
    const lastPurchase = new Date(Math.max(...customerEvents.map(e => e.timestamp.getTime())));
    const daysBetween = (lastPurchase.getTime() - firstPurchase.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.max(daysBetween / 365, 1); // Years
  }

  // Calculate churn risk
  private calculateChurnRisk(userId: string): 'low' | 'medium' | 'high' {
    const customerEvents = this.revenueEvents.filter(event => event.userId === userId);
    if (customerEvents.length === 0) return 'high';

    const lastPurchase = new Date(Math.max(...customerEvents.map(e => e.timestamp.getTime())));
    const daysSinceLastPurchase = (Date.now() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastPurchase > 90) return 'high';
    if (daysSinceLastPurchase > 30) return 'medium';
    return 'low';
  }

  // Calculate engagement score
  private calculateEngagementScore(userId: string): number {
    // This would integrate with user behavior data
    // For now, return a score based on purchase frequency

    const purchaseFrequency = this.calculatePurchaseFrequency(userId);
    
    return Math.min(purchaseFrequency * 10, 100); // Score out of 100
  }

  // Track custom revenue event
  public trackRevenue(
    type: RevenueType,
    userId: string,
    amount: number,
    currency: string = 'USD',
    planId?: string,
    metadata: Record<string, any> = {}
  ): void {
    const plan = planId ? this.subscriptionPlans.get(planId) : undefined;
    
    const revenueEvent: RevenueEvent = {
      id: this.generateId(),
      type,
      userId,
      amount,
      currency,
      planId,
      planName: plan?.name,
      timestamp: new Date(),
      status: 'completed',
      metadata
    };

    this.revenueEvents.push(revenueEvent);
    this.updateCustomerMetrics(revenueEvent);

    // Track with analytics service
    analyticsService.track(AnalyticsEventType.PAYMENT_COMPLETED, {
      amount,
      currency,
      planId,
      planName: plan?.name,
      revenueType: type,
      ...metadata
    });

    console.log('Custom revenue event tracked:', revenueEvent);
  }

  // Get revenue metrics
  public getRevenueMetrics(
    startDate?: Date,
    endDate?: Date
  ): {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;
    averageOrderValue: number;
    totalOrders: number;
    revenueGrowth: number;
    topPlans: Array<{ planId: string; planName: string; revenue: number; subscribers: number }>;
    revenueByType: Record<RevenueType, number>;
  } {
    let events = [...this.revenueEvents];

    if (startDate) {
      events = events.filter(event => event.timestamp >= startDate);
    }

    if (endDate) {
      events = events.filter(event => event.timestamp <= endDate);
    }

    const totalRevenue = events.reduce((sum, event) => sum + event.amount, 0);
    const totalOrders = events.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate MRR and ARR
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const monthlyEvents = events.filter(event => event.timestamp >= oneMonthAgo);
    const monthlyRecurringRevenue = monthlyEvents.reduce((sum, event) => sum + event.amount, 0);
    const annualRecurringRevenue = monthlyRecurringRevenue * 12;

    // Calculate revenue growth (simplified)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
    const previousMonthEvents = events.filter(event => 
      event.timestamp >= twoMonthsAgo && event.timestamp < oneMonthAgo
    );
    const previousMonthRevenue = previousMonthEvents.reduce((sum, event) => sum + event.amount, 0);
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((monthlyRecurringRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;

    // Top plans by revenue
    const planRevenue = new Map<string, { revenue: number; subscribers: number }>();
    events.forEach(event => {
      if (event.planId) {
        const current = planRevenue.get(event.planId) || { revenue: 0, subscribers: 0 };
        current.revenue += event.amount;
        current.subscribers += 1;
        planRevenue.set(event.planId, current);
      }
    });

    const topPlans = Array.from(planRevenue.entries())
      .map(([planId, data]) => ({
        planId,
        planName: this.subscriptionPlans.get(planId)?.name || 'Unknown',
        revenue: data.revenue,
        subscribers: data.subscribers
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Revenue by type
    const revenueByType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + event.amount;
      return acc;
    }, {} as Record<RevenueType, number>);

    return {
      totalRevenue,
      monthlyRecurringRevenue,
      annualRecurringRevenue,
      averageOrderValue,
      totalOrders,
      revenueGrowth,
      topPlans,
      revenueByType
    };
  }

  // Get customer metrics
  public getCustomerMetrics(userId?: string): CustomerMetrics[] | CustomerMetrics | null {
    if (userId) {
      return this.customerMetrics.get(userId) || null;
    }
    return Array.from(this.customerMetrics.values());
  }

  // Get churn analysis
  public getChurnAnalysis(
    startDate: Date,
    endDate: Date
  ): {
    churnRate: number;
    churnedCustomers: number;
    totalCustomers: number;
    churnByPlan: Record<string, number>;
    churnReasons: Record<string, number>;
  } {
    const periodEvents = this.revenueEvents.filter(event => 
      event.timestamp >= startDate && event.timestamp <= endDate
    );

    const churnedEvents = periodEvents.filter(event => 
      event.type === RevenueType.DOWNGRADE || event.type === RevenueType.REFUND
    );

    const uniqueCustomers = new Set(periodEvents.map(event => event.userId));
    const churnedCustomers = new Set(churnedEvents.map(event => event.userId));

    const churnRate = uniqueCustomers.size > 0 
      ? (churnedCustomers.size / uniqueCustomers.size) * 100 
      : 0;

    // Churn by plan
    const churnByPlan = churnedEvents.reduce((acc, event) => {
      if (event.planId) {
        acc[event.planId] = (acc[event.planId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Mock churn reasons (in real implementation, this would come from feedback)
    const churnReasons = {
      'Too Expensive': 35,
      'Not Using Enough': 25,
      'Found Better Alternative': 20,
      'Poor Support': 15,
      'Technical Issues': 5
    };

    return {
      churnRate,
      churnedCustomers: churnedCustomers.size,
      totalCustomers: uniqueCustomers.size,
      churnByPlan,
      churnReasons
    };
  }

  // Get subscription analytics
  public getSubscriptionAnalytics(): {
    totalSubscribers: number;
    activeSubscriptions: number;
    trialConversions: number;
    subscriptionGrowth: number;
    averageSubscriptionValue: number;
    planDistribution: Record<string, number>;
  } {
    const subscriptionEvents = this.revenueEvents.filter(event => 
      event.type === RevenueType.SUBSCRIPTION
    );

    const uniqueSubscribers = new Set(subscriptionEvents.map(event => event.userId));
    const activeSubscriptions = Array.from(this.customerMetrics.values())
      .filter(customer => customer.subscriptionStatus === 'active').length;

    const trialConversions = subscriptionEvents.filter(event => 
      event.metadata?.isTrialConversion
    ).length;

    // Calculate subscription growth
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    const currentMonthSubscriptions = subscriptionEvents.filter(event => 
      event.timestamp >= oneMonthAgo
    ).length;

    const previousMonthSubscriptions = subscriptionEvents.filter(event => 
      event.timestamp >= twoMonthsAgo && event.timestamp < oneMonthAgo
    ).length;

    const subscriptionGrowth = previousMonthSubscriptions > 0 
      ? ((currentMonthSubscriptions - previousMonthSubscriptions) / previousMonthSubscriptions) * 100 
      : 0;

    const averageSubscriptionValue = subscriptionEvents.length > 0 
      ? subscriptionEvents.reduce((sum, event) => sum + event.amount, 0) / subscriptionEvents.length 
      : 0;

    // Plan distribution
    const planDistribution = subscriptionEvents.reduce((acc, event) => {
      if (event.planId) {
        acc[event.planId] = (acc[event.planId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSubscribers: uniqueSubscribers.size,
      activeSubscriptions,
      trialConversions,
      subscriptionGrowth,
      averageSubscriptionValue,
      planDistribution
    };
  }

  // Add subscription plan
  public addSubscriptionPlan(plan: SubscriptionPlan): void {
    this.subscriptionPlans.set(plan.id, plan);
  }

  // Get subscription plans
  public getSubscriptionPlans(): SubscriptionPlan[] {
    return Array.from(this.subscriptionPlans.values());
  }

  // Get revenue events
  public getRevenueEvents(
    type?: RevenueType,
    startDate?: Date,
    endDate?: Date
  ): RevenueEvent[] {
    let events = [...this.revenueEvents];

    if (type) {
      events = events.filter(event => event.type === type);
    }

    if (startDate) {
      events = events.filter(event => event.timestamp >= startDate);
    }

    if (endDate) {
      events = events.filter(event => event.timestamp <= endDate);
    }

    return events;
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const revenueAnalyticsService = new RevenueAnalyticsService();

// Export default instance
export default revenueAnalyticsService; 