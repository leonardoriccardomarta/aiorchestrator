"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var express_rate_limit_1 = require("express-rate-limit");
var compression_1 = require("compression");
var morgan_1 = require("morgan");
var config_1 = require("./config");
var logger_1 = require("./config/logger");
var errorHandler_1 = require("./middleware/errorHandler");
// import { requestLogger } from './middleware/requestLogger';
var routes_1 = require("./routes");
var database_1 = require("./config/database");
var app = (0, express_1.default)();
var PORT = config_1.config.PORT;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: config_1.config.CORS_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Compression
app.use((0, compression_1.default)());
// Request logging
app.use((0, morgan_1.default)('combined', { stream: { write: function (message) { return logger_1.logger.info(message.trim()); } } }));
// Rate limiting
var limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.RATE_LIMIT_WINDOW_MS,
    max: config_1.config.RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request logging middleware (using morgan instead)
// app.use(requestLogger);
// Health check endpoint
app.get('/health', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // Check database connection
                return [4 /*yield*/, database_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
            case 1:
                // Check database connection
                _a.sent();
                res.json({
                    success: true,
                    message: 'AI Orchestrator API is running',
                    timestamp: new Date().toISOString(),
                    version: '1.0.0',
                    status: 'healthy',
                    database: 'connected'
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                logger_1.logger.error('Health check failed:', error_1);
                res.status(503).json({
                    success: false,
                    message: 'Service unavailable',
                    timestamp: new Date().toISOString(),
                    status: 'unhealthy',
                    database: 'disconnected'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// API routes
app.use('/api', routes_1.default);
// Root endpoint
app.get('/', function (_req, res) {
    res.json({
        success: true,
        message: 'Welcome to AI Orchestrator API',
        version: '1.0.0',
        documentation: '/api',
        health: '/health',
        endpoints: {
            auth: '/api/auth',
            chatbots: '/api/chatbots',
            dashboard: '/api/dashboard',
            subscriptions: '/api/subscriptions',
        },
    });
});
// 404 handler
app.use('*', function (_req, res) {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: 'The requested resource does not exist',
        path: _req.originalUrl,
    });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
// Graceful shutdown
process.on('SIGTERM', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.logger.info('SIGTERM received, shutting down gracefully');
                return [4 /*yield*/, database_1.prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.logger.info('SIGINT received, shutting down gracefully');
                return [4 /*yield*/, database_1.prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
// Start server
app.listen(PORT, function () {
    logger_1.logger.info("\uD83D\uDE80 AI Orchestrator Backend running on port ".concat(PORT));
    logger_1.logger.info("\uD83D\uDCCA Health check: http://localhost:".concat(PORT, "/health"));
    logger_1.logger.info("\uD83D\uDD17 API docs: http://localhost:".concat(PORT, "/api"));
    logger_1.logger.info("\uD83C\uDF0D Environment: ".concat(config_1.config.NODE_ENV));
    logger_1.logger.info("\uD83D\uDD12 CORS origins: ".concat(config_1.config.CORS_ORIGIN));
});
exports.default = app;
var templateObject_1;
