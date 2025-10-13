"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var subscriptionController_1 = require("../controllers/subscriptionController");
var auth_1 = require("../middleware/auth");
var validation_1 = require("../middleware/validation");
var validation_2 = require("../middleware/validation");
var router = (0, express_1.Router)();
// Public routes (plans can be viewed without authentication)
router.get('/plans', subscriptionController_1.getPlans);
router.get('/plans/:id', subscriptionController_1.getPlan);
// Protected routes
router.use(auth_1.authenticateToken);
router.post('/', (0, validation_1.validate)(validation_2.schemas.createSubscription), subscriptionController_1.createSubscription);
router.get('/', subscriptionController_1.getSubscription);
router.put('/', (0, validation_1.validate)(validation_2.schemas.createSubscription), subscriptionController_1.updateSubscription);
router.delete('/', subscriptionController_1.cancelSubscription);
router.get('/usage', subscriptionController_1.getUsage);
exports.default = router;
