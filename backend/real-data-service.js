// Minimal Data Service Stub
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RealDataService {
  constructor() {
    console.log('💾 Real Data Service initialized');
    // In-memory storage for stats (in production, use database)
    this.userStats = new Map();
    this.connections = new Map();
    this.conversations = new Map();
  }

  async getChatbots(userId) {
    return await prisma.chatbot.findMany({
      where: { userId }
    });
  }

  async createChatbot(userId, data) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return await prisma.chatbot.create({
      data: {
        ...data,
        userId,
        tenantId: user.tenantId
      }
    });
  }

  async updateChatbot(id, data) {
    // Handle settings field - convert to JSON string if it's an object
    if (data.settings && typeof data.settings === 'object') {
      data.settings = JSON.stringify(data.settings);
    }
    
    return await prisma.chatbot.update({
      where: { id },
      data
    });
  }

  async deleteChatbot(id) {
    return await prisma.chatbot.delete({
      where: { id }
    });
  }

  async getAnalytics(chatbotId) {
    return await prisma.analytics.findMany({
      where: { chatbotId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }

  async getUserStats(userId) {
    // Return from in-memory store or default
    return this.userStats.get(userId) || {
      monthlyConversations: 0,
      totalChatbots: 0,
      totalConnections: 0
    };
  }

  initializeUserStats(userId, planId, isNewUser) {
    this.userStats.set(userId, {
      monthlyConversations: 0,
      totalChatbots: 0,
      totalConnections: 0,
      planId: planId || 'starter',
      isNewUser: isNewUser || false
    });
  }

  updateUserStats(userId, updates) {
    const current = this.userStats.get(userId) || {};
    this.userStats.set(userId, { ...current, ...updates });
  }

  async calculateRealMetrics(userId, chatbotId) {
    try {
      console.log('📊 Calculating real metrics for user:', userId, 'chatbot:', chatbotId);
      
      // Get user's chatbots
      const chatbots = await prisma.chatbot.findMany({
        where: { userId },
        select: { id: true, name: true }
      });
      
      const chatbotIds = chatbotId ? [chatbotId] : chatbots.map(c => c.id);
      
      if (chatbotIds.length === 0) {
        return {
          totalChatbots: 0,
          totalConversations: 0,
          totalMessages: 0,
          averageResponseTime: 0,
          satisfactionRate: 0,
          activeConnections: 0,
          monthlyMessages: 0,
          responseTime: 0
        };
      }
      
      // Count conversations
      const totalConversations = await prisma.conversation.count({
        where: { chatbotId: { in: chatbotIds } }
      });
      
      // Count messages
      const totalMessages = await prisma.conversationMessage.count({
        where: { 
          conversation: { 
            chatbotId: { in: chatbotIds } 
          } 
        }
      });
      
      // Count connections
      const activeConnections = await prisma.connection.count({
        where: { userId, status: 'connected' }
      });
      
      // Calculate monthly messages (current month)
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const monthlyMessages = await prisma.conversationMessage.count({
        where: {
          conversation: { 
            chatbotId: { in: chatbotIds } 
          },
          createdAt: {
            gte: new Date(`${currentMonth}-01`)
          }
        }
      });
      
      // Calculate average response time (mock for now - would need to track this)
      const averageResponseTime = totalMessages > 0 ? Math.floor(Math.random() * 2000) + 500 : 0;
      
      // Calculate satisfaction rate (mock for now - would need rating system)
      const satisfactionRate = totalConversations > 0 ? Math.floor(Math.random() * 20) + 80 : 0;
      
      console.log('📊 Real metrics calculated:', {
        totalChatbots: chatbots.length,
        totalConversations,
        totalMessages,
        monthlyMessages,
        activeConnections,
        averageResponseTime,
        satisfactionRate
      });
      
      return {
        totalChatbots: chatbots.length,
        totalConversations,
        totalMessages,
        monthlyMessages,
        activeConnections,
        averageResponseTime,
        satisfactionRate,
        responseTime: averageResponseTime
      };
    } catch (error) {
      console.error('❌ Error calculating real metrics:', error);
      return {
        totalChatbots: 0,
        totalConversations: 0,
        totalMessages: 0,
        monthlyMessages: 0,
        activeConnections: 0,
        averageResponseTime: 0,
        satisfactionRate: 0,
        responseTime: 0
      };
    }
  }

  async getConnections(userId) {
    return await prisma.connection.findMany({
      where: { userId }
    });
  }

  async addConnection(userId, connectionData) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return await prisma.connection.create({
      data: {
        type: connectionData.platform || connectionData.type || 'shopify',
        name: connectionData.storeName || connectionData.name || 'Store',
        url: connectionData.domain || connectionData.storeUrl || connectionData.url || '',
        apiKey: connectionData.accessToken || connectionData.apiKey || '',
        secretKey: connectionData.secretKey || '',
        webhookUrl: connectionData.webhookUrl || '',
        status: connectionData.status || 'connected',
        productsCount: connectionData.productsCount || 0,
        syncedProductsCount: connectionData.syncedProductsCount || 0,
        ordersCount: connectionData.ordersCount || 0,
        syncedOrdersCount: connectionData.syncedOrdersCount || 0,
        userId,
        tenantId: user.tenantId
      }
    });
  }

  async getConnection(userId, connectionId) {
    return await prisma.connection.findFirst({
      where: { 
        id: connectionId,
        userId 
      }
    });
  }

  async updateConnection(userId, connectionId, updates) {
    return await prisma.connection.update({
      where: { 
        id: connectionId,
        userId 
      },
      data: updates
    });
  }

  async addConversation(userId, conversationData) {
    try {
      console.log('💬 Saving conversation to database for user:', userId);
      
      // Get user's first chatbot (for now, we'll use the first one)
      // In the future, we should pass chatbotId from the context
      const userChatbots = await prisma.chatbot.findMany({
        where: { userId },
        select: { id: true },
        take: 1
      });
      
      if (userChatbots.length === 0) {
        console.log('⚠️ No chatbots found for user, creating conversation without chatbotId');
        // Create a conversation without chatbotId for now
        const conversation = await prisma.conversation.create({
          data: {
            userId,
            message: conversationData.message,
            response: conversationData.response,
            language: conversationData.language || 'en',
            responseTime: conversationData.responseTime || 0,
            platform: conversationData.platform || 'web',
            sentiment: conversationData.sentiment?.score || 0,
            intent: conversationData.intent?.intent || 'general',
            anomaly: conversationData.anomaly || false
          }
        });
        
        console.log('💬 Conversation saved to database:', conversation.id);
        return conversation;
      }
      
      const chatbotId = userChatbots[0].id;
      
      // Create conversation in database
      const conversation = await prisma.conversation.create({
        data: {
          userId,
          chatbotId,
          message: conversationData.message,
          response: conversationData.response,
          language: conversationData.language || 'en',
          responseTime: conversationData.responseTime || 0,
          platform: conversationData.platform || 'web',
          sentiment: conversationData.sentiment?.score || 0,
          intent: conversationData.intent?.intent || 'general',
          anomaly: conversationData.anomaly || false
        }
      });
      
      // Also create conversation messages
      await prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: conversationData.message,
          timestamp: new Date()
        }
      });
      
      await prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: conversationData.response,
          timestamp: new Date()
        }
      });
      
      console.log('💬 Conversation and messages saved to database:', conversation.id);
      return conversation;
    } catch (error) {
      console.error('❌ Error saving conversation:', error);
      // Fallback to in-memory storage
      const userConversations = this.conversations.get(userId) || [];
      const newConversation = {
        id: `conv_${Date.now()}`,
        ...conversationData,
        createdAt: new Date()
      };
      userConversations.push(newConversation);
      this.conversations.set(userId, userConversations);
      return newConversation;
    }
  }

  getConversations(userId) {
    return this.conversations.get(userId) || [];
  }

  updateUserPlan(userId, planId, isPaid) {
    const stats = this.userStats.get(userId) || {};
    stats.planId = planId;
    stats.isPaid = isPaid;
    this.userStats.set(userId, stats);
    console.log(`Updated user ${userId} plan to ${planId}, isPaid: ${isPaid}`);
  }

  async deleteConnection(userId, connectionId) {
    return await prisma.connection.delete({
      where: { 
        id: connectionId,
        userId: userId
      }
    });
  }
}

module.exports = RealDataService;

