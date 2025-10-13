import { analyticsService, AnalyticsEventType } from './AnalyticsService';

// Feature Types
export enum FeatureType {
  CHATBOT_CREATION = 'chatbot_creation',
  CHATBOT_TRAINING = 'chatbot_training',
  CHATBOT_DEPLOYMENT = 'chatbot_deployment',
  ANALYTICS_DASHBOARD = 'analytics_dashboard',
  USER_MANAGEMENT = 'user_management',
  PAYMENT_PROCESSING = 'payment_processing',
  API_INTEGRATION = 'api_integration',
  CUSTOM_BRANDING = 'custom_branding',
  MULTI_LANGUAGE = 'multi_language',
  ADVANCED_ANALYTICS = 'advanced_analytics',
  WHITE_LABEL = 'white_label',
  ENTERPRISE_FEATURES = 'enterprise_features'
}

// Feature Usage Event
export interface FeatureUsageEvent {
  id: string;
  userId: string;
  featureType: FeatureType;
  action: string;
  timestamp: Date;
  duration?: number; // in seconds
  success: boolean;
  errorMessage?: string;
  properties: Record<string, any>;
  sessionId?: string;
}

// Feature Adoption Metrics
export interface FeatureAdoptionMetrics {
  featureType: FeatureType;
  totalUsers: number;
  activeUsers: number;
  adoptionRate: number;
  usageFrequency: number;
  averageSessionDuration: number;
  errorRate: number;
  satisfactionScore: number;
  retentionImpact: number;
}

// Product Performance Metrics
export interface ProductPerformanceMetrics {
  overallUptime: number;
  averageResponseTime: number;
  errorRate: number;
  userSatisfaction: number;
  featureAdoption: Record<FeatureType, FeatureAdoptionMetrics>;
  topIssues: Array<{ issue: string; count: number; impact: string }>;
  performanceTrends: Array<{ date: Date; uptime: number; responseTime: number; errorRate: number }>;
}

// User Feedback
export interface UserFeedback {
  id: string;
  userId: string;
  featureType?: FeatureType;
  category: 'bug' | 'feature_request' | 'improvement' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  timestamp: Date;
  assignedTo?: string;
  tags: string[];
  votes: number;
}

// Product Analytics Service
export class ProductAnalyticsService {
  private featureUsageEvents: FeatureUsageEvent[] = [];
  private userFeedback: UserFeedback[] = [];
  private featureDefinitions: Map<FeatureType, {
    name: string;
    description: string;
    category: string;
    complexity: 'simple' | 'medium' | 'complex';
    targetAudience: string[];
  }> = new Map();

  constructor() {
    this.initialize();
  }

  // Initialize product analytics
  private initialize(): void {
    this.setupFeatureDefinitions();
    this.setupEventListeners();
  }

  // Setup feature definitions
  private setupFeatureDefinitions(): void {
    const features = [
      {
        type: FeatureType.CHATBOT_CREATION,
        name: 'Chatbot Creation',
        description: 'Create and configure chatbots',
        category: 'Core Features',
        complexity: 'simple',
        targetAudience: ['all']
      },
      {
        type: FeatureType.CHATBOT_TRAINING,
        name: 'Chatbot Training',
        description: 'Train chatbots with custom data',
        category: 'Core Features',
        complexity: 'medium',
        targetAudience: ['power_users', 'enterprise']
      },
      {
        type: FeatureType.CHATBOT_DEPLOYMENT,
        name: 'Chatbot Deployment',
        description: 'Deploy chatbots to various platforms',
        category: 'Core Features',
        complexity: 'medium',
        targetAudience: ['all']
      },
      {
        type: FeatureType.ANALYTICS_DASHBOARD,
        name: 'Analytics Dashboard',
        description: 'View chatbot performance analytics',
        category: 'Analytics',
        complexity: 'simple',
        targetAudience: ['all']
      },
      {
        type: FeatureType.USER_MANAGEMENT,
        name: 'User Management',
        description: 'Manage team members and permissions',
        category: 'Administration',
        complexity: 'medium',
        targetAudience: ['admin', 'enterprise']
      },
      {
        type: FeatureType.PAYMENT_PROCESSING,
        name: 'Payment Processing',
        description: 'Handle subscription payments',
        category: 'Billing',
        complexity: 'complex',
        targetAudience: ['all']
      },
      {
        type: FeatureType.API_INTEGRATION,
        name: 'API Integration',
        description: 'Integrate with external APIs',
        category: 'Development',
        complexity: 'complex',
        targetAudience: ['developers', 'enterprise']
      },
      {
        type: FeatureType.CUSTOM_BRANDING,
        name: 'Custom Branding',
        description: 'Customize chatbot appearance',
        category: 'Customization',
        complexity: 'simple',
        targetAudience: ['business', 'enterprise']
      },
      {
        type: FeatureType.MULTI_LANGUAGE,
        name: 'Multi-Language Support',
        description: 'Support multiple languages',
        category: 'Internationalization',
        complexity: 'medium',
        targetAudience: ['enterprise', 'international']
      },
      {
        type: FeatureType.ADVANCED_ANALYTICS,
        name: 'Advanced Analytics',
        description: 'Advanced reporting and insights',
        category: 'Analytics',
        complexity: 'complex',
        targetAudience: ['power_users', 'enterprise']
      },
      {
        type: FeatureType.WHITE_LABEL,
        name: 'White Label',
        description: 'Remove branding for resale',
        category: 'Enterprise',
        complexity: 'complex',
        targetAudience: ['enterprise', 'partners']
      },
      {
        type: FeatureType.ENTERPRISE_FEATURES,
        name: 'Enterprise Features',
        description: 'Advanced enterprise capabilities',
        category: 'Enterprise',
        complexity: 'complex',
        targetAudience: ['enterprise']
      }
    ];

    features.forEach(feature => {
      const { type, ...definition } = feature;
      this.featureDefinitions.set(type, definition as any);
    });
  }

