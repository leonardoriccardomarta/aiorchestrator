import { apiRequest } from './api';

// Core analytics data retrieval
export const getAnalyticsDashboard = async () => {
  try {
    const response = await apiRequest('/api/analytics/dashboard');
    return response.data || generateMockAnalyticsData();
  } catch (error) {
    console.warn('Analytics API not available, using mock data:', error.message);
    return generateMockAnalyticsData();
  }
};

// User interaction analytics
export const getUserInteractions = async (timeRange = '7d') => {
  try {
    const response = await apiRequest(`/api/analytics/interactions?range=${timeRange}`);
    return response.data || generateMockInteractionData();
  } catch (error) {
    console.warn('User interactions API not available, using mock data:', error.message);
    return generateMockInteractionData();
  }
};

// Escalation rates analytics
export const getEscalationRates = async (timeRange = '7d') => {
  try {
    const response = await apiRequest(`/api/analytics/escalations?range=${timeRange}`);
    return response.data || generateMockEscalationData();
  } catch (error) {
    console.warn('Escalation rates API not available, using mock data:', error.message);
    return generateMockEscalationData();
  }
};

// Service performance analytics
export const getServicePerformance = async (timeRange = '7d') => {
  try {
    const response = await apiRequest(`/api/analytics/performance?range=${timeRange}`);
    return response.data || generateMockPerformanceData();
  } catch (error) {
    console.warn('Service performance API not available, using mock data:', error.message);
    return generateMockPerformanceData();
  }
};

// Chatbot-specific analytics
export const getChatbotAnalytics = async (chatbotId, timeRange = '7d') => {
  try {
    const response = await apiRequest(`/api/analytics/chatbot/${chatbotId}?range=${timeRange}`);
    return response.data || generateMockChatbotData(chatbotId);
  } catch (error) {
    console.warn('Chatbot analytics API not available, using mock data:', error.message);
    return generateMockChatbotData(chatbotId);
  }
};

// Channel analytics
export const getChannelAnalytics = async (channelType, timeRange = '7d') => {
  try {
    const response = await apiRequest(`/api/analytics/channel/${channelType}?range=${timeRange}`);
    return response.data || generateMockChannelData(channelType);
  } catch (error) {
    console.warn('Channel analytics API not available, using mock data:', error.message);
    return generateMockChannelData(channelType);
  }
};

// Real-time analytics
export const getRealTimeStats = async () => {
  try {
    const response = await apiRequest('/api/analytics/realtime');
    return response.data || generateMockRealTimeData();
  } catch (error) {
    console.warn('Real-time analytics API not available, using mock data:', error.message);
    return generateMockRealTimeData();
  }
};

// Export analytics data
export const exportAnalyticsData = async (options = {}) => {
  try {
    const { format = 'csv', timeRange = '30d', includeDetails = false } = options;
    const response = await apiRequest(`/api/analytics/export?format=${format}&range=${timeRange}&details=${includeDetails}`);
    return response.data || generateMockExportData(options);
  } catch (error) {
    console.warn('Export analytics API not available, generating mock data:', error.message);
    return generateMockExportData(options);
  }
};

// Helper function to get current user/tenant context
const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.userId,
        tenantId: payload.tenantId,
        email: payload.email
      };
    }
  } catch (error) {
    console.warn('Could not parse auth token:', error.message);
  }
  return {
    userId: 'user_' + Math.random().toString(36).substr(2, 9),
    tenantId: 'tenant_default',
    email: 'demo@example.com'
  };
};

// Mock data generators (fallback when API is not available)
const generateMockAnalyticsData = () => {
  const user = getCurrentUser();
  const now = new Date();
  
  return {
    timeRange: '7d',
    totalRevenue: 34567 + Math.floor(Math.random() * 10000),
    totalConversations: 2856 + Math.floor(Math.random() * 1000),
    averageResponseTime: 2.3 + Math.random() * 1.5,
    overallSatisfaction: 92.5 + Math.random() * 5,
    chatbots: [
      {
        id: 'bot_1',
        name: 'Customer Support Bot',
        totalConversations: 1245,
        activeUsers: 856,
        responseTime: 2.1,
        satisfactionRate: 94.2,
        conversionRate: 18.5,
        revenue: 15670,
        messagesPerConversation: 6.2,
        resolutionRate: 89.7
      },
      {
        id: 'bot_2',
        name: 'Sales Assistant',
        totalConversations: 923,
        activeUsers: 642,
        responseTime: 1.8,
        satisfactionRate: 91.8,
        conversionRate: 24.3,
        revenue: 12890,
        messagesPerConversation: 7.1,
        resolutionRate: 92.1
      },
      {
        id: 'bot_3',
        name: 'FAQ Helper',
        totalConversations: 688,
        activeUsers: 421,
        responseTime: 1.2,
        satisfactionRate: 96.1,
        conversionRate: 12.7,
        revenue: 6007,
        messagesPerConversation: 4.8,
        resolutionRate: 95.3
      }
    ],
    trends: {
      conversations: generateTrendData(7, 200, 600),
      revenue: generateTrendData(7, 1000, 3000),
      satisfaction: generateTrendData(7, 85, 98),
      responseTime: generateTrendData(7, 1.5, 3.2)
    },
    userInfo: user,
    lastUpdated: now.toISOString()
  };
};

