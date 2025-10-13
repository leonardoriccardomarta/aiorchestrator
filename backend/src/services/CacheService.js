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
exports.cacheService = exports.CacheService = void 0;
var redis_1 = require("redis");
var config_1 = require("../config");
var logger_1 = require("../config/logger");
var CacheService = /** @class */ (function () {
    function CacheService() {
        this.redis = null;
        this.isConnected = false;
        this.initializeRedis();
    }
    CacheService.prototype.initializeRedis = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.redis = redis_1.default.createClient({
                            url: config_1.config.REDIS_URL,
                        });
                        this.redis.on('error', function (error) {
                            logger_1.logger.error('Redis connection error:', error);
                            _this.isConnected = false;
                        });
                        this.redis.on('connect', function () {
                            logger_1.logger.info('Redis connected successfully');
                            _this.isConnected = true;
                        });
                        return [4 /*yield*/, this.redis.connect()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.logger.error('Failed to initialize Redis:', error_1);
                        this.isConnected = false;
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var value, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, null];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.get(key)];
                    case 2:
                        value = _a.sent();
                        return [2 /*return*/, value ? JSON.parse(value) : null];
                    case 3:
                        error_2 = _a.sent();
                        logger_1.logger.error('Redis GET error:', { key: key, error: error_2 });
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.set = function (key, value, ttlSeconds) {
        return __awaiter(this, void 0, void 0, function () {
            var serializedValue, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        serializedValue = JSON.stringify(value);
                        if (!ttlSeconds) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.redis.setEx(key, ttlSeconds, serializedValue)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.redis.set(key, serializedValue)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, true];
                    case 6:
                        error_3 = _a.sent();
                        logger_1.logger.error('Redis SET error:', { key: key, error: error_3 });
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.del = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.del(key)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_4 = _a.sent();
                        logger_1.logger.error('Redis DEL error:', { key: key, error: error_4 });
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.exists = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.exists(key)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result === 1];
                    case 3:
                        error_5 = _a.sent();
                        logger_1.logger.error('Redis EXISTS error:', { key: key, error: error_5 });
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.expire = function (key, ttlSeconds) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.expire(key, ttlSeconds)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_6 = _a.sent();
                        logger_1.logger.error('Redis EXPIRE error:', { key: key, error: error_6 });
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.increment = function (key_1) {
        return __awaiter(this, arguments, void 0, function (key, by) {
            var error_7;
            if (by === void 0) { by = 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, null];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.incrBy(key, by)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_7 = _a.sent();
                        logger_1.logger.error('Redis INCREMENT error:', { key: key, error: error_7 });
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.decrement = function (key_1) {
        return __awaiter(this, arguments, void 0, function (key, by) {
            var error_8;
            if (by === void 0) { by = 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, null];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.decrBy(key, by)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_8 = _a.sent();
                        logger_1.logger.error('Redis DECREMENT error:', { key: key, error: error_8 });
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.hget = function (key, field) {
        return __awaiter(this, void 0, void 0, function () {
            var value, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, null];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.hGet(key, field)];
                    case 2:
                        value = _a.sent();
                        return [2 /*return*/, value ? JSON.parse(value) : null];
                    case 3:
                        error_9 = _a.sent();
                        logger_1.logger.error('Redis HGET error:', { key: key, field: field, error: error_9 });
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.hset = function (key, field, value) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.hSet(key, field, JSON.stringify(value))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_10 = _a.sent();
                        logger_1.logger.error('Redis HSET error:', { key: key, field: field, error: error_10 });
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.hdel = function (key, field) {
        return __awaiter(this, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.hDel(key, field)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_11 = _a.sent();
                        logger_1.logger.error('Redis HDEL error:', { key: key, field: field, error: error_11 });
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.hgetall = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, result, _i, _a, _b, field, value, error_12;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.isConnected || !this.redis) {
                            return [2 /*return*/, null];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.hGetAll(key)];
                    case 2:
                        hash = _c.sent();
                        result = {};
                        for (_i = 0, _a = Object.entries(hash); _i < _a.length; _i++) {
                            _b = _a[_i], field = _b[0], value = _b[1];
                            result[field] = JSON.parse(value);
                        }
                        return [2 /*return*/, result];
                    case 3:
                        error_12 = _c.sent();
                        logger_1.logger.error('Redis HGETALL error:', { key: key, error: error_12 });
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Cache patterns
    CacheService.prototype.cacheUser = function (userId_1, userData_1) {
        return __awaiter(this, arguments, void 0, function (userId, userData, ttlSeconds) {
            if (ttlSeconds === void 0) { ttlSeconds = 3600; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.set("user:".concat(userId), userData, ttlSeconds)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.getCachedUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get("user:".concat(userId))];
            });
        });
    };
    CacheService.prototype.cacheChatbot = function (chatbotId_1, chatbotData_1) {
        return __awaiter(this, arguments, void 0, function (chatbotId, chatbotData, ttlSeconds) {
            if (ttlSeconds === void 0) { ttlSeconds = 1800; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.set("chatbot:".concat(chatbotId), chatbotData, ttlSeconds)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.getCachedChatbot = function (chatbotId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get("chatbot:".concat(chatbotId))];
            });
        });
    };
    CacheService.prototype.cacheSession = function (sessionId_1, sessionData_1) {
        return __awaiter(this, arguments, void 0, function (sessionId, sessionData, ttlSeconds) {
            if (ttlSeconds === void 0) { ttlSeconds = 1800; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.set("session:".concat(sessionId), sessionData, ttlSeconds)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.getCachedSession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get("session:".concat(sessionId))];
            });
        });
    };
    CacheService.prototype.incrementRateLimit = function (key_1) {
        return __awaiter(this, arguments, void 0, function (key, ttlSeconds) {
            var count;
            if (ttlSeconds === void 0) { ttlSeconds = 60; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.increment(key, 1)];
                    case 1:
                        count = (_a.sent()) || 0;
                        if (!(count === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.expire(key, ttlSeconds)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, count];
                }
            });
        });
    };
    CacheService.prototype.getRateLimit = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(key)];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count || 0];
                }
            });
        });
    };
    // Cache invalidation patterns
    CacheService.prototype.invalidateUserCache = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.del("user:".concat(userId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.invalidateChatbotCache = function (chatbotId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.del("chatbot:".concat(chatbotId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheService.prototype.invalidateTenantCache = function (tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // This would need to be implemented with pattern matching
                // For now, we'll use a simple approach
                logger_1.logger.info("Cache invalidation requested for tenant: ".concat(tenantId));
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.redis) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.redis.disconnect()];
                    case 1:
                        _a.sent();
                        this.isConnected = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return CacheService;
}());
exports.CacheService = CacheService;
exports.cacheService = new CacheService();
