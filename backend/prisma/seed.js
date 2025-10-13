"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcryptjs_1 = require("bcryptjs");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var defaultTenant, hashedPassword, adminUser, demoUser, chatbot1, faqs, _i, faqs_1, faq, plans, _a, plans_1, plan, analyticsData, _b, analyticsData_1, analytics, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🌱 Starting database seed...');
                    return [4 /*yield*/, prisma.tenant.upsert({
                            where: { id: 'default-tenant' },
                            update: {},
                            create: {
                                id: 'default-tenant',
                                name: 'Default Tenant',
                                domain: 'localhost',
                                isActive: true,
                            },
                        })];
                case 1:
                    defaultTenant = _c.sent();
                    console.log('✅ Default tenant created:', defaultTenant.name);
                    return [4 /*yield*/, bcryptjs_1.default.hash('admin123', 12)];
                case 2:
                    hashedPassword = _c.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'admin@example.com' },
                            update: {},
                            create: {
                                email: 'admin@example.com',
                                firstName: 'Admin',
                                lastName: 'User',
                                password: hashedPassword,
                                isActive: true,
                                isVerified: true,
                                emailVerifiedAt: new Date(),
                                tenantId: defaultTenant.id,
                                role: 'ADMIN',
                            },
                        })];
                case 3:
                    adminUser = _c.sent();
                    console.log('✅ Admin user created:', adminUser.email);
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'demo@example.com' },
                            update: {},
                            create: {
                                email: 'demo@example.com',
                                firstName: 'Demo',
                                lastName: 'User',
                                password: hashedPassword,
                                isActive: true,
                                isVerified: true,
                                emailVerifiedAt: new Date(),
                                tenantId: defaultTenant.id,
                                role: 'USER',
                            },
                        })];
                case 4:
                    demoUser = _c.sent();
                    console.log('✅ Demo user created:', demoUser.email);
                    return [4 /*yield*/, prisma.chatbot.upsert({
                            where: { id: 'demo-chatbot-1' },
                            update: {},
                            create: {
                                id: 'demo-chatbot-1',
                                name: 'Customer Support Bot',
                                description: 'Helps customers with common questions and support issues',
                                isActive: true,
                                ownerId: adminUser.id,
                                tenantId: defaultTenant.id,
                                model: 'gpt-3.5-turbo',
                                personality: 'helpful',
                                responseStyle: 'professional',
                                temperature: 0.7,
                                maxTokens: 1000,
                                whatsappEnabled: true,
                                messengerEnabled: true,
                                totalMessages: 150,
                                avgResponseTime: 1.2,
                                satisfactionScore: 4.8,
                            },
                        })];
                case 5:
                    chatbot1 = _c.sent();
                    return [4 /*yield*/, prisma.chatbot.upsert({
                            where: { id: 'demo-chatbot-2' },
                            update: {},
                            create: {
                                id: 'demo-chatbot-2',
                                name: 'Sales Assistant',
                                description: 'Assists with product inquiries and sales questions',
                                isActive: true,
                                ownerId: adminUser.id,
                                tenantId: defaultTenant.id,
                                model: 'gpt-4',
                                personality: 'friendly',
                                responseStyle: 'conversational',
                                temperature: 0.8,
                                maxTokens: 1500,
                                telegramEnabled: true,
                                shopifyEnabled: true,
                                totalMessages: 89,
                                avgResponseTime: 0.9,
                                satisfactionScore: 4.9,
                            },
                        })];
                case 6:
                    _c.sent();
                    console.log('✅ Sample chatbots created');
                    faqs = [
                        {
                            question: 'How do I create a new chatbot?',
                            answer: 'Go to the Chatbots section in your dashboard and click "Create New Bot". Fill in the required information and configure your bot settings.',
                            category: 'Getting Started',
                            tags: 'chatbot,create,setup',
                        },
                        {
                            question: 'How to integrate with WhatsApp?',
                            answer: 'Use the integration panel in your chatbot settings. You\'ll need to provide your WhatsApp Business API credentials.',
                            category: 'Integrations',
                            tags: 'whatsapp,integration,api',
                        },
                        {
                            question: 'What AI models are supported?',
                            answer: 'We support OpenAI GPT-3.5-turbo, GPT-4, and other popular language models. You can choose the model that best fits your needs.',
                            category: 'AI Configuration',
                            tags: 'ai,models,openai,gpt',
                        },
                        {
                            question: 'How much does it cost?',
                            answer: 'We offer flexible pricing plans starting from $29/month. Check our pricing page for detailed information about features and limits.',
                            category: 'Billing',
                            tags: 'pricing,billing,plans',
                        },
                    ];
                    _i = 0, faqs_1 = faqs;
                    _c.label = 7;
                case 7:
                    if (!(_i < faqs_1.length)) return [3 /*break*/, 10];
                    faq = faqs_1[_i];
                    return [4 /*yield*/, prisma.fAQ.create({
                            data: {
                                question: faq.question,
                                answer: faq.answer,
                                category: faq.category,
                                tags: faq.tags,
                                isActive: true,
                                order: 0,
                                ownerId: adminUser.id,
                                tenantId: defaultTenant.id,
                            },
                        })];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10:
                    console.log('✅ Sample FAQs created');
                    plans = [
                        {
                            id: 'starter-plan',
                            name: 'Starter',
                            description: 'Perfect for small businesses getting started',
                            price: 2900, // $29.00 in cents
                            currency: 'usd',
                            interval: 'MONTHLY',
                            intervalCount: 1,
                            isActive: true,
                            apiCallsLimit: 10000,
                            storageLimit: 5,
                            usersLimit: 3,
                            chatbotsLimit: 5,
                            features: 'basic_support,whatsapp_integration,analytics',
                        },
                        {
                            id: 'professional-plan',
                            name: 'Professional',
                            description: 'For growing businesses with advanced needs',
                            price: 9900, // $99.00 in cents
                            currency: 'usd',
                            interval: 'MONTHLY',
                            intervalCount: 1,
                            isActive: true,
                            apiCallsLimit: 50000,
                            storageLimit: 25,
                            usersLimit: 10,
                            chatbotsLimit: 20,
                            features: 'priority_support,all_integrations,advanced_analytics,workflows',
                        },
                        {
                            id: 'enterprise-plan',
                            name: 'Enterprise',
                            description: 'For large organizations with custom requirements',
                            price: 29900, // $299.00 in cents
                            currency: 'usd',
                            interval: 'MONTHLY',
                            intervalCount: 1,
                            isActive: true,
                            apiCallsLimit: 200000,
                            storageLimit: 100,
                            usersLimit: 50,
                            chatbotsLimit: 100,
                            features: 'dedicated_support,all_integrations,advanced_analytics,workflows,custom_branding,api_access',
                        },
                    ];
                    _a = 0, plans_1 = plans;
                    _c.label = 11;
                case 11:
                    if (!(_a < plans_1.length)) return [3 /*break*/, 14];
                    plan = plans_1[_a];
                    return [4 /*yield*/, prisma.plan.upsert({
                            where: { id: plan.id },
                            update: {},
                            create: plan,
                        })];
                case 12:
                    _c.sent();
                    _c.label = 13;
                case 13:
                    _a++;
                    return [3 /*break*/, 11];
                case 14:
                    console.log('✅ Sample plans created');
                    analyticsData = [
                        {
                            type: 'MESSAGE_SENT',
                            entityId: chatbot1.id,
                            entityType: 'chatbot',
                            tenantId: defaultTenant.id,
                            userId: adminUser.id,
                            data: JSON.stringify({
                                messageCount: 150,
                                responseTime: 1.2,
                                satisfaction: 4.8,
                                timestamp: new Date().toISOString(),
                            }),
                        },
                        {
                            type: 'USER_ACTIVITY',
                            entityId: adminUser.id,
                            entityType: 'user',
                            tenantId: defaultTenant.id,
                            userId: adminUser.id,
                            data: JSON.stringify({
                                action: 'chatbot_created',
                                chatbotId: chatbot1.id,
                                timestamp: new Date().toISOString(),
                            }),
                        },
                    ];
                    _b = 0, analyticsData_1 = analyticsData;
                    _c.label = 15;
                case 15:
                    if (!(_b < analyticsData_1.length)) return [3 /*break*/, 20];
                    analytics = analyticsData_1[_b];
                    _c.label = 16;
                case 16:
                    _c.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, prisma.analytics.create({
                            data: analytics,
                        })];
                case 17:
                    _c.sent();
                    return [3 /*break*/, 19];
                case 18:
                    error_1 = _c.sent();
                    console.log('⚠️  Analytics creation skipped (foreign key constraint)');
                    return [3 /*break*/, 19];
                case 19:
                    _b++;
                    return [3 /*break*/, 15];
                case 20:
                    console.log('✅ Sample analytics data created');
                    console.log('🎉 Database seed completed successfully!');
                    console.log('\n📋 Default credentials:');
                    console.log('Admin: admin@example.com / admin123');
                    console.log('Demo: demo@example.com / admin123');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
