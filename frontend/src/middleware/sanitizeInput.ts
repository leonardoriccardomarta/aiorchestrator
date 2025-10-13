import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const sanitizeObject = (obj: unknown): unknown => {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === 'string') {
      // Basic sanitization without xss library
      sanitized[key] = value.replace(/[<>]/g, '');
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query) as ParsedQs;
  }
  
  // Sanitize body parameters
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params) as ParamsDictionary;
  }
  
  next();
};

export default sanitizeInput; 