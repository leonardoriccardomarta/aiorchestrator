import { User, Chatbot, FAQ, Subscription, Plan, Analytics } from '@prisma/client';

// Extended types for our application
export interface UserWithTenant extends User {
  tenant?: {
    id: string;
    name: string;
    domain?: string;
  };
}

export interface ChatbotWithOwner extends Chatbot {
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface FAQWithOwner extends FAQ {
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface SubscriptionWithPlan extends Subscription {
  plan?: Plan;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface CreateChatbotRequest {
  name: string;
  description?: string;
  model?: string;
  personality?: string;
  responseStyle?: string;
  temperature?: number;
  maxTokens?: number;
  whatsappEnabled?: boolean;
  messengerEnabled?: boolean;
  telegramEnabled?: boolean;
  shopifyEnabled?: boolean;
  webhookUrl?: string;
}

export interface UpdateChatbotRequest extends Partial<CreateChatbotRequest> {
  isActive?: boolean;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  category?: string;
  tags?: string;
  order?: number;
}

export interface UpdateFAQRequest extends Partial<CreateFAQRequest> {
  isActive?: boolean;
}

export interface CreateSubscriptionRequest {
  planId: string;
  tenantId?: string;
}

// Analytics types
export interface AnalyticsData {
  totalChatbots: number;
  totalFAQs: number;
  totalMessages: number;
  avgResponseTime: number;
  satisfactionScore: number;
  monthlyActiveUsers: number;
  conversionRate: number;
  revenue: number;
  chartData?: Array<{
    date: string;
    messages: number;
    users: number;
  }>;
}

export interface RevenueAnalytics {
  monthlyRevenue: number;
  totalRevenue: number;
  growthRate: number;
  chartData: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  retentionRate: number;
  chartData: Array<{
    date: string;
    users: number;
  }>;
}

// Payment types
export interface PaymentData {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceData {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export interface PlanData {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: {
    chatbots: number;
    messages: number;
    storage: number;
  };
}

export interface UsageData {
  plan: string | null;
  usage: {
    chatbots: number;
    messages: number;
    storage: number;
  };
  limits: {
    chatbots: number;
    messages: number;
    storage: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  tenantId?: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export interface JwtPayload {
  id?: string;
  userId?: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface DashboardStats {
  totalChatbots: number;
  totalFAQs: number;
  totalMessages: number;
  avgResponseTime: number;
  satisfactionScore: number;
  monthlyActiveUsers: number;
  conversionRate: number;
  revenue: number;
}

// Chat types
export interface ChatRequest {
  message: string;
  chatbotId: string;
  context?: any;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  chatbotId: string;
  tokensUsed?: number;
  cost?: number;
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Environment types
export interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  OPENAI_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

// Re-export Prisma types
export type {
  User,
  Chatbot,
  FAQ,
  Subscription,
  Plan,
  Analytics
};
// Request context
export interface RequestContext {
  user?: UserWithTenant;
  tenantId?: string;
  ip?: string;
  userAgent?: string;
}

// Export all Prisma types
export * from '@prisma/client';
