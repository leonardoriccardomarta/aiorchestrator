import { AIService } from './AIService.ts';
import { AnalyticsService } from './AnalyticsService.ts';
import { CollaborationService } from './CollaborationService.ts';
import { SecurityService } from './SecurityService.ts';
import { WorkflowService } from './WorkflowService.ts';

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, unknown>;

  private constructor() {
    this.services = new Map();
    this.initializeServices();
  }

  private async initializeServices(): Promise<void> {
    // Initialize AI Service
    const aiService = new AIService(process.env.OPENAI_API_KEY || '');
    this.services.set('ai', aiService);

    // Initialize Analytics Service
    const analyticsService = new AnalyticsService(
      process.env.MIXPANEL_TOKEN || '',
      process.env.POSTHOG_TOKEN || ''
    );
    this.services.set('analytics', analyticsService);

    // Initialize Security Service
    const securityService = new SecurityService();
    this.services.set('security', securityService);

    // Initialize Workflow Service
    const workflowService = new WorkflowService();
    this.services.set('workflow', workflowService);

    // Initialize Collaboration Service
    const collaborationService = new CollaborationService('default-room');
    this.services.set('collaboration', collaborationService);
  }

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  public getService<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }

  public async healthCheck(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};
    
    for (const [name, service] of this.services.entries()) {
      try {
        const typedService = service as Record<string, unknown>;
        if (typeof typedService.healthCheck === 'function') {
          health[name] = await (typedService.healthCheck as () => Promise<boolean>)();
        } else {
          health[name] = true;
        }
      } catch (error) {
        console.error(`Health check failed for ${name}:`, error);
        health[name] = false;
      }
    }

    return health;
  }

  public async shutdown(): Promise<void> {
    for (const [name, service] of this.services.entries()) {
      try {
        const typedService = service as Record<string, unknown>;
        if (typeof typedService.shutdown === 'function') {
          await (typedService.shutdown as () => Promise<void>)();
        }
      } catch (error) {
        console.error(`Error shutting down ${name}:`, error);
      }
    }
  }
} 