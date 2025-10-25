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
exports.chatbotService = exports.ChatbotService = void 0;
var database_1 = require("../config/database");
var logger_1 = require("../config/logger");
var errorHandler_1 = require("../middleware/errorHandler");
var ChatbotService = /** @class */ (function () {
    function ChatbotService() {
        this.prisma = database_1.prisma;
    }
    ChatbotService.prototype.createChatbot = function (data, userId, tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            var chatbot, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.prisma.chatbot.create({
                                data: {
                                    name: data.name,
                                    description: data.description || null,
                                    ownerId: userId,
                                    tenantId: tenantId,
                                    model: data.model || 'gpt-3.5-turbo',
                                    personality: data.personality || 'helpful',
                                    responseStyle: data.responseStyle || 'professional',
                                    temperature: data.temperature || 0.7,
                                    maxTokens: data.maxTokens || 1000,
                                    whatsappEnabled: data.whatsappEnabled || false,
                                    messengerEnabled: data.messengerEnabled || false,
                                    telegramEnabled: data.telegramEnabled || false,
                                    shopifyEnabled: data.shopifyEnabled || false,
                                    webhookUrl: data.webhookUrl || null,
                                },
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                    case 1:
                        chatbot = _a.sent();
                        // Log creation
                        return [4 /*yield*/, this.logAuditEvent(userId, 'CHATBOT_CREATED', 'chatbot', chatbot.id)];
                    case 2:
                        // Log creation
                        _a.sent();
                        // Track analytics
                        return [4 /*yield*/, this.trackAnalytics('CHATBOT_CREATED', chatbot.id, 'chatbot', userId, tenantId)];
                    case 3:
                        // Track analytics
                        _a.sent();
                        logger_1.logger.info('Chatbot created successfully', {
                            chatbotId: chatbot.id,
                            userId: userId,
                            tenantId: tenantId
                        });
                        return [2 /*return*/, chatbot];
                    case 4:
                        error_1 = _a.sent();
                        logger_1.logger.error('Failed to create chatbot:', error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotService.prototype.getChatbots = function (userId_1, tenantId_1) {
        return __awaiter(this, arguments, void 0, function (userId, tenantId, page, limit) {
            var skip, _a, chatbots, total, error_2;
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        skip = (page - 1) * limit;
                        return [4 /*yield*/, Promise.all([
                                this.prisma.chatbot.findMany({
                                    where: {
                                        ownerId: userId,
                                        tenantId: tenantId,
                                    },
                                    include: {
                                        owner: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                email: true,
                                            },
                                        },
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' },
                                }),
                                this.prisma.chatbot.count({
                                    where: {
                                        ownerId: userId,
                                        tenantId: tenantId,
                                    },
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), chatbots = _a[0], total = _a[1];
                        return [2 /*return*/, { chatbots: chatbots, total: total }];
                    case 2:
                        error_2 = _b.sent();
                        logger_1.logger.error('Failed to get chatbots:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotService.prototype.getChatbot = function (id, userId, tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            var chatbot, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.chatbot.findFirst({
                                where: {
                                    id: id,
                                    ownerId: userId,
                                    tenantId: tenantId,
                                },
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                    case 1:
                        chatbot = _a.sent();
                        if (!chatbot) {
                            throw new errorHandler_1.AppError('Chatbot not found', 404);
                        }
                        return [2 /*return*/, chatbot];
                    case 2:
                        error_3 = _a.sent();
                        logger_1.logger.error('Failed to get chatbot:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotService.prototype.updateChatbot = function (id, data, userId, tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingChatbot, chatbot, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.prisma.chatbot.findFirst({
                                where: {
                                    id: id,
                                    ownerId: userId,
                                    tenantId: tenantId,
                                },
                            })];
                    case 1:
                        existingChatbot = _a.sent();
                        if (!existingChatbot) {
                            throw new errorHandler_1.AppError('Chatbot not found', 404);
                        }
                        return [4 /*yield*/, this.prisma.chatbot.update({
                                where: { id: id },
                                data: __assign(__assign({}, data), { updatedAt: new Date() }),
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                    case 2:
                        chatbot = _a.sent();
                        // Log update
                        return [4 /*yield*/, this.logAuditEvent(userId, 'CHATBOT_UPDATED', 'chatbot', id, data)];
                    case 3:
                        // Log update
                        _a.sent();
                        logger_1.logger.info('Chatbot updated successfully', {
                            chatbotId: id,
                            userId: userId,
                            tenantId: tenantId
                        });
                        return [2 /*return*/, chatbot];
                    case 4:
                        error_4 = _a.sent();
                        logger_1.logger.error('Failed to update chatbot:', error_4);
                        throw error_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotService.prototype.deleteChatbot = function (id, userId, tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingChatbot, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.prisma.chatbot.findFirst({
                                where: {
                                    id: id,
                                    ownerId: userId,
                                    tenantId: tenantId,
                                },
                            })];
                    case 1:
                        existingChatbot = _a.sent();
                        if (!existingChatbot) {
                            throw new errorHandler_1.AppError('Chatbot not found', 404);
                        }
                        return [4 /*yield*/, this.prisma.chatbot.delete({
                                where: { id: id },
                            })];
                    case 2:
                        _a.sent();
                        // Log deletion
                        return [4 /*yield*/, this.logAuditEvent(userId, 'CHATBOT_DELETED', 'chatbot', id)];
                    case 3:
                        // Log deletion
                        _a.sent();
                        logger_1.logger.info('Chatbot deleted successfully', {
                            chatbotId: id,
                            userId: userId,
                            tenantId: tenantId
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        logger_1.logger.error('Failed to delete chatbot:', error_5);
                        throw error_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotService.prototype.getChatbotStats = function (userId, tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            var chatbots, totalChatbots, activeChatbots, totalMessages, avgResponseTime, avgSatisfactionScore, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.chatbot.findMany({
                                where: {
                                    ownerId: userId,
                                    tenantId: tenantId,
                                },
                            })];
                    case 1:
                        chatbots = _a.sent();
                        totalChatbots = chatbots.length;
                        activeChatbots = chatbots.filter(function (c) { return c.isActive; }).length;
                        totalMessages = chatbots.reduce(function (sum, c) { return sum + c.totalMessages; }, 0);
                        avgResponseTime = chatbots.length > 0
                            ? chatbots.reduce(function (sum, c) { return sum + c.avgResponseTime; }, 0) / chatbots.length
                            : 0;
                        avgSatisfactionScore = chatbots.length > 0
                            ? chatbots.reduce(function (sum, c) { return sum + c.satisfactionScore; }, 0) / chatbots.length
                            : 0;
                        return [2 /*return*/, {
                                totalChatbots: totalChatbots,
                                activeChatbots: activeChatbots,
                                totalMessages: totalMessages,
                                avgResponseTime: avgResponseTime,
                                avgSatisfactionScore: avgSatisfactionScore,
                            }];
                    case 2:
                        error_6 = _a.sent();
                        logger_1.logger.error('Failed to get chatbot stats:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotService.prototype.updateChatbotMetrics = function (id, metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.chatbot.update({
                                where: { id: id },
                                data: __assign(__assign({}, metrics), { updatedAt: new Date() }),
                            })];
                    case 1:
                        _a.sent();
                        logger_1.logger.info('Chatbot metrics updated', { chatbotId: id, metrics: metrics });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        logger_1.logger.error('Failed to update chatbot metrics:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotService.prototype.logAuditEvent = function (userId, action, resource, resourceId, details) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.auditLog.create({
                                data: {
                                    userId: userId,
                                    action: action,
                                    resource: resource,
                                    resourceId: resourceId,
                                    details: details,
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        logger_1.logger.error('Failed to log audit event:', error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotService.prototype.trackAnalytics = function (type, entityId, entityType, userId, tenantId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.analytics.create({
                                data: {
                                    type: type,
                                    entityId: entityId,
                                    entityType: entityType,
                                    userId: userId,
                                    tenantId: tenantId,
                                    data: data,
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        logger_1.logger.error('Failed to track analytics:', error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotService.prototype.getEmbedCode = function (chatbotId) {
        return __awaiter(this, void 0, void 0, function () {
            var chatbot, user, userPlan, isProfessionalPlan, baseUrl, embedCode, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.chatbot.findUnique({
                                where: { id: chatbotId },
                                include: { user: true }
                            })];
                    case 1:
                        chatbot = _a.sent();
                        if (!chatbot) {
                            throw new errorHandler_1.AppError('Chatbot not found', 404);
                        }
                        user = chatbot.user;
                        userPlan = user?.planId || 'starter';
                        isProfessionalPlan = userPlan === 'professional' || userPlan === 'business';
                        baseUrl = process.env.API_URL || 'https://aiorchestrator-vtihz.ondigitalocean.app';
                        embedCode = "<!-- AI Orchestrator Chatbot Widget -->\n<script \n  src=\"".concat(baseUrl, "/chatbot-widget.js\"\n  data-ai-orchestrator-id=\"").concat(chatbotId, "\"\n  data-api-key=\"support-widget\"\n  data-theme=\"").concat(chatbot.theme || 'blue', "\"\n  data-title=\"").concat(chatbot.title || 'AI Support', "\"\n  data-placeholder=\"").concat(chatbot.placeholder || 'Type your message...', "\"\n  data-welcome-message=\"").concat(chatbot.welcomeMessage || 'Hello! How can I help you today?', "\"\n  data-primary-language=\"").concat(chatbot.primaryLanguage || 'auto', "\"\n  data-show-avatar=\"").concat(chatbot.showAvatar !== false, "\"");
                        if (isProfessionalPlan) {
                            embedCode += "\n  data-font-family=\"".concat(chatbot.fontFamily || 'Inter', "\"\n  data-logo=\"").concat(chatbot.logo || '', "\"');
                        }
                        embedCode += '\n  defer>\n</script>';
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    embedCode: embedCode,
                                    chatbotId: chatbotId,
                                    plan: userPlan,
                                    hasCustomBranding: isProfessionalPlan
                                }
                            }];
                    case 2:
                        error_10 = _a.sent();
                        logger_1.logger.error('Failed to get embed code:', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ChatbotService;
}());
exports.ChatbotService = ChatbotService;
exports.chatbotService = new ChatbotService();
