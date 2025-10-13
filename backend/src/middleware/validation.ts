import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../config/logger';

// Enhanced validation middleware with security checks
export const validate = (schema: Joi.ObjectSchema, options: {
  abortEarly?: boolean;
  allowUnknown?: boolean;
  stripUnknown?: boolean;
  sanitize?: boolean;
} = {}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const {
      abortEarly = false,
      allowUnknown = false,
      stripUnknown = true,
      sanitize = true,
    } = options;

    const { error, value } = schema.validate(req.body, {
      abortEarly,
      allowUnknown,
      stripUnknown,
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type,
      }));

      logger.warn('Validation error:', {
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
    } else {
      req.body = value;
    }

    next();
  };
};

// Query validation with enhanced security
export const validateQuery = (schema: Joi.ObjectSchema, options: any = {}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
      ...options,
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type,
      }));

      logger.warn('Query validation error:', {
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

// Enhanced validation schemas with security rules
export const schemas = {
  // Authentication with enhanced security
  login: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .max(254)
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.max': 'Email address is too long',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
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

  register: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .max(254)
      .required(),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required(),
    firstName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s-']+$/)
      .required()
      .messages({
        'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
      }),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s-']+$/)
      .required()
      .messages({
        'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
      }),
  }),

  // Chatbot with comprehensive validation
  createChatbot: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z0-9\s-_]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Name can only contain letters, numbers, spaces, hyphens, and underscores',
      }),
    description: Joi.string()
      .max(500)
      .optional(),
    model: Joi.string()
      .valid('gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo')
      .default('gpt-3.5-turbo'),
    personality: Joi.string()
      .valid('helpful', 'friendly', 'professional', 'casual', 'enthusiastic')
      .default('helpful'),
    responseStyle: Joi.string()
      .valid('professional', 'conversational', 'formal', 'casual')
      .default('professional'),
    temperature: Joi.number()
      .min(0)
      .max(2)
      .default(0.7),
    maxTokens: Joi.number()
      .min(100)
      .max(4000)
      .default(1000),
    whatsappEnabled: Joi.boolean().default(false),
    messengerEnabled: Joi.boolean().default(false),
    telegramEnabled: Joi.boolean().default(false),
    shopifyEnabled: Joi.boolean().default(false),
    webhookUrl: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Please provide a valid URL',
      }),
  }),

  updateChatbot: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z0-9\s-_]+$/)
      .optional(),
    description: Joi.string().max(500).optional(),
    model: Joi.string()
      .valid('gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo')
      .optional(),
    personality: Joi.string()
      .valid('helpful', 'friendly', 'professional', 'casual', 'enthusiastic')
      .optional(),
    responseStyle: Joi.string()
      .valid('professional', 'conversational', 'formal', 'casual')
      .optional(),
    temperature: Joi.number().min(0).max(2).optional(),
    maxTokens: Joi.number().min(100).max(4000).optional(),
    whatsappEnabled: Joi.boolean().optional(),
    messengerEnabled: Joi.boolean().optional(),
    telegramEnabled: Joi.boolean().optional(),
    shopifyEnabled: Joi.boolean().optional(),
    webhookUrl: Joi.string().uri().optional(),
    isActive: Joi.boolean().optional(),
  }),

  // FAQ with enhanced validation
  createFAQ: Joi.object({
    question: Joi.string()
      .min(10)
      .max(500)
      .required(),
    answer: Joi.string()
      .min(10)
      .max(2000)
      .required(),
    category: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s-_]+$/)
      .required(),
    tags: Joi.array()
      .items(Joi.string().min(2).max(30))
      .max(10)
      .optional(),
  }),

  // Subscription with payment validation
  createSubscription: Joi.object({
    planId: Joi.string()
      .uuid()
      .required(),
    paymentMethodId: Joi.string()
      .optional(),
    couponCode: Joi.string()
      .alphanum()
      .max(20)
      .optional(),
  }),

  // Pagination with limits
  pagination: Joi.object({
    page: Joi.number()
      .min(1)
      .max(1000)
      .default(1),
    limit: Joi.number()
      .min(1)
      .max(100)
      .default(20),
    sortBy: Joi.string()
      .pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
      .optional(),
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc'),
    search: Joi.string()
      .max(100)
      .optional(),
  }),

  // File upload validation
  fileUpload: Joi.object({
    type: Joi.string()
      .valid('image', 'document', 'video', 'audio')
      .required(),
    maxSize: Joi.number()
      .min(1024)
      .max(10 * 1024 * 1024) // 10MB
      .optional(),
  }),

  // Analytics with time range validation
  analytics: Joi.object({
    type: Joi.string()
      .valid('MESSAGE_SENT', 'MESSAGE_RECEIVED', 'CHATBOT_CREATED', 'USER_REGISTERED', 'SUBSCRIPTION_CREATED', 'API_CALL', 'ERROR_OCCURRED', 'PERFORMANCE_METRIC')
      .required(),
    entityId: Joi.string().uuid().optional(),
    entityType: Joi.string().max(50).optional(),
    timeRange: Joi.string()
      .valid('24h', '7d', '30d', '90d', '1y')
      .default('7d'),
    data: Joi.object().optional(),
  }),

  // Webhook validation
  webhook: Joi.object({
    url: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .required(),
    events: Joi.array()
      .items(Joi.string())
      .min(1)
      .max(10)
      .required(),
    secret: Joi.string()
      .min(32)
      .max(128)
      .optional(),
  }),

  // Password change with current password validation
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
  }),

  // Profile update with sanitization
  updateProfile: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s-']+$/)
      .optional(),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s-']+$/)
      .optional(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .max(254)
      .optional(),
    bio: Joi.string()
      .max(500)
      .optional(),
    timezone: Joi.string()
      .valid('UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo')
      .optional(),
  }),
};

// Data sanitization function
const sanitizeData = (data: any): any => {
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
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip sensitive fields from sanitization
      if (['password', 'token', 'secret', 'key'].some(sensitive => 
        key.toLowerCase().includes(sensitive))) {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }
  
  return data;
};

// Custom validation for business rules
export const validateBusinessRules = (req: Request, _res: Response, next: NextFunction): void => {
  // Example: Check if user can create more chatbots based on subscription
  if (req.path.includes('/chatbots') && req.method === 'POST') {
    // This would be implemented with actual subscription checks
    logger.info('Chatbot creation request', {
      userId: req.user?.id,
      ip: req.ip,
    });
  }
  
  next();
};