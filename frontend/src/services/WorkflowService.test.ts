import { describe, it, expect } from 'vitest';
import { WorkflowService } from './WorkflowService';

describe('WorkflowService', () => {
  it('should be instantiable', () => {
    const service = new WorkflowService();
    expect(service).toBeInstanceOf(WorkflowService);
  });
});