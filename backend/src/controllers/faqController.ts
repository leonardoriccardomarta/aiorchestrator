import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export const getFAQs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const faqs = await prisma.fAQ.findMany({
      where: {
        ownerId: userId
      },
      orderBy: {
        order: 'asc'
      }
    });

    res.json(faqs);
  } catch (error) {
    logger.error('Get FAQs error:', error);
    next(error);
  }
};

export const createFAQ = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { question, answer, category, tags } = req.body;

    if (!question || !answer) {
      res.status(400).json({ error: 'Question and answer are required' });
      return;
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || 'General',
        tags: tags || '',
        ownerId: userId,
        tenantId: 'default-tenant'
      }
    });

    res.status(201).json(faq);
  } catch (error) {
    logger.error('Create FAQ error:', error);
    next(error);
  }
};

export const updateFAQ = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'FAQ ID is required' });
      return;
    }

    const { question, answer, category, tags, isActive } = req.body;

    const faq = await prisma.fAQ.update({
      where: {
        id: id
      },
      data: {
        question,
        answer,
        category,
        tags,
        isActive
      }
    });

    res.json(faq);
  } catch (error) {
    logger.error('Update FAQ error:', error);
    next(error);
  }
};

export const deleteFAQ = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'FAQ ID is required' });
      return;
    }

    await prisma.fAQ.delete({
      where: {
        id: id
      }
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Delete FAQ error:', error);
    next(error);
  }
};

export const getFAQsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { category } = req.params;
    if (!category) {
      res.status(400).json({ error: 'Category is required' });
      return;
    }

    const faqs = await prisma.fAQ.findMany({
      where: {
        ownerId: userId,
        category: category
      },
      orderBy: {
        order: 'asc'
      }
    });

    res.json(faqs);
  } catch (error) {
    logger.error('Get FAQs by category error:', error);
    next(error);
  }
};