  // Setup event listeners
  private setupEventListeners(): void {
    analyticsService.on('event', (event: any) => {
      this.processAnalyticsEvent(event);
    });
  }

  // Process analytics event
  private processAnalyticsEvent(event: any): void {
    if (!event.userId) return;

    // Track feature usage
    if (event.type === AnalyticsEventType.FEATURE_USED) {
      this.trackFeatureUsage(event);
    }

    // Track errors
    if (event.type === AnalyticsEventType.ERROR_OCCURRED) {
      this.trackFeatureError(event);
    }
  }

  // Track feature usage
  private trackFeatureUsage(event: any): void {
    const featureType = this.mapEventToFeatureType(event);
    if (!featureType) return;

    const usageEvent: FeatureUsageEvent = {
      id: this.generateId(),
      userId: event.userId,
      featureType,
      action: event.properties?.action || 'used',
      timestamp: event.timestamp,
      duration: event.properties?.duration,
      success: true,
      properties: event.properties || {},
      sessionId: event.sessionId
    };

    this.featureUsageEvents.push(usageEvent);
  }

  // Track feature error
  private trackFeatureError(event: any): void {
    const featureType = this.mapEventToFeatureType(event);
    if (!featureType) return;

    const errorEvent: FeatureUsageEvent = {
      id: this.generateId(),
      userId: event.userId,
      featureType,
      action: event.properties?.action || 'error',
      timestamp: event.timestamp,
      success: false,
      errorMessage: event.properties?.message || event.properties?.error,
      properties: event.properties || {},
      sessionId: event.sessionId
    };

    this.featureUsageEvents.push(errorEvent);
  }

  // Map event to feature type
  private mapEventToFeatureType(event: any): FeatureType | null {
    const featureMapping = event.properties?.feature;
    if (!featureMapping) return null;

    // Map feature names to FeatureType enum
    const mapping: Record<string, FeatureType> = {
      'chatbot_creation': FeatureType.CHATBOT_CREATION,
      'chatbot_training': FeatureType.CHATBOT_TRAINING,
      'chatbot_deployment': FeatureType.CHATBOT_DEPLOYMENT,
      'analytics_dashboard': FeatureType.ANALYTICS_DASHBOARD,
      'user_management': FeatureType.USER_MANAGEMENT,
      'payment_processing': FeatureType.PAYMENT_PROCESSING,
      'api_integration': FeatureType.API_INTEGRATION,
      'custom_branding': FeatureType.CUSTOM_BRANDING,
      'multi_language': FeatureType.MULTI_LANGUAGE,
      'advanced_analytics': FeatureType.ADVANCED_ANALYTICS,
      'white_label': FeatureType.WHITE_LABEL,
      'enterprise_features': FeatureType.ENTERPRISE_FEATURES
    };

    return mapping[featureMapping] || null;
  }



