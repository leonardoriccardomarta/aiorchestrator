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
exports.BaseService = void 0;
var database_1 = require("../config/database");
var logger_1 = require("../config/logger");
var BaseService = /** @class */ (function () {
    function BaseService(serviceName) {
        this.prisma = database_1.prisma;
        this.serviceName = serviceName;
    }
    BaseService.prototype.executeWithLogging = function (operation, operationName, context) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, result, duration, error_1, duration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        logger_1.logger.info("".concat(this.serviceName, ": Starting ").concat(operationName), {
                            service: this.serviceName,
                            operation: operationName,
                            context: context,
                        });
                        return [4 /*yield*/, operation()];
                    case 2:
                        result = _a.sent();
                        duration = Date.now() - startTime;
                        logger_1.logger.info("".concat(this.serviceName, ": Completed ").concat(operationName), {
                            service: this.serviceName,
                            operation: operationName,
                            duration: duration,
                            success: true,
                        });
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        duration = Date.now() - startTime;
                        logger_1.logger.error("".concat(this.serviceName, ": Failed ").concat(operationName), {
                            service: this.serviceName,
                            operation: operationName,
                            duration: duration,
                            error: error_1 instanceof Error ? error_1.message : 'Unknown error',
                            context: context,
                        });
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BaseService.prototype.auditLog = function (userId, action, resource, resourceId, details) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
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
                        error_2 = _a.sent();
                        logger_1.logger.error('Failed to create audit log', {
                            error: error_2 instanceof Error ? error_2.message : 'Unknown error',
                            userId: userId,
                            action: action,
                            resource: resource,
                            resourceId: resourceId,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BaseService.prototype.trackAnalytics = function (type, entityId, entityType, userId, tenantId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
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
                        error_3 = _a.sent();
                        logger_1.logger.error('Failed to track analytics', {
                            error: error_3 instanceof Error ? error_3.message : 'Unknown error',
                            type: type,
                            entityId: entityId,
                            entityType: entityType,
                            userId: userId,
                            tenantId: tenantId,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BaseService.prototype.validateTenantAccess = function (userId, tenantId) {
        var _this = this;
        return this.executeWithLogging(function () { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { id: userId },
                            select: { tenantId: true, isActive: true },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user || !user.isActive) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, user.tenantId === tenantId];
                }
            });
        }); }, 'validateTenantAccess', { userId: userId, tenantId: tenantId });
    };
    BaseService.prototype.checkResourceOwnership = function (resourceId, userId, resourceType) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.executeWithLogging(function () { return __awaiter(_this, void 0, void 0, function () {
                        var resource;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.prisma[resourceType].findFirst({
                                        where: {
                                            id: resourceId,
                                            ownerId: userId,
                                        },
                                    })];
                                case 1:
                                    resource = _a.sent();
                                    return [2 /*return*/, !!resource];
                            }
                        });
                    }); }, 'checkResourceOwnership', { resourceId: resourceId, userId: userId, resourceType: resourceType })];
            });
        });
    };
    BaseService.prototype.checkSubscriptionLimits = function (userId, tenantId, resourceType) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.executeWithLogging(function () { return __awaiter(_this, void 0, void 0, function () {
                        var subscription, planLimits, limit, current, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, this.prisma.subscription.findFirst({
                                        where: {
                                            userId: userId,
                                            tenantId: tenantId,
                                            status: 'ACTIVE',
                                        }
                                    })];
                                case 1:
                                    subscription = _b.sent();
                                    if (!subscription) {
                                        return [2 /*return*/, { canCreate: false }];
                                    }
                                    planLimits = {
                                        chatbots: 5,
                                        storage: 10,
                                        users: 10
                                    };
                                    current = 0;
                                    _a = resourceType;
                                    switch (_a) {
                                        case 'chatbot': return [3 /*break*/, 2];
                                        case 'user': return [3 /*break*/, 4];
                                    }
                                    return [3 /*break*/, 6];
                                case 2:
                                    limit = planLimits.chatbots;
                                    return [4 /*yield*/, this.prisma.chatbot.count({
                                            where: {
                                                ownerId: userId,
                                                tenantId: tenantId,
                                            },
                                        })];
                                case 3:
                                    current = _b.sent();
                                    return [3 /*break*/, 7];
                                case 4:
                                    limit = planLimits.users;
                                    return [4 /*yield*/, this.prisma.user.count({
                                            where: {
                                                tenantId: tenantId,
                                                isActive: true,
                                            },
                                        })];
                                case 5:
                                    current = _b.sent();
                                    return [3 /*break*/, 7];
                                case 6: return [2 /*return*/, { canCreate: true }];
                                case 7: return [2 /*return*/, {
                                        canCreate: !limit || current < limit,
                                        limit: limit,
                                        current: current,
                                    }];
                            }
                        });
                    }); }, 'checkSubscriptionLimits', { userId: userId, tenantId: tenantId, resourceType: resourceType })];
            });
        });
    };
    BaseService.prototype.handleDatabaseError = function (error, operation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger_1.logger.error("".concat(this.serviceName, ": Database error in ").concat(operation), {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    operation: operation,
                    service: this.serviceName,
                });
                // Handle specific Prisma errors
                if (error.code === 'P2002') {
                    throw new Error('A record with this information already exists');
                }
                else if (error.code === 'P2025') {
                    throw new Error('Record not found');
                }
                else if (error.code === 'P2003') {
                    throw new Error('Invalid reference to related record');
                }
                throw error;
            });
        });
    };
    return BaseService;
}());
exports.BaseService = BaseService;
