// Minimal Data Service Stub
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RealDataService {
  constructor() {
    console.log('💾 Real Data Service initialized');
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
}

module.exports = RealDataService;

