import { Router } from 'express';
import { 
  getStats,
  getRecentActivity,
  getAnalytics,
  getRevenueData
} from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';
import { validateQuery } from '../middleware/validation';
import { schemas } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard stats
router.get('/stats', getStats);

router.get('/activity', 
  validateQuery(schemas.pagination),
  getRecentActivity
);

router.get('/analytics', 
  validateQuery(schemas.analytics),
  getAnalytics
);

router.get('/revenue', getRevenueData);

export default router;
