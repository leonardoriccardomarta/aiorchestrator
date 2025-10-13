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

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'action' | 'condition';
  config: Record<string, unknown>;
  nextSteps: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'event' | 'schedule' | 'manual';
    config: Record<string, unknown>;
  };
  steps: WorkflowStep[];
  status: 'active' | 'inactive' | 'archived';
  createdAt: number;
  updatedAt: number;
}

export class WorkflowService extends BrowserEventEmitter {
  private workflows: Map<string, Workflow>;
  private runningInstances: Map<string, {
    workflowId: string;
    currentStep: string;
    data: Record<string, unknown>;
    status: 'running' | 'completed' | 'failed';
  }>;

  constructor() {
    super();
    this.workflows = new Map();
    this.runningInstances = new Map();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.on('stepCompleted', this.handleStepCompletion.bind(this));
    this.on('workflowCompleted', this.handleWorkflowCompletion.bind(this));
    this.on('workflowFailed', this.handleWorkflowFailure.bind(this));
  }

  createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = crypto.randomUUID();
    const now = Date.now();

    const newWorkflow: Workflow = {
      ...workflow,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.workflows.set(id, newWorkflow);
    return id;
  }

  async startWorkflow(workflowId: string, initialData: Record<string, unknown> = {}): Promise<string> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const instanceId = crypto.randomUUID();
    const firstStep = workflow.steps[0];

    this.runningInstances.set(instanceId, {
      workflowId,
      currentStep: firstStep.id,
      data: initialData,
      status: 'running',
    });

    await this.executeStep(instanceId, firstStep, initialData);
    return instanceId;
  }

  private async executeStep(
    instanceId: string,
    step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<void> {
    try {
      const result = await this.processStep(step, data);
      this.emit('stepCompleted', { instanceId, stepId: step.id, result });
    } catch (error) {
      this.emit('workflowFailed', { instanceId, stepId: step.id, error });
    }
  }

  private async processStep(
    _step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    switch (_step.type) {
      case 'approval':
        return this.handleApprovalStep(_step, data);
      case 'notification':
        return this.handleNotificationStep(_step, data);
      case 'action':
        return this.handleActionStep(_step, data);
      case 'condition':
        return this.handleConditionStep(_step, data);
      default:
        throw new Error(`Unknown step type: ${_step.type}`);
    }
  }

  private async handleApprovalStep(
    _step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // In a real implementation, this would create an approval task
    // and wait for user input
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...data, approved: true });
      }, 1000);
    });
  }

  private async handleNotificationStep(
    step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // In a real implementation, this would send notifications
    // through various channels (email, SMS, push, etc.)
    console.log('Notification:', step.config.message, data);
    return data;
  }

  private async handleActionStep(
    step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // In a real implementation, this would execute custom actions
    // defined in the workflow
    const actionResult = await this.executeAction(step.config.action as string, data);
    return actionResult;
  }

  private async handleConditionStep(
    step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // Evaluate condition and determine next step
    const condition = step.config.condition;
    const result = this.evaluateCondition(condition as string, data);
    return { ...data, conditionResult: result };
  }

  private async executeAction(
    action: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // Execute custom action based on action type
    switch (action) {
      case 'processDocument':
        return this.processDocument(data);
      case 'updateDatabase':
        return this.updateDatabase(data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async processDocument(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Implement document processing logic
    return { ...data, processed: true };
  }

  private async updateDatabase(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Implement database update logic
    return { ...data, updated: true };
  }

  private evaluateCondition(condition: string, data: Record<string, unknown>): boolean {
    // Implement condition evaluation logic
    try {
      return new Function('data', `return ${condition}`)(data);
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  private handleStepCompletion(event: {
    instanceId: string;
    stepId: string;
    result: Record<string, unknown>;
  }): void {
    const instance = this.runningInstances.get(event.instanceId);
    if (!instance) return;

    const workflow = this.workflows.get(instance.workflowId);
    if (!workflow) return;

    const currentStep = workflow.steps.find((s) => s.id === event.stepId);
    if (!currentStep) return;

    // Update instance data
    instance.data = event.result;

    // Find and execute next steps
    const nextSteps = workflow.steps.filter((s) =>
      currentStep.nextSteps.includes(s.id)
    );

    if (nextSteps.length === 0) {
      this.emit('workflowCompleted', {
        instanceId: event.instanceId,
        result: event.result,
      });
      return;
    }

    // Execute next steps
    nextSteps.forEach((step) => {
      this.executeStep(event.instanceId, step, event.result);
    });
  }

  private handleWorkflowCompletion(event: {
    instanceId: string;
    result: Record<string, unknown>;
  }): void {
    const instance = this.runningInstances.get(event.instanceId);
    if (!instance) return;

    instance.status = 'completed';
    console.log('Workflow completed:', event);
  }

  private handleWorkflowFailure(event: {
    instanceId: string;
    stepId: string;
    error: Error;
  }): void {
    const instance = this.runningInstances.get(event.instanceId);
    if (!instance) return;

    instance.status = 'failed';
    console.error('Workflow failed:', event);
  }

  getWorkflowStatus(instanceId: string): {
    status: 'running' | 'completed' | 'failed';
    data: Record<string, unknown>;
  } | null {
    const instance = this.runningInstances.get(instanceId);
    if (!instance) return null;

    return {
      status: instance.status,
      data: instance.data,
    };
  }

  listWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  updateWorkflow(id: string, updates: Partial<Workflow>): boolean {
    const workflow = this.workflows.get(id);
    if (!workflow) return false;

    this.workflows.set(id, {
      ...workflow,
      ...updates,
      updatedAt: Date.now(),
    });

    return true;
  }

  deleteWorkflow(id: string): boolean {
    return this.workflows.delete(id);
  }
} 