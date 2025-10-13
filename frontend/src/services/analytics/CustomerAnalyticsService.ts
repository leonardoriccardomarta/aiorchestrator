import { analyticsService, AnalyticsEventType } from './AnalyticsService';
import { revenueAnalyticsService } from './RevenueAnalyticsService';

// Customer Segment Types
export enum CustomerSegment {
  NEW_CUSTOMER = 'new_customer',
  ACTIVE_CUSTOMER = 'active_customer',
  POWER_USER = 'power_user',
  CHURN_RISK = 'churn_risk',
  CHURNED = 'churned',
  VIP = 'vip',
  FREEMIUM = 'freemium',
  ENTERPRISE = 'enterprise'
}

// Customer Behavior Type
export enum BehaviorType {
  LOGIN_FREQUENCY = 'login_frequency',
  FEATURE_USAGE = 'feature_usage',
  SUPPORT_REQUESTS = 'support_requests',
  FEEDBACK_SUBMISSION = 'feedback_submission',
  REFERRAL_ACTIVITY = 'referral_activity',
  UPGRADE_ACTIVITY = 'upgrade_activity',
  DOWNGRADE_ACTIVITY = 'downgrade_activity',
  PAYMENT_HISTORY = 'payment_history',
  SESSION_DURATION = 'session_duration',
  PAGE_VIEWS = 'page_views'
}

// Customer Profile
export interface CustomerProfile {
  userId: string;
  email: string;
  name?: string;
  company?: string;
  industry?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  registrationDate: Date;
  lastLoginDate: Date;
  segment: CustomerSegment;
  lifetimeValue: number;
  engagementScore: number;
  satisfactionScore: number;
  churnRisk: 'low' | 'medium' | 'high';
  preferences: Record<string, any>;
  tags: string[];
}

// Customer Behavior Event
export interface CustomerBehaviorEvent {
  id: string;
  userId: string;
  type: BehaviorType;
  timestamp: Date;
  properties: Record<string, any>;
  sessionId?: string;
  pageUrl?: string;
  userAgent?: string;
}

// Customer Satisfaction Survey
export interface SatisfactionSurvey {
  id: string;
  userId: string;
  score: number; // 1-10
  category: 'overall' | 'product' | 'support' | 'pricing' | 'features';
  feedback?: string;
  timestamp: Date;
  followUpRequired: boolean;
}

// Customer Analytics Service
export class CustomerAnalyticsService {
  private customerProfiles: Map<string, CustomerProfile> = new Map();
  private behaviorEvents: CustomerBehaviorEvent[] = [];
  private satisfactionSurveys: SatisfactionSurvey[] = [];
  private segments: Map<CustomerSegment, string[]> = new Map();

  constructor() {
    this.initialize();
  }

  // Initialize customer analytics
  private initialize(): void {
    this.setupEventListeners();
    this.initializeSegments();
  }

  // Setup event listeners
  private setupEventListeners(): void {
    analyticsService.on('event', (event: any) => {
      this.processAnalyticsEvent(event);
    });
  }

  // Initialize customer segments
  private initializeSegments(): void {
    Object.values(CustomerSegment).forEach(segment => {
      this.segments.set(segment, []);
    });
  }

  // Process analytics event
  private processAnalyticsEvent(event: any): void {
    if (!event.userId) return;

    // Create or update customer profile
    this.ensureCustomerProfile(event.userId, event);

    // Track behavior event
    this.trackBehaviorEvent(event);

    // Update customer metrics
    this.updateCustomerMetrics(event.userId);
  }

  // Ensure customer profile exists
  private ensureCustomerProfile(userId: string, event: any): void {
    if (!this.customerProfiles.has(userId)) {
      const profile: CustomerProfile = {
        userId,
        email: event.properties?.email || '',
        name: event.properties?.name,
        company: event.properties?.company,
        industry: event.properties?.industry,
        location: {
          country: event.context?.location?.country,
          city: event.context?.location?.city,
          timezone: event.context?.location?.timezone
        },
        registrationDate: event.timestamp,
        lastLoginDate: event.timestamp,
        segment: CustomerSegment.NEW_CUSTOMER,
        lifetimeValue: 0,
        engagementScore: 0,
        satisfactionScore: 0,
        churnRisk: 'low',
        preferences: {},
        tags: []
      };

      this.customerProfiles.set(userId, profile);
      this.addCustomerToSegment(userId, CustomerSegment.NEW_CUSTOMER);
    } else {
      // Update last login date
      const profile = this.customerProfiles.get(userId)!;
      if (event.type === AnalyticsEventType.USER_LOGGED_IN) {
        profile.lastLoginDate = event.timestamp;
      }
    }
  }

