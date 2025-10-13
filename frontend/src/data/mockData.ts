// Mock Data for Y Combinator Demo
export const MOCK_DATA = {
  // Dashboard Metrics
  dashboard: {
    totalMessages: 15420,
    activeChatbots: 8,
    responseTime: 1.2,
    revenue: 12500,
    conversions: 234,
    userSatisfaction: 4.8,
    uptime: 99.9,
    costSavings: 60
  },

  // Chatbots
  chatbots: [
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Handles customer inquiries 24/7',
      status: 'Active',
      isActive: true,
      icon: '',
      language: 'English',
      llmModel: 'gpt-3.5-turbo',
      messagesToday: 245,
      totalMessages: 3420,
      lastActive: '2025-01-15T10:30:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      metrics: {
        totalMessages: 3420,
        avgResponseTime: 1.2,
        satisfaction: 4.8,
        uptime: 99.9
      }
    },
    {
      id: '2',
      name: 'Sales Assistant',
      description: 'Helps with sales and conversions',
      status: 'Active',
      isActive: true,
      icon: '💬',
      language: 'English',
      llmModel: 'gpt-4',
      messagesToday: 189,
      totalMessages: 2890,
      lastActive: '2025-01-15T10:25:00Z',
      createdAt: '2025-01-02T00:00:00Z',
      metrics: {
        totalMessages: 2890,
        avgResponseTime: 0.8,
        satisfaction: 4.9,
        uptime: 99.8
      }
    },
    {
      id: '3',
      name: 'Technical Support',
      description: 'Technical assistance and troubleshooting',
      status: 'Inactive',
      isActive: false,
      icon: '',
      language: 'English',
      llmModel: 'gpt-3.5-turbo',
      messagesToday: 0,
      totalMessages: 0,
      lastActive: '2025-01-15T09:15:00Z',
      createdAt: '2025-01-10T00:00:00Z',
      metrics: {
        totalMessages: 0,
        avgResponseTime: 0,
        satisfaction: 0,
        uptime: 0
      }
    }
  ],

  // FAQs
  faqs: [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Security > Reset Password and follow the instructions.',
      category: 'account',
      tags: ['account', 'password', 'security'],
      status: 'published',
      views: 1250,
      helpful: 89,
      searches: 340,
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      question: 'How do I integrate with WhatsApp?',
      answer: 'Go to Integrations > WhatsApp and follow the setup guide. You\'ll need your WhatsApp Business API credentials.',
      category: 'technical',
      tags: ['technical', 'integration', 'whatsapp'],
      status: 'published',
      views: 890,
      helpful: 76,
      searches: 210,
      createdAt: '2025-01-02T00:00:00Z'
    },
    {
      id: '3',
      question: 'What AI models are supported?',
      answer: 'We support GPT-3.5, GPT-4, Claude, and other major AI models. You can switch between them in your chatbot settings.',
      category: 'technical',
      tags: ['technical', 'ai', 'models'],
      status: 'published',
      views: 2100,
      helpful: 95,
      searches: 450,
      createdAt: '2025-01-03T00:00:00Z'
    },
    {
      id: '4',
      question: 'How much does it cost?',
      answer: 'Our pricing starts at $29/month for basic features. Enterprise plans are available with custom pricing.',
      category: 'billing',
      tags: ['billing', 'pricing', 'cost'],
      status: 'published',
      views: 3200,
      helpful: 88,
      searches: 680,
      createdAt: '2025-01-04T00:00:00Z'
    }
  ],

  // Workflows
  workflows: [
    {
      id: '1',
      name: 'Customer Onboarding',
      description: 'Automated customer onboarding workflow',
      status: 'active',
      triggers: ['new_customer', 'signup'],
      actions: ['send_welcome_email', 'create_account', 'assign_support_agent'],
      lastRun: '2025-01-15T10:30:00Z',
      totalRuns: 245,
      successRate: 98.5
    },
    {
      id: '2',
      name: 'Support Ticket Routing',
      description: 'Route support tickets to appropriate agents',
      status: 'active',
      triggers: ['new_ticket', 'urgent_ticket'],
      actions: ['categorize_ticket', 'assign_agent', 'send_notification'],
      lastRun: '2025-01-15T10:25:00Z',
      totalRuns: 189,
      successRate: 96.2
    },
    {
      id: '3',
      name: 'Payment Processing',
      description: 'Handle payment processing and notifications',
      status: 'draft',
      triggers: ['payment_received', 'payment_failed'],
      actions: ['update_subscription', 'send_receipt', 'notify_customer'],
      lastRun: null,
      totalRuns: 0,
      successRate: 0
    },
    {
      id: '4',
      name: 'Email Marketing Campaign',
      description: 'Automated email marketing workflow',
      status: 'paused',
      triggers: ['user_signup', 'purchase_complete'],
      actions: ['send_welcome_series', 'send_product_recommendations'],
      lastRun: '2025-01-14T15:20:00Z',
      totalRuns: 156,
      successRate: 94.8
    }
  ],

  // Analytics Data
  analytics: {
    messagesOverTime: [
      { date: '2024-01-01', messages: 1200 },
      { date: '2024-01-02', messages: 1350 },
      { date: '2024-01-03', messages: 1180 },
      { date: '2024-01-04', messages: 1420 },
      { date: '2024-01-05', messages: 1580 },
      { date: '2024-01-06', messages: 1650 },
      { date: '2024-01-07', messages: 1720 }
    ],
    topChatbots: [
      { name: 'Customer Support Bot', messages: 3420, satisfaction: 4.8 },
      { name: 'Sales Assistant', messages: 2890, satisfaction: 4.6 },
      { name: 'Technical Support', messages: 2100, satisfaction: 4.7 }
    ],
    revenueData: [
      { month: 'Jan', revenue: 12500, growth: 15 },
      { month: 'Feb', revenue: 14200, growth: 18 },
      { month: 'Mar', revenue: 16800, growth: 22 }
    ]
  },

  // User Profile
  user: {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    avatar: '/avatars/alice.jpg',
    company: 'TechCorp Inc.',
    plan: 'enterprise',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Recent Activities
  activities: [
    {
      id: '1',
      type: 'chatbot_created',
      title: 'New Chatbot Created',
      description: 'Created new chatbot "Technical Support"',
      timestamp: '2025-01-15T10:30:00Z',
      user: 'Alice Johnson'
    },
    {
      id: '2',
      type: 'workflow_executed',
      title: 'FAQ Updated',
      description: 'Updated FAQ "How do I reset my password?"',
      timestamp: '2025-01-15T09:45:00Z',
      user: 'Alice Johnson'
    },
    {
      id: '3',
      type: 'chatbot_created',
      title: 'Integration Added',
      description: 'Added WhatsApp integration',
      timestamp: '2025-01-15T08:20:00Z',
      user: 'Alice Johnson'
    }
  ],

  // Stripe Demo Data
  stripe: {
    customerId: 'cus_demo123',
    subscriptionId: 'sub_demo123',
    plan: 'enterprise',
    status: 'active',
    currentPeriodEnd: '2024-02-15T00:00:00Z',
    amount: 29900, // $299.00 in cents
    currency: 'usd'
  },

  // Shopify Demo Data
  shopify: {
    shopDomain: 'demo-store.myshopify.com',
    shopName: 'AI Demo Store',
    products: [
      {
        id: '1',
        title: 'AI Chatbot Starter Kit',
        price: 99.99,
        inventory: 50,
        status: 'active'
      },
      {
        id: '2',
        title: 'Advanced AI Integration',
        price: 299.99,
        inventory: 25,
        status: 'active'
      }
    ],
    orders: [
      {
        id: '1',
        orderNumber: '#1001',
        customerEmail: 'customer@example.com',
        total: 99.99,
        status: 'fulfilled',
        createdAt: '2025-01-15T10:00:00Z'
      }
    ]
  },

  // Payments Demo Data
  payments: [
    {
      id: 1,
      description: 'Professional Plan Subscription',
      customer: 'John Doe',
      amount: 499,
      date: '2025-01-15T10:30:00Z',
      status: 'completed',
      method: 'credit_card'
    },
    {
      id: 2,
      description: 'Enterprise Plan Upgrade',
      customer: 'Jane Smith',
      amount: 999,
      date: '2025-01-14T15:45:00Z',
      status: 'completed',
      method: 'paypal'
    },
    {
      id: 3,
      description: 'Starter Plan Subscription',
      customer: 'Mike Johnson',
      amount: 199,
      date: '2025-01-13T09:20:00Z',
      status: 'pending',
      method: 'bank_transfer'
    },
    {
      id: 4,
      description: 'Professional Plan Subscription',
      customer: 'Sarah Wilson',
      amount: 499,
      date: '2025-01-12T14:15:00Z',
      status: 'completed',
      method: 'credit_card'
    },
    {
      id: 5,
      description: 'Enterprise Plan Subscription',
      customer: 'David Brown',
      amount: 999,
      date: '2025-01-11T11:30:00Z',
      status: 'completed',
      method: 'credit_card'
    }
  ],

  // Settings Demo Data
  settings: {
    profile: {
      firstName: 'Y Combinator',
      lastName: 'Accelerator',
      email: 'founder@ycombinator.com',
      phone: '+1 650 123 4567',
      timezone: 'America/Los_Angeles',
      language: 'en'
    },
    mfa: {
      enabled: false
    },
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    billing: {
      plan: 'enterprise',
      amount: 999,
      nextBilling: '2025-02-15T00:00:00Z'
    }
  }
};

// Mock API responses
export const MOCK_API_RESPONSES = {
  dashboard: () => Promise.resolve({ data: MOCK_DATA.dashboard }),
  chatbots: () => Promise.resolve({ data: MOCK_DATA.chatbots }),
  faqs: () => Promise.resolve({ data: MOCK_DATA.faqs }),
  analytics: () => Promise.resolve({ data: MOCK_DATA.analytics }),
  user: () => Promise.resolve({ data: MOCK_DATA.user }),
  activities: () => Promise.resolve({ data: MOCK_DATA.activities }),
  stripe: () => Promise.resolve({ data: MOCK_DATA.stripe }),
  shopify: () => Promise.resolve({ data: MOCK_DATA.shopify }),
  payments: () => Promise.resolve({ data: MOCK_DATA.payments }),
  settings: () => Promise.resolve({ data: MOCK_DATA.settings })
};
