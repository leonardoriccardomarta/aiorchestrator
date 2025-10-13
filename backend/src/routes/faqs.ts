import { Router } from 'express';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ, getFAQsByCategory } from '../controllers/faqController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// FAQ routes
router.get('/', getFAQs);
router.post('/', createFAQ);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);
router.get('/category/:category', getFAQsByCategory);

export default router;

