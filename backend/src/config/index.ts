import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // App Configuration
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  PORT: parseInt(process.env['PORT'] || '4000', 10),
  API_BASE_URL: process.env['API_BASE_URL'] || 'http://localhost:4000',
  CORS_ORIGIN: process.env['CORS_ORIGIN'] || 'http://localhost:5173,http://localhost:5176',

  // Database
  DATABASE_URL: process.env['DATABASE_URL'] || 'file:./dev.db',

  // JWT
  JWT_SECRET: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '7d',
  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] || 'your-super-secret-refresh-key-change-this-in-production',
  JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] || '30d',

  // Redis
  REDIS_URL: process.env['REDIS_URL'] || 'redis://localhost:6379',

  // OpenAI
  OPENAI_API_KEY: process.env['OPENAI_API_KEY'] || '',

  // Stripe
  STRIPE_SECRET_KEY: process.env['STRIPE_SECRET_KEY'] || '',
  STRIPE_PUBLISHABLE_KEY: process.env['STRIPE_PUBLISHABLE_KEY'] || '',
  STRIPE_WEBHOOK_SECRET: process.env['STRIPE_WEBHOOK_SECRET'] || '',

  // Email
  SMTP_HOST: process.env['SMTP_HOST'] || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env['SMTP_PORT'] || '587', 10),
  SMTP_USER: process.env['SMTP_USER'] || '',
  SMTP_PASS: process.env['SMTP_PASS'] || '',
  FROM_EMAIL: process.env['FROM_EMAIL'] || 'noreply@yourcompany.com',

  // Security
  BCRYPT_ROUNDS: parseInt(process.env['BCRYPT_ROUNDS'] || '12', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10),

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env['MAX_FILE_SIZE'] || '10485760', 10), // 10MB
  UPLOAD_PATH: process.env['UPLOAD_PATH'] || './uploads',

  // Multi-tenancy
  DEFAULT_TENANT: process.env['DEFAULT_TENANT'] || 'default',
  ENABLE_MULTI_TENANT: process.env['ENABLE_MULTI_TENANT'] === 'true',

  // Monitoring
  LOG_LEVEL: process.env['LOG_LEVEL'] || 'info',
  ENABLE_METRICS: process.env['ENABLE_METRICS'] === 'true',
};

// Validate required environment variables (temporarily disabled for development)
// const requiredEnvVars = [
//   'JWT_SECRET',
//   'JWT_REFRESH_SECRET',
//   'DATABASE_URL',
// ];

// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar as keyof typeof process.env]) {
//     throw new Error(`Missing required environment variable: ${envVar}`);
//   }
// }

export default config;