  // Track behavior event
  private trackBehaviorEvent(event: any): void {
    const behaviorType = this.mapEventTypeToBehaviorType(event.type);
    if (!behaviorType) return;

    const behaviorEvent: CustomerBehaviorEvent = {
      id: this.generateId(),
      userId: event.userId,
      type: behaviorType,
      timestamp: event.timestamp,
      properties: event.properties || {},
      sessionId: event.sessionId,
      pageUrl: event.context?.url,
      userAgent: event.context?.userAgent
    };

    this.behaviorEvents.push(behaviorEvent);
  }

  // Map event type to behavior type
  private mapEventTypeToBehaviorType(eventType: string): BehaviorType | null {
    const mapping: Record<string, BehaviorType> = {
      [AnalyticsEventType.USER_LOGGED_IN]: BehaviorType.LOGIN_FREQUENCY,
      [AnalyticsEventType.FEATURE_USED]: BehaviorType.FEATURE_USAGE,
      [AnalyticsEventType.PAGE_VIEWED]: BehaviorType.PAGE_VIEWS,
      [AnalyticsEventType.SUBSCRIPTION_STARTED]: BehaviorType.UPGRADE_ACTIVITY,
      [AnalyticsEventType.SUBSCRIPTION_CANCELLED]: BehaviorType.DOWNGRADE_ACTIVITY,
      [AnalyticsEventType.PAYMENT_COMPLETED]: BehaviorType.PAYMENT_HISTORY
    };

    return mapping[eventType] || null;
  }

  // Update customer metrics
  private updateCustomerMetrics(userId: string): void {
    const profile = this.customerProfiles.get(userId);
    if (!profile) return;

    // Update engagement score
    profile.engagementScore = this.calculateEngagementScore(userId);

    // Update lifetime value
    const customerMetrics = revenueAnalyticsService.getCustomerMetrics(userId);
    if (customerMetrics && Array.isArray(customerMetrics) && customerMetrics.length > 0) {
      profile.lifetimeValue = customerMetrics[0].lifetimeValue || 0;
    } else if (customerMetrics && typeof customerMetrics === 'object' && 'lifetimeValue' in customerMetrics) {
      profile.lifetimeValue = (customerMetrics as any).lifetimeValue || 0;
    }

    // Update churn risk
    profile.churnRisk = this.calculateChurnRisk(userId);

    // Update segment
    const newSegment = this.determineCustomerSegment(userId);
    if (newSegment !== profile.segment) {
      this.removeCustomerFromSegment(userId, profile.segment);
      profile.segment = newSegment;
      this.addCustomerToSegment(userId, newSegment);
    }
  }

  // Calculate engagement score
  private calculateEngagementScore(userId: string): number {
    const userEvents = this.behaviorEvents.filter(event => event.userId === userId);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentEvents = userEvents.filter(event => event.timestamp >= thirtyDaysAgo);
    
    let score = 0;

    // Login frequency (max 30 points)
    const loginEvents = recentEvents.filter(event => event.type === BehaviorType.LOGIN_FREQUENCY);
    score += Math.min(loginEvents.length * 2, 30);

    // Feature usage (max 25 points)
    const featureEvents = recentEvents.filter(event => event.type === BehaviorType.FEATURE_USAGE);
    score += Math.min(featureEvents.length, 25);

    // Page views (max 20 points)
    const pageViewEvents = recentEvents.filter(event => event.type === BehaviorType.PAGE_VIEWS);
    score += Math.min(pageViewEvents.length / 10, 20);

    // Payment activity (max 15 points)
    const paymentEvents = recentEvents.filter(event => event.type === BehaviorType.PAYMENT_HISTORY);
    score += Math.min(paymentEvents.length * 5, 15);

    // Support activity (max 10 points)
    const supportEvents = recentEvents.filter(event => event.type === BehaviorType.SUPPORT_REQUESTS);
    score += Math.min(supportEvents.length * 2, 10);

    return Math.min(score, 100);
  }

