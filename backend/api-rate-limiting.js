// Rate Limiting Middleware
const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 10000 requests per windowMs (increased from 100)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  validate: {
    trustProxy: false, // Disable the trust proxy warning
    xForwardedForHeader: false
  }
});

const chatRateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 chat requests per minute
  message: 'Too many chat requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  validate: {
    trustProxy: false, // Disable the trust proxy warning
    xForwardedForHeader: false
  }
});

module.exports = {
  rateLimitMiddleware,
  chatRateLimitMiddleware
};

