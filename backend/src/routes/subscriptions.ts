import { Router } from 'express';
import { 
  getPlans,
  getPlan,
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  getUsage
} from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { schemas } from '../middleware/validation';

const router = Router();

// Public routes (plans can be viewed without authentication)
router.get('/plans', getPlans);
router.get('/plans/:id', getPlan);

// Protected routes
router.use(authenticateToken);

router.post('/',
  validate(schemas.createSubscription),
  createSubscription
);

router.get('/', getSubscription);

router.put('/',
  validate(schemas.createSubscription),
  updateSubscription
);

router.delete('/', cancelSubscription);

router.get('/usage', getUsage);

export default router;
