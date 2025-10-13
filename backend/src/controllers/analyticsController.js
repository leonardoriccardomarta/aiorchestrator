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
exports.getUserAnalytics = exports.getRevenueAnalytics = exports.getAnalytics = void 0;
var database_1 = require("../config/database");
var logger_1 = require("../config/logger");
var getAnalytics = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, totalChatbots, totalFAQs, totalMessages, analytics, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, database_1.prisma.chatbot.count({
                        where: { ownerId: userId }
                    })];
            case 1:
                totalChatbots = _b.sent();
                return [4 /*yield*/, database_1.prisma.fAQ.count({
                        where: { ownerId: userId }
                    })];
            case 2:
                totalFAQs = _b.sent();
                return [4 /*yield*/, database_1.prisma.chatbot.aggregate({
                        where: { ownerId: userId },
                        _sum: { totalMessages: true }
                    })];
            case 3:
                totalMessages = _b.sent();
                analytics = {
                    totalChatbots: totalChatbots,
                    totalFAQs: totalFAQs,
                    totalMessages: totalMessages._sum.totalMessages || 0,
                    avgResponseTime: 1.2,
                    satisfactionScore: 4.5,
                    monthlyActiveUsers: 150,
                    conversionRate: 12.5,
                    revenue: 1250.00,
                    chartData: [
                        { date: '2024-01-01', messages: 100, users: 50 },
                        { date: '2024-01-02', messages: 120, users: 55 },
                        { date: '2024-01-03', messages: 140, users: 60 },
                        { date: '2024-01-04', messages: 160, users: 65 },
                        { date: '2024-01-05', messages: 180, users: 70 }
                    ]
                };
                res.json(analytics);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                logger_1.logger.error('Analytics error:', error_1);
                next(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAnalytics = getAnalytics;
var getRevenueAnalytics = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, revenueData;
    var _a;
    return __generator(this, function (_b) {
        try {
            userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                res.status(401).json({ error: 'User not authenticated' });
                return [2 /*return*/];
            }
            revenueData = {
                monthlyRevenue: 1250.00,
                totalRevenue: 12500.00,
                growthRate: 15.5,
                chartData: [
                    { month: 'Jan', revenue: 1000 },
                    { month: 'Feb', revenue: 1100 },
                    { month: 'Mar', revenue: 1250 },
                    { month: 'Apr', revenue: 1300 },
                    { month: 'May', revenue: 1250 }
                ]
            };
            res.json(revenueData);
        }
        catch (error) {
            logger_1.logger.error('Revenue analytics error:', error);
            next(error);
        }
        return [2 /*return*/];
    });
}); };
exports.getRevenueAnalytics = getRevenueAnalytics;
var getUserAnalytics = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userAnalytics;
    var _a;
    return __generator(this, function (_b) {
        try {
            userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                res.status(401).json({ error: 'User not authenticated' });
                return [2 /*return*/];
            }
            userAnalytics = {
                totalUsers: 150,
                activeUsers: 120,
                newUsers: 25,
                retentionRate: 85.5,
                chartData: [
                    { date: '2024-01-01', users: 100 },
                    { date: '2024-01-02', users: 105 },
                    { date: '2024-01-03', users: 110 },
                    { date: '2024-01-04', users: 115 },
                    { date: '2024-01-05', users: 120 }
                ]
            };
            res.json(userAnalytics);
        }
        catch (error) {
            logger_1.logger.error('User analytics error:', error);
            next(error);
        }
        return [2 /*return*/];
    });
}); };
exports.getUserAnalytics = getUserAnalytics;
