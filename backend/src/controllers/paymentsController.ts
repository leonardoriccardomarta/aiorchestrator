import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export const getPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const payments = await prisma.payment.findMany({
      where: {
        userId: userId
      },
      include: {
        subscription: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(payments);
  } catch (error) {
    logger.error('Get payments error:', error);
    next(error);
  }
};

export const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { amount, currency, method, description, subscriptionId } = req.body;

    if (!amount || !method) {
      res.status(400).json({ error: 'Amount and method are required' });
      return;
    }

    const payment = await prisma.payment.create({
      data: {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        method,
        description,
        userId: userId,
        tenantId: 'default-tenant',
        subscriptionId
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    logger.error('Create payment error:', error);
    next(error);
  }
};

export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Payment ID is required' });
      return;
    }

    const { status } = req.body;

    const payment = await prisma.payment.update({
      where: {
        id: id
      },
      data: {
        status
      }
    });

    res.json(payment);
  } catch (error) {
    logger.error('Update payment status error:', error);
    next(error);
  }
};

export const getInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: userId
      },
      include: {
        payment: true,
        subscription: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(invoices);
  } catch (error) {
    logger.error('Get invoices error:', error);
    next(error);
  }
};

export const createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { amount, currency, dueDate, subscriptionId } = req.body;

    if (!amount) {
      res.status(400).json({ error: 'Amount is required' });
      return;
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: userId,
        tenantId: 'default-tenant',
        subscriptionId
      }
    });

    res.status(201).json(invoice);
  } catch (error) {
    logger.error('Create invoice error:', error);
    next(error);
  }
};

