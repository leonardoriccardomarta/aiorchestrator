// Browser-compatible EventEmitter implementation
class BrowserEventEmitter {
  private events: Map<string, Function[]> = new Map();

  on(event: string, listener: Function): this {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
      return true;
    }
    return false;
  }

  off(event: string, listener: Function): this {
    const listeners = this.events.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
}

// Analytics Event Types
export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  PAGE_VIEWED = 'page_viewed',
  CLICK = 'click',
  SCROLL = 'scroll',
  FORM_SUBMIT = 'form_submit',
  CONVERSION = 'conversion',
  ERROR = 'error',
  ERROR_OCCURRED = 'error_occurred',
  PERFORMANCE = 'performance',
  PERFORMANCE_METRIC = 'performance_metric',
  USER_ACTION = 'user_action',
  BUSINESS_EVENT = 'business_event',
  USER_LOGGED_IN = 'user_logged_in',
  USER_REGISTERED = 'user_registered',
  FEATURE_USED = 'feature_used',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_INITIATED = 'payment_initiated',
  SUBSCRIPTION_STARTED = 'subscription_started',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  CHATBOT_UPDATED = 'chatbot_updated',
  CHATBOT_TRAINED = 'chatbot_trained',
  CHATBOT_DEPLOYED = 'chatbot_deployed',
  CONVERSION_COMPLETED = 'conversion_completed'
}

// Analytics Event Interface
export interface AnalyticsEvent {
  type: AnalyticsEventType;
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  context: {
    userAgent: string;
    url: string;
    referrer?: string;
    ip?: string;
    location?: string;
  };
}

// Analytics Configuration
export interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  endpoint?: string;
  batchSize: number;
  flushInterval: number;
  maxQueueSize: number;
  debug: boolean;
  onEvent?: (event: AnalyticsEvent) => void;
  onError?: (error: Error) => void;
}

// Analytics Service Class
export class AnalyticsService extends BrowserEventEmitter {
  private config: AnalyticsConfig;
  private queue: AnalyticsEvent[] = [];
  private flushTimer?: number;
  private isInitialized = false;
  private userId?: string;
  private sessionId: string;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    super();
    
    this.config = {
      enabled: true,
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      maxQueueSize: 1000,
      debug: false,
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private initialize(): void {
    if (this.config.enabled) {
      this.startFlushTimer();
      this.isInitialized = true;
      
      if (this.config.debug) {
        console.log('Analytics Service initialized');
      }
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval) as any;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public trackEvent(type: AnalyticsEventType, name: string, properties?: Record<string, any>): void {
    if (!this.config.enabled || !this.isInitialized) {
      return;
    }

    const event: AnalyticsEvent = {
      type,
      name,
      properties,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date(),
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        ip: this.getIpAddress(),
        location: this.getLocation()
      }
    };

    this.queue.push(event);
    this.emit('event', event);

    if (this.config.onEvent) {
      this.config.onEvent(event);
    }

    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }

    if (this.queue.length >= this.config.maxQueueSize) {
      this.queue = this.queue.slice(-this.config.maxQueueSize / 2);
    }
  }

  public trackPageView(page: string, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.PAGE_VIEW, page, properties);
  }

  public trackClick(element: string, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.CLICK, element, properties);
  }

  public trackConversion(conversionType: string, value?: number, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.CONVERSION, conversionType, {
      value,
      ...properties
    });
  }

  public trackError(error: Error, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.ERROR, error.message, {
      stack: error.stack,
      ...properties
    });
  }

  public trackPerformance(metric: string, value: number, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.PERFORMANCE, metric, {
      value,
      ...properties
    });
  }

  public trackUserAction(action: string, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.USER_ACTION, action, properties);
  }

  public trackBusinessEvent(event: string, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.BUSINESS_EVENT, event, properties);
  }

  // Alias for trackEvent for compatibility
  public track(event: string, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.BUSINESS_EVENT, event, properties);
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }

    const events = [...this.queue];
    this.queue = [];

    try {
      if (this.config.endpoint) {
        await this.sendEvents(events);
      }
      
      this.emit('flush', events);
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error);
      }
      
      this.emit('error', error);
      
      // Re-add events to queue on failure
      this.queue.unshift(...events);
    }
  }

  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.endpoint) {
      return;
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send analytics events: ${response.statusText}`);
    }
  }

  private getIpAddress(): string {
    // This would typically be set by the server
    return '';
  }

  private getLocation(): string {
    // This would typically be determined by IP geolocation
    return '';
  }

  public getQueueSize(): number {
    return this.queue.length;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getSession(): { id: string; userId?: string } {
    return {
      id: this.sessionId,
      userId: this.userId
    };
  }

  public isEnabled(): boolean {
    return this.config.enabled && this.isInitialized;
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flush();
    this.removeAllListeners();
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService(); 