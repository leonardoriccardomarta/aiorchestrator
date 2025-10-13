export interface ChatbotAnalytics {
  id: string;
  name: string;
  totalConversations: number;
  activeUsers: number;
  responseTime: number;
  satisfactionRate: number;
  conversionRate: number;
  revenue: number;
  messagesPerConversation: number;
  resolutionRate: number;
  category: string;
  status: string;
  growth: number;
  topIntents: string[];
  hourlyData: Array<{
    hour: number;
    conversations: number;
    satisfaction: number;
  }>;
}

export interface AnalyticsData {
  chatbots: ChatbotAnalytics[];
  timeRange: string;
  totalRevenue: number;
  totalConversations: number;
  averageResponseTime: number;
  overallSatisfaction: number;
  weeklyData: Array<{
    day: string;
    conversations: number;
    revenue: number;
    satisfaction: number;
  }>;
  channelDistribution: Array<{
    channel: string;
    conversations: number;
    percentage: number;
  }>;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topIssues: Array<{
    issue: string;
    count: number;
    resolution: number;
  }>;
}