import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { cacheService } from '../services/CacheService';

// Performance monitoring
export const performanceMonitoring = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = process.hrtime.bigint();
  const startMemory = process.memoryUsage();

  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      external: endMemory.external - startMemory.external,
    };

    // Log performance metrics
    logger.info('Request performance metrics', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      memoryDelta,
      timestamp: new Date().toISOString(),
    });

    // Track slow requests
    if (duration > 1000) { // 1 second
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
      });
    }

    // Track high memory usage
    if (memoryDelta.heapUsed > 10 * 1024 * 1024) { // 10MB
      logger.warn('High memory usage detected', {
        method: req.method,
        url: req.url,
        memoryDelta: `${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      });
    }
  });

  next();
};

// API usage tracking
export const apiUsageTracking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const endpoint = `${req.method} ${req.path}`;
  const userId = req.user?.id || 'anonymous';
  const tenantId = req.tenantId || 'unknown';

  // Increment API call counter
  await cacheService.increment(`api:calls:${endpoint}`, 1);
  await cacheService.increment(`api:calls:user:${userId}`, 1);
  await cacheService.increment(`api:calls:tenant:${tenantId}`, 1);

  // Track daily usage
  const today = new Date().toISOString().split('T')[0];
  await cacheService.increment(`api:daily:${today}:${endpoint}`, 1);
  await cacheService.increment(`api:daily:${today}:user:${userId}`, 1);

  res.on('finish', async () => {
    // Track response codes
    const statusCode = res.statusCode;
    await cacheService.increment(`api:status:${statusCode}:${endpoint}`, 1);
    
    // Track error rates
    if (statusCode >= 400) {
      await cacheService.increment(`api:errors:${endpoint}`, 1);
      await cacheService.increment(`api:errors:user:${userId}`, 1);
    }
  });

  next();
};

// Health check monitoring
export const healthCheckMonitoring = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.path === '/health' || req.path === '/api/health') {
    const healthData = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      version: process.version,
      platform: process.platform,
    };

    logger.info('Health check performed', healthData);
    
    // Store health data in cache for monitoring dashboard
    cacheService.set('system:health', healthData, 60); // 1 minute TTL
  }

  next();
};

// Error rate monitoring
export const errorRateMonitoring = (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', async () => {
    const statusCode = res.statusCode;
    const endpoint = `${req.method} ${req.path}`;
    
    if (statusCode >= 400) {
      const errorData = {
        endpoint,
        statusCode,
        timestamp: new Date().toISOString(),
        userId: req.user?.id,
        tenantId: req.tenantId,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      };

      logger.error('API Error detected', errorData);
      
      // Track error patterns
      await cacheService.increment(`errors:${endpoint}:${statusCode}`, 1);
      await cacheService.increment(`errors:hourly:${new Date().getHours()}`, 1);
    }
  });

  next();
};

// Database query monitoring
export const databaseMonitoring = {
  trackQuery: (query: string, duration: number, success: boolean) => {
    if (duration > 1000) { // Log slow queries (> 1 second)
      logger.warn('Slow database query detected', {
        query: query.substring(0, 200), // Limit query length in logs
        duration: `${duration}ms`,
        success,
        timestamp: new Date().toISOString(),
      });
    }

    // Track query patterns
    cacheService.increment(`db:queries:${success ? 'success' : 'error'}`, 1);
    cacheService.increment(`db:queries:duration:${Math.floor(duration / 100)}`, 1);
  },

  trackConnection: (action: 'connect' | 'disconnect' | 'error', details?: any) => {
    logger.info(`Database ${action}`, {
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  },
};

// System metrics collection
export const collectSystemMetrics = async (): Promise<any> => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    version: process.version,
    platform: process.platform,
    nodeEnv: process.env['NODE_ENV'],
  };

  // Store metrics in cache
  await cacheService.set('system:metrics', metrics, 300); // 5 minutes TTL
  
  return metrics;
};

// Alert system
export const checkAlerts = async (): Promise<void> => {
  try {
    // Check error rates
    const errorRate = await cacheService.get<number>('api:errors:total') || 0;
    const totalRequests = await cacheService.get<number>('api:calls:total') || 1;
    const errorPercentage = (errorRate / totalRequests) * 100;

    if (errorPercentage > 10) { // Alert if error rate > 10%
      logger.error('High error rate detected', {
        errorRate: `${errorPercentage.toFixed(2)}%`,
        totalErrors: errorRate,
        totalRequests,
      });
    }

    // Check response times
    const slowQueries = await cacheService.get<number>('db:queries:duration:10') || 0; // > 1 second
    if (slowQueries > 50) { // Alert if > 50 slow queries
      logger.error('High number of slow database queries', {
        slowQueries,
      });
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
    
    if (memoryUsageMB > 500) { // Alert if memory usage > 500MB
      logger.error('High memory usage detected', {
        memoryUsage: `${memoryUsageMB.toFixed(2)}MB`,
      });
    }

  } catch (error) {
    logger.error('Error checking alerts:', error);
  }
};

// Periodic metrics collection
export const startMetricsCollection = (): void => {
  // Collect system metrics every 5 minutes
  setInterval(async () => {
    await collectSystemMetrics();
    await checkAlerts();
  }, 5 * 60 * 1000);

  // Log startup
  logger.info('Metrics collection started');
};
