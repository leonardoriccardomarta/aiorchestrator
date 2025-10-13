import { analyticsService } from '../analytics/AnalyticsService';

// Customer Support Types
export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_FOR_CUSTOMER = 'waiting_for_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketCategory {
  TECHNICAL = 'technical',
  BILLING = 'billing',
  FEATURE_REQUEST = 'feature_request',
  BUG_REPORT = 'bug_report',
  GENERAL = 'general',
  ONBOARDING = 'onboarding'
}

export enum SupportChannel {
  EMAIL = 'email',
  LIVE_CHAT = 'live_chat',
  PHONE = 'phone',
  TICKET = 'ticket',
  KNOWLEDGE_BASE = 'knowledge_base'
}

// Support Ticket
export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  channel: SupportChannel;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  tags: string[];
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'customer' | 'agent' | 'system';
    message: string;
    timestamp: Date;
    attachments?: Array<{
      id: string;
      name: string;
      url: string;
      size: number;
      type: string;
    }>;
  }>;
  metrics: {
    responseTime: number; // in minutes
    resolutionTime: number; // in minutes
    customerSatisfaction?: number; // 1-5 rating
    firstResponseTime: number; // in minutes
    messagesCount: number;
    reopenCount: number;
  };
}

// Live Chat Session
export interface LiveChatSession {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  agentId?: string;
  agentName?: string;
  status: 'waiting' | 'active' | 'ended' | 'transferred';
  startedAt: Date;
  endedAt?: Date;
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'customer' | 'agent' | 'system';
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  metrics: {
    waitTime: number; // in minutes
    sessionDuration: number; // in minutes
    messagesCount: number;
    customerSatisfaction?: number;
  };
}

// Knowledge Base Article
export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  updatedAt: Date;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  searchScore: number;
  relatedArticles: string[];
}

// Customer Success
export interface CustomerSuccess {
  customerId: string;
  customerName: string;
  customerEmail: string;
  healthScore: number; // 0-100
  onboardingStatus: 'not_started' | 'in_progress' | 'completed' | 'at_risk';
  lastActivity: Date;
  subscriptionTier: string;
  usageMetrics: {
    totalUsage: number;
    featureUsage: Record<string, number>;
    lastLogin: Date;
    loginFrequency: number; // logins per week
  };
  supportHistory: {
    totalTickets: number;
    resolvedTickets: number;
    averageSatisfaction: number;
    lastTicketDate?: Date;
  };
  successMetrics: {
    timeToValue: number; // days
    featureAdoption: number; // percentage
    retentionScore: number; // 0-100
    expansionPotential: number; // 0-100
  };
  nextActions: Array<{
    id: string;
    type: 'check_in' | 'training' | 'upsell' | 'support' | 'onboarding';
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
  }>;
}

// Customer Support Service
export class CustomerSupportService {
  private tickets: Map<string, SupportTicket> = new Map();
  private liveChatSessions: Map<string, LiveChatSession> = new Map();
  private knowledgeBaseArticles: Map<string, KnowledgeBaseArticle> = new Map();
  private customerSuccess: Map<string, CustomerSuccess> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (this.isInitialized) return;
    
    this.setupDefaultData();
    this.setupEventListeners();
    this.startHealthMonitoring();
    
