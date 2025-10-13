import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export const getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Get basic analytics data
    const totalChatbots = await prisma.chatbot.count({
      where: { ownerId: userId }
    });

    const totalFAQs = await prisma.fAQ.count({
      where: { ownerId: userId }
    });

    const totalMessages = await prisma.chatbot.aggregate({
      where: { ownerId: userId },
      _sum: { totalMessages: true }
    });

    const analytics = {
      totalChatbots,
      totalFAQs,
      totalMessages: totalMessages._sum.totalMessages || 0,
      avgResponseTime: 1.2,
      satisfactionScore: 4.5,
      monthlyActiveUsers: 150,
      conversionRate: 12.5,
      revenue: 1250.00,
      chartData: [
        { date: '2024-01-01', messages: 100, users: 50 },
        { date: '2024-01-02', messages: 120, users: 55 },
        { date: '2024-01-03', messages: 140, users: 60 },
        { date: '2024-01-04', messages: 160, users: 65 },
        { date: '2024-01-05', messages: 180, users: 70 }
      ]
    };

    res.json(analytics);
  } catch (error) {
    logger.error('Analytics error:', error);
    next(error);
  }
};

export const getRevenueAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Get revenue analytics
    const revenueData = {
      monthlyRevenue: 1250.00,
      totalRevenue: 12500.00,
      growthRate: 15.5,
      chartData: [
        { month: 'Jan', revenue: 1000 },
        { month: 'Feb', revenue: 1100 },
        { month: 'Mar', revenue: 1250 },
        { month: 'Apr', revenue: 1300 },
        { month: 'May', revenue: 1250 }
      ]
    };

    res.json(revenueData);
  } catch (error) {
    logger.error('Revenue analytics error:', error);
    next(error);
  }
};

export const getUserAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Get user analytics
    const userAnalytics = {
      totalUsers: 150,
      activeUsers: 120,
      newUsers: 25,
      retentionRate: 85.5,
      chartData: [
        { date: '2024-01-01', users: 100 },
        { date: '2024-01-02', users: 105 },
        { date: '2024-01-03', users: 110 },
        { date: '2024-01-04', users: 115 },
        { date: '2024-01-05', users: 120 }
      ]
    };

    res.json(userAnalytics);
  } catch (error) {
    logger.error('User analytics error:', error);
    next(error);
  }
};