const generateMockInteractionData = () => {
  return {
    totalInteractions: 15432,
    uniqueUsers: 8765,
    averageSessionLength: 8.5,
    bounceRate: 12.3,
    interactions: generateTrendData(30, 300, 800),
    topPages: [
      { page: '/support', interactions: 3421, conversionRate: 18.5 },
      { page: '/pricing', interactions: 2567, conversionRate: 24.3 },
      { page: '/features', interactions: 1892, conversionRate: 12.7 },
      { page: '/contact', interactions: 1445, conversionRate: 34.2 }
    ]
  };
};

const generateMockEscalationData = () => {
  return {
    totalEscalations: 245,
    escalationRate: 8.7,
    averageResolutionTime: 24.5,
    escalations: generateTrendData(30, 5, 15),
    reasons: [
      { reason: 'Complex Query', count: 89, percentage: 36.3 },
      { reason: 'Technical Issue', count: 67, percentage: 27.3 },
      { reason: 'Billing Problem', count: 45, percentage: 18.4 },
      { reason: 'Product Information', count: 32, percentage: 13.1 },
      { reason: 'Other', count: 12, percentage: 4.9 }
    ]
  };
};

const generateMockPerformanceData = () => {
  return {
    uptime: 99.8,
    averageResponseTime: 450,
    errorRate: 0.12,
    throughput: 1250,
    performance: generateTrendData(24, 400, 600, 'hourly'),
    errors: generateTrendData(24, 0, 5, 'hourly'),
    systemHealth: {
      cpu: 45.2,
      memory: 67.8,
      disk: 23.4,
      network: 156.7
    }
  };
};

const generateMockChatbotData = (chatbotId) => {
  const botNames = {
    'bot_1': 'Customer Support Bot',
    'bot_2': 'Sales Assistant',
    'bot_3': 'FAQ Helper'
  };
  
  return {
    id: chatbotId,
    name: botNames[chatbotId] || 'Custom Chatbot',
    conversations: generateTrendData(30, 20, 100),
    messages: generateTrendData(30, 100, 500),
    users: generateTrendData(30, 15, 80),
    satisfaction: generateTrendData(30, 85, 98),
    topIntents: [
      { intent: 'greeting', count: 567, confidence: 98.5 },
      { intent: 'pricing', count: 423, confidence: 94.2 },
      { intent: 'support', count: 356, confidence: 91.7 },
      { intent: 'features', count: 234, confidence: 89.3 }
    ],
    channels: [
      { channel: 'website', count: 456, percentage: 45.6 },
      { channel: 'whatsapp', count: 234, percentage: 23.4 },
      { channel: 'messenger', count: 189, percentage: 18.9 },
      { channel: 'telegram', count: 121, percentage: 12.1 }
    ]
  };
};

const generateMockChannelData = (channelType) => {
  return {
    channel: channelType,
    totalMessages: 2345 + Math.floor(Math.random() * 1000),
    activeUsers: 1567 + Math.floor(Math.random() * 500),
    responseRate: 87.5 + Math.random() * 10,
    averageResponseTime: 2.1 + Math.random() * 2,
    messages: generateTrendData(30, 50, 150),
    users: generateTrendData(30, 30, 100),
    satisfaction: generateTrendData(30, 80, 95)
  };
};

const generateMockRealTimeData = () => {
  return {
    activeUsers: 234 + Math.floor(Math.random() * 100),
    ongoingConversations: 67 + Math.floor(Math.random() * 50),
    responseTime: 1.8 + Math.random() * 1,
    messagesPerMinute: 45 + Math.floor(Math.random() * 30),
    systemStatus: 'healthy',
    lastUpdated: new Date().toISOString()
  };
};

const generateMockExportData = (options) => {
  const { format, timeRange } = options;
  return {
    downloadUrl: `/api/analytics/export/download/${Date.now()}.${format}`,
    fileName: `analytics_${timeRange}_${Date.now()}.${format}`,
    size: '2.5 MB',
    recordCount: 15432,
    generatedAt: new Date().toISOString()
  };
};

// Helper function to generate trend data
const generateTrendData = (days, min, max, frequency = 'daily') => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const value = min + Math.random() * (max - min);
    
    data.push({
      date: frequency === 'hourly' ? date.toISOString() : date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      label: frequency === 'hourly' ? 
        date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};
