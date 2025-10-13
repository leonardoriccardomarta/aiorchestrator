import { PrismaClient, Chatbot } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { 
  CreateChatbotRequest, 
  UpdateChatbotRequest 
} from '../types';
import { AppError } from '../middleware/errorHandler';

export class ChatbotService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async createChatbot(
    data: CreateChatbotRequest,
    userId: string,
    tenantId: string
  ): Promise<Chatbot> {
    try {
      const chatbot = await this.prisma.chatbot.create({
        data: {
          name: data.name,
          description: data.description || null,
          ownerId: userId,
          tenantId,
          model: data.model || 'gpt-3.5-turbo',
          personality: data.personality || 'helpful',
          responseStyle: data.responseStyle || 'professional',
          temperature: data.temperature || 0.7,
          maxTokens: data.maxTokens || 1000,
          whatsappEnabled: data.whatsappEnabled || false,
          messengerEnabled: data.messengerEnabled || false,
          telegramEnabled: data.telegramEnabled || false,
          shopifyEnabled: data.shopifyEnabled || false,
          webhookUrl: data.webhookUrl || null,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Log creation
      await this.logAuditEvent(userId, 'CHATBOT_CREATED', 'chatbot', chatbot.id);

      // Track analytics
      await this.trackAnalytics('CHATBOT_CREATED', chatbot.id, 'chatbot', userId, tenantId);

      logger.info('Chatbot created successfully', { 
        chatbotId: chatbot.id, 
        userId, 
        tenantId 
      });

      return chatbot;
    } catch (error) {
      logger.error('Failed to create chatbot:', error);
      throw error;
    }
  }

  async getChatbots(
    userId: string,
    tenantId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ chatbots: Chatbot[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [chatbots, total] = await Promise.all([
        this.prisma.chatbot.findMany({
          where: {
            ownerId: userId,
            tenantId,
          },
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.chatbot.count({
          where: {
            ownerId: userId,
            tenantId,
          },
        }),
      ]);

      return { chatbots, total };
    } catch (error) {
      logger.error('Failed to get chatbots:', error);
      throw error;
    }
  }

  async getChatbot(
    id: string,
    userId: string,
    tenantId: string
  ): Promise<Chatbot> {
    try {
      const chatbot = await this.prisma.chatbot.findFirst({
        where: {
          id,
          ownerId: userId,
          tenantId,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!chatbot) {
        throw new AppError('Chatbot not found', 404);
      }

      return chatbot;
    } catch (error) {
      logger.error('Failed to get chatbot:', error);
      throw error;
    }
  }

  async updateChatbot(
    id: string,
    data: UpdateChatbotRequest,
    userId: string,
    tenantId: string
  ): Promise<Chatbot> {
    try {
      // Check if chatbot exists and belongs to user
      const existingChatbot = await this.prisma.chatbot.findFirst({
        where: {
          id,
          ownerId: userId,
          tenantId,
        },
      });

      if (!existingChatbot) {
        throw new AppError('Chatbot not found', 404);
      }

      const chatbot = await this.prisma.chatbot.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Log update
      await this.logAuditEvent(userId, 'CHATBOT_UPDATED', 'chatbot', id, data);

      logger.info('Chatbot updated successfully', { 
        chatbotId: id, 
        userId, 
        tenantId 
      });

      return chatbot;
    } catch (error) {
      logger.error('Failed to update chatbot:', error);
      throw error;
    }
  }

  async deleteChatbot(
    id: string,
    userId: string,
    tenantId: string
  ): Promise<void> {
    try {
      // Check if chatbot exists and belongs to user
      const existingChatbot = await this.prisma.chatbot.findFirst({
        where: {
          id,
          ownerId: userId,
          tenantId,
        },
      });

      if (!existingChatbot) {
        throw new AppError('Chatbot not found', 404);
      }

      await this.prisma.chatbot.delete({
        where: { id },
      });

      // Log deletion
      await this.logAuditEvent(userId, 'CHATBOT_DELETED', 'chatbot', id);

      logger.info('Chatbot deleted successfully', { 
        chatbotId: id, 
        userId, 
        tenantId 
      });
    } catch (error) {
      logger.error('Failed to delete chatbot:', error);
      throw error;
    }
  }

  async getChatbotStats(
    userId: string,
    tenantId: string
  ): Promise<{
    totalChatbots: number;
    activeChatbots: number;
    totalMessages: number;
    avgResponseTime: number;
    avgSatisfactionScore: number;
  }> {
    try {
      const chatbots = await this.prisma.chatbot.findMany({
        where: {
          ownerId: userId,
          tenantId,
        },
      });

      const totalChatbots = chatbots.length;
      const activeChatbots = chatbots.filter(c => c.isActive).length;
      const totalMessages = chatbots.reduce((sum, c) => sum + c.totalMessages, 0);
      const avgResponseTime = chatbots.length > 0 
        ? chatbots.reduce((sum, c) => sum + c.avgResponseTime, 0) / chatbots.length 
        : 0;
      const avgSatisfactionScore = chatbots.length > 0 
        ? chatbots.reduce((sum, c) => sum + c.satisfactionScore, 0) / chatbots.length 
        : 0;

      return {
        totalChatbots,
        activeChatbots,
        totalMessages,
        avgResponseTime,
        avgSatisfactionScore,
      };
    } catch (error) {
      logger.error('Failed to get chatbot stats:', error);
      throw error;
    }
  }

  async updateChatbotMetrics(
    id: string,
    metrics: {
      totalMessages?: number;
      avgResponseTime?: number;
      satisfactionScore?: number;
    }
  ): Promise<void> {
    try {
      await this.prisma.chatbot.update({
        where: { id },
        data: {
          ...metrics,
          updatedAt: new Date(),
        },
      });

      logger.info('Chatbot metrics updated', { chatbotId: id, metrics });
    } catch (error) {
      logger.error('Failed to update chatbot metrics:', error);
      throw error;
    }
  }

  private async logAuditEvent(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details?: any
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          resource,
          resourceId,
          details,
        },
      });
    } catch (error) {
      logger.error('Failed to log audit event:', error);
    }
  }

  private async trackAnalytics(
    type: string,
    entityId: string,
    entityType: string,
    userId: string,
    tenantId: string,
    data?: any
  ): Promise<void> {
    try {
      await this.prisma.analytics.create({
        data: {
          type: type as any,
          entityId,
          entityType,
          userId,
          tenantId,
          data,
        },
      });
    } catch (error) {
      logger.error('Failed to track analytics:', error);
    }
  }
}

export const chatbotService = new ChatbotService();
