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
    // Handle settings field properly
    // If settings is an object, stringify it
    // If settings is already a string, use it as-is
    if (data.settings !== undefined) {
      if (typeof data.settings === 'object') {
        data.settings = JSON.stringify(data.settings);
      }
      // If it's already a string, keep it as is (no double stringify)
    }
    
    console.log('🔧 updateChatbot: settings type:', typeof data.settings);
    console.log('🔧 updateChatbot: settings value (first 100 chars):', data.settings ? (typeof data.settings === 'string' ? data.settings.substring(0, 100) : JSON.stringify(data.settings).substring(0, 100)) : 'null');
    
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
      
      console.log('🤖 Found chatbots:', chatbots.length, chatbots);
      
      const chatbotIds = chatbotId ? [chatbotId] : chatbots.map(c => c.id);
      
      if (chatbotIds.length === 0) {
        console.log('⚠️ No chatbots found for user, returning zero data');
        return {
          totalChatbots: 0,
          totalConversations: 0,
          totalMessages: 0,
          totalMessagesAllTime: 0,
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
      console.log('💬 Total conversations found:', totalConversations);
      
      // Count messages
      const totalMessages = await prisma.conversationMessage.count({
        where: { 
          conversation: { 
            chatbotId: { in: chatbotIds } 
          } 
        }
      });
      console.log('💬 Total messages found:', totalMessages);
      
      // Debug: Check if there are any conversations at all
      const allConversations = await prisma.conversation.count();
      const allMessagesCount = await prisma.conversationMessage.count();
      console.log('🔍 Debug - Total conversations in DB:', allConversations);
      console.log('🔍 Debug - Total messages in DB:', allMessagesCount);
      
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
      
      // Calculate REAL average response time from message timestamps
      const conversationsWithMessages = await prisma.conversation.findMany({
        where: { chatbotId: { in: chatbotIds } },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });
      
      const responseTimes = [];
      for (const conv of conversationsWithMessages) {
        const messages = conv.messages;
        for (let i = 0; i < messages.length - 1; i++) {
          // If user message followed by bot message, calculate response time
          if (messages[i].sender === 'visitor' && messages[i + 1].sender === 'bot') {
            const responseTime = messages[i + 1].createdAt.getTime() - messages[i].createdAt.getTime();
            if (responseTime > 0 && responseTime < 60000) { // Valid response time under 60 seconds
              responseTimes.push(responseTime);
            }
          }
        }
      }
      
      const averageResponseTime = responseTimes.length > 0
        ? Math.round(responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length)
        : 0;
      
      // Calculate REAL satisfaction rate from conversation ratings
      const conversationsWithRatings = await prisma.conversation.findMany({
        where: {
          chatbotId: { in: chatbotIds },
          rating: { not: null }
        },
        select: { rating: true }
      });
      
      const satisfactionRate = conversationsWithRatings.length > 0
        ? Math.round((conversationsWithRatings.reduce((sum, c) => sum + (c.rating || 0), 0) / conversationsWithRatings.length) * 20) // Convert 1-5 to 0-100
        : 0;
      
      // Calculate REAL Response Rate (percentage of visitor messages that got bot responses)
      let visitorMessages = 0;
      let respondedMessages = 0;
      
      for (const conv of conversationsWithMessages) {
        const messages = conv.messages;
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].sender === 'visitor') {
            visitorMessages++;
            // Check if next message is from bot
            if (i < messages.length - 1 && messages[i + 1].sender === 'bot') {
              respondedMessages++;
            }
          }
        }
      }
      
      const responseRate = visitorMessages > 0
        ? Math.round((respondedMessages / visitorMessages) * 100)
        : 0;
      
      // Calculate REAL Revenue Impact from Order data
      let revenueImpact = 0;
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { tenantId: true }
        });
        
        if (user?.tenantId) {
          const orders = await prisma.order.findMany({
            where: {
              tenantId: user.tenantId,
              createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Current month
              }
            },
            select: { total: true }
          });
          
          revenueImpact = Math.round(orders.reduce((sum, o) => sum + o.total, 0));
        }
      } catch (error) {
        console.log('⚠️ Could not fetch orders for revenue calculation:', error.message);
      }
      
      // Calculate REAL active languages from message metadata or message content
      const allMessages = await prisma.conversationMessage.findMany({
        where: {
          conversation: {
            chatbotId: { in: chatbotIds }
          }
        },
        select: {
          metadata: true,
          message: true
        }
      });
      
      // Try to extract language from metadata, otherwise use a simple heuristic
      const languagesSet = new Set();
      for (const msg of allMessages) {
        if (msg.metadata) {
          try {
            const metadata = JSON.parse(msg.metadata);
            if (metadata.language) {
              languagesSet.add(metadata.language);
            }
          } catch (e) {
            // Metadata parsing failed, skip
          }
        }
      }
      
      const languagesActive = languagesSet.size > 0 ? languagesSet.size : 1; // Default to 1 if no language detected
      
      console.log('📊 Real metrics calculated:', {
        userId,
        chatbotIds,
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
        totalMessagesAllTime: totalMessages, // All time messages (same as totalMessages for now)
        monthlyMessages,
        activeConnections,
        averageResponseTime,
        satisfactionRate,
        responseTime: averageResponseTime,
        responseRate: responseRate,
        revenueImpact: revenueImpact,
        uptime: 99.9, // Uptime would require external monitoring service
        languagesActive: languagesActive,
        customerSatisfaction: conversationsWithRatings.length > 0
          ? (conversationsWithRatings.reduce((sum, c) => sum + (c.rating || 0), 0) / conversationsWithRatings.length) // Average rating 1-5
          : 0
      };
    } catch (error) {
      console.error('❌ Error calculating real metrics:', error);
      return {
        totalChatbots: 0,
        totalConversations: 0,
        totalMessages: 0,
        totalMessagesAllTime: 0,
        monthlyMessages: 0,
        activeConnections: 0,
        averageResponseTime: 0,
        satisfactionRate: 0,
        responseTime: 0,
        responseRate: 0,
        revenueImpact: 0,
        uptime: 0,
        languagesActive: 0,
        customerSatisfaction: 0
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
        chatbotId: connectionData.chatbotId || null, // Associate with specific chatbot
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
        console.log('⚠️ No chatbots found for user, cannot create conversation without chatbot');
        return null; // Cannot create conversation without chatbot
      }
      
      const chatbotId = userChatbots[0].id;
      
      // Create conversation in database (using correct schema fields)
      const conversation = await prisma.conversation.create({
        data: {
          chatbotId,
          visitorId: conversationData.visitorId || `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          visitorEmail: conversationData.visitorEmail || null,
          visitorName: conversationData.visitorName || null,
          status: 'bot', // bot-handled conversation
          priority: 'normal',
          metadata: JSON.stringify({
            language: conversationData.language || 'en',
            responseTime: conversationData.responseTime || 0,
            platform: conversationData.platform || 'web',
            sentiment: conversationData.sentiment?.score || 0,
            intent: conversationData.intent?.intent || 'general',
            anomaly: conversationData.anomaly || false
          })
        }
      });
      
      // Also create conversation messages (using correct schema)
      await prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          sender: 'visitor', // visitor, bot, agent
          senderName: conversationData.visitorName || 'Visitor',
          message: conversationData.message
        }
      });
      
      await prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          sender: 'bot',
          senderName: 'AI Assistant',
          message: conversationData.response
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

