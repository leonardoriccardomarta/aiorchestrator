import { describe, it, expect } from 'vitest';
import { integrationService } from './IntegrationService';

describe('integrationService', () => {
  it('should be defined', () => {
    expect(integrationService).toBeDefined();
  });
  it('should have getIntegrations method', () => {
    expect(typeof integrationService.getIntegrations).toBe('function');
  });
});