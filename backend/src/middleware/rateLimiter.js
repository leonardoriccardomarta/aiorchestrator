"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookLimiter = exports.uploadLimiter = exports.apiLimiter = exports.authLimiter = exports.generalLimiter = void 0;
var express_rate_limit_1 = require("express-rate-limit");
var config_1 = require("../config");
// General rate limiter
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.RATE_LIMIT_WINDOW_MS,
    max: config_1.config.RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        error: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Strict rate limiter for authentication
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});
// API rate limiter
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    message: {
        success: false,
        error: 'API rate limit exceeded, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// File upload rate limiter
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 uploads per hour
    message: {
        success: false,
        error: 'Upload rate limit exceeded, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Webhook rate limiter
exports.webhookLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 webhook calls per minute
    message: {
        success: false,
        error: 'Webhook rate limit exceeded.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