  // Submit user feedback
  public submitFeedback(
    userId: string,
    category: UserFeedback['category'],
    priority: UserFeedback['priority'],
    title: string,
    description: string,
    featureType?: FeatureType,
    tags: string[] = []
  ): void {
    const feedback: UserFeedback = {
      id: this.generateId(),
      userId,
      featureType,
      category,
      priority,
      title,
      description,
      status: 'open',
      timestamp: new Date(),
      tags,
      votes: 0
    };

    this.userFeedback.push(feedback);
    console.log('User feedback submitted:', feedback);
  }

  // Get feature adoption metrics
  public getFeatureAdoptionMetrics(
    featureType?: FeatureType,
    startDate?: Date,
    endDate?: Date
  ): FeatureAdoptionMetrics[] | FeatureAdoptionMetrics | null {
    let events = [...this.featureUsageEvents];

    if (startDate) {
      events = events.filter(event => event.timestamp >= startDate);
    }

    if (endDate) {
      events = events.filter(event => event.timestamp <= endDate);
    }

    if (featureType) {
      events = events.filter(event => event.featureType === featureType);
      return this.calculateFeatureMetrics(events, featureType);
    }

    // Return metrics for all features
    const allFeatures = Object.values(FeatureType);
    return allFeatures.map(feature => {
      const featureEvents = events.filter(event => event.featureType === feature);
      return this.calculateFeatureMetrics(featureEvents, feature);
    });
  }

  // Calculate feature metrics
  private calculateFeatureMetrics(events: FeatureUsageEvent[], featureType: FeatureType): FeatureAdoptionMetrics {
    const totalUsers = new Set(events.map(event => event.userId)).size;
    const activeUsers = new Set(
      events
        .filter(event => event.timestamp >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .map(event => event.userId)
    ).size;

    const totalEvents = events.length;
    const errorEvents = events.filter(event => !event.success).length;
    const errorRate = totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0;

    // Calculate usage frequency (events per user per month)
    const usageFrequency = totalUsers > 0 ? totalEvents / totalUsers : 0;

    // Calculate average session duration
    const eventsWithDuration = events.filter(event => event.duration);
    const averageSessionDuration = eventsWithDuration.length > 0
      ? eventsWithDuration.reduce((sum, event) => sum + (event.duration || 0), 0) / eventsWithDuration.length
      : 0;

    // Calculate adoption rate (users who used the feature at least once)
    const totalUsersInSystem = 1000; // This would come from user analytics
    const adoptionRate = totalUsersInSystem > 0 ? (totalUsers / totalUsersInSystem) * 100 : 0;

    // Mock satisfaction score (in real implementation, this would come from surveys)
    const satisfactionScore = Math.max(0, 100 - errorRate * 2);

    // Mock retention impact (in real implementation, this would be calculated from user retention data)
    const retentionImpact = Math.min(100, adoptionRate * 0.8 + satisfactionScore * 0.2);

    return {
      featureType,
      totalUsers,
      activeUsers,
      adoptionRate,
      usageFrequency,
      averageSessionDuration,
      errorRate,
      satisfactionScore,
      retentionImpact
    };
  }

  // Get product performance metrics
  public getProductPerformanceMetrics(): ProductPerformanceMetrics {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentEvents = this.featureUsageEvents.filter(event => event.timestamp >= thirtyDaysAgo);

    // Calculate overall metrics
    const totalEvents = recentEvents.length;
    const errorEvents = recentEvents.filter(event => !event.success).length;
    const overallErrorRate = totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0;

    // Mock uptime (in real implementation, this would come from system monitoring)
    const overallUptime = 99.8;

    // Mock response time (in real implementation, this would come from performance monitoring)
    const averageResponseTime = 150; // milliseconds

    // Calculate user satisfaction (average of feature satisfaction scores)
    const featureMetrics = this.getFeatureAdoptionMetrics() as FeatureAdoptionMetrics[];
    const averageSatisfaction = featureMetrics.length > 0
      ? featureMetrics.reduce((sum, metric) => sum + metric.satisfactionScore, 0) / featureMetrics.length
      : 0;

    // Get feature adoption metrics
    const featureAdoption = Object.values(FeatureType).reduce((acc, featureType) => {
      const metrics = this.getFeatureAdoptionMetrics(featureType) as FeatureAdoptionMetrics;
      acc[featureType] = metrics;
      return acc;
    }, {} as Record<FeatureType, FeatureAdoptionMetrics>);

    // Top issues
    const topIssues = [
      { issue: 'Slow response times', count: 45, impact: 'Medium' },
      { issue: 'Feature not working as expected', count: 32, impact: 'High' },
      { issue: 'UI/UX confusion', count: 28, impact: 'Low' },
      { issue: 'Integration problems', count: 15, impact: 'High' },
      { issue: 'Documentation unclear', count: 12, impact: 'Medium' }
    ];

    // Performance trends (mock data for last 30 days)
    const performanceTrends = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      performanceTrends.push({
        date,
        uptime: 99.5 + Math.random() * 0.5,
        responseTime: 120 + Math.random() * 60,
        errorRate: Math.random() * 2
      });
    }

    return {
      overallUptime,
      averageResponseTime,
      errorRate: overallErrorRate,
      userSatisfaction: averageSatisfaction,
      featureAdoption,
      topIssues,
      performanceTrends
    };
  }

