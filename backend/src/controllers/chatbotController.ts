import { Request, Response, NextFunction } from 'express';
import { chatbotService } from '../services/chatbotService';
import { asyncHandler } from '../middleware/errorHandler';

export class ChatbotController {
  async createChatbot(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const tenantId = req.tenantId;
    const data = req.body;

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const chatbot = await chatbotService.createChatbot(data, userId, tenantId);

      res.status(201).json({
        success: true,
        data: chatbot,
        message: 'Chatbot created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getChatbots(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const tenantId = req.tenantId;
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const result = await chatbotService.getChatbots(userId, tenantId, page, limit);

      res.json({
        success: true,
        data: result.chatbots,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getChatbot(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const tenantId = req.tenantId;
    const { id } = req.params;

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const chatbot = await chatbotService.getChatbot(id as string, userId, tenantId);

      res.json({
        success: true,
        data: chatbot,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateChatbot(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const tenantId = req.tenantId;
    const { id } = req.params;
    const data = req.body;

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const chatbot = await chatbotService.updateChatbot(id as string, data, userId, tenantId);

      res.json({
        success: true,
        data: chatbot,
        message: 'Chatbot updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteChatbot(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const tenantId = req.tenantId;
    const { id } = req.params;

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      await chatbotService.deleteChatbot(id as string, userId, tenantId);

      res.json({
        success: true,
        message: 'Chatbot deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getChatbotStats(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const stats = await chatbotService.getChatbotStats(userId, tenantId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const tenantId = req.tenantId;
    const { id } = req.params;
    const { sessionId } = req.body;

    try {
      if (!userId || !tenantId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      // Get chatbot
      const chatbot = await chatbotService.getChatbot(id as string, userId, tenantId);

      // In a real implementation, you would:
      // 1. Process the message with OpenAI
      // 2. Store the conversation
      // 3. Update metrics
      // 4. Return the response

      // For now, return a mock response
      const mockResponse = {
        message: `Hello! I'm ${chatbot.name}. How can I help you today?`,
        sessionId: sessionId || `session_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      // Update chatbot metrics
      await chatbotService.updateChatbotMetrics(id as string, {
        totalMessages: chatbot.totalMessages + 1,
        avgResponseTime: chatbot.avgResponseTime,
        satisfactionScore: chatbot.satisfactionScore,
      });

      res.json({
        success: true,
        data: mockResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const chatbotController = new ChatbotController();

// Async handler wrappers
export const createChatbot = asyncHandler(chatbotController.createChatbot.bind(chatbotController));
export const getChatbots = asyncHandler(chatbotController.getChatbots.bind(chatbotController));
export const getChatbot = asyncHandler(chatbotController.getChatbot.bind(chatbotController));
export const updateChatbot = asyncHandler(chatbotController.updateChatbot.bind(chatbotController));
export const deleteChatbot = asyncHandler(chatbotController.deleteChatbot.bind(chatbotController));
export const getChatbotStats = asyncHandler(chatbotController.getChatbotStats.bind(chatbotController));
export const sendMessage = asyncHandler(chatbotController.sendMessage.bind(chatbotController));