  // Calculate churn risk
  private calculateChurnRisk(userId: string): 'low' | 'medium' | 'high' {
    const profile = this.customerProfiles.get(userId);
    if (!profile) return 'high';

    const now = new Date();
    const daysSinceLastLogin = (now.getTime() - profile.lastLoginDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceRegistration = (now.getTime() - profile.registrationDate.getTime()) / (1000 * 60 * 60 * 24);

    // High risk factors
    if (daysSinceLastLogin > 90) return 'high';
    if (profile.engagementScore < 20) return 'high';
    if (profile.lifetimeValue === 0 && daysSinceRegistration > 30) return 'high';

    // Medium risk factors
    if (daysSinceLastLogin > 30) return 'medium';
    if (profile.engagementScore < 50) return 'medium';

    return 'low';
  }

  // Determine customer segment
  private determineCustomerSegment(userId: string): CustomerSegment {
    const profile = this.customerProfiles.get(userId);
    if (!profile) return CustomerSegment.NEW_CUSTOMER;

    // VIP customers
    if (profile.lifetimeValue > 1000 && profile.engagementScore > 80) {
      return CustomerSegment.VIP;
    }

    // Enterprise customers
    if (profile.company && profile.lifetimeValue > 500) {
      return CustomerSegment.ENTERPRISE;
    }

    // Power users
    if (profile.engagementScore > 70) {
      return CustomerSegment.POWER_USER;
    }

    // Churned customers
    if (profile.churnRisk === 'high' && profile.lifetimeValue > 0) {
      return CustomerSegment.CHURNED;
    }

    // Churn risk customers
    if (profile.churnRisk === 'high') {
      return CustomerSegment.CHURN_RISK;
    }

    // Active customers
    if (profile.engagementScore > 30) {
      return CustomerSegment.ACTIVE_CUSTOMER;
    }

    // Freemium customers
    if (profile.lifetimeValue === 0) {
      return CustomerSegment.FREEMIUM;
    }

    return CustomerSegment.NEW_CUSTOMER;
  }

  // Add customer to segment
  private addCustomerToSegment(userId: string, segment: CustomerSegment): void {
    const segmentCustomers = this.segments.get(segment) || [];
    if (!segmentCustomers.includes(userId)) {
      segmentCustomers.push(userId);
      this.segments.set(segment, segmentCustomers);
    }
  }

  // Remove customer from segment
  private removeCustomerFromSegment(userId: string, segment: CustomerSegment): void {
    const segmentCustomers = this.segments.get(segment) || [];
    const updatedCustomers = segmentCustomers.filter(id => id !== userId);
    this.segments.set(segment, updatedCustomers);
  }

  // Track custom behavior
  public trackBehavior(
    userId: string,
    type: BehaviorType,
    properties: Record<string, any> = {}
  ): void {
    const behaviorEvent: CustomerBehaviorEvent = {
      id: this.generateId(),
      userId,
      type,
      timestamp: new Date(),
      properties,
      sessionId: analyticsService.getSession()?.id
    };

    this.behaviorEvents.push(behaviorEvent);
    this.updateCustomerMetrics(userId);

    console.log('Custom behavior tracked:', behaviorEvent);
  }

  // Submit satisfaction survey
  public submitSatisfactionSurvey(
    userId: string,
    score: number,
    category: SatisfactionSurvey['category'],
    feedback?: string
  ): void {
    const survey: SatisfactionSurvey = {
      id: this.generateId(),
      userId,
      score,
      category,
      feedback,
      timestamp: new Date(),
      followUpRequired: score < 6
    };

    this.satisfactionSurveys.push(survey);

    // Update customer satisfaction score
    const profile = this.customerProfiles.get(userId);
    if (profile) {
      const userSurveys = this.satisfactionSurveys.filter(s => s.userId === userId);
      profile.satisfactionScore = userSurveys.reduce((sum, s) => sum + s.score, 0) / userSurveys.length;
    }

    console.log('Satisfaction survey submitted:', survey);
  }

  // Get customer profile
  public getCustomerProfile(userId: string): CustomerProfile | null {
    return this.customerProfiles.get(userId) || null;
  }

  // Get all customer profiles
  public getAllCustomerProfiles(): CustomerProfile[] {
    return Array.from(this.customerProfiles.values());
  }

  // Get customers by segment
  public getCustomersBySegment(segment: CustomerSegment): CustomerProfile[] {
    const userIds = this.segments.get(segment) || [];
    return userIds.map(userId => this.customerProfiles.get(userId)).filter(Boolean) as CustomerProfile[];
  }

  // Get customer behavior events
  public getCustomerBehaviorEvents(
    userId?: string,
    type?: BehaviorType,
    startDate?: Date,
    endDate?: Date
  ): CustomerBehaviorEvent[] {
    let events = [...this.behaviorEvents];

    if (userId) {
      events = events.filter(event => event.userId === userId);
    }

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

  // Get customer analytics
  public getCustomerAnalytics(): {
    totalCustomers: number;
    segmentDistribution: Record<CustomerSegment, number>;
    averageEngagementScore: number;
    averageSatisfactionScore: number;
    averageLifetimeValue: number;
    churnRiskDistribution: Record<string, number>;
    topIndustries: Array<{ industry: string; count: number }>;
    topLocations: Array<{ location: string; count: number }>;
  } {
    const profiles = Array.from(this.customerProfiles.values());
    const totalCustomers = profiles.length;

    // Segment distribution
    const segmentDistribution = Object.values(CustomerSegment).reduce((acc, segment) => {
      acc[segment] = this.segments.get(segment)?.length || 0;
      return acc;
    }, {} as Record<CustomerSegment, number>);

    // Average scores
    const averageEngagementScore = profiles.length > 0 
      ? profiles.reduce((sum, profile) => sum + profile.engagementScore, 0) / profiles.length 
      : 0;

    const averageSatisfactionScore = profiles.length > 0 
      ? profiles.reduce((sum, profile) => sum + profile.satisfactionScore, 0) / profiles.length 
      : 0;

    const averageLifetimeValue = profiles.length > 0 
      ? profiles.reduce((sum, profile) => sum + profile.lifetimeValue, 0) / profiles.length 
      : 0;

    // Churn risk distribution
    const churnRiskDistribution = profiles.reduce((acc, profile) => {
      acc[profile.churnRisk] = (acc[profile.churnRisk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top industries
    const industryCount = profiles.reduce((acc, profile) => {
      if (profile.industry) {
        acc[profile.industry] = (acc[profile.industry] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topIndustries = Object.entries(industryCount)
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top locations
    const locationCount = profiles.reduce((acc, profile) => {
      if (profile.location?.country) {
        acc[profile.location.country] = (acc[profile.location.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topLocations = Object.entries(locationCount)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalCustomers,
      segmentDistribution,
      averageEngagementScore,
      averageSatisfactionScore,
      averageLifetimeValue,
      churnRiskDistribution,
      topIndustries,
      topLocations
    };
  }

  // Get customer journey analysis
  public getCustomerJourneyAnalysis(userId: string): {
    journey: CustomerBehaviorEvent[];
    milestones: Array<{ event: string; date: Date; significance: string }>;
    engagementTrend: Array<{ date: Date; score: number }>;
    recommendations: string[];
  } {
    const userEvents = this.behaviorEvents.filter(event => event.userId === userId);
    const profile = this.customerProfiles.get(userId);

    // Sort events by timestamp
    const sortedEvents = userEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Identify milestones
    const milestones = [];
    if (profile) {
      milestones.push({
        event: 'Registration',
        date: profile.registrationDate,
        significance: 'Customer joined'
      });
    }

    const firstPayment = sortedEvents.find(event => event.type === BehaviorType.PAYMENT_HISTORY);
    if (firstPayment) {
      milestones.push({
        event: 'First Payment',
        date: firstPayment.timestamp,
        significance: 'Customer converted'
      });
    }

    const firstFeature = sortedEvents.find(event => event.type === BehaviorType.FEATURE_USAGE);
    if (firstFeature) {
      milestones.push({
        event: 'First Feature Usage',
        date: firstFeature.timestamp,
        significance: 'Customer engaged'
      });
    }

    // Engagement trend (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentEvents = sortedEvents.filter(event => event.timestamp >= thirtyDaysAgo);

    const engagementTrend = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dayEvents = recentEvents.filter(event => 
        event.timestamp.toDateString() === date.toDateString()
      );
      const score = dayEvents.length * 10; // Simple scoring
      engagementTrend.push({ date, score });
    }

    // Generate recommendations
    const recommendations = [];
    if (profile) {
      if (profile.engagementScore < 30) {
        recommendations.push('Send onboarding email series to increase engagement');
      }
      if (profile.churnRisk === 'high') {
        recommendations.push('Reach out with personalized retention offer');
      }
      if (profile.lifetimeValue > 500) {
        recommendations.push('Consider upselling to enterprise plan');
      }
      if (profile.satisfactionScore < 7) {
        recommendations.push('Follow up on recent support interactions');
      }
    }

    return {
      journey: sortedEvents,
      milestones,
      engagementTrend,
      recommendations
    };
  }

  // Update customer profile
  public updateCustomerProfile(userId: string, updates: Partial<CustomerProfile>): void {
    const profile = this.customerProfiles.get(userId);
    if (profile) {
      Object.assign(profile, updates);
      
      // Update segment if needed
      if (updates.segment && updates.segment !== profile.segment) {
        this.removeCustomerFromSegment(userId, profile.segment);
        this.addCustomerToSegment(userId, updates.segment);
      }
    }
  }

  // Add customer tag
  public addCustomerTag(userId: string, tag: string): void {
    const profile = this.customerProfiles.get(userId);
    if (profile && !profile.tags.includes(tag)) {
      profile.tags.push(tag);
    }
  }

  // Remove customer tag
  public removeCustomerTag(userId: string, tag: string): void {
    const profile = this.customerProfiles.get(userId);
    if (profile) {
      profile.tags = profile.tags.filter(t => t !== tag);
    }
  }

  // Get customers by tag
  public getCustomersByTag(tag: string): CustomerProfile[] {
    return Array.from(this.customerProfiles.values())
      .filter(profile => profile.tags.includes(tag));
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const customerAnalyticsService = new CustomerAnalyticsService();

// Export default instance
export default customerAnalyticsService; 