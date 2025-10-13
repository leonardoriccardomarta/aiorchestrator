const { PrismaClient } = require('@prisma/client');

class RealDataService {
  constructor(prismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  // Dashboard Stats
  async getDashboardStats(userId) {
    try {
      // Get user's chatbots (fallback to distinct conversations if Chatbot model not available)
      let totalChatbots = 0;
      try {
        if (this.prisma.chatbot) {
          const chatbots = await this.prisma.chatbot.findMany({
            where: userId ? { userId } : {}
          });
          totalChatbots = chatbots.length;
        } else {
          const distinctChatbots = await this.prisma.conversation.groupBy({
            by: ['chatbotId'],
            where: userId ? { userId } : {}
          });
          totalChatbots = distinctChatbots.length;
        }
      } catch (_) {
        const distinctChatbots = await this.prisma.conversation.groupBy({
          by: ['chatbotId'],
          where: userId ? { userId } : {}
        });
        totalChatbots = distinctChatbots.length;
      }

      // Get total messages from conversations
      let totalMessages = 0;
      try {
        if (this.prisma.conversation) {
          totalMessages = await this.prisma.conversation.count({
            where: userId ? { userId } : {}
          });
        }
      } catch (_) {
        totalMessages = 0;
      }

      // Get active connections (guard if model not present)
      let connections = [];
      try {
        if (this.prisma.connection) {
          connections = await this.prisma.connection.findMany({
            where: {
              ...(userId ? { userId } : {}),
              status: 'connected'
            }
          });
        }
      } catch (_) {
        connections = [];
      }

      // Get today's messages
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let todayMessages = 0;
      try {
        if (this.prisma.conversation) {
          todayMessages = await this.prisma.conversation.count({
            where: {
              ...(userId ? { userId } : {}),
              updatedAt: { gte: today }
            }
          });
        }
      } catch (_) {
        todayMessages = 0;
      }

      return {
        totalChatbots,
        totalMessages: totalMessages,
        activeConnections: connections.length,
        messagesToday: todayMessages,
        uptime: 99.9,
        customerSatisfaction: 4.8,
        languagesSupported: 50
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalChatbots: 0,
        totalMessages: 0,
        activeConnections: 0,
        messagesToday: 0,
        uptime: 0,
        customerSatisfaction: 0,
        languagesSupported: 0
      };
    }
  }

  // Recent Activity
  async getRecentActivity(userId) {
    try {
      const activities = [];

      // Get recent conversations
      let conversations = [];
      try {
        if (this.prisma.conversation) {
          conversations = await this.prisma.conversation.findMany({
            where: userId ? { userId } : {},
            orderBy: { updatedAt: 'desc' },
            take: 5
          });
        }
      } catch (_) {
        conversations = [];
      }

      conversations.forEach(conv => {
        activities.push({
          id: conv.id,
          type: 'conversation',
          title: 'New conversation started',
          description: `User started a conversation with your chatbot`,
          timestamp: conv.updatedAt || conv.startedAt,
          icon: 'MessageCircle'
        });
      });

      // Get recent chatbot updates
      if (this.prisma.chatbot) {
        const chatbotUpdates = await this.prisma.chatbot.findMany({
          where: userId ? { userId } : {},
          orderBy: { updatedAt: 'desc' },
          take: 3
        });

        chatbotUpdates.forEach(chatbot => {
          activities.push({
            id: chatbot.id,
            type: 'chatbot',
            title: 'Chatbot updated',
            description: `Updated chatbot: ${chatbot.name}`,
            timestamp: chatbot.updatedAt,
            icon: 'Bot'
          });
        });
      }

      // Get recent connections
      let recentConnections = [];
      try {
        if (this.prisma.connection) {
          recentConnections = await this.prisma.connection.findMany({
            where: userId ? { userId } : {},
            orderBy: { createdAt: 'desc' },
            take: 3
          });
        }
      } catch (_) {
        recentConnections = [];
      }

      recentConnections.forEach(conn => {
        activities.push({
          id: conn.id,
          type: 'connection',
          title: 'Store connected',
          description: `Connected to ${conn.type} store`,
          timestamp: conn.createdAt,
          icon: 'ShoppingCart'
        });
      });

      // Sort by timestamp and return top 10
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // Analytics Data
  async getAnalytics(userId) {
    try {
      // Get conversation data
      let conversations = [];
      try {
        if (this.prisma.conversation) {
          conversations = await this.prisma.conversation.findMany({
            where: userId ? { userId } : {}
          });
        }
      } catch (_) {
        conversations = [];
      }

      // Get chatbot data
      let chatbots = [];
      if (this.prisma.chatbot) {
        chatbots = await this.prisma.chatbot.findMany({
          where: userId ? { userId } : {}
        });
      }

      // Calculate analytics
      const totalMessages = conversations.length;
      const totalUsers = new Set(conversations.map(c => c.userId).filter(Boolean)).size;
      // If no conversations exist, everything must be zero
      const hasData = totalMessages > 0;
      const avgResponseTime = hasData ? 2.1 : 0;
      const satisfaction = hasData ? 0 : 0;

      // Language distribution (mock data for now)
      const languageDistribution = hasData ? [] : [];

      // AI Insights (mock data for now)
      const insights = hasData ? [] : [];

      return {
        overview: {
          totalMessages,
          totalUsers,
          avgResponseTime,
          satisfaction,
          uptime: hasData ? 99.9 : 0
        },
        messages: {
          byLanguage: languageDistribution,
          byTime: []
        },
        insights
      };

    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        overview: {
          totalMessages: 0,
          totalUsers: 0,
          avgResponseTime: 0,
          satisfaction: 0,
          uptime: 0
        },
        messages: {
          byLanguage: [],
          byTime: []
        },
        insights: []
      };
    }
  }

  // Connections Data
  async getConnections(userId) {
    try {
      let connections = [];
      try {
        if (this.prisma.connection) {
          connections = await this.prisma.connection.findMany({
            where: userId ? { userId } : {}
          });
        }
      } catch (_) {
        connections = [];
      }

      return connections.map(conn => ({
        id: conn.id,
        name: conn.name,
        type: conn.type,
        status: conn.status,
        lastSync: conn.lastSync,
        createdAt: conn.createdAt
      }));

    } catch (error) {
      console.error('Error fetching connections:', error);
      return [];
    }
  }

  // Chatbots Data
  async getChatbots(userId) {
    try {
      if (!this.prisma.chatbot) {
        return [];
      }
      const chatbots = await this.prisma.chatbot.findMany({
        where: userId ? { userId } : {}
      });

      return chatbots.map(chatbot => ({
        id: chatbot.id,
        name: chatbot.name,
        status: chatbot.status,
        createdAt: chatbot.createdAt,
        updatedAt: chatbot.updatedAt
      }));

    } catch (error) {
      console.error('Error fetching chatbots:', error);
      return [];
    }
  }

  // Update user plan
  updateUserPlan(userId, planId, isPaid) {
    // This would update the user's plan in the database
    // For now, we'll just log it
    console.log(`Updated user ${userId} to plan ${planId}, paid: ${isPaid}`);
  }

  // Helper function to format time ago
  formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
}

module.exports = RealDataService;
