import { Router } from 'express';
import { getPayments, createPayment, updatePaymentStatus, getInvoices, createInvoice } from '../controllers/paymentsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Payment routes
router.get('/', getPayments);
router.post('/', createPayment);
router.put('/:id/status', updatePaymentStatus);

// Invoice routes
router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);

export default router;

