"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("./auth");
var chatbots_1 = require("./chatbots");
var simpleDashboard_1 = require("./simpleDashboard");
var subscriptions_1 = require("./subscriptions");
var analytics_1 = require("./analytics");
var faqs_1 = require("./faqs");
var payments_1 = require("./payments");
var router = (0, express_1.Router)();
// Health check endpoint
router.get('/health', function (_req, res) {
    res.json({
        success: true,
        message: 'AI Orchestrator API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
// API routes
router.use('/auth', auth_1.default);
router.use('/chatbots', chatbots_1.default);
router.use('/dashboard', simpleDashboard_1.default);
router.use('/subscriptions', subscriptions_1.default);
router.use('/analytics', analytics_1.default);
router.use('/faqs', faqs_1.default);
router.use('/payments', payments_1.default);
// Root endpoint
router.get('/', function (_req, res) {
    res.json({
        success: true,
        message: 'Welcome to AI Orchestrator API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/auth',
            chatbots: '/chatbots',
            dashboard: '/dashboard',
            subscriptions: '/subscriptions',
            analytics: '/analytics',
            faqs: '/faqs',
            payments: '/payments',
        },
    });
});
exports.default = router;
