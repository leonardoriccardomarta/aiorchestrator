import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { logger } from '../config/logger';

// Advanced security headers
export const securityHeaders = helmet({
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
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  const sanitize = (obj: any): any => {
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
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
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

// Advanced rate limiting
export const createRateLimit = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100,
    message: {
      success: false,
      error: options.message || 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    keyGenerator: options.keyGenerator || ((req: Request) => {
      return req.ip + (req.user?.id || 'anonymous');
    }),
  });
};

// IP whitelist/blacklist middleware
export const ipFilter = (req: Request, res: Response, next: NextFunction): void => {
  const clientIp = req.ip || 'unknown';
  
  // Blacklist (in production, load from database)
  const blacklistedIPs = [
    '127.0.0.1', // Example - remove in production
  ];
  
  if (blacklistedIPs.includes(clientIp)) {
    logger.warn('Blocked request from blacklisted IP', { ip: clientIp });
    res.status(403).json({
      success: false,
      error: 'Access denied',
    });
    return;
  }
  
  // Log suspicious activity
  if (req.headers['user-agent']?.includes('bot') || 
      req.headers['user-agent']?.includes('crawler')) {
    logger.info('Bot/crawler detected', { 
      ip: clientIp, 
      userAgent: req.headers['user-agent'] 
    });
  }
  
  next();
};

// Request size limiter
export const requestSizeLimit = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  
  if (contentLength > config.MAX_FILE_SIZE) {
    logger.warn('Request too large', { 
      contentLength, 
      maxSize: config.MAX_FILE_SIZE,
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

// SQL injection protection
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction): void => {
  const checkForSQLInjection = (input: any): boolean => {
    if (typeof input === 'string') {
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
        /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
        /(\bUNION\b.*\bSELECT\b)/i,
        /(\bSCRIPT\b)/i,
        /(\bJAVASCRIPT\b)/i,
        /(\bVBSCRIPT\b)/i,
        /(\bONLOAD\b)/i,
      ];
      
      return sqlPatterns.some(pattern => pattern.test(input));
    }
    
    if (Array.isArray(input)) {
      return input.some(checkForSQLInjection);
    }
    
    if (input && typeof input === 'object') {
      return Object.values(input).some(checkForSQLInjection);
    }
    
    return false;
  };

  const body = req.body;
  const query = req.query;
  const params = req.params;

  if (checkForSQLInjection(body) || 
      checkForSQLInjection(query) || 
      checkForSQLInjection(params)) {
    
    logger.warn('SQL injection attempt detected', {
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

// XSS protection
export const xssProtection = (req: Request, res: Response, next: NextFunction): void => {
  const checkForXSS = (input: any): boolean => {
    if (typeof input === 'string') {
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^>]*>/gi,
        /<object\b[^>]*>/gi,
        /<embed\b[^>]*>/gi,
        /<link\b[^>]*>/gi,
        /<meta\b[^>]*>/gi,
      ];
      
      return xssPatterns.some(pattern => pattern.test(input));
    }
    
    if (Array.isArray(input)) {
      return input.some(checkForXSS);
    }
    
    if (input && typeof input === 'object') {
      return Object.values(input).some(checkForXSS);
    }
    
    return false;
  };

  const body = req.body;
  const query = req.query;

  if (checkForXSS(body) || checkForXSS(query)) {
    logger.warn('XSS attempt detected', {
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

// Request timing middleware
export const requestTiming = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log slow requests
    if (duration > 5000) { // 5 seconds
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }
    
    // Log all requests for monitoring
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
    });
  });
  
  next();
};

// Security audit middleware
export const securityAudit = (req: Request, _res: Response, next: NextFunction): void => {
  // Log security-relevant requests
  const securityHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-cluster-client-ip',
    'user-agent',
    'referer',
    'origin',
  ];
  
  const securityInfo: any = {
    ip: req.ip,
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  };
  
  securityHeaders.forEach(header => {
    if (req.headers[header]) {
      securityInfo[header] = req.headers[header];
    }
  });
  
  // Log authentication attempts
  if (req.path.includes('/auth/') && req.method === 'POST') {
    logger.info('Authentication attempt', securityInfo);
  }
  
  // Log admin actions
  if (req.path.includes('/admin/') || req.user?.role === 'ADMIN') {
    logger.info('Admin action', securityInfo);
  }
  
  next();
};
