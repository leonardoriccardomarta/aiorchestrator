// Mock API service that simulates a real backend with proper authentication and multi-tenancy
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  isActive: boolean;
  isVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChatBot {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  tenantId: string;
  isActive: boolean;
  settings: {
    model: string;
    personality: string;
    responseStyle: string;
  };
  integrations: {
    whatsapp: boolean;
    messenger: boolean;
    telegram: boolean;
    shopify: boolean;
  };
  metrics: {
    totalMessages: number;
    avgResponseTime: number;
    satisfactionScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tenantId: string;
  ownerId: string;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalMessages: number;
  totalChatbots: number;
  activeUsers: number;
  responseTime: number;
}

// Mock data store
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    tenantId: 'example.com',
    isActive: true,
    isVerified: true,
    roles: ['user'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Smith',
    tenantId: 'example.com',
    isActive: true,
    isVerified: true,
    roles: ['user'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    email: 'charlie@company.com',
    firstName: 'Charlie',
    lastName: 'Brown',
    tenantId: 'company.com',
    isActive: true,
    isVerified: true,
    roles: ['user'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockChatbots: ChatBot[] = [
  {
    id: 'bot-1',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries 24/7',
    ownerId: 'user-1',
    tenantId: 'example.com',
    isActive: true,
    settings: {
      model: 'gpt-3.5-turbo',
      personality: 'helpful',
      responseStyle: 'professional'
    },
    integrations: {
      whatsapp: true,
      messenger: true,
      telegram: false,
      shopify: true
    },
    metrics: {
      totalMessages: 1247,
      avgResponseTime: 1.2,
      satisfactionScore: 4.8
    },
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-2',
    name: 'Sales Assistant',
    description: 'Helps with product recommendations',
    ownerId: 'user-1',
    tenantId: 'example.com',
    isActive: true,
    settings: {
      model: 'gpt-4',
      personality: 'friendly',
      responseStyle: 'conversational'
    },
    integrations: {
      whatsapp: false,
      messenger: true,
      telegram: true,
      shopify: true
    },
    metrics: {
      totalMessages: 856,
      avgResponseTime: 0.8,
      satisfactionScore: 4.6
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-3',
    name: 'HR Assistant',
    description: 'Internal HR support bot',
    ownerId: 'user-2',
    tenantId: 'example.com',
    isActive: true,
    settings: {
      model: 'gpt-3.5-turbo',
      personality: 'professional',
      responseStyle: 'formal'
    },
    integrations: {
      whatsapp: false,
      messenger: false,
      telegram: true,
      shopify: false
    },
    metrics: {
      totalMessages: 423,
      avgResponseTime: 1.5,
      satisfactionScore: 4.4
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-4',
    name: 'Marketing Bot',
    description: 'Handles marketing campaigns',
    ownerId: 'user-3',
    tenantId: 'company.com',
    isActive: true,
    settings: {
      model: 'gpt-4',
      personality: 'enthusiastic',
      responseStyle: 'casual'
    },
    integrations: {
      whatsapp: true,
      messenger: true,
      telegram: true,
      shopify: false
    },
    metrics: {
      totalMessages: 2156,
      avgResponseTime: 0.9,
      satisfactionScore: 4.9
    },
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What are your business hours?',
    answer: 'We are open Monday to Friday, 9 AM to 6 PM EST.',
    category: 'General',
    tenantId: 'example.com',
    ownerId: 'user-1',
    isActive: true,
    tags: ['hours', 'schedule'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-2',
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page.',
    category: 'Account',
    tenantId: 'example.com',
    ownerId: 'user-1',
    isActive: true,
    tags: ['password', 'account'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-3',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers.',
    category: 'Billing',
    tenantId: 'company.com',
    ownerId: 'user-3',
    isActive: true,
    tags: ['payment', 'billing'],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Simple password storage for demo (in real app, this would be hashed)
const mockPasswords: Record<string, string> = {
  'alice@example.com': 'TestPassword123!',
  'bob@example.com': 'TestPassword123!',
  'charlie@company.com': 'TestPassword123!'
};

// Utility functions
const generateToken = (userId: string, tenantId: string): string => {
  return btoa(`${userId}:${tenantId}:${Date.now()}`);
};

const parseToken = (token: string): { userId: string; tenantId: string } | null => {
  try {
    const decoded = atob(token);
    const [userId, tenantId] = decoded.split(':');
    return { userId, tenantId };
  } catch {
    return null;
  }
};

const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const parsed = parseToken(token);
  if (!parsed) return null;
  
  return mockUsers.find(u => u.id === parsed.userId) || null;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API class
export class MockApiService {
  // Authentication
  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    await delay(500); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || mockPasswords[email] !== password) {
      throw new Error('Invalid credentials');
    }
    
    const token = generateToken(user.id, user.tenantId);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  }
  
  static async signUp(input: { email: string; password: string; firstName: string; lastName: string }): Promise<{ token: string; user: User }> {
    await delay(500);
    
    if (mockUsers.some(u => u.email === input.email)) {
      throw new Error('Email already registered');
    }
    
    const tenantId = input.email.split('@')[1] || 'default';
    const user: User = {
      id: `user-${Date.now()}`,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      tenantId,
      isActive: true,
      isVerified: true,
      roles: ['user'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUsers.push(user);
    mockPasswords[input.email] = input.password;
    
    const token = generateToken(user.id, user.tenantId);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  }
  
  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  // Dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    await delay(300);
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const userChatbots = mockChatbots.filter(bot => 
      bot.tenantId === currentUser.tenantId && 
      bot.ownerId === currentUser.id
    );
    
    const totalMessages = userChatbots.reduce((sum, bot) => sum + bot.metrics.totalMessages, 0);
    const avgResponseTime = userChatbots.length > 0 
      ? userChatbots.reduce((sum, bot) => sum + bot.metrics.avgResponseTime, 0) / userChatbots.length 
      : 0;
    
    return {
      totalMessages,
      totalChatbots: userChatbots.length,
      activeUsers: userChatbots.filter(bot => bot.isActive).length,
      responseTime: avgResponseTime
    };
  }
  
  // Chatbots
  static async getChatbots(): Promise<ChatBot[]> {
    await delay(300);
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    return mockChatbots.filter(bot => 
      bot.tenantId === currentUser.tenantId && 
      bot.ownerId === currentUser.id
    );
  }
  
  static async getChatbot(id: string): Promise<ChatBot> {
    await delay(300);
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const chatbot = mockChatbots.find(bot => 
      bot.id === id && 
      bot.tenantId === currentUser.tenantId && 
      bot.ownerId === currentUser.id
    );
    
    if (!chatbot) throw new Error('ChatBot not found');
    return chatbot;
  }
  
  static async createChatbot(input: { name: string; description?: string }): Promise<ChatBot> {
    await delay(500);
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const chatbot: ChatBot = {
      id: `bot-${Date.now()}`,
      name: input.name,
      description: input.description,
      ownerId: currentUser.id,
      tenantId: currentUser.tenantId,
      isActive: true,
      settings: {
        model: 'gpt-3.5-turbo',
        personality: 'helpful',
        responseStyle: 'professional'
      },
      integrations: {
        whatsapp: false,
        messenger: false,
        telegram: false,
        shopify: false
      },
      metrics: {
        totalMessages: 0,
        avgResponseTime: 0,
        satisfactionScore: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockChatbots.push(chatbot);
    return chatbot;
  }
  
  // FAQs
  static async getFAQs(): Promise<FAQ[]> {
    await delay(300);
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    return mockFAQs.filter(faq => 
      faq.tenantId === currentUser.tenantId && 
      faq.ownerId === currentUser.id
    );
  }
  
  static async createFAQ(input: { question: string; answer: string; category: string; tags?: string[] }): Promise<FAQ> {
    await delay(500);
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const faq: FAQ = {
      id: `faq-${Date.now()}`,
      question: input.question,
      answer: input.answer,
      category: input.category,
      tenantId: currentUser.tenantId,
      ownerId: currentUser.id,
      isActive: true,
      tags: input.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockFAQs.push(faq);
    return faq;
  }
  
  static async updateFAQ(id: string, input: Partial<FAQ>): Promise<FAQ> {
    await delay(500);
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const faqIndex = mockFAQs.findIndex(faq => 
      faq.id === id && 
      faq.tenantId === currentUser.tenantId && 
      faq.ownerId === currentUser.id
    );
    
    if (faqIndex === -1) throw new Error('FAQ not found');
    
    const updatedFaq = {
      ...mockFAQs[faqIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    
    mockFAQs[faqIndex] = updatedFaq;
    return updatedFaq;
  }
  
  static async deleteFAQ(id: string): Promise<boolean> {
    await delay(300);
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const faqIndex = mockFAQs.findIndex(faq => 
      faq.id === id && 
      faq.tenantId === currentUser.tenantId && 
      faq.ownerId === currentUser.id
    );
    
    if (faqIndex === -1) throw new Error('FAQ not found');
    
    mockFAQs.splice(faqIndex, 1);
    return true;
  }
}