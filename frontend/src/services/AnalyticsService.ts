import mixpanel from 'mixpanel-browser';
import posthog from 'posthog-js';

declare global {
  interface Window {
    localStorage: Storage;
  }
}

export class AnalyticsService {
  constructor(
    mixpanelToken: string,
    posthogToken: string,
    posthogApiHost: string = 'https://app.posthog.com'
  ) {
    mixpanel.init(mixpanelToken);
    posthog.init(posthogToken, { api_host: posthogApiHost });
  }

  trackEvent(eventName: string, properties: Record<string, unknown> = {}): void {
    // Track in Mixpanel
    mixpanel.track(eventName, properties);

    // Track in PostHog
    posthog.capture(eventName, properties);

    // Custom event processing
    this.processCustomAnalytics(eventName, properties);
  }

  identifyUser(userId: string, traits: Record<string, unknown> = {}): void {
    mixpanel.identify(userId);
    mixpanel.people.set(traits);

    posthog.identify(userId, traits);
  }

  private processCustomAnalytics(eventName: string, properties: Record<string, unknown>): void {
    // Store events in local storage for offline support
    const offlineEvents = JSON.parse(localStorage.getItem('offlineEvents') || '[]');
    offlineEvents.push({ eventName, properties, timestamp: Date.now() });
    localStorage.setItem('offlineEvents', JSON.stringify(offlineEvents));

    // Process custom metrics
    this.updateCustomMetrics(eventName, properties);
  }

  private updateCustomMetrics(_eventName: string, properties: Record<string, unknown>): void {
    // Implementation would go here
    console.log('Custom metrics updated:', properties);
  }

  async syncOfflineEvents(): Promise<void> {
    const offlineEvents = JSON.parse(localStorage.getItem('offlineEvents') || '[]');
    
    for (const event of offlineEvents) {
      await this.trackEvent(event.eventName, event.properties);
    }

    localStorage.removeItem('offlineEvents');
  }

  getAnalyticsDashboardData(): Record<string, unknown> {
    return {
      metrics: JSON.parse(localStorage.getItem('customMetrics') || '{}'),
      recentEvents: JSON.parse(localStorage.getItem('offlineEvents') || '[]'),
    };
  }
} 