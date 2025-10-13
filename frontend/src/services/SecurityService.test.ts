import { describe, it, expect } from 'vitest';
import { SecurityService } from './SecurityService';

describe('SecurityService', () => {
  it('should be instantiable', () => {
    const service = new SecurityService();
    expect(service).toBeInstanceOf(SecurityService);
  });
});