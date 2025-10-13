"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dashboardController_1 = require("../controllers/dashboardController");
var auth_1 = require("../middleware/auth");
var validation_1 = require("../middleware/validation");
var validation_2 = require("../middleware/validation");
var router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Dashboard stats
router.get('/stats', dashboardController_1.getStats);
router.get('/activity', (0, validation_1.validateQuery)(validation_2.schemas.pagination), dashboardController_1.getRecentActivity);
router.get('/analytics', (0, validation_1.validateQuery)(validation_2.schemas.analytics), dashboardController_1.getAnalytics);
router.get('/revenue', dashboardController_1.getRevenueData);
exports.default = router;
