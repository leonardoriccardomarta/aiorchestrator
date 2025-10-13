// Chatbot Service Stub
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ChatbotService {
  constructor() {
    console.log('🤖 Chatbot Service initialized');
  }

  async getChatbot(id) {
    return await prisma.chatbot.findUnique({
      where: { id },
      include: {
        user: true,
        tenant: true
      }
    });
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
}

module.exports = ChatbotService;

