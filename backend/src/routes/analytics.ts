import { Router } from 'express';
import { getAnalytics, getRevenueAnalytics, getUserAnalytics } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Analytics routes
router.get('/', getAnalytics);
router.get('/revenue', getRevenueAnalytics);
router.get('/users', getUserAnalytics);

export default router;

