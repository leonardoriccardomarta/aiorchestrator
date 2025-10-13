import { WorkflowService, Workflow, WorkflowStep } from '../services/WorkflowService';
import { ServiceRegistry } from '../services/ServiceRegistry';
import { AnalyticsService } from '../services/AnalyticsService';
import { SecurityService, UserRole } from '../services/SecurityService';
import { AIService } from '../services/AIService';

export class CustomerSupportWorkflow {
  private registry: ServiceRegistry;

  constructor() {
    this.registry = ServiceRegistry.getInstance();
  }

  async createSupportWorkflow(): Promise<string> {
    const workflowService = this.registry.getService<WorkflowService>('workflow');
    const workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'AI-Powered Customer Support',
      description: 'Automated customer support workflow with AI assistance and team collaboration',
      trigger: {
        type: 'event',
        config: {
          eventType: 'newSupportRequest',
        },
      },
      status: 'active',
      steps: this.defineSupportSteps(),
    };

    return workflowService.createWorkflow(workflow);
  }

  private defineSupportSteps(): WorkflowStep[] {
    return [
      {
        id: 'initial-ai-analysis',
        name: 'AI Analysis',
        type: 'action',
        config: {
          action: 'analyzeRequest',
          handler: this.handleAIAnalysis.bind(this),
        },
        nextSteps: ['categorize-request'],
      },
      {
        id: 'categorize-request',
        name: 'Categorize Request',
        type: 'condition',
        config: {
          condition: 'data.priority === "high"',
          handler: this.handleCategorization.bind(this),
        },
        nextSteps: ['assign-support-agent', 'automated-response'],
      },
      {
        id: 'automated-response',
        name: 'Automated Response',
        type: 'action',
        config: {
          action: 'generateResponse',
          handler: this.handleAutomatedResponse.bind(this),
        },
        nextSteps: ['track-satisfaction'],
      },
      {
        id: 'assign-support-agent',
        name: 'Assign Support Agent',
        type: 'action',
        config: {
          action: 'assignAgent',
          handler: this.handleAgentAssignment.bind(this),
        },
        nextSteps: ['create-collaboration-room'],
      },
      {
        id: 'create-collaboration-room',
        name: 'Create Collaboration Room',
        type: 'action',
        config: {
          action: 'createRoom',
          handler: this.handleCollaborationRoom.bind(this),
        },
        nextSteps: ['track-satisfaction'],
      },
      {
        id: 'track-satisfaction',
        name: 'Track Customer Satisfaction',
        type: 'action',
        config: {
          action: 'trackMetrics',
          handler: this.handleSatisfactionTracking.bind(this),
        },
        nextSteps: [],
      },
    ];
  }

  private async handleAIAnalysis(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const aiService = this.registry.getService<AIService>('ai');
    const securityService = this.registry.getService<SecurityService>('security');

    // Check permissions
    if (!securityService.hasPermission(UserRole.SUPPORT, 'read', 'customer-data')) {
      throw new Error('Permission denied');
    }

    // Type guard for customerMessage
    const customerMessage = typeof data.customerMessage === 'string' ? data.customerMessage : '';
    // Analyze request using AI
    const analysis = await aiService.analyzeConversation([customerMessage]);
    
    // Generate tags
    const tags = await aiService.generateTags(customerMessage);

    return {
      ...data,
      analysis,
      tags,
      priority: analysis.sentiment === 'negative' ? 'high' : 'normal',
    };
  }

  private async handleCategorization(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const analyticsService = this.registry.getService<AnalyticsService>('analytics');

    // Type guards
    const priority = typeof data.priority === 'string' ? data.priority : '';
    const analysis = typeof data.analysis === 'object' && data.analysis !== null ? data.analysis as { sentiment: string } : { sentiment: '' };
    const tags = Array.isArray(data.tags) ? data.tags : [];

    // Track categorization event
    analyticsService.trackEvent('support_request_categorized', {
      priority,
      sentiment: analysis.sentiment,
      tags,
    });

    return data;
  }

  private async handleAutomatedResponse(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const aiService = this.registry.getService<AIService>('ai');
    const securityService = this.registry.getService<SecurityService>('security');

    // Type guard for customerMessage
    const customerMessage = typeof data.customerMessage === 'string' ? data.customerMessage : '';
    // Generate AI response
    const response = await aiService.generateSuggestions(
      `Please provide a helpful response to this customer inquiry: ${customerMessage}`
    );

    // Encrypt sensitive data
    const encryptedResponse = await securityService.encryptMessage(
      response,
      process.env.ENCRYPTION_KEY || 'default-key'
    );

    return {
      ...data,
      automatedResponse: response,
      encryptedResponse,
    };
  }

  private async handleAgentAssignment(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const analyticsService = this.registry.getService<AnalyticsService>('analytics');

    // Type guard for tags
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const priority = typeof data.priority === 'string' ? data.priority : '';
    // In a real implementation, this would use an algorithm to find the best agent
    const assignedAgent = {
      id: 'agent-123',
      name: 'John Doe',
      expertise: tags,
    };

    analyticsService.trackEvent('agent_assigned', {
      agentId: assignedAgent.id,
      requestPriority: priority,
      tags,
    });

    return {
      ...data,
      assignedAgent,
    };
  }

  private async handleCollaborationRoom(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const securityService = this.registry.getService<SecurityService>('security');

    // Type guard for assignedAgent
    const assignedAgent = typeof data.assignedAgent === 'object' && data.assignedAgent !== null ? data.assignedAgent as { id: string } : { id: '' };
    // Create a secure collaboration room
    const roomId = `support-${Date.now()}`;

    // Log collaboration room creation
    securityService.logAudit(
      assignedAgent.id,
      'create',
      `collaboration-room-${roomId}`,
      true
    );

    return {
      ...data,
      collaborationRoomId: roomId,
    };
  }

  private async handleSatisfactionTracking(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const analyticsService = this.registry.getService<AnalyticsService>('analytics');

    // Type guards
    const requestId = typeof data.requestId === 'string' ? data.requestId : '';
    const createdAt = typeof data.createdAt === 'number' ? data.createdAt : Date.now();
    const priority = typeof data.priority === 'string' ? data.priority : '';
    const assignedAgent = typeof data.assignedAgent === 'object' && data.assignedAgent !== null ? data.assignedAgent as { id?: string } : {};
    const tags = Array.isArray(data.tags) ? data.tags : [];

    // Track metrics
    analyticsService.trackEvent('support_request_completed', {
      requestId,
      duration: Date.now() - createdAt,
      priority,
      agentId: assignedAgent.id,
      automated: !assignedAgent.id,
      tags,
    });

    return data;
  }
} 