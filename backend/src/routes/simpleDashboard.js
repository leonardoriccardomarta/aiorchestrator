"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var simpleDashboardController_1 = require("../controllers/simpleDashboardController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// Dashboard routes with authentication
router.get('/stats', auth_1.authenticateToken, simpleDashboardController_1.simpleDashboardController.getStats.bind(simpleDashboardController_1.simpleDashboardController));
router.get('/activity', auth_1.authenticateToken, simpleDashboardController_1.simpleDashboardController.getRecentActivity.bind(simpleDashboardController_1.simpleDashboardController));
router.get('/analytics', auth_1.authenticateToken, simpleDashboardController_1.simpleDashboardController.getAnalytics.bind(simpleDashboardController_1.simpleDashboardController));
exports.default = router;
