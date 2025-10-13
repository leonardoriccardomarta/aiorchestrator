import { describe, it, expect } from 'vitest';
import { AIService } from './AIService';

describe('AIService', () => {
  it('should have generateSuggestions, analyzeConversation, and generateTags methods', () => {
    const service = new AIService('dummy-key');
    expect(typeof service.generateSuggestions).toBe('function');
    expect(typeof service.analyzeConversation).toBe('function');
    expect(typeof service.generateTags).toBe('function');
  });
});