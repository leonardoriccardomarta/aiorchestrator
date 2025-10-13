"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var analyticsController_1 = require("../controllers/analyticsController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// Analytics routes
router.get('/', analyticsController_1.getAnalytics);
router.get('/revenue', analyticsController_1.getRevenueAnalytics);
router.get('/users', analyticsController_1.getUserAnalytics);
exports.default = router;
