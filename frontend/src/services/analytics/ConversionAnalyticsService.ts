import { analyticsService, AnalyticsEventType } from './AnalyticsService';

// Conversion Types
export enum ConversionType {
  SIGNUP = 'signup',
  LOGIN = 'login',
  SUBSCRIPTION = 'subscription',
  PAYMENT = 'payment',
  CHATBOT_CREATION = 'chatbot_creation',
  CHATBOT_DEPLOYMENT = 'chatbot_deployment',
  FEATURE_USAGE = 'feature_usage',
  DOWNLOAD = 'download',
  SHARE = 'share',
  CONTACT = 'contact',
  DEMO_REQUEST = 'demo_request',
  TRIAL_START = 'trial_start',
  TRIAL_CONVERSION = 'trial_conversion'
}

// Funnel Step
export interface FunnelStep {
  id: string;
  name: string;
  description: string;
  url?: string;
  eventType: string;
  order: number;
  required: boolean;
  properties?: Record<string, any>;
}

// Funnel Definition
export interface FunnelDefinition {
  id: string;
  name: string;
  description: string;
  steps: FunnelStep[];
  goal: ConversionType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Funnel Result
export interface FunnelResult {
  funnelId: string;
  funnelName: string;
  period: {
    start: Date;
    end: Date;
  };
  steps: {
    stepId: string;
    stepName: string;
    count: number;
    conversionRate: number;
    dropoffRate: number;
    averageTime: number;
    revenue?: number;
  }[];
  totalConversions: number;
  overallConversionRate: number;
  totalRevenue?: number;
  averageOrderValue?: number;
}

// Conversion Event
export interface ConversionEvent {
  id: string;
  type: ConversionType;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  value?: number;
  currency?: string;
  properties: Record<string, any>;
  funnelId?: string;
  stepId?: string;
}

// Cohort Analysis
export interface CohortData {
  cohortDate: Date;
  cohortSize: number;
  retention: {
    day1: number;
    day7: number;
    day30: number;
    day90: number;
  };
  revenue: {
    day1: number;
    day7: number;
    day30: number;
    day90: number;
  };
}

// Conversion Analytics Service
export class ConversionAnalyticsService {
  private funnels: Map<string, FunnelDefinition> = new Map();
  private conversionEvents: ConversionEvent[] = [];
  private isTracking = false;

  constructor() {
    this.initialize();
  }

  // Initialize conversion analytics
  private initialize(): void {
    this.setupDefaultFunnels();
    this.startTracking();
  }

