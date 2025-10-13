import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
// import { logger } from '../config/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { DashboardStats } from '../types';

export class DashboardController {
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

      // Calculate stats
      const totalMessages = chatbots.reduce((sum, bot) => sum + bot.totalMessages, 0);
      const totalChatbots = chatbots.length;
      const activeUsers = chatbots.filter(bot => bot.isActive).length;
      const avgResponseTime = chatbots.length > 0 
        ? chatbots.reduce((sum, bot) => sum + bot.avgResponseTime, 0) / chatbots.length 
        : 0;

      // Get revenue data (if user has subscription)
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          tenantId,
          status: 'ACTIVE',
        },
      });

      // Get plan data separately
      const plan = subscription ? await prisma.plan.findUnique({
        where: { id: subscription.planId }
      }) : null;

      const stats: DashboardStats = {
        totalMessages,
        totalChatbots,
        totalFAQs: 0,
        monthlyActiveUsers: activeUsers,
        avgResponseTime: avgResponseTime,
        revenue: plan ? plan.price : 0,
        conversionRate: 12.5,
        satisfactionScore: 4.5,
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

      // Get recent analytics
      const recentAnalytics = await prisma.analytics.findMany({
        where: {
          userId,
          tenantId,
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
        select: {
          id: true,
          type: true,
          data: true,
          timestamp: true,
        },
      });

      const activities = [
        ...recentChatbots.map(bot => ({
          id: bot.id,
          type: 'chatbot_created',
          title: `Created chatbot "${bot.name}"`,
          description: bot.description || 'No description',
          timestamp: bot.createdAt,
          data: {
            chatbotId: bot.id,
            isActive: bot.isActive,
            totalMessages: bot.totalMessages,
          },
        })),
        ...recentAnalytics.map(analytic => ({
          id: analytic.id,
          type: analytic.type,
          title: `Analytics event: ${analytic.type}`,
          description: 'System analytics event',
          timestamp: analytic.timestamp,
          data: analytic.data,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
       .slice(0, limit);

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
    const timeRange = req.query['timeRange'] as string || '7d';

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      // Calculate date range
      const now = new Date();
      let startDate: Date;

      switch (timeRange) {
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      // Get analytics data
      const analytics = await prisma.analytics.findMany({
        where: {
          userId,
          tenantId,
          timestamp: {
            gte: startDate,
            lte: now,
          },
        },
        orderBy: { timestamp: 'asc' },
      });

      // Process analytics data for charts
      const chartData = analytics.reduce((acc, analytic) => {
        const date: string = analytic.timestamp.toISOString().split('T')[0] || '';
        
        if (!acc[date]) {
          acc[date] = {
            date,
            messages: 0,
            chatbots: 0,
            users: 0,
            errors: 0,
          };
        }

        switch (analytic.type) {
          case 'MESSAGE_SENT':
          case 'MESSAGE_RECEIVED':
            acc[date].messages += 1;
            break;
          case 'CHATBOT_CREATED':
            acc[date].chatbots += 1;
            break;
          case 'USER_REGISTERED':
            acc[date].users += 1;
            break;
          case 'ERROR_OCCURRED':
            acc[date].errors += 1;
            break;
        }

        return acc;
      }, {} as Record<string, any>);

      const chartArray = Object.values(chartData).sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      res.json({
        success: true,
        data: {
          timeRange,
          chartData: chartArray,
          totalEvents: analytics.length,
          summary: {
            messages: analytics.filter(a => a.type.includes('MESSAGE')).length,
            chatbots: analytics.filter(a => a.type === 'CHATBOT_CREATED').length,
            users: analytics.filter(a => a.type === 'USER_REGISTERED').length,
            errors: analytics.filter(a => a.type === 'ERROR_OCCURRED').length,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getRevenueData(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      // Get subscription data
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          tenantId,
          status: 'ACTIVE',
        },
      });

      if (!subscription) {
        res.json({
          success: true,
          data: {
            currentPlan: null,
            monthlyRevenue: 0,
            yearlyRevenue: 0,
            totalRevenue: 0,
            nextBillingDate: null,
          },
        });
        return;
      }

      // Get plan data separately
      const plan = await prisma.plan.findUnique({
        where: { id: subscription.planId }
      });

      if (!plan) {
        res.json({
          success: true,
          data: {
            currentPlan: null,
            monthlyRevenue: 0,
            yearlyRevenue: 0,
            totalRevenue: 0,
            nextBillingDate: null,
          },
        });
        return;
      }

      // Calculate revenue metrics
      const monthlyRevenue = plan.price;
      const yearlyRevenue = plan.interval === 'YEARLY' 
        ? plan.price 
        : plan.price * 12;
      const totalRevenue = monthlyRevenue; // Simplified for demo

      res.json({
        success: true,
        data: {
          currentPlan: {
            id: plan.id,
            name: plan.name,
            price: plan.price,
            interval: plan.interval,
          },
          monthlyRevenue,
          yearlyRevenue,
          totalRevenue,
          nextBillingDate: subscription.currentPeriodEnd,
          status: subscription.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();

// Async handler wrappers
export const getStats = asyncHandler(dashboardController.getStats.bind(dashboardController));
export const getRecentActivity = asyncHandler(dashboardController.getRecentActivity.bind(dashboardController));
export const getAnalytics = asyncHandler(dashboardController.getAnalytics.bind(dashboardController));
export const getRevenueData = asyncHandler(dashboardController.getRevenueData.bind(dashboardController));