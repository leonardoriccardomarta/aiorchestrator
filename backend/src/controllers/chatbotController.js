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
exports.sendMessage = exports.getChatbotStats = exports.deleteChatbot = exports.updateChatbot = exports.getChatbot = exports.getChatbots = exports.createChatbot = exports.chatbotController = exports.ChatbotController = void 0;
var chatbotService_1 = require("../services/chatbotService");
var errorHandler_1 = require("../middleware/errorHandler");
var ChatbotController = /** @class */ (function () {
    function ChatbotController() {
    }
    ChatbotController.prototype.createChatbot = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, data, chatbot, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
                        data = req.body;
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
                        return [4 /*yield*/, chatbotService_1.chatbotService.createChatbot(data, userId, tenantId)];
                    case 2:
                        chatbot = _b.sent();
                        res.status(201).json({
                            success: true,
                            data: chatbot,
                            message: 'Chatbot created successfully',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        next(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotController.prototype.getChatbots = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, page, limit, result, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
                        page = parseInt(req.query['page']) || 1;
                        limit = parseInt(req.query['limit']) || 20;
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
                        return [4 /*yield*/, chatbotService_1.chatbotService.getChatbots(userId, tenantId, page, limit)];
                    case 2:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result.chatbots,
                            pagination: {
                                page: page,
                                limit: limit,
                                total: result.total,
                                totalPages: Math.ceil(result.total / limit),
                            },
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        next(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotController.prototype.getChatbot = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, id, chatbot, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
                        id = req.params.id;
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
                        return [4 /*yield*/, chatbotService_1.chatbotService.getChatbot(id, userId, tenantId)];
                    case 2:
                        chatbot = _b.sent();
                        res.json({
                            success: true,
                            data: chatbot,
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
    ChatbotController.prototype.updateChatbot = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, id, data, chatbot, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
                        id = req.params.id;
                        data = req.body;
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
                        return [4 /*yield*/, chatbotService_1.chatbotService.updateChatbot(id, data, userId, tenantId)];
                    case 2:
                        chatbot = _b.sent();
                        res.json({
                            success: true,
                            data: chatbot,
                            message: 'Chatbot updated successfully',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        next(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotController.prototype.deleteChatbot = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, id, error_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
                        id = req.params.id;
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
                        return [4 /*yield*/, chatbotService_1.chatbotService.deleteChatbot(id, userId, tenantId)];
                    case 2:
                        _b.sent();
                        res.json({
                            success: true,
                            message: 'Chatbot deleted successfully',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _b.sent();
                        next(error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotController.prototype.getChatbotStats = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, stats, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
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
                        return [4 /*yield*/, chatbotService_1.chatbotService.getChatbotStats(userId, tenantId)];
                    case 2:
                        stats = _b.sent();
                        res.json({
                            success: true,
                            data: stats,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _b.sent();
                        next(error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatbotController.prototype.sendMessage = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tenantId, id, sessionId, chatbot, mockResponse, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        tenantId = req.tenantId;
                        id = req.params.id;
                        sessionId = req.body.sessionId;
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
                        return [4 /*yield*/, chatbotService_1.chatbotService.getChatbot(id, userId, tenantId)];
                    case 2:
                        chatbot = _b.sent();
                        mockResponse = {
                            message: "Hello! I'm ".concat(chatbot.name, ". How can I help you today?"),
                            sessionId: sessionId || "session_".concat(Date.now()),
                            timestamp: new Date().toISOString(),
                        };
                        // Update chatbot metrics
                        return [4 /*yield*/, chatbotService_1.chatbotService.updateChatbotMetrics(id, {
                                totalMessages: chatbot.totalMessages + 1,
                                avgResponseTime: chatbot.avgResponseTime,
                                satisfactionScore: chatbot.satisfactionScore,
                            })];
                    case 3:
                        // Update chatbot metrics
                        _b.sent();
                        res.json({
                            success: true,
                            data: mockResponse,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_7 = _b.sent();
                        next(error_7);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ChatbotController;
}());
exports.ChatbotController = ChatbotController;
exports.chatbotController = new ChatbotController();
// Async handler wrappers
exports.createChatbot = (0, errorHandler_1.asyncHandler)(exports.chatbotController.createChatbot.bind(exports.chatbotController));
exports.getChatbots = (0, errorHandler_1.asyncHandler)(exports.chatbotController.getChatbots.bind(exports.chatbotController));
exports.getChatbot = (0, errorHandler_1.asyncHandler)(exports.chatbotController.getChatbot.bind(exports.chatbotController));
exports.updateChatbot = (0, errorHandler_1.asyncHandler)(exports.chatbotController.updateChatbot.bind(exports.chatbotController));
exports.deleteChatbot = (0, errorHandler_1.asyncHandler)(exports.chatbotController.deleteChatbot.bind(exports.chatbotController));
exports.getChatbotStats = (0, errorHandler_1.asyncHandler)(exports.chatbotController.getChatbotStats.bind(exports.chatbotController));
exports.sendMessage = (0, errorHandler_1.asyncHandler)(exports.chatbotController.sendMessage.bind(exports.chatbotController));