  // Setup default funnels
  private setupDefaultFunnels(): void {
    // Signup Funnel
         this.createFunnel({
       id: 'signup-funnel',
       name: 'User Signup Funnel',
       description: 'Track user signup conversion from landing page to account creation',
       active: true,
       steps: [
        {
          id: 'landing-page',
          name: 'Landing Page Visit',
          description: 'User visits landing page',
          url: '/',
          eventType: AnalyticsEventType.PAGE_VIEWED,
          order: 1,
          required: true
        },
        {
          id: 'signup-form',
          name: 'Signup Form View',
          description: 'User views signup form',
          url: '/signup',
          eventType: AnalyticsEventType.PAGE_VIEWED,
          order: 2,
          required: true
        },
        {
          id: 'form-fill',
          name: 'Form Filled',
          description: 'User fills signup form',
          eventType: AnalyticsEventType.FEATURE_USED,
          order: 3,
          required: true,
          properties: { feature: 'signup_form' }
        },
        {
          id: 'account-created',
          name: 'Account Created',
          description: 'User successfully creates account',
          eventType: AnalyticsEventType.USER_REGISTERED,
          order: 4,
          required: true
        }
      ],
      goal: ConversionType.SIGNUP
    });

    // Subscription Funnel
         this.createFunnel({
       id: 'subscription-funnel',
       name: 'Subscription Conversion Funnel',
       description: 'Track subscription conversion from free user to paid subscriber',
       active: true,
       steps: [
        {
          id: 'dashboard-visit',
          name: 'Dashboard Visit',
          description: 'User visits dashboard',
          url: '/dashboard',
          eventType: AnalyticsEventType.PAGE_VIEWED,
          order: 1,
          required: true
        },
        {
          id: 'feature-usage',
          name: 'Feature Usage',
          description: 'User uses premium features',
          eventType: AnalyticsEventType.FEATURE_USED,
          order: 2,
          required: true
        },
        {
          id: 'upgrade-page',
          name: 'Upgrade Page Visit',
          description: 'User visits upgrade page',
          url: '/pricing',
          eventType: AnalyticsEventType.PAGE_VIEWED,
          order: 3,
          required: true
        },
        {
          id: 'payment-initiated',
          name: 'Payment Initiated',
          description: 'User starts payment process',
          eventType: AnalyticsEventType.PAYMENT_INITIATED,
          order: 4,
          required: true
        },
        {
          id: 'subscription-completed',
          name: 'Subscription Completed',
          description: 'User completes subscription',
          eventType: AnalyticsEventType.SUBSCRIPTION_STARTED,
          order: 5,
          required: true
        }
      ],
      goal: ConversionType.SUBSCRIPTION
    });

    // Chatbot Creation Funnel
         this.createFunnel({
       id: 'chatbot-creation-funnel',
       name: 'Chatbot Creation Funnel',
       description: 'Track chatbot creation from idea to deployment',
       active: true,
       steps: [
        {
          id: 'chatbot-page',
          name: 'Chatbot Page Visit',
          description: 'User visits chatbot creation page',
          url: '/chatbots',
          eventType: AnalyticsEventType.PAGE_VIEWED,
          order: 1,
          required: true
        },
        {
          id: 'create-button',
          name: 'Create Button Click',
          description: 'User clicks create chatbot button',
          eventType: AnalyticsEventType.FEATURE_USED,
          order: 2,
          required: true,
          properties: { feature: 'create_chatbot_button' }
        },
        {
          id: 'chatbot-configured',
          name: 'Chatbot Configured',
          description: 'User configures chatbot settings',
          eventType: AnalyticsEventType.CHATBOT_UPDATED,
          order: 3,
          required: true
        },
        {
          id: 'chatbot-trained',
          name: 'Chatbot Trained',
          description: 'User trains chatbot with data',
          eventType: AnalyticsEventType.CHATBOT_TRAINED,
          order: 4,
          required: true
        },
        {
          id: 'chatbot-deployed',
          name: 'Chatbot Deployed',
          description: 'User deploys chatbot',
          eventType: AnalyticsEventType.CHATBOT_DEPLOYED,
          order: 5,
          required: true
        }
      ],
      goal: ConversionType.CHATBOT_DEPLOYMENT
    });
  }

  // Create new funnel
  public createFunnel(funnel: Omit<FunnelDefinition, 'createdAt' | 'updatedAt'>): void {
    const now = new Date();
    const funnelDefinition: FunnelDefinition = {
      ...funnel,
      createdAt: now,
      updatedAt: now
    };

    this.funnels.set(funnel.id, funnelDefinition);
    
    console.log('Funnel created:', funnel.name);
  }

  // Update funnel
  public updateFunnel(funnelId: string, updates: Partial<FunnelDefinition>): void {
    const funnel = this.funnels.get(funnelId);
    if (!funnel) {
      console.error('Funnel not found:', funnelId);
      return;
    }

    const updatedFunnel: FunnelDefinition = {
      ...funnel,
      ...updates,
      updatedAt: new Date()
    };

    this.funnels.set(funnelId, updatedFunnel);
    
    console.log('Funnel updated:', funnel.name);
  }

  // Delete funnel
  public deleteFunnel(funnelId: string): void {
    const funnel = this.funnels.get(funnelId);
    if (!funnel) {
      console.error('Funnel not found:', funnelId);
      return;
    }

    this.funnels.delete(funnelId);
    
    console.log('Funnel deleted:', funnel.name);
  }

  // Get funnel
  public getFunnel(funnelId: string): FunnelDefinition | undefined {
    return this.funnels.get(funnelId);
  }

  // Get all funnels
  public getAllFunnels(): FunnelDefinition[] {
    return Array.from(this.funnels.values());
  }

  // Start conversion tracking
  public startTracking(): void {
    if (this.isTracking) return;

    this.isTracking = true;
    this.setupEventListeners();
    
    console.log('Conversion analytics tracking started');
  }

  // Stop conversion tracking
  public stopTracking(): void {
    if (!this.isTracking) return;

    this.isTracking = false;
    
    console.log('Conversion analytics tracking stopped');
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Listen to analytics events
    analyticsService.on('event', (event: any) => {
      this.processAnalyticsEvent(event);
    });
  }

