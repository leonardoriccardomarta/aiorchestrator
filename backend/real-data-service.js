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

  getConnections(userId) {
    const userConnections = this.connections.get(userId) || [];
    return userConnections;
  }

  addConnection(userId, connectionData) {
    const userConnections = this.connections.get(userId) || [];
    const newConnection = {
      id: `conn_${Date.now()}`,
      ...connectionData,
      createdAt: new Date()
    };
    userConnections.push(newConnection);
    this.connections.set(userId, userConnections);
    return newConnection;
  }

  getConnection(userId, connectionId) {
    const userConnections = this.connections.get(userId) || [];
    return userConnections.find(c => c.id === connectionId);
  }

  updateConnection(userId, connectionId, updates) {
    const userConnections = this.connections.get(userId) || [];
    const index = userConnections.findIndex(c => c.id === connectionId);
    if (index !== -1) {
      userConnections[index] = { ...userConnections[index], ...updates };
      this.connections.set(userId, userConnections);
      return userConnections[index];
    }
    return null;
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
}

module.exports = RealDataService;

