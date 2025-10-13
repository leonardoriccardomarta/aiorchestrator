export interface IMenuItem {
  text: string;
  url: string;
  icon?: string;
}

export interface ISocials {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}

export interface IFooterDetails {
  subheading: string;
  quickLinks: IMenuItem[];
  email: string;
  telephone: string;
  socials: ISocials;
}

export interface ISiteDetails {
  title: string;
  description: string;
  googleAnalyticsId?: string;
  theme: {
    primary: string;
    secondary: string;
  };
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  tenantId: string;
  roles: string[];
  lastLogin?: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
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

export interface AnalyticsMetrics {
  userEngagement: number;
  conversationQuality: number;
  botPerformance: number;
  recentEvents: Array<{
    eventName: string;
    properties: Record<string, unknown>;
    timestamp: number;
  }>;
}

export interface ConversationTrend {
  date: string;
  total: number;
  automated: number;
  escalated: number;
}

export interface UserEngagement {
  byChannel: Array<{
    name: string;
    value: number;
  }>;
  sessionDuration: Array<{
    range: string;
    count: number;
  }>;
}

export interface BotPerformance {
  responseTime: Array<{
    range: string;
    count: number;
  }>;
  resolutionRate: Array<{
    category: string;
    value: number;
    color?: string;
  }>;
}
