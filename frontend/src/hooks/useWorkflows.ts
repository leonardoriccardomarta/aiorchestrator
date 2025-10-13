import { useState, useEffect } from 'react';
import { Workflow } from '../types';

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Customer Onboarding',
    description: 'Automated customer onboarding process',
    trigger: { type: 'event', config: {} },
    steps: [],
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: 'Data Sync',
    description: 'Synchronize data between systems',
    trigger: { type: 'schedule', config: {} },
    steps: [],
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

interface UseWorkflowsReturn {
  workflows: Workflow[];
  createWorkflow: (workflow: Partial<Workflow>) => Promise<void>;
  executeWorkflow: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export const useWorkflows = (): UseWorkflowsReturn => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setWorkflows(mockWorkflows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'));
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkflow = async (workflow: Partial<Workflow>) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newWorkflow: Workflow = {
        ...workflow,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active',
        steps: workflow.steps || [],
        name: workflow.name || '',
        description: workflow.description || '',
        trigger: workflow.trigger || { type: 'manual', config: {} },
      };
      setWorkflows(prev => [...prev, newWorkflow]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create workflow'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const executeWorkflow = async () => {
    // Simulate API call
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to execute workflow'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    workflows,
    createWorkflow,
    executeWorkflow,
    isLoading,
    error,
  };
}; 