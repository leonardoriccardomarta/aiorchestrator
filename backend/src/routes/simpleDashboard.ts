import { Router } from 'express';
import { simpleDashboardController } from '../controllers/simpleDashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Dashboard routes with authentication
router.get('/stats', authenticateToken, simpleDashboardController.getStats.bind(simpleDashboardController));
router.get('/activity', authenticateToken, simpleDashboardController.getRecentActivity.bind(simpleDashboardController));
router.get('/analytics', authenticateToken, simpleDashboardController.getAnalytics.bind(simpleDashboardController));

export default router;
