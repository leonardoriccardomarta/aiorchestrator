import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { JwtPayload } from '../types';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
      tenantId?: string;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            domain: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isActive || !user.tenant.isActive) {
      res.status(401).json({ 
        success: false, 
        error: 'User not found or inactive' 
      });
      return;
    }

    // Add user and tenant info to request
    req.user = user;
    req.tenantId = user.tenantId;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false, 
        error: 'Token expired' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Authentication failed' 
      });
    }
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              domain: true,
              isActive: true,
            },
          },
        },
      });

      if (user && user.isActive && user.tenant.isActive) {
        req.user = user;
        req.tenantId = user.tenantId;
      }
    }

    next();
  } catch (error) {
    // Optional auth - continue even if token is invalid
    next();
  }
};

export const generateTokens = (payload: JwtPayload) => {
  const jwtSecret = config.JWT_SECRET || 'fallback-secret';
  const refreshSecret = config.JWT_REFRESH_SECRET || 'fallback-refresh';
  
  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(
    { userId: payload.userId },
    refreshSecret,
    {
      expiresIn: '7d',
    }
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as { userId: string };
};

// Rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
