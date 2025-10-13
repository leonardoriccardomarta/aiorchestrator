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
exports.startMetricsCollection = exports.checkAlerts = exports.collectSystemMetrics = exports.databaseMonitoring = exports.errorRateMonitoring = exports.healthCheckMonitoring = exports.apiUsageTracking = exports.performanceMonitoring = void 0;
var logger_1 = require("../config/logger");
var CacheService_1 = require("../services/CacheService");
// Performance monitoring
var performanceMonitoring = function (req, res, next) {
    var startTime = process.hrtime.bigint();
    var startMemory = process.memoryUsage();
    res.on('finish', function () {
        var endTime = process.hrtime.bigint();
        var endMemory = process.memoryUsage();
        var duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        var memoryDelta = {
            rss: endMemory.rss - startMemory.rss,
            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
            heapTotal: endMemory.heapTotal - startMemory.heapTotal,
            external: endMemory.external - startMemory.external,
        };
        // Log performance metrics
        logger_1.logger.info('Request performance metrics', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: "".concat(duration.toFixed(2), "ms"),
            memoryDelta: memoryDelta,
            timestamp: new Date().toISOString(),
        });
        // Track slow requests
        if (duration > 1000) { // 1 second
            logger_1.logger.warn('Slow request detected', {
                method: req.method,
                url: req.url,
                duration: "".concat(duration.toFixed(2), "ms"),
                statusCode: res.statusCode,
            });
        }
        // Track high memory usage
        if (memoryDelta.heapUsed > 10 * 1024 * 1024) { // 10MB
            logger_1.logger.warn('High memory usage detected', {
                method: req.method,
                url: req.url,
                memoryDelta: "".concat((memoryDelta.heapUsed / 1024 / 1024).toFixed(2), "MB"),
            });
        }
    });
    next();
};
exports.performanceMonitoring = performanceMonitoring;
// API usage tracking
var apiUsageTracking = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var endpoint, userId, tenantId, today;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                endpoint = "".concat(req.method, " ").concat(req.path);
                userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous';
                tenantId = req.tenantId || 'unknown';
                // Increment API call counter
                return [4 /*yield*/, CacheService_1.cacheService.increment("api:calls:".concat(endpoint), 1)];
            case 1:
                // Increment API call counter
                _b.sent();
                return [4 /*yield*/, CacheService_1.cacheService.increment("api:calls:user:".concat(userId), 1)];
            case 2:
                _b.sent();
                return [4 /*yield*/, CacheService_1.cacheService.increment("api:calls:tenant:".concat(tenantId), 1)];
            case 3:
                _b.sent();
                today = new Date().toISOString().split('T')[0];
                return [4 /*yield*/, CacheService_1.cacheService.increment("api:daily:".concat(today, ":").concat(endpoint), 1)];
            case 4:
                _b.sent();
                return [4 /*yield*/, CacheService_1.cacheService.increment("api:daily:".concat(today, ":user:").concat(userId), 1)];
            case 5:
                _b.sent();
                res.on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var statusCode;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                statusCode = res.statusCode;
                                return [4 /*yield*/, CacheService_1.cacheService.increment("api:status:".concat(statusCode, ":").concat(endpoint), 1)];
                            case 1:
                                _a.sent();
                                if (!(statusCode >= 400)) return [3 /*break*/, 4];
                                return [4 /*yield*/, CacheService_1.cacheService.increment("api:errors:".concat(endpoint), 1)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, CacheService_1.cacheService.increment("api:errors:user:".concat(userId), 1)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.apiUsageTracking = apiUsageTracking;
// Health check monitoring
var healthCheckMonitoring = function (req, _res, next) {
    if (req.path === '/health' || req.path === '/api/health') {
        var healthData = {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage(),
            version: process.version,
            platform: process.platform,
        };
        logger_1.logger.info('Health check performed', healthData);
        // Store health data in cache for monitoring dashboard
        CacheService_1.cacheService.set('system:health', healthData, 60); // 1 minute TTL
    }
    next();
};
exports.healthCheckMonitoring = healthCheckMonitoring;
// Error rate monitoring
var errorRateMonitoring = function (req, res, next) {
    res.on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
        var statusCode, endpoint, errorData;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    statusCode = res.statusCode;
                    endpoint = "".concat(req.method, " ").concat(req.path);
                    if (!(statusCode >= 400)) return [3 /*break*/, 3];
                    errorData = {
                        endpoint: endpoint,
                        statusCode: statusCode,
                        timestamp: new Date().toISOString(),
                        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                        tenantId: req.tenantId,
                        ip: req.ip,
                        userAgent: req.headers['user-agent'],
                    };
                    logger_1.logger.error('API Error detected', errorData);
                    // Track error patterns
                    return [4 /*yield*/, CacheService_1.cacheService.increment("errors:".concat(endpoint, ":").concat(statusCode), 1)];
                case 1:
                    // Track error patterns
                    _b.sent();
                    return [4 /*yield*/, CacheService_1.cacheService.increment("errors:hourly:".concat(new Date().getHours()), 1)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
    next();
};
exports.errorRateMonitoring = errorRateMonitoring;
// Database query monitoring
exports.databaseMonitoring = {
    trackQuery: function (query, duration, success) {
        if (duration > 1000) { // Log slow queries (> 1 second)
            logger_1.logger.warn('Slow database query detected', {
                query: query.substring(0, 200), // Limit query length in logs
                duration: "".concat(duration, "ms"),
                success: success,
                timestamp: new Date().toISOString(),
            });
        }
        // Track query patterns
        CacheService_1.cacheService.increment("db:queries:".concat(success ? 'success' : 'error'), 1);
        CacheService_1.cacheService.increment("db:queries:duration:".concat(Math.floor(duration / 100)), 1);
    },
    trackConnection: function (action, details) {
        logger_1.logger.info("Database ".concat(action), {
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
        });
    },
};
// System metrics collection
var collectSystemMetrics = function () { return __awaiter(void 0, void 0, void 0, function () {
    var metrics;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                metrics = {
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage(),
                    version: process.version,
                    platform: process.platform,
                    nodeEnv: process.env['NODE_ENV'],
                };
                // Store metrics in cache
                return [4 /*yield*/, CacheService_1.cacheService.set('system:metrics', metrics, 300)];
            case 1:
                // Store metrics in cache
                _a.sent(); // 5 minutes TTL
                return [2 /*return*/, metrics];
        }
    });
}); };
exports.collectSystemMetrics = collectSystemMetrics;
// Alert system
var checkAlerts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var errorRate, totalRequests, errorPercentage, slowQueries, memoryUsage, memoryUsageMB, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, CacheService_1.cacheService.get('api:errors:total')];
            case 1:
                errorRate = (_a.sent()) || 0;
                return [4 /*yield*/, CacheService_1.cacheService.get('api:calls:total')];
            case 2:
                totalRequests = (_a.sent()) || 1;
                errorPercentage = (errorRate / totalRequests) * 100;
                if (errorPercentage > 10) { // Alert if error rate > 10%
                    logger_1.logger.error('High error rate detected', {
                        errorRate: "".concat(errorPercentage.toFixed(2), "%"),
                        totalErrors: errorRate,
                        totalRequests: totalRequests,
                    });
                }
                return [4 /*yield*/, CacheService_1.cacheService.get('db:queries:duration:10')];
            case 3:
                slowQueries = (_a.sent()) || 0;
                if (slowQueries > 50) { // Alert if > 50 slow queries
                    logger_1.logger.error('High number of slow database queries', {
                        slowQueries: slowQueries,
                    });
                }
                memoryUsage = process.memoryUsage();
                memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
                if (memoryUsageMB > 500) { // Alert if memory usage > 500MB
                    logger_1.logger.error('High memory usage detected', {
                        memoryUsage: "".concat(memoryUsageMB.toFixed(2), "MB"),
                    });
                }
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                logger_1.logger.error('Error checking alerts:', error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.checkAlerts = checkAlerts;
// Periodic metrics collection
var startMetricsCollection = function () {
    // Collect system metrics every 5 minutes
    setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.collectSystemMetrics)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.checkAlerts)()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 5 * 60 * 1000);
    // Log startup
    logger_1.logger.info('Metrics collection started');
};
exports.startMetricsCollection = startMetricsCollection;
