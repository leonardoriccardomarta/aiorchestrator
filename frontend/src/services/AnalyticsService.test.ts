import { describe, it, expect } from 'vitest';
import { AnalyticsService } from './AnalyticsService';

describe('AnalyticsService', () => {
  it('should have trackEvent and identifyUser methods', () => {
    const service = new AnalyticsService('mixpanel-token', 'posthog-token');
    expect(typeof service.trackEvent).toBe('function');
    expect(typeof service.identifyUser).toBe('function');
  });
});