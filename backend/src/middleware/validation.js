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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBusinessRules = exports.schemas = exports.validateQuery = exports.validate = void 0;
var joi_1 = require("joi");
var logger_1 = require("../config/logger");
// Enhanced validation middleware with security checks
var validate = function (schema, options) {
    if (options === void 0) { options = {}; }
    return function (req, res, next) {
        var _a = options.abortEarly, abortEarly = _a === void 0 ? false : _a, _b = options.allowUnknown, allowUnknown = _b === void 0 ? false : _b, _c = options.stripUnknown, stripUnknown = _c === void 0 ? true : _c, _d = options.sanitize, sanitize = _d === void 0 ? true : _d;
        var _e = schema.validate(req.body, {
            abortEarly: abortEarly,
            allowUnknown: allowUnknown,
            stripUnknown: stripUnknown,
        }), error = _e.error, value = _e.value;
        if (error) {
            var errorDetails = error.details.map(function (detail) { return ({
                field: detail.path.join('.'),
                message: detail.message,
                type: detail.type,
            }); });
            logger_1.logger.warn('Validation error:', {
                errors: errorDetails,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                body: JSON.stringify(req.body),
            });
            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errorDetails,
            });
            return;
        }
        // Sanitize the validated data
        if (sanitize) {
            req.body = sanitizeData(value);
        }
        else {
            req.body = value;
        }
        next();
    };
};
exports.validate = validate;
// Query validation with enhanced security
var validateQuery = function (schema, options) {
    if (options === void 0) { options = {}; }
    return function (req, res, next) {
        var _a = schema.validate(req.query, __assign({ abortEarly: false, allowUnknown: false, stripUnknown: true }, options)), error = _a.error, value = _a.value;
        if (error) {
            var errorDetails = error.details.map(function (detail) { return ({
                field: detail.path.join('.'),
                message: detail.message,
                type: detail.type,
            }); });
            logger_1.logger.warn('Query validation error:', {
                errors: errorDetails,
                query: JSON.stringify(req.query),
                ip: req.ip,
            });
            res.status(400).json({
                success: false,
                error: 'Query validation failed',
                details: errorDetails,
            });
            return;
        }
        req.query = sanitizeData(value);
        next();
    };
};
exports.validateQuery = validateQuery;
// Enhanced validation schemas with security rules
exports.schemas = {
    // Authentication with enhanced security
    login: joi_1.default.object({
        email: joi_1.default.string()
            .email({ tlds: { allow: false } })
            .max(254)
            .required()
            .messages({
            'string.email': 'Please provide a valid email address',
            'string.max': 'Email address is too long',
            'any.required': 'Email is required',
        }),
        password: joi_1.default.string()
            .min(8)
            .max(128)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .required()
            .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password is too long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required',
        }),
    }),
    register: joi_1.default.object({
        email: joi_1.default.string()
            .email({ tlds: { allow: false } })
            .max(254)
            .required(),
        password: joi_1.default.string()
            .min(8)
            .max(128)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .required(),
        firstName: joi_1.default.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-Z\s-']+$/)
            .required()
            .messages({
            'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
        }),
        lastName: joi_1.default.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-Z\s-']+$/)
            .required()
            .messages({
            'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
        }),
    }),
    // Chatbot with comprehensive validation
    createChatbot: joi_1.default.object({
        name: joi_1.default.string()
            .min(2)
            .max(100)
            .pattern(/^[a-zA-Z0-9\s-_]+$/)
            .required()
            .messages({
            'string.pattern.base': 'Name can only contain letters, numbers, spaces, hyphens, and underscores',
        }),
        description: joi_1.default.string()
            .max(500)
            .optional(),
        model: joi_1.default.string()
            .valid('gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo')
            .default('gpt-3.5-turbo'),
        personality: joi_1.default.string()
            .valid('helpful', 'friendly', 'professional', 'casual', 'enthusiastic')
            .default('helpful'),
        responseStyle: joi_1.default.string()
            .valid('professional', 'conversational', 'formal', 'casual')
            .default('professional'),
        temperature: joi_1.default.number()
            .min(0)
            .max(2)
            .default(0.7),
        maxTokens: joi_1.default.number()
            .min(100)
            .max(4000)
            .default(1000),
        whatsappEnabled: joi_1.default.boolean().default(false),
        messengerEnabled: joi_1.default.boolean().default(false),
        telegramEnabled: joi_1.default.boolean().default(false),
        shopifyEnabled: joi_1.default.boolean().default(false),
        webhookUrl: joi_1.default.string()
            .uri()
            .optional()
            .messages({
            'string.uri': 'Please provide a valid URL',
        }),
    }),
    updateChatbot: joi_1.default.object({
        name: joi_1.default.string()
            .min(2)
            .max(100)
            .pattern(/^[a-zA-Z0-9\s-_]+$/)
            .optional(),
        description: joi_1.default.string().max(500).optional(),
        model: joi_1.default.string()
            .valid('gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo')
            .optional(),
        personality: joi_1.default.string()
            .valid('helpful', 'friendly', 'professional', 'casual', 'enthusiastic')
            .optional(),
        responseStyle: joi_1.default.string()
            .valid('professional', 'conversational', 'formal', 'casual')
            .optional(),
        temperature: joi_1.default.number().min(0).max(2).optional(),
        maxTokens: joi_1.default.number().min(100).max(4000).optional(),
        whatsappEnabled: joi_1.default.boolean().optional(),
        messengerEnabled: joi_1.default.boolean().optional(),
        telegramEnabled: joi_1.default.boolean().optional(),
        shopifyEnabled: joi_1.default.boolean().optional(),
        webhookUrl: joi_1.default.string().uri().optional(),
        isActive: joi_1.default.boolean().optional(),
    }),
    // FAQ with enhanced validation
    createFAQ: joi_1.default.object({
        question: joi_1.default.string()
            .min(10)
            .max(500)
            .required(),
        answer: joi_1.default.string()
            .min(10)
            .max(2000)
            .required(),
        category: joi_1.default.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-Z0-9\s-_]+$/)
            .required(),
        tags: joi_1.default.array()
            .items(joi_1.default.string().min(2).max(30))
            .max(10)
            .optional(),
    }),
    // Subscription with payment validation
    createSubscription: joi_1.default.object({
        planId: joi_1.default.string()
            .uuid()
            .required(),
        paymentMethodId: joi_1.default.string()
            .optional(),
        couponCode: joi_1.default.string()
            .alphanum()
            .max(20)
            .optional(),
    }),
    // Pagination with limits
    pagination: joi_1.default.object({
        page: joi_1.default.number()
            .min(1)
            .max(1000)
            .default(1),
        limit: joi_1.default.number()
            .min(1)
            .max(100)
            .default(20),
        sortBy: joi_1.default.string()
            .pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
            .optional(),
        sortOrder: joi_1.default.string()
            .valid('asc', 'desc')
            .default('desc'),
        search: joi_1.default.string()
            .max(100)
            .optional(),
    }),
    // File upload validation
    fileUpload: joi_1.default.object({
        type: joi_1.default.string()
            .valid('image', 'document', 'video', 'audio')
            .required(),
        maxSize: joi_1.default.number()
            .min(1024)
            .max(10 * 1024 * 1024) // 10MB
            .optional(),
    }),
    // Analytics with time range validation
    analytics: joi_1.default.object({
        type: joi_1.default.string()
            .valid('MESSAGE_SENT', 'MESSAGE_RECEIVED', 'CHATBOT_CREATED', 'USER_REGISTERED', 'SUBSCRIPTION_CREATED', 'API_CALL', 'ERROR_OCCURRED', 'PERFORMANCE_METRIC')
            .required(),
        entityId: joi_1.default.string().uuid().optional(),
        entityType: joi_1.default.string().max(50).optional(),
        timeRange: joi_1.default.string()
            .valid('24h', '7d', '30d', '90d', '1y')
            .default('7d'),
        data: joi_1.default.object().optional(),
    }),
    // Webhook validation
    webhook: joi_1.default.object({
        url: joi_1.default.string()
            .uri({ scheme: ['http', 'https'] })
            .required(),
        events: joi_1.default.array()
            .items(joi_1.default.string())
            .min(1)
            .max(10)
            .required(),
        secret: joi_1.default.string()
            .min(32)
            .max(128)
            .optional(),
    }),
    // Password change with current password validation
    changePassword: joi_1.default.object({
        currentPassword: joi_1.default.string().required(),
        newPassword: joi_1.default.string()
            .min(8)
            .max(128)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .required()
            .messages({
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        }),
    }),
    // Profile update with sanitization
    updateProfile: joi_1.default.object({
        firstName: joi_1.default.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-Z\s-']+$/)
            .optional(),
        lastName: joi_1.default.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-Z\s-']+$/)
            .optional(),
        email: joi_1.default.string()
            .email({ tlds: { allow: false } })
            .max(254)
            .optional(),
        bio: joi_1.default.string()
            .max(500)
            .optional(),
        timezone: joi_1.default.string()
            .valid('UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo')
            .optional(),
    }),
};
// Data sanitization function
var sanitizeData = function (data) {
    if (typeof data === 'string') {
        return data
            .trim()
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/[<>]/g, ''); // Remove potential HTML tags
    }
    if (Array.isArray(data)) {
        return data.map(sanitizeData);
    }
    if (data && typeof data === 'object') {
        var sanitized = {};
        var _loop_1 = function (key, value) {
            // Skip sensitive fields from sanitization
            if (['password', 'token', 'secret', 'key'].some(function (sensitive) {
                return key.toLowerCase().includes(sensitive);
            })) {
                sanitized[key] = value;
            }
            else {
                sanitized[key] = sanitizeData(value);
            }
        };
        for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            _loop_1(key, value);
        }
        return sanitized;
    }
    return data;
};
// Custom validation for business rules
var validateBusinessRules = function (req, _res, next) {
    var _a;
    // Example: Check if user can create more chatbots based on subscription
    if (req.path.includes('/chatbots') && req.method === 'POST') {
        // This would be implemented with actual subscription checks
        logger_1.logger.info('Chatbot creation request', {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            ip: req.ip,
        });
    }
    next();
};
exports.validateBusinessRules = validateBusinessRules;