    this.isInitialized = true;
  }

  private setupDefaultData(): void {
    this.setupDefaultTickets();
    this.setupDefaultKnowledgeBase();
    this.setupDefaultCustomerSuccess();
  }

  private setupDefaultTickets(): void {
    const defaultTickets: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>[] = [
      {
        customerId: 'customer-1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        subject: 'Cannot access chatbot dashboard',
        description: 'I\'m unable to access my chatbot dashboard after the recent update.',
        category: TicketCategory.TECHNICAL,
        priority: TicketPriority.HIGH,
        status: TicketStatus.IN_PROGRESS,
        channel: SupportChannel.EMAIL,
        assignedTo: 'agent-1',
        tags: ['dashboard', 'access', 'technical'],
        attachments: [],
        messages: [
          {
            id: 'msg-1',
            senderId: 'customer-1',
            senderName: 'John Doe',
            senderType: 'customer',
            message: 'I\'m unable to access my chatbot dashboard after the recent update.',
            timestamp: new Date(Date.now() - 3600000)
          },
          {
            id: 'msg-2',
            senderId: 'agent-1',
            senderName: 'Support Agent',
            senderType: 'agent',
            message: 'Hi John, I\'m looking into this issue for you. Can you please try clearing your browser cache and let me know if that helps?',
            timestamp: new Date(Date.now() - 1800000)
          }
        ]
      },
      {
        customerId: 'customer-2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        subject: 'Billing question about subscription',
        description: 'I have a question about my monthly subscription billing.',
        category: TicketCategory.BILLING,
        priority: TicketPriority.MEDIUM,
        status: TicketStatus.OPEN,
        channel: SupportChannel.LIVE_CHAT,
        tags: ['billing', 'subscription'],
        attachments: [],
        messages: [
          {
            id: 'msg-3',
            senderId: 'customer-2',
            senderName: 'Jane Smith',
            senderType: 'customer',
            message: 'I have a question about my monthly subscription billing.',
            timestamp: new Date(Date.now() - 7200000)
          }
        ]
      }
    ];

    defaultTickets.forEach((ticket, index) => {
      const ticketId = `ticket-${index + 1}`;
      const now = new Date();
      const createdAt = new Date(now.getTime() - (index + 1) * 3600000);
      
      this.tickets.set(ticketId, {
        ...ticket,
        id: ticketId,
        createdAt,
        updatedAt: now,
        metrics: {
          responseTime: index === 0 ? 30 : 0,
          resolutionTime: 0,
          firstResponseTime: index === 0 ? 30 : 0,
          messagesCount: ticket.messages.length,
          reopenCount: 0
        }
      });
    });
  }

  private setupDefaultKnowledgeBase(): void {
    const defaultArticles: Omit<KnowledgeBaseArticle, 'id' | 'updatedAt'>[] = [
      {
        title: 'Getting Started with AI Orchestrator',
        content: 'Learn how to set up your first chatbot and get started with AI Orchestrator...',
        category: 'Getting Started',
        tags: ['onboarding', 'setup', 'beginner'],
        authorId: 'admin-1',
        authorName: 'AI Orchestrator Team',
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000),
        viewCount: 1250,
        helpfulCount: 89,
        notHelpfulCount: 3,
        searchScore: 0.95,
        relatedArticles: []
      },
      {
        title: 'How to Configure Chatbot Responses',
        content: 'Learn how to configure and customize your chatbot responses...',
        category: 'Configuration',
        tags: ['chatbot', 'configuration', 'responses'],
        authorId: 'admin-1',
        authorName: 'AI Orchestrator Team',
        status: 'published',
        publishedAt: new Date(Date.now() - 172800000),
        viewCount: 890,
        helpfulCount: 67,
        notHelpfulCount: 2,
        searchScore: 0.92,
        relatedArticles: []
      },
      {
        title: 'Troubleshooting Common Issues',
        content: 'Common issues and their solutions...',
        category: 'Troubleshooting',
        tags: ['troubleshooting', 'issues', 'help'],
        authorId: 'admin-1',
        authorName: 'AI Orchestrator Team',
        status: 'published',
        publishedAt: new Date(Date.now() - 259200000),
        viewCount: 2100,
        helpfulCount: 156,
        notHelpfulCount: 8,
        searchScore: 0.88,
        relatedArticles: []
      }
    ];

    defaultArticles.forEach((article, index) => {
      const articleId = `article-${index + 1}`;
      this.knowledgeBaseArticles.set(articleId, {
        ...article,
        id: articleId,
        updatedAt: new Date()
      });
    });
  }

  private setupDefaultCustomerSuccess(): void {
    const defaultCustomers: Omit<CustomerSuccess, 'lastActivity'>[] = [
      {
        customerId: 'customer-1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        healthScore: 85,
        onboardingStatus: 'completed',
        subscriptionTier: 'pro',
        usageMetrics: {
          totalUsage: 150,
          featureUsage: {
            'chatbot': 45,
            'analytics': 30,
            'integrations': 25,
            'customization': 50
          },
          lastLogin: new Date(Date.now() - 86400000),
          loginFrequency: 5
        },
        supportHistory: {
          totalTickets: 3,
          resolvedTickets: 3,
          averageSatisfaction: 4.5,
          lastTicketDate: new Date(Date.now() - 3600000)
        },
        successMetrics: {
          timeToValue: 7,
          featureAdoption: 75,
          retentionScore: 90,
          expansionPotential: 80
        },
        nextActions: [
          {
            id: 'action-1',
            type: 'check_in',
            title: 'Monthly Check-in',
            description: 'Schedule monthly check-in call',
            dueDate: new Date(Date.now() + 604800000),
            completed: false
          }
        ]
      },
      {
        customerId: 'customer-2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        healthScore: 65,
        onboardingStatus: 'in_progress',
        subscriptionTier: 'basic',
        usageMetrics: {
          totalUsage: 45,
          featureUsage: {
            'chatbot': 20,
            'analytics': 15,
            'integrations': 10
          },
          lastLogin: new Date(Date.now() - 172800000),
          loginFrequency: 2
        },
        supportHistory: {
          totalTickets: 1,
          resolvedTickets: 0,
          averageSatisfaction: 0,
          lastTicketDate: new Date(Date.now() - 7200000)
        },
        successMetrics: {
          timeToValue: 14,
          featureAdoption: 40,
          retentionScore: 70,
          expansionPotential: 60
        },
        nextActions: [
          {
            id: 'action-2',
            type: 'onboarding',
            title: 'Complete Onboarding',
            description: 'Help customer complete onboarding process',
            dueDate: new Date(Date.now() + 259200000),
            completed: false
          }
        ]
      }
    ];

    defaultCustomers.forEach(customer => {
      this.customerSuccess.set(customer.customerId, {
        ...customer,
        lastActivity: new Date()
      });
    });
  }

  private setupEventListeners(): void {
    // Listen for customer interactions
    document.addEventListener('support-ticket-created', (event: any) => {
      this.handleTicketCreated(event.detail);
    });

    document.addEventListener('live-chat-started', (event: any) => {
      this.handleLiveChatStarted(event.detail);
    });

    document.addEventListener('knowledge-base-viewed', (event: any) => {
      this.handleKnowledgeBaseViewed(event.detail);
    });
  }

  private startHealthMonitoring(): void {
    // Monitor customer health scores
    setInterval(() => {
      this.updateCustomerHealthScores();
    }, 3600000); // Every hour

    // Monitor support metrics
    setInterval(() => {
      this.updateSupportMetrics();
    }, 1800000); // Every 30 minutes
  }

  private handleTicketCreated(ticketData: any): void {
    analyticsService.track('support_ticket_created', {
      ticketId: ticketData.id,
      category: ticketData.category,
      priority: ticketData.priority,
      channel: ticketData.channel
    });
  }

  private handleLiveChatStarted(chatData: any): void {
    analyticsService.track('live_chat_started', {
      sessionId: chatData.id,
      customerId: chatData.customerId
    });
  }

  private handleKnowledgeBaseViewed(articleData: any): void {
    analyticsService.track('knowledge_base_viewed', {
      articleId: articleData.id,
      category: articleData.category
    });
  }

  private updateCustomerHealthScores(): void {
    this.customerSuccess.forEach((customer, customerId) => {
      const newHealthScore = this.calculateHealthScore(customer);
      if (newHealthScore !== customer.healthScore) {
        this.customerSuccess.set(customerId, {
          ...customer,
          healthScore: newHealthScore
        });
      }
    });
  }

  private calculateHealthScore(customer: CustomerSuccess): number {
    let score = 100;

    // Deduct points for low usage
    if (customer.usageMetrics.loginFrequency < 3) score -= 15;
    if (customer.usageMetrics.totalUsage < 50) score -= 10;

    // Deduct points for support issues
    if (customer.supportHistory.totalTickets > 5) score -= 10;
    if (customer.supportHistory.averageSatisfaction < 3) score -= 20;

    // Deduct points for onboarding issues
    if (customer.onboardingStatus === 'at_risk') score -= 25;
    if (customer.onboardingStatus === 'not_started') score -= 30;

    // Add points for good metrics
    if (customer.successMetrics.featureAdoption > 70) score += 10;
    if (customer.successMetrics.retentionScore > 80) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private updateSupportMetrics(): void {
    // Update response times and resolution times
    this.tickets.forEach((ticket, ticketId) => {
      if (ticket.status === TicketStatus.OPEN || ticket.status === TicketStatus.IN_PROGRESS) {
        const responseTime = this.calculateResponseTime(ticket);
        const resolutionTime = this.calculateResolutionTime(ticket);
        
        this.tickets.set(ticketId, {
          ...ticket,
          metrics: {
            ...ticket.metrics,
            responseTime,
            resolutionTime
          }
        });
      }
    });
  }

  private calculateResponseTime(ticket: SupportTicket): number {
    if (ticket.messages.length < 2) return 0;
    
    const firstCustomerMessage = ticket.messages[0];
    const firstAgentMessage = ticket.messages.find(msg => msg.senderType === 'agent');
    
    if (!firstAgentMessage) return 0;
    
    return Math.floor((firstAgentMessage.timestamp.getTime() - firstCustomerMessage.timestamp.getTime()) / 60000);
  }

  private calculateResolutionTime(ticket: SupportTicket): number {
    if (ticket.status !== TicketStatus.RESOLVED && ticket.status !== TicketStatus.CLOSED) return 0;
    
    return Math.floor((ticket.resolvedAt!.getTime() - ticket.createdAt.getTime()) / 60000);
  }

  // Public Methods

  public createTicket(ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'metrics' | 'messages'>): SupportTicket {
    const ticketId = this.generateId();
    const now = new Date();
    
    const ticket: SupportTicket = {
      ...ticketData,
      id: ticketId,
      createdAt: now,
      updatedAt: now,
      messages: [{
        id: this.generateId(),
        senderId: ticketData.customerId,
        senderName: ticketData.customerName,
        senderType: 'customer',
        message: ticketData.description,
        timestamp: now
      }],
      metrics: {
        responseTime: 0,
        resolutionTime: 0,
        firstResponseTime: 0,
        messagesCount: 1,
        reopenCount: 0
      }
    };

    this.tickets.set(ticketId, ticket);
    
    // Track analytics
    analyticsService.track('support_ticket_created', {
      ticketId,
      category: ticket.category,
      priority: ticket.priority,
      channel: ticket.channel
    });

    return ticket;
  }

  public getTicket(ticketId: string): SupportTicket | null {
    return this.tickets.get(ticketId) || null;
  }

  public getTickets(filters?: {
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    assignedTo?: string;
  }): SupportTicket[] {
    let tickets = Array.from(this.tickets.values());

    if (filters) {
      if (filters.status) {
        tickets = tickets.filter(ticket => ticket.status === filters.status);
      }
      if (filters.priority) {
        tickets = tickets.filter(ticket => ticket.priority === filters.priority);
      }
      if (filters.category) {
        tickets = tickets.filter(ticket => ticket.category === filters.category);
      }
      if (filters.assignedTo) {
        tickets = tickets.filter(ticket => ticket.assignedTo === filters.assignedTo);
      }
    }

    return tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public updateTicket(ticketId: string, updates: Partial<SupportTicket>): SupportTicket | null {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return null;

    const updatedTicket: SupportTicket = {
      ...ticket,
      ...updates,
      updatedAt: new Date()
    };

    this.tickets.set(ticketId, updatedTicket);
    return updatedTicket;
  }

  public addMessageToTicket(ticketId: string, message: Omit<SupportTicket['messages'][0], 'id' | 'timestamp'>): boolean {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return false;

    const newMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date()
    };

    const updatedTicket: SupportTicket = {
      ...ticket,
      messages: [...ticket.messages, newMessage],
      updatedAt: new Date(),
      metrics: {
        ...ticket.metrics,
        messagesCount: ticket.messages.length + 1
      }
    };

    this.tickets.set(ticketId, updatedTicket);
    return true;
  }

  public createLiveChatSession(sessionData: Omit<LiveChatSession, 'id' | 'startedAt' | 'status' | 'messages' | 'metrics'>): LiveChatSession {
    const sessionId = this.generateId();
    const now = new Date();
    
    const session: LiveChatSession = {
      ...sessionData,
      id: sessionId,
      startedAt: now,
      status: 'waiting',
      messages: [],
      metrics: {
        waitTime: 0,
        sessionDuration: 0,
        messagesCount: 0
      }
    };

    this.liveChatSessions.set(sessionId, session);
    
    analyticsService.track('live_chat_started', {
      sessionId,
      customerId: sessionData.customerId
    });

    return session;
  }

  public getLiveChatSession(sessionId: string): LiveChatSession | null {
    return this.liveChatSessions.get(sessionId) || null;
  }

  public addMessageToLiveChat(sessionId: string, message: Omit<LiveChatSession['messages'][0], 'id' | 'timestamp' | 'read'>): boolean {
    const session = this.liveChatSessions.get(sessionId);
    if (!session) return false;

    const newMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const updatedSession: LiveChatSession = {
      ...session,
      messages: [...session.messages, newMessage],
      metrics: {
        ...session.metrics,
        messagesCount: session.messages.length + 1
      }
    };

    this.liveChatSessions.set(sessionId, updatedSession);
    return true;
  }

  public createKnowledgeBaseArticle(articleData: Omit<KnowledgeBaseArticle, 'id' | 'updatedAt' | 'viewCount' | 'helpfulCount' | 'notHelpfulCount' | 'searchScore' | 'relatedArticles'>): KnowledgeBaseArticle {
    const articleId = this.generateId();
    const now = new Date();
    
    const article: KnowledgeBaseArticle = {
      ...articleData,
      id: articleId,
      updatedAt: now,
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      searchScore: 0,
      relatedArticles: []
    };

    this.knowledgeBaseArticles.set(articleId, article);
    return article;
  }

  public getKnowledgeBaseArticle(articleId: string): KnowledgeBaseArticle | null {
    return this.knowledgeBaseArticles.get(articleId) || null;
  }

  public searchKnowledgeBase(query: string): KnowledgeBaseArticle[] {
    const articles = Array.from(this.knowledgeBaseArticles.values());
    const searchTerms = query.toLowerCase().split(' ');
    
    return articles
      .filter(article => article.status === 'published')
      .map(article => {
        const titleScore = searchTerms.filter(term => 
          article.title.toLowerCase().includes(term)
        ).length;
        const contentScore = searchTerms.filter(term => 
          article.content.toLowerCase().includes(term)
        ).length;
        const tagScore = searchTerms.filter(term => 
          article.tags.some(tag => tag.toLowerCase().includes(term))
        ).length;
        
        const totalScore = titleScore * 3 + contentScore * 2 + tagScore * 2;
        
        return { article, score: totalScore };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.article);
  }

  public getCustomerSuccess(customerId: string): CustomerSuccess | null {
    return this.customerSuccess.get(customerId) || null;
  }

  public getAllCustomerSuccess(): CustomerSuccess[] {
    return Array.from(this.customerSuccess.values());
  }

  public updateCustomerSuccess(customerId: string, updates: Partial<CustomerSuccess>): CustomerSuccess | null {
    const customer = this.customerSuccess.get(customerId);
    if (!customer) return null;

    const updatedCustomer: CustomerSuccess = {
      ...customer,
      ...updates,
      lastActivity: new Date()
    };

    this.customerSuccess.set(customerId, updatedCustomer);
    return updatedCustomer;
  }

  public getSupportAnalytics(): {
    totalTickets: number;
    openTickets: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    customerSatisfaction: number;
    totalLiveChatSessions: number;
    activeLiveChatSessions: number;
    knowledgeBaseViews: number;
    customerHealthScore: number;
  } {
    const tickets = Array.from(this.tickets.values());
    const liveChatSessions = Array.from(this.liveChatSessions.values());
    const knowledgeBaseArticles = Array.from(this.knowledgeBaseArticles.values());
    const customers = Array.from(this.customerSuccess.values());

    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS).length;
    
    const responseTimes = tickets.map(t => t.metrics.responseTime).filter(t => t > 0);
    const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;
    
    const resolutionTimes = tickets.map(t => t.metrics.resolutionTime).filter(t => t > 0);
    const averageResolutionTime = resolutionTimes.length > 0 ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length : 0;
    
    const satisfactionScores = tickets.map(t => t.metrics.customerSatisfaction).filter(s => s !== undefined);
    const customerSatisfaction = satisfactionScores.length > 0 ? satisfactionScores.reduce((a, b) => a + b!, 0) / satisfactionScores.length : 0;
    
    const totalLiveChatSessions = liveChatSessions.length;
    const activeLiveChatSessions = liveChatSessions.filter(s => s.status === 'active').length;
    
    const knowledgeBaseViews = knowledgeBaseArticles.reduce((sum, article) => sum + article.viewCount, 0);
    
    const healthScores = customers.map(c => c.healthScore);
    const customerHealthScore = healthScores.length > 0 ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length : 0;

    return {
      totalTickets,
      openTickets,
      averageResponseTime,
      averageResolutionTime,
      customerSatisfaction,
      totalLiveChatSessions,
      activeLiveChatSessions,
      knowledgeBaseViews,
      customerHealthScore
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export const customerSupportService = new CustomerSupportService();
export default customerSupportService; 