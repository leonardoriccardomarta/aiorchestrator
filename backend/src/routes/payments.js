"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var paymentsController_1 = require("../controllers/paymentsController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// Payment routes
router.get('/', paymentsController_1.getPayments);
router.post('/', paymentsController_1.createPayment);
router.put('/:id/status', paymentsController_1.updatePaymentStatus);
// Invoice routes
router.get('/invoices', paymentsController_1.getInvoices);
router.post('/invoices', paymentsController_1.createInvoice);
exports.default = router;
