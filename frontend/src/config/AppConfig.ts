export interface AppConfig {
  ai: {
    openaiApiKey: string;
    enableAiFeatures: boolean;
  };
  analytics: {
    mixpanelToken: string;
    posthogToken: string;
    vercelAnalyticsId: string;
    enableAnalytics: boolean;
  };
  security: {
    jwtSecret: string;
    encryptionKey: string;
    enableE2eEncryption: boolean;
    enableAuditLogging: boolean;
    enableRateLimiting: boolean;
  };
  collaboration: {
    liveblocksPublicKey: string;
    liveblocksSecretKey: string;
  };
  database: {
    mongodbUri: string;
    redisUrl: string;
  };
  payment: {
    stripeSecretKey: string;
    stripeWebhookSecret: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
  };
  app: {
    nodeEnv: string;
    port: number;
    apiUrl: string;
    frontendUrl: string;
    corsOrigin: string;
  };
  performance: {
    cacheTtl: number;
    maxRequestsPerMinute: number;
    workerThreads: number;
  };
}

class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): AppConfig {
    return {
      ai: {
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        enableAiFeatures: process.env.ENABLE_AI_FEATURES === 'true',
      },
      analytics: {
        mixpanelToken: process.env.MIXPANEL_TOKEN || '',
        posthogToken: process.env.POSTHOG_TOKEN || '',
        vercelAnalyticsId: process.env.VERCEL_ANALYTICS_ID || '',
        enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
      },
      security: {
        jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
        encryptionKey: process.env.ENCRYPTION_KEY || 'default-encryption-key',
        enableE2eEncryption: process.env.ENABLE_E2E_ENCRYPTION === 'true',
        enableAuditLogging: process.env.ENABLE_AUDIT_LOGGING === 'true',
        enableRateLimiting: process.env.ENABLE_RATE_LIMITING === 'true',
      },
      collaboration: {
        liveblocksPublicKey: process.env.LIVEBLOCKS_PUBLIC_KEY || '',
        liveblocksSecretKey: process.env.LIVEBLOCKS_SECRET_KEY || '',
      },
      database: {
        mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot',
        redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      },
      payment: {
        stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      },
      email: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
        smtpUser: process.env.SMTP_USER || '',
        smtpPassword: process.env.SMTP_PASSWORD || '',
      },
      app: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT || '3000', 10),
        apiUrl: process.env.API_URL || 'http://localhost:3000',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      },
      performance: {
        cacheTtl: parseInt(process.env.CACHE_TTL || '3600', 10),
        maxRequestsPerMinute: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '100', 10),
        workerThreads: parseInt(process.env.WORKER_THREADS || '4', 10),
      },
    };
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  public isDevelopment(): boolean {
    return this.config.app.nodeEnv === 'development';
  }

  public isProduction(): boolean {
    return this.config.app.nodeEnv === 'production';
  }

  public isTest(): boolean {
    return this.config.app.nodeEnv === 'test';
  }

  public validateConfig(): void {
    const requiredKeys = [
      'ai.openaiApiKey',
      'analytics.mixpanelToken',
      'analytics.posthogToken',
      'security.jwtSecret',
      'security.encryptionKey',
      'collaboration.liveblocksPublicKey',
      'database.mongodbUri',
      'payment.stripeSecretKey',
    ];

    const missingKeys = requiredKeys.filter((key) => {
      const keys = key.split('.');
      let value: unknown = this.config;
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
      }
      return !value;
    });

    if (missingKeys.length > 0) {
      console.warn('Missing required configuration keys:', missingKeys);
      if (this.isProduction()) {
        throw new Error(`Missing required configuration keys: ${missingKeys.join(', ')}`);
      }
    }
  }
}

export const config = ConfigService.getInstance(); 