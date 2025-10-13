import { Router } from 'express';
import authRoutes from './auth';
import chatbotRoutes from './chatbots';
import dashboardRoutes from './simpleDashboard';
import subscriptionRoutes from './subscriptions';
import analyticsRoutes from './analytics';
import faqRoutes from './faqs';
import paymentRoutes from './payments';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AI Orchestrator API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/chatbots', chatbotRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/faqs', faqRoutes);
router.use('/payments', paymentRoutes);

// Root endpoint
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to AI Orchestrator API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      chatbots: '/chatbots',
      dashboard: '/dashboard',
      subscriptions: '/subscriptions',
      analytics: '/analytics',
      faqs: '/faqs',
      payments: '/payments',
    },
  });
});

export default router;