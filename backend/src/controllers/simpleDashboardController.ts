import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export class SimpleDashboardController {
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const tenantId = req.tenantId;

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      // Get user's chatbots
      const chatbots = await prisma.chatbot.findMany({
        where: {
          ownerId: userId,
          tenantId,
        },
      });

      // Calculate basic stats
      const totalMessages = chatbots.reduce((sum, bot) => sum + bot.totalMessages, 0);
      const totalChatbots = chatbots.length;
      const activeUsers = chatbots.filter(bot => bot.isActive).length;
      const avgResponseTime = chatbots.length > 0 
        ? chatbots.reduce((sum, bot) => sum + bot.avgResponseTime, 0) / chatbots.length 
        : 0;

      const stats = {
        totalMessages,
        totalChatbots,
        activeUsers,
        responseTime: avgResponseTime,
        totalRevenue: 0,
        monthlyRevenue: 0,
        growth: 0,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const tenantId = req.tenantId;
    const limit = parseInt(req.query['limit'] as string) || 10;

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      // Get recent chatbots
      const recentChatbots = await prisma.chatbot.findMany({
        where: {
          ownerId: userId,
          tenantId,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          createdAt: true,
          totalMessages: true,
        },
      });

      const activities = recentChatbots.map(chatbot => ({
        id: chatbot.id,
        type: 'chatbot_created',
        message: `Chatbot "${chatbot.name}" created`,
        timestamp: chatbot.createdAt,
        user: 'System',
      }));

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const tenantId = req.tenantId;

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      // Get basic analytics
      const chatbots = await prisma.chatbot.findMany({
        where: {
          ownerId: userId,
          tenantId,
        },
      });

      const analytics = {
        pageViews: 1250,
        uniqueVisitors: 890,
        conversionRate: 12.5,
        bounceRate: 35.2,
        totalMessages: chatbots.reduce((sum, bot) => sum + bot.totalMessages, 0),
        activeChatbots: chatbots.filter(bot => bot.isActive).length,
        avgResponseTime: chatbots.length > 0 
          ? chatbots.reduce((sum, bot) => sum + bot.avgResponseTime, 0) / chatbots.length 
          : 0,
        satisfactionScore: 4.8,
      };

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const simpleDashboardController = new SimpleDashboardController();