  // Process analytics event
  private processAnalyticsEvent(event: any): void {
    if (!this.isTracking) return;

    // Check if event matches any funnel steps
    for (const funnel of this.funnels.values()) {
      if (!funnel.active) continue;

      for (const step of funnel.steps) {
        if (this.matchesFunnelStep(event, step)) {
          this.trackFunnelStep(funnel.id, step.id, event);
          break;
        }
      }
    }

    // Check if event is a conversion
    if (this.isConversionEvent(event)) {
      this.trackConversion(event);
    }
  }

  // Check if event matches funnel step
  private matchesFunnelStep(event: any, step: FunnelStep): boolean {
    // Check event type
    if (event.type !== step.eventType) return false;

    // Check URL if specified
    if (step.url && event.context?.url) {
      if (!event.context.url.includes(step.url)) return false;
    }

    // Check properties if specified
    if (step.properties) {
      for (const [key, value] of Object.entries(step.properties)) {
        if (event.properties?.[key] !== value) return false;
      }
    }

    return true;
  }

  // Track funnel step
  private trackFunnelStep(funnelId: string, stepId: string, event: any): void {
    const funnel = this.funnels.get(funnelId);
    if (!funnel) return;

    const step = funnel.steps.find(s => s.id === stepId);
    if (!step) return;

    analyticsService.track('funnel_step_completed', {
      funnelId,
      funnelName: funnel.name,
      stepId,
      stepName: step.name,
      stepOrder: step.order,
      userId: event.userId,
      sessionId: event.sessionId,
      timestamp: event.timestamp
    });

    console.log(`Funnel step completed: ${funnel.name} - ${step.name}`);
  }

  // Check if event is a conversion
  private isConversionEvent(event: any): boolean {
    const conversionEventTypes = [
      AnalyticsEventType.USER_REGISTERED,
      AnalyticsEventType.SUBSCRIPTION_STARTED,
      AnalyticsEventType.PAYMENT_COMPLETED,
      AnalyticsEventType.CHATBOT_DEPLOYED,
      AnalyticsEventType.CONVERSION_COMPLETED
    ];

    return conversionEventTypes.includes(event.type);
  }

  // Track conversion
  private trackConversion(event: any): void {
    const conversionEvent: ConversionEvent = {
      id: this.generateId(),
      type: this.mapEventTypeToConversionType(event.type),
      userId: event.userId,
      sessionId: event.sessionId,
      timestamp: event.timestamp,
      value: event.properties?.value,
      currency: event.properties?.currency,
      properties: event.properties || {}
    };

    this.conversionEvents.push(conversionEvent);

    analyticsService.track('conversion_tracked', {
      conversionId: conversionEvent.id,
      conversionType: conversionEvent.type,
      value: conversionEvent.value,
      currency: conversionEvent.currency
    });

    console.log('Conversion tracked:', conversionEvent);
  }

  // Map event type to conversion type
  private mapEventTypeToConversionType(eventType: string): ConversionType {
    const mapping: Record<string, ConversionType> = {
      [AnalyticsEventType.USER_REGISTERED]: ConversionType.SIGNUP,
      [AnalyticsEventType.SUBSCRIPTION_STARTED]: ConversionType.SUBSCRIPTION,
      [AnalyticsEventType.PAYMENT_COMPLETED]: ConversionType.PAYMENT,
      [AnalyticsEventType.CHATBOT_DEPLOYED]: ConversionType.CHATBOT_DEPLOYMENT,
      [AnalyticsEventType.CONVERSION_COMPLETED]: ConversionType.FEATURE_USAGE
    };

    return mapping[eventType] || ConversionType.FEATURE_USAGE;
  }

  // Track custom conversion
  public trackCustomConversion(
    type: ConversionType,
    value?: number,
    currency?: string,
    properties: Record<string, any> = {}
  ): void {
    const session = analyticsService.getSession();
    
    const conversionEvent: ConversionEvent = {
      id: this.generateId(),
      type,
      userId: session?.userId,
      sessionId: session?.id,
      timestamp: new Date(),
      value,
      currency,
      properties
    };

    this.conversionEvents.push(conversionEvent);

    analyticsService.track(AnalyticsEventType.CONVERSION_COMPLETED, {
      conversionType: type,
      value,
      currency,
      ...properties
    });

    console.log('Custom conversion tracked:', conversionEvent);
  }

