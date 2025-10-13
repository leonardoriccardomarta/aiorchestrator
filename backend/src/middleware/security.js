"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityAudit = exports.requestTiming = exports.xssProtection = exports.sqlInjectionProtection = exports.requestSizeLimit = exports.ipFilter = exports.createRateLimit = exports.sanitizeInput = exports.securityHeaders = void 0;
var helmet_1 = require("helmet");
var express_rate_limit_1 = require("express-rate-limit");
var config_1 = require("../config");
var logger_1 = require("../config/logger");
// Advanced security headers
exports.securityHeaders = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.stripe.com"],
            frameSrc: ["'self'", "https://js.stripe.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            manifestSrc: ["'self'"],
            workerSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});
// Input sanitization middleware
var sanitizeInput = function (req, _res, next) {
    var sanitize = function (obj) {
        if (typeof obj === 'string') {
            // Remove potentially dangerous characters
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (obj && typeof obj === 'object') {
            var sanitized = {};
            for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                sanitized[key] = sanitize(value);
            }
            return sanitized;
        }
        return obj;
    };
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    next();
};
exports.sanitizeInput = sanitizeInput;
// Advanced rate limiting
var createRateLimit = function (options) {
    return (0, express_rate_limit_1.default)({
        windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
        max: options.max || 100,
        message: {
            success: false,
            error: options.message || 'Too many requests, please try again later.',
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: options.skipSuccessfulRequests || false,
        keyGenerator: options.keyGenerator || (function (req) {
            var _a;
            return req.ip + (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous');
        }),
    });
};
exports.createRateLimit = createRateLimit;
// IP whitelist/blacklist middleware
var ipFilter = function (req, res, next) {
    var _a, _b;
    var clientIp = req.ip || 'unknown';
    // Blacklist (in production, load from database)
    var blacklistedIPs = [
        '127.0.0.1', // Example - remove in production
    ];
    if (blacklistedIPs.includes(clientIp)) {
        logger_1.logger.warn('Blocked request from blacklisted IP', { ip: clientIp });
        res.status(403).json({
            success: false,
            error: 'Access denied',
        });
        return;
    }
    // Log suspicious activity
    if (((_a = req.headers['user-agent']) === null || _a === void 0 ? void 0 : _a.includes('bot')) ||
        ((_b = req.headers['user-agent']) === null || _b === void 0 ? void 0 : _b.includes('crawler'))) {
        logger_1.logger.info('Bot/crawler detected', {
            ip: clientIp,
            userAgent: req.headers['user-agent']
        });
    }
    next();
};
exports.ipFilter = ipFilter;
// Request size limiter
var requestSizeLimit = function (req, res, next) {
    var contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > config_1.config.MAX_FILE_SIZE) {
        logger_1.logger.warn('Request too large', {
            contentLength: contentLength,
            maxSize: config_1.config.MAX_FILE_SIZE,
            ip: req.ip
        });
        res.status(413).json({
            success: false,
            error: 'Request entity too large',
        });
        return;
    }
    next();
};
exports.requestSizeLimit = requestSizeLimit;
// SQL injection protection
var sqlInjectionProtection = function (req, res, next) {
    var checkForSQLInjection = function (input) {
        if (typeof input === 'string') {
            var sqlPatterns = [
                /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
                /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
                /(\bUNION\b.*\bSELECT\b)/i,
                /(\bSCRIPT\b)/i,
                /(\bJAVASCRIPT\b)/i,
                /(\bVBSCRIPT\b)/i,
                /(\bONLOAD\b)/i,
            ];
            return sqlPatterns.some(function (pattern) { return pattern.test(input); });
        }
        if (Array.isArray(input)) {
            return input.some(checkForSQLInjection);
        }
        if (input && typeof input === 'object') {
            return Object.values(input).some(checkForSQLInjection);
        }
        return false;
    };
    var body = req.body;
    var query = req.query;
    var params = req.params;
    if (checkForSQLInjection(body) ||
        checkForSQLInjection(query) ||
        checkForSQLInjection(params)) {
        logger_1.logger.warn('SQL injection attempt detected', {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            body: JSON.stringify(body),
            query: JSON.stringify(query),
        });
        res.status(400).json({
            success: false,
            error: 'Invalid request',
        });
        return;
    }
    next();
};
exports.sqlInjectionProtection = sqlInjectionProtection;
// XSS protection
var xssProtection = function (req, res, next) {
    var checkForXSS = function (input) {
        if (typeof input === 'string') {
            var xssPatterns = [
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                /javascript:/gi,
                /on\w+\s*=/gi,
                /<iframe\b[^>]*>/gi,
                /<object\b[^>]*>/gi,
                /<embed\b[^>]*>/gi,
                /<link\b[^>]*>/gi,
                /<meta\b[^>]*>/gi,
            ];
            return xssPatterns.some(function (pattern) { return pattern.test(input); });
        }
        if (Array.isArray(input)) {
            return input.some(checkForXSS);
        }
        if (input && typeof input === 'object') {
            return Object.values(input).some(checkForXSS);
        }
        return false;
    };
    var body = req.body;
    var query = req.query;
    if (checkForXSS(body) || checkForXSS(query)) {
        logger_1.logger.warn('XSS attempt detected', {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        });
        res.status(400).json({
            success: false,
            error: 'Invalid request',
        });
        return;
    }
    next();
};
exports.xssProtection = xssProtection;
// Request timing middleware
var requestTiming = function (req, res, next) {
    var startTime = Date.now();
    res.on('finish', function () {
        var duration = Date.now() - startTime;
        // Log slow requests
        if (duration > 5000) { // 5 seconds
            logger_1.logger.warn('Slow request detected', {
                method: req.method,
                url: req.url,
                duration: duration,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
            });
        }
        // Log all requests for monitoring
        logger_1.logger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: duration,
            ip: req.ip,
        });
    });
    next();
};
exports.requestTiming = requestTiming;
// Security audit middleware
var securityAudit = function (req, _res, next) {
    var _a;
    // Log security-relevant requests
    var securityHeaders = [
        'x-forwarded-for',
        'x-real-ip',
        'x-cluster-client-ip',
        'user-agent',
        'referer',
        'origin',
    ];
    var securityInfo = {
        ip: req.ip,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
    };
    securityHeaders.forEach(function (header) {
        if (req.headers[header]) {
            securityInfo[header] = req.headers[header];
        }
    });
    // Log authentication attempts
    if (req.path.includes('/auth/') && req.method === 'POST') {
        logger_1.logger.info('Authentication attempt', securityInfo);
    }
    // Log admin actions
    if (req.path.includes('/admin/') || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'ADMIN') {
        logger_1.logger.info('Admin action', securityInfo);
    }
    next();
};
exports.securityAudit = securityAudit;
