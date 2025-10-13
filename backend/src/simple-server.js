"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var app = (0, express_1.default)();
var PORT = 4000;
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:5176',
    credentials: true
}));
app.use(express_1.default.json());
// Health check
app.get('/health', function (_req, res) {
    res.json({
        success: true,
        message: 'AI Orchestrator API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// Dashboard stats
app.get('/api/dashboard/stats', function (_req, res) {
    res.json({
        success: true,
        data: {
            totalChatbots: 5,
            totalMessages: 1250,
            activeUsers: 89,
            revenue: 12500.50,
            growth: 12.5
        }
    });
});
// Chatbots
app.get('/api/chatbots', function (_req, res) {
    res.json({
        success: true,
        data: [
            {
                id: '1',
                name: 'Customer Support Bot',
                description: 'Handles customer inquiries',
                status: 'active',
                createdAt: new Date().toISOString(),
                totalMessages: 450,
                satisfactionScore: 4.8
            },
            {
                id: '2',
                name: 'Sales Assistant',
                description: 'Generates leads and answers sales queries',
                status: 'active',
                createdAt: new Date().toISOString(),
                totalMessages: 320,
                satisfactionScore: 4.6
            }
        ]
    });
});
// Dashboard analytics
app.get('/api/dashboard/analytics', function (_req, res) {
    res.json({
        success: true,
        data: [
            {
                id: '1',
                type: 'chatbot_created',
                message: 'New chatbot "Customer Support Bot" created',
                timestamp: new Date().toISOString(),
                user: 'John Doe'
            },
            {
                id: '2',
                type: 'message_sent',
                message: '500 messages sent today',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                user: 'System'
            }
        ]
    });
});
// Create chatbot
app.post('/api/chatbots', function (req, res) {
    res.json({
        success: true,
        message: 'Chatbot created successfully',
        data: __assign(__assign({ id: Date.now().toString() }, req.body), { status: 'active', createdAt: new Date().toISOString(), totalMessages: 0, satisfactionScore: 0 })
    });
});
// Chatbot integrations
app.get('/api/chatbots/:id/integrations', function (_req, res) {
    res.json({
        success: true,
        data: [
            {
                id: '1',
                type: 'whatsapp',
                status: 'connected',
                phoneNumber: '+1234567890',
                connectedAt: new Date().toISOString()
            },
            {
                id: '2',
                type: 'messenger',
                status: 'connected',
                pageId: '123456789',
                connectedAt: new Date().toISOString()
            }
        ]
    });
});
// Connect WhatsApp
app.post('/api/chatbots/:id/integrations/whatsapp', function (req, res) {
    res.json({
        success: true,
        message: 'WhatsApp integration configured successfully',
        data: {
            chatbotId: req.params.id,
            integration: 'whatsapp',
            status: 'connected',
            phoneNumber: req.body.phoneNumber || '+1234567890',
            connectedAt: new Date().toISOString()
        }
    });
});
// Connect Messenger
app.post('/api/chatbots/:id/integrations/messenger', function (req, res) {
    res.json({
        success: true,
        message: 'Facebook Messenger integration configured successfully',
        data: {
            chatbotId: req.params.id,
            integration: 'messenger',
            status: 'connected',
            pageId: req.body.pageId || '123456789',
            connectedAt: new Date().toISOString()
        }
    });
});
// Connect Telegram
app.post('/api/chatbots/:id/integrations/telegram', function (req, res) {
    res.json({
        success: true,
        message: 'Telegram integration configured successfully',
        data: {
            chatbotId: req.params.id,
            integration: 'telegram',
            status: 'connected',
            username: req.body.username || 'ai_orchestrator_bot',
            connectedAt: new Date().toISOString()
        }
    });
});
// Connect Shopify
app.post('/api/chatbots/:id/integrations/shopify', function (req, res) {
    res.json({
        success: true,
        message: 'Shopify integration configured successfully',
        data: {
            chatbotId: req.params.id,
            integration: 'shopify',
            status: 'connected',
            storeUrl: req.body.storeUrl || 'https://demo-store.myshopify.com',
            connectedAt: new Date().toISOString()
        }
    });
});
// Disconnect integration
app.delete('/api/chatbots/:id/integrations/:integrationId', function (_req, res) {
    res.json({
        success: true,
        message: "".concat(_req.params.integrationId, " integration disconnected successfully")
    });
});
// Workflows
app.get('/api/workflows', function (_req, res) {
    res.json({
        success: true,
        data: [
            {
                id: '1',
                name: 'Customer Onboarding',
                status: 'active',
                triggers: ['new_user'],
                actions: ['send_welcome', 'collect_info'],
                createdAt: new Date().toISOString()
            }
        ]
    });
});
app.post('/api/workflows', function (req, res) {
    res.json({
        success: true,
        message: 'Workflow created successfully',
        data: __assign(__assign({ id: Date.now().toString() }, req.body), { status: 'active', createdAt: new Date().toISOString() })
    });
});
// Analytics
app.get('/api/analytics', function (_req, res) {
    res.json({
        success: true,
        data: {
            totalMessages: 1250,
            activeChatbots: 5,
            avgResponseTime: 1.2,
            satisfactionScore: 4.7,
            charts: {
                messagesOverTime: [
                    { date: '2024-01-01', count: 120 },
                    { date: '2024-01-02', count: 135 },
                    { date: '2024-01-03', count: 110 }
                ],
                chatbotPerformance: [
                    { name: 'Support Bot', messages: 500, satisfaction: 4.9 },
                    { name: 'Sales Bot', messages: 350, satisfaction: 4.7 }
                ]
            }
        }
    });
});
// Settings
app.get('/api/settings', function (_req, res) {
    res.json({
        success: true,
        data: {
            notifications: {
                email: true,
                push: false,
                sms: false
            },
            privacy: {
                dataRetention: '30d',
                analytics: true
            },
            integrations: {
                whatsapp: true,
                messenger: true,
                telegram: false,
                shopify: false
            }
        }
    });
});
app.put('/api/settings', function (req, res) {
    res.json({
        success: true,
        message: 'Settings updated successfully',
        data: req.body
    });
});
// FAQ
app.get('/api/faqs', function (_req, res) {
    res.json({
        success: true,
        data: [
            {
                id: '1',
                question: 'How do I create a chatbot?',
                answer: 'Go to the Chatbots section and click "Create New Bot".',
                category: 'Getting Started',
                createdAt: new Date().toISOString()
            }
        ]
    });
});
// Notifications
app.get('/api/notifications', function (_req, res) {
    res.json({
        success: true,
        data: [
            {
                id: '1',
                title: 'New chatbot created',
                message: 'Your chatbot "Support Bot" is ready to use',
                type: 'success',
                read: false,
                createdAt: new Date().toISOString()
            }
        ]
    });
});
// Error handling
app.use(function (_req, res) {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 AI Orchestrator Simple Backend running on port ".concat(PORT));
    console.log("\uD83D\uDCCA Health check: http://localhost:".concat(PORT, "/health"));
    console.log("\uD83D\uDD17 API docs: http://localhost:".concat(PORT, "/api"));
});
