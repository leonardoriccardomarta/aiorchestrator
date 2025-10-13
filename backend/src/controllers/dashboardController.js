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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueData = exports.getAnalytics = exports.getRecentActivity = exports.getStats = exports.dashboardController = exports.DashboardController = void 0;
var database_1 = require("../config/database");
// import { logger } from '../config/logger';
var errorHandler_1 = require("../middleware/errorHandler");
var DashboardController = /** @class */ (function () {
    function DashboardController() {
    }
    DashboardController.prototype.getStats = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, chatbots, totalMessages, totalChatbots, activeUsers, avgResponseTime, subscription, plan, _a, stats, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                        tenantId = req.tenantId;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        if (!userId || !tenantId) {
                            res.status(401).json({
                                success: false,
                                error: 'Authentication required',
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, database_1.prisma.chatbot.findMany({
                                where: {
                                    ownerId: userId,
                                    tenantId: tenantId,
                                },
                            })];
                    case 2:
                        chatbots = _c.sent();
                        totalMessages = chatbots.reduce(function (sum, bot) { return sum + bot.totalMessages; }, 0);
                        totalChatbots = chatbots.length;
                        activeUsers = chatbots.filter(function (bot) { return bot.isActive; }).length;
                        avgResponseTime = chatbots.length > 0
                            ? chatbots.reduce(function (sum, bot) { return sum + bot.avgResponseTime; }, 0) / chatbots.length
                            : 0;
                        return [4 /*yield*/, database_1.prisma.subscription.findFirst({
                                where: {
                                    userId: userId,
                                    tenantId: tenantId,
                                    status: 'ACTIVE',
                                },
                            })];
                    case 3:
                        subscription = _c.sent();
                        if (!subscription) return [3 /*break*/, 5];
                        return [4 /*yield*/, database_1.prisma.plan.findUnique({
                                where: { id: subscription.planId }
                            })];
                    case 4:
                        _a = _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _a = null;
                        _c.label = 6;
                    case 6:
                        plan = _a;
                        stats = {
                            totalMessages: totalMessages,
                            totalChatbots: totalChatbots,
                            totalFAQs: 0,
                            monthlyActiveUsers: activeUsers,
                            avgResponseTime: avgResponseTime,
                            revenue: plan ? plan.price : 0,
                            conversionRate: 12.5,
                            satisfactionScore: 4.5,
                        };
                        res.json({
                            success: true,
                            data: stats,
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _c.sent();
                        next(error_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    DashboardController.prototype.getRecentActivity = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, limit, recentChatbots, recentAnalytics, activities, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
                        limit = parseInt(req.query['limit']) || 10;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!userId || !tenantId) {
                            res.status(401).json({
                                success: false,
                                error: 'Authentication required',
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, database_1.prisma.chatbot.findMany({
                                where: {
                                    ownerId: userId,
                                    tenantId: tenantId,
                                },
                                orderBy: { createdAt: 'desc' },
                                take: limit,
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    isActive: true,
                                    createdAt: true,
                                    totalMessages: true,
                                },
                            })];
                    case 2:
                        recentChatbots = _b.sent();
                        return [4 /*yield*/, database_1.prisma.analytics.findMany({
                                where: {
                                    userId: userId,
                                    tenantId: tenantId,
                                },
                                orderBy: { timestamp: 'desc' },
                                take: limit,
                                select: {
                                    id: true,
                                    type: true,
                                    data: true,
                                    timestamp: true,
                                },
                            })];
                    case 3:
                        recentAnalytics = _b.sent();
                        activities = __spreadArray(__spreadArray([], recentChatbots.map(function (bot) { return ({
                            id: bot.id,
                            type: 'chatbot_created',
                            title: "Created chatbot \"".concat(bot.name, "\""),
                            description: bot.description || 'No description',
                            timestamp: bot.createdAt,
                            data: {
                                chatbotId: bot.id,
                                isActive: bot.isActive,
                                totalMessages: bot.totalMessages,
                            },
                        }); }), true), recentAnalytics.map(function (analytic) { return ({
                            id: analytic.id,
                            type: analytic.type,
                            title: "Analytics event: ".concat(analytic.type),
                            description: 'System analytics event',
                            timestamp: analytic.timestamp,
                            data: analytic.data,
                        }); }), true).sort(function (a, b) { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); })
                            .slice(0, limit);
                        res.json({
                            success: true,
                            data: activities,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        next(error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DashboardController.prototype.getAnalytics = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, timeRange, now, startDate, analytics, chartData, chartArray, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
                        timeRange = req.query['timeRange'] || '7d';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        if (!userId || !tenantId) {
                            res.status(401).json({
                                success: false,
                                error: 'Authentication required',
                            });
                            return [2 /*return*/];
                        }
                        now = new Date();
                        startDate = void 0;
                        switch (timeRange) {
                            case '24h':
                                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                                break;
                            case '7d':
                                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                                break;
                            case '30d':
                                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                                break;
                            case '90d':
                                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                                break;
                            default:
                                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        }
                        return [4 /*yield*/, database_1.prisma.analytics.findMany({
                                where: {
                                    userId: userId,
                                    tenantId: tenantId,
                                    timestamp: {
                                        gte: startDate,
                                        lte: now,
                                    },
                                },
                                orderBy: { timestamp: 'asc' },
                            })];
                    case 2:
                        analytics = _b.sent();
                        chartData = analytics.reduce(function (acc, analytic) {
                            var date = analytic.timestamp.toISOString().split('T')[0] || '';
                            if (!acc[date]) {
                                acc[date] = {
                                    date: date,
                                    messages: 0,
                                    chatbots: 0,
                                    users: 0,
                                    errors: 0,
                                };
                            }
                            switch (analytic.type) {
                                case 'MESSAGE_SENT':
                                case 'MESSAGE_RECEIVED':
                                    acc[date].messages += 1;
                                    break;
                                case 'CHATBOT_CREATED':
                                    acc[date].chatbots += 1;
                                    break;
                                case 'USER_REGISTERED':
                                    acc[date].users += 1;
                                    break;
                                case 'ERROR_OCCURRED':
                                    acc[date].errors += 1;
                                    break;
                            }
                            return acc;
                        }, {});
                        chartArray = Object.values(chartData).sort(function (a, b) {
                            return new Date(a.date).getTime() - new Date(b.date).getTime();
                        });
                        res.json({
                            success: true,
                            data: {
                                timeRange: timeRange,
                                chartData: chartArray,
                                totalEvents: analytics.length,
                                summary: {
                                    messages: analytics.filter(function (a) { return a.type.includes('MESSAGE'); }).length,
                                    chatbots: analytics.filter(function (a) { return a.type === 'CHATBOT_CREATED'; }).length,
                                    users: analytics.filter(function (a) { return a.type === 'USER_REGISTERED'; }).length,
                                    errors: analytics.filter(function (a) { return a.type === 'ERROR_OCCURRED'; }).length,
                                },
                            },
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        next(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DashboardController.prototype.getRevenueData = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, subscription, plan, monthlyRevenue, yearlyRevenue, totalRevenue, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!userId || !tenantId) {
                            res.status(401).json({
                                success: false,
                                error: 'Authentication required',
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, database_1.prisma.subscription.findFirst({
                                where: {
                                    userId: userId,
                                    tenantId: tenantId,
                                    status: 'ACTIVE',
                                },
                            })];
                    case 2:
                        subscription = _b.sent();
                        if (!subscription) {
                            res.json({
                                success: true,
                                data: {
                                    currentPlan: null,
                                    monthlyRevenue: 0,
                                    yearlyRevenue: 0,
                                    totalRevenue: 0,
                                    nextBillingDate: null,
                                },
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, database_1.prisma.plan.findUnique({
                                where: { id: subscription.planId }
                            })];
                    case 3:
                        plan = _b.sent();
                        if (!plan) {
                            res.json({
                                success: true,
                                data: {
                                    currentPlan: null,
                                    monthlyRevenue: 0,
                                    yearlyRevenue: 0,
                                    totalRevenue: 0,
                                    nextBillingDate: null,
                                },
                            });
                            return [2 /*return*/];
                        }
                        monthlyRevenue = plan.price;
                        yearlyRevenue = plan.interval === 'YEARLY'
                            ? plan.price
                            : plan.price * 12;
                        totalRevenue = monthlyRevenue;
                        res.json({
                            success: true,
                            data: {
                                currentPlan: {
                                    id: plan.id,
                                    name: plan.name,
                                    price: plan.price,
                                    interval: plan.interval,
                                },
                                monthlyRevenue: monthlyRevenue,
                                yearlyRevenue: yearlyRevenue,
                                totalRevenue: totalRevenue,
                                nextBillingDate: subscription.currentPeriodEnd,
                                status: subscription.status,
                            },
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _b.sent();
                        next(error_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return DashboardController;
}());
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
// Async handler wrappers
exports.getStats = (0, errorHandler_1.asyncHandler)(exports.dashboardController.getStats.bind(exports.dashboardController));
exports.getRecentActivity = (0, errorHandler_1.asyncHandler)(exports.dashboardController.getRecentActivity.bind(exports.dashboardController));
exports.getAnalytics = (0, errorHandler_1.asyncHandler)(exports.dashboardController.getAnalytics.bind(exports.dashboardController));
exports.getRevenueData = (0, errorHandler_1.asyncHandler)(exports.dashboardController.getRevenueData.bind(exports.dashboardController));