  // Calculate funnel results
  public calculateFunnelResults(
    funnelId: string,
    startDate: Date,
    endDate: Date
  ): FunnelResult | null {
    const funnel = this.funnels.get(funnelId);
    if (!funnel) return null;

    // Filter events for the period
    const periodEvents = this.conversionEvents.filter(event => 
      event.timestamp >= startDate && event.timestamp <= endDate
    );

    // Calculate step metrics
    const steps = funnel.steps.map((step, index) => {
      const stepEvents = periodEvents.filter(event => 
        event.properties?.stepId === step.id || 
        event.properties?.funnelId === funnelId
      );

      const count = stepEvents.length;
      const previousStep = index > 0 ? funnel.steps[index - 1] : null;
      const previousCount = previousStep 
        ? periodEvents.filter(event => 
            event.properties?.stepId === previousStep.id || 
            event.properties?.funnelId === funnelId
          ).length 
        : count;

      const conversionRate = previousCount > 0 ? (count / previousCount) * 100 : 0;
      const dropoffRate = previousCount > 0 ? ((previousCount - count) / previousCount) * 100 : 0;

      return {
        stepId: step.id,
        stepName: step.name,
        count,
        conversionRate,
        dropoffRate,
        averageTime: 0, // Would need to calculate from actual data
        revenue: stepEvents.reduce((sum, event) => sum + (event.value || 0), 0)
      };
    });

    const totalConversions = steps[steps.length - 1]?.count || 0;
    const overallConversionRate = steps[0]?.count > 0 
      ? (totalConversions / steps[0].count) * 100 
      : 0;
    const totalRevenue = steps.reduce((sum, step) => sum + (step.revenue || 0), 0);
    const averageOrderValue = totalConversions > 0 ? totalRevenue / totalConversions : 0;

    return {
      funnelId,
      funnelName: funnel.name,
      period: { start: startDate, end: endDate },
      steps,
      totalConversions,
      overallConversionRate,
      totalRevenue,
      averageOrderValue
    };
  }

  // Calculate cohort analysis
  public calculateCohortAnalysis(
    startDate: Date,
    endDate: Date,
    cohortType: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): CohortData[] {
    // This would need to be implemented with actual user data
    // For now, return mock data
    const cohorts: CohortData[] = [];
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      cohorts.push({
        cohortDate: new Date(currentDate),
        cohortSize: Math.floor(Math.random() * 100) + 10,
        retention: {
          day1: Math.random() * 100,
          day7: Math.random() * 80,
          day30: Math.random() * 50,
          day90: Math.random() * 30
        },
        revenue: {
          day1: Math.random() * 1000,
          day7: Math.random() * 5000,
          day30: Math.random() * 15000,
          day90: Math.random() * 30000
        }
      });

      // Increment date based on cohort type
      switch (cohortType) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    return cohorts;
  }

  // Get conversion events
  public getConversionEvents(
    type?: ConversionType,
    startDate?: Date,
    endDate?: Date
  ): ConversionEvent[] {
    let events = [...this.conversionEvents];

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

  // Get conversion metrics
  public getConversionMetrics(
    startDate: Date,
    endDate: Date
  ): {
    totalConversions: number;
    conversionRate: number;
    totalRevenue: number;
    averageOrderValue: number;
    topConversionTypes: Array<{ type: ConversionType; count: number; revenue: number }>;
  } {
    const events = this.getConversionEvents(undefined, startDate, endDate);
    
    const totalConversions = events.length;
    const totalRevenue = events.reduce((sum, event) => sum + (event.value || 0), 0);
    const averageOrderValue = totalConversions > 0 ? totalRevenue / totalConversions : 0;

    // Group by conversion type
    const typeGroups = events.reduce((groups, event) => {
      if (!groups[event.type]) {
        groups[event.type] = { count: 0, revenue: 0 };
      }
      groups[event.type].count++;
      groups[event.type].revenue += event.value || 0;
      return groups;
    }, {} as Record<ConversionType, { count: number; revenue: number }>);

    const topConversionTypes = Object.entries(typeGroups)
      .map(([type, data]) => ({
        type: type as ConversionType,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate conversion rate (would need total visitors data)
    const conversionRate = 0; // Placeholder

    return {
      totalConversions,
      conversionRate,
      totalRevenue,
      averageOrderValue,
      topConversionTypes
    };
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const conversionAnalyticsService = new ConversionAnalyticsService();

// Export default instance
export default conversionAnalyticsService; 