  // Get user feedback
  public getUserFeedback(
    status?: UserFeedback['status'],
    priority?: UserFeedback['priority'],
    featureType?: FeatureType
  ): UserFeedback[] {
    let feedback = [...this.userFeedback];

    if (status) {
      feedback = feedback.filter(f => f.status === status);
    }

    if (priority) {
      feedback = feedback.filter(f => f.priority === priority);
    }

    if (featureType) {
      feedback = feedback.filter(f => f.featureType === featureType);
    }

    return feedback.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Update feedback status
  public updateFeedbackStatus(feedbackId: string, status: UserFeedback['status'], assignedTo?: string): void {
    const feedback = this.userFeedback.find(f => f.id === feedbackId);
    if (feedback) {
      feedback.status = status;
      if (assignedTo) {
        feedback.assignedTo = assignedTo;
      }
    }
  }

  // Vote on feedback
  public voteOnFeedback(feedbackId: string): void {
    const feedback = this.userFeedback.find(f => f.id === feedbackId);
    if (feedback) {
      feedback.votes += 1;
    }
  }

  // Get feature definitions
  public getFeatureDefinitions(): Array<{
    type: FeatureType;
    name: string;
    description: string;
    category: string;
    complexity: 'simple' | 'medium' | 'complex';
    targetAudience: string[];
  }> {
    return Array.from(this.featureDefinitions.entries()).map(([type, definition]) => ({
      type,
      ...definition
    }));
  }

  // Get feature usage events
  public getFeatureUsageEvents(
    userId?: string,
    featureType?: FeatureType,
    startDate?: Date,
    endDate?: Date
  ): FeatureUsageEvent[] {
    let events = [...this.featureUsageEvents];

    if (userId) {
      events = events.filter(event => event.userId === userId);
    }

    if (featureType) {
      events = events.filter(event => event.featureType === featureType);
    }

    if (startDate) {
      events = events.filter(event => event.timestamp >= startDate);
    }

    if (endDate) {
      events = events.filter(event => event.timestamp <= endDate);
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get feature recommendations for user
  public getFeatureRecommendations(userId: string): Array<{
    featureType: FeatureType;
    name: string;
    reason: string;
    priority: 'low' | 'medium' | 'high';
  }> {
    const userEvents = this.featureUsageEvents.filter(event => event.userId === userId);
    const usedFeatures = new Set(userEvents.map(event => event.featureType));
    const allFeatures = Object.values(FeatureType);
    const unusedFeatures = allFeatures.filter(feature => !usedFeatures.has(feature));

    const recommendations = [];

    // Recommend based on usage patterns
    if (userEvents.some(event => event.featureType === FeatureType.CHATBOT_CREATION)) {
      if (!usedFeatures.has(FeatureType.CHATBOT_TRAINING)) {
        recommendations.push({
          featureType: FeatureType.CHATBOT_TRAINING,
          name: 'Chatbot Training',
          reason: 'You\'ve created chatbots, try training them with custom data',
          priority: 'high'
        });
      }
    }

    if (userEvents.some(event => event.featureType === FeatureType.ANALYTICS_DASHBOARD)) {
      if (!usedFeatures.has(FeatureType.ADVANCED_ANALYTICS)) {
        recommendations.push({
          featureType: FeatureType.ADVANCED_ANALYTICS,
          name: 'Advanced Analytics',
          reason: 'You use analytics, try advanced reporting features',
          priority: 'medium'
        });
      }
    }

    // Add general recommendations for unused features
    unusedFeatures.slice(0, 3).forEach(feature => {
      const definition = this.featureDefinitions.get(feature);
      if (definition) {
        recommendations.push({
          featureType: feature,
          name: definition.name,
          reason: `Explore ${definition.name.toLowerCase()} to enhance your experience`,
          priority: 'low'
        });
      }
    });

    return recommendations as any;
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const productAnalyticsService = new ProductAnalyticsService();

// Export default instance
export default productAnalyticsService; 