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

  calculateRealMetrics(userId, chatbotId) {
    // Return mock metrics
    return {
      totalConversations: 0,
      averageResponseTime: 0,
      satisfactionRate: 0
    };
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

  addConversation(userId, conversationData) {
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

