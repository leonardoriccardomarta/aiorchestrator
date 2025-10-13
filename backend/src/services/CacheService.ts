import Redis from 'redis';
import { config } from '../config';
import { logger } from '../config/logger';

export class CacheService {
  private redis: Redis.RedisClientType | null = null;
  private isConnected = false;

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis(): Promise<void> {
    try {
      this.redis = Redis.createClient({
        url: config.REDIS_URL,
      });

      this.redis.on('error', (error) => {
        logger.error('Redis connection error:', error);
        this.isConnected = false;
      });

      this.redis.on('connect', () => {
        logger.info('Redis connected successfully');
        this.isConnected = true;
      });

      await this.redis.connect();
    } catch (error) {
      logger.error('Failed to initialize Redis:', error);
      this.isConnected = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.redis) {
      return null;
    }

    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis GET error:', { key, error });
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      
      if (ttlSeconds) {
        await this.redis.setEx(key, ttlSeconds, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
      
      return true;
    } catch (error) {
      logger.error('Redis SET error:', { key, error });
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL error:', { key, error });
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', { key, error });
      return false;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      await this.redis.expire(key, ttlSeconds);
      return true;
    } catch (error) {
      logger.error('Redis EXPIRE error:', { key, error });
      return false;
    }
  }

  async increment(key: string, by: number = 1): Promise<number | null> {
    if (!this.isConnected || !this.redis) {
      return null;
    }

    try {
      return await this.redis.incrBy(key, by);
    } catch (error) {
      logger.error('Redis INCREMENT error:', { key, error });
      return null;
    }
  }

  async decrement(key: string, by: number = 1): Promise<number | null> {
    if (!this.isConnected || !this.redis) {
      return null;
    }

    try {
      return await this.redis.decrBy(key, by);
    } catch (error) {
      logger.error('Redis DECREMENT error:', { key, error });
      return null;
    }
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    if (!this.isConnected || !this.redis) {
      return null;
    }

    try {
      const value = await this.redis.hGet(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis HGET error:', { key, field, error });
      return null;
    }
  }

  async hset(key: string, field: string, value: any): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      await this.redis.hSet(key, field, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Redis HSET error:', { key, field, error });
      return false;
    }
  }

  async hdel(key: string, field: string): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      await this.redis.hDel(key, field);
      return true;
    } catch (error) {
      logger.error('Redis HDEL error:', { key, field, error });
      return false;
    }
  }

  async hgetall<T>(key: string): Promise<Record<string, T> | null> {
    if (!this.isConnected || !this.redis) {
      return null;
    }

    try {
      const hash = await this.redis.hGetAll(key);
      const result: Record<string, T> = {};
      
      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value);
      }
      
      return result;
    } catch (error) {
      logger.error('Redis HGETALL error:', { key, error });
      return null;
    }
  }

  // Cache patterns
  async cacheUser(userId: string, userData: any, ttlSeconds: number = 3600): Promise<void> {
    await this.set(`user:${userId}`, userData, ttlSeconds);
  }

  async getCachedUser(userId: string): Promise<any | null> {
    return this.get(`user:${userId}`);
  }

  async cacheChatbot(chatbotId: string, chatbotData: any, ttlSeconds: number = 1800): Promise<void> {
    await this.set(`chatbot:${chatbotId}`, chatbotData, ttlSeconds);
  }

  async getCachedChatbot(chatbotId: string): Promise<any | null> {
    return this.get(`chatbot:${chatbotId}`);
  }

  async cacheSession(sessionId: string, sessionData: any, ttlSeconds: number = 1800): Promise<void> {
    await this.set(`session:${sessionId}`, sessionData, ttlSeconds);
  }

  async getCachedSession(sessionId: string): Promise<any | null> {
    return this.get(`session:${sessionId}`);
  }

  async incrementRateLimit(key: string, ttlSeconds: number = 60): Promise<number> {
    const count = await this.increment(key, 1) || 0;
    
    if (count === 1) {
      await this.expire(key, ttlSeconds);
    }
    
    return count;
  }

  async getRateLimit(key: string): Promise<number> {
    const count = await this.get<number>(key);
    return count || 0;
  }

  // Cache invalidation patterns
  async invalidateUserCache(userId: string): Promise<void> {
    await this.del(`user:${userId}`);
  }

  async invalidateChatbotCache(chatbotId: string): Promise<void> {
    await this.del(`chatbot:${chatbotId}`);
  }

  async invalidateTenantCache(tenantId: string): Promise<void> {
    // This would need to be implemented with pattern matching
    // For now, we'll use a simple approach
    logger.info(`Cache invalidation requested for tenant: ${tenantId}`);
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.disconnect();
      this.isConnected = false;
    }
  }
}

export const cacheService = new CacheService();
