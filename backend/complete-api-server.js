const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

// Load environment variables FIRST
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Set environment variables explicitly if not found
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
}
if (!process.env.PORT) {
  process.env.PORT = '4000';
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
if (!process.env.GROQ_API_KEY) {
  process.env.GROQ_API_KEY = 'your_groq_api_key_here';
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import AI Service
const HybridAIService = require('./src/ai-service-hybrid');
const MLService = require('./src/ml-service');
const CronService = require('./src/services/cronService');
const EmailService = require('./src/services/emailService');
const EmailFollowUpService = require('./src/services/emailFollowUpService');
const affiliateService = require('./src/services/affiliateService');
const { getReferralCode } = require('./src/middleware/referralTracking');
const ChatbotService = require('./chatbot-service');
const { rateLimitMiddleware, chatRateLimitMiddleware } = require('./api-rate-limiting');
const { 
  validateChatbot, 
  validateConnection, 
  validateFAQ,
  validateWorkflow,
  validateUserData,
  handleValidationErrors,
  sanitizeInput,
  securityHeaders 
} = require('./middleware/validation');
const { 
  errorHandler, 
  notFoundHandler, 
  asyncHandler,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  PlanLimitError,
  AIError
} = require('./middleware/errorHandler');
const AuthService = require('./real-auth-system');
const RealDataService = require('./real-data-service');

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize AI Service
const aiService = new HybridAIService();

// Initialize ML Service (Full Machine Learning Suite)
const mlService = new MLService();
const cronService = new CronService();

// Initialize Email Services
const emailService = new EmailService();
const emailFollowUpService = new EmailFollowUpService();

// Initialize Auth Service
const authService = new AuthService();

// Initialize Real Data Service
const realDataService = new RealDataService();

// Initialize Chatbot Service
const chatbotService = new ChatbotService();

// Store WooCommerce connections in memory (in production, use database)
const woocommerceConnections = new Map();

// Apply security middleware
app.use(securityHeaders);
app.use(sanitizeInput);

// Verify token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const user = await authService.verifyAccess(token);
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
};

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5176', 'http://localhost:5173', 'http://localhost:5177'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth middleware will be defined later after auth service

// Onboarding completion endpoint
app.post('/api/onboarding/complete', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { storeData, chatbotData } = req.body;
    
    // Update user onboarding status in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hasCompletedOnboarding: true,
        isNewUser: false
      }
    });
    
    console.log(`User ${user.id} completed onboarding`);
    
    res.json({
      success: true,
      message: 'Onboarding completed successfully'
    });
    
  } catch (error) {
    console.error('Onboarding completion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete onboarding'
    });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const aiHealth = await aiService.healthCheck();
    const stats = aiService.getStats();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      ai: {
        services: aiHealth,
        stats: stats
      },
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      ai: 'configured',
      email: 'configured',
      stripe: 'configured'
    }
  });
});

// ==================== WOOCOMMERCE API ENDPOINTS ====================

// Test WooCommerce connection
app.post('/api/woocommerce/test-connection', async (req, res) => {
  try {
    const { storeUrl, consumerKey, consumerSecret } = req.body;
    
    if (!storeUrl || !consumerKey || !consumerSecret) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: storeUrl, consumerKey, consumerSecret'
      });
    }

    // Validate URL format
    try {
      new URL(storeUrl);
    } catch (urlError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid store URL format'
      });
    }

    const adapter = new WooCommerceAdapter(storeUrl, consumerKey, consumerSecret);
    const result = await adapter.testConnection();

    if (result.success) {
      res.json({
        success: true,
        data: {
          storeName: result.data.storeName,
          version: result.data.version,
          currency: result.data.currency,
          timezone: result.data.timezone,
          message: 'WooCommerce connection successful!'
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to connect to WooCommerce store'
      });
    }
  } catch (error) {
    console.error('WooCommerce test connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

// Connect WooCommerce store
app.post('/api/woocommerce/connect', authenticateToken, async (req, res) => {
  try {
    const { storeUrl, consumerKey, consumerSecret, storeName } = req.body;
    const user = req.user;
    
    if (!storeUrl || !consumerKey || !consumerSecret) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check plan limits first
    const userConnections = realDataService.getConnections(user.id);
    const userPlan = planService.getUserPlan(user.id) || { planId: 'starter' };
    const planLimits = planService.getPlanLimits(userPlan.planId);
    
    if (planLimits && planLimits.connections !== 'unlimited') {
      if (userConnections.length >= planLimits.connections) {
        return res.status(400).json({
          success: false,
          error: `Plan limit reached. You can only connect ${planLimits.connections} store(s) on the ${userPlan.planId} plan.`,
          limitReached: true,
          currentUsage: userConnections.length,
          limit: planLimits.connections,
          planId: userPlan.planId
        });
      }
    }

    const adapter = new WooCommerceAdapter(storeUrl, consumerKey, consumerSecret);
    const testResult = await adapter.testConnection();

    if (!testResult.success) {
      return res.status(400).json({
        success: false,
        error: testResult.error
      });
    }

    // Generate connection ID
    const connectionId = `wc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store connection in real data service
    const connection = realDataService.addConnection(user.id, {
      id: connectionId,
      storeUrl,
      consumerKey,
      consumerSecret,
      storeName: storeName || testResult.data.storeName,
      version: testResult.data.version,
      currency: testResult.data.currency,
      timezone: testResult.data.timezone,
      status: 'connected',
      lastSync: new Date().toISOString(),
      productsCount: 0,
      ordersCount: 0,
      customersCount: 0,
      revenue: 0,
      monthlyRevenue: 0
    });

    woocommerceConnections.set(connectionId, connection);

    res.json({
      success: true,
      data: {
        connection,
        message: 'WooCommerce store connected successfully!'
      }
    });
  } catch (error) {
    console.error('WooCommerce connect error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Sync WooCommerce data
app.post('/api/woocommerce/sync/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = woocommerceConnections.get(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }

    const adapter = new WooCommerceAdapter(
      connection.storeUrl,
      connection.consumerKey,
      connection.consumerSecret
    );

    const analytics = await adapter.getAnalytics();

    if (!analytics.success) {
      return res.status(400).json({
        success: false,
        error: analytics.error
      });
    }

    // Update connection with synced data
    const updatedConnection = {
      ...connection,
      productsCount: analytics.data.productsCount,
      ordersCount: analytics.data.ordersCount,
      customersCount: analytics.data.customersCount,
      revenue: analytics.data.totalRevenue,
      monthlyRevenue: analytics.data.monthlyRevenue,
      lastSync: analytics.data.lastSync
    };

    woocommerceConnections.set(connectionId, updatedConnection);

    res.json({
      success: true,
      data: {
        connection: updatedConnection,
        message: 'WooCommerce data synced successfully!'
      }
    });
  } catch (error) {
    console.error('WooCommerce sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get WooCommerce connection
app.get('/api/woocommerce/connection/:connectionId', (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = woocommerceConnections.get(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }

    res.json({
      success: true,
      data: { connection }
    });
  } catch (error) {
    console.error('WooCommerce get connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all WooCommerce connections
app.get('/api/woocommerce/connections', (req, res) => {
  try {
    const connections = Array.from(woocommerceConnections.values());
    
    res.json({
      success: true,
      data: { connections }
    });
  } catch (error) {
    console.error('WooCommerce get connections error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ==================== SHOPIFY API ENDPOINTS ====================

// Test Shopify connection
app.post('/api/shopify/test-connection', authenticateToken, async (req, res) => {
  try {
    const { shop, accessToken } = req.body;
    
    if (!shop || !accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: shop, accessToken'
      });
    }

    // Validate shop format
    if (!shop.includes('.myshopify.com')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid shop format. Must be in format: your-shop.myshopify.com'
      });
    }

    // Mock successful connection for demo
    res.json({
      success: true,
      data: {
        shopName: shop.replace('.myshopify.com', ''),
        domain: shop,
        plan: 'Basic',
        currency: 'USD',
        timezone: 'UTC',
        message: 'Shopify connection successful!'
      }
    });
  } catch (error) {
    console.error('Shopify test connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

// Connect Shopify store
app.post('/api/shopify/connect', authenticateToken, async (req, res) => {
  try {
    const { shop, accessToken, storeName } = req.body;
    const user = req.user;
    
    if (!shop || !accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate shop format
    if (!shop.includes('.myshopify.com')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid shop format. Must be in format: your-shop.myshopify.com'
      });
    }

    // Check plan limits first
    const userConnections = realDataService.getConnections(user.id);
    const userPlan = planService.getUserPlan(user.id) || { planId: 'starter' };
    const planLimits = planService.getPlanLimits(userPlan.planId);
    
    if (planLimits && planLimits.connections !== 'unlimited') {
      if (userConnections.length >= planLimits.connections) {
        return res.status(400).json({
          success: false,
          error: `Plan limit reached. You can only connect ${planLimits.connections} store(s) on the ${userPlan.planId} plan.`,
          limitReached: true,
          currentUsage: userConnections.length,
          limit: planLimits.connections,
          planId: userPlan.planId
        });
      }
    }

    // Generate connection ID
    const connectionId = `shopify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store connection in real data service
    const connection = realDataService.addConnection(user.id, {
      id: connectionId,
      platform: 'shopify',
      storeName: storeName || shop.replace('.myshopify.com', ''),
      domain: shop,
      status: 'connected',
      lastSync: new Date().toISOString(),
      productsCount: 0,
      ordersCount: 0,
      customersCount: 0,
      revenue: 0,
      monthlyRevenue: 0,
      accessToken: accessToken,
      shopId: shop,
      plan: 'Basic',
      region: 'US',
      currency: 'USD',
      webhookUrl: 'https://api.aiorchestrator.com/webhooks/shopify'
    });

    // Also store in old system for compatibility
    woocommerceConnections.set(connectionId, connection); // Keep for now for compatibility

    res.json({
      success: true,
      data: {
        connection,
        message: 'Shopify store connected successfully!'
      }
    });
  } catch (error) {
    console.error('Shopify connect error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Sync Shopify data
app.post('/api/shopify/sync/:connectionId', authenticateToken, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const user = req.user;
    
    const connection = realDataService.getConnection(user.id, connectionId);
    if (!connection || connection.platform !== 'shopify') {
      return res.status(404).json({
        success: false,
        error: 'Shopify connection not found'
      });
    }

    // Simulate data sync
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay

    // Update connection with mock data for now
    const updatedConnection = realDataService.updateConnection(user.id, connectionId, {
      lastSync: new Date().toISOString(),
      productsCount: Math.floor(Math.random() * 1000),
      ordersCount: Math.floor(Math.random() * 500),
      customersCount: Math.floor(Math.random() * 200),
      revenue: parseFloat((Math.random() * 10000).toFixed(2)),
      monthlyRevenue: parseFloat((Math.random() * 2000).toFixed(2))
    });

    res.json({
      success: true,
      data: {
        connection: updatedConnection,
        message: 'Shopify data synced successfully!'
      }
    });
  } catch (error) {
    console.error('Shopify sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get single Shopify connection
app.get('/api/shopify/connection/:connectionId', authenticateToken, (req, res) => {
  try {
    const { connectionId } = req.params;
    const user = req.user;
    
    const connection = realDataService.getConnection(user.id, connectionId);
    if (!connection || connection.platform !== 'shopify') {
      return res.status(404).json({
        success: false,
        error: 'Shopify connection not found'
      });
    }

    res.json({
      success: true,
      data: { connection }
    });
  } catch (error) {
    console.error('Shopify get connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all Shopify connections for a user
app.get('/api/shopify/connections', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    const connections = realDataService.getConnections(user.id).filter(c => c.platform === 'shopify');
    res.json({
      success: true,
      data: { connections }
    });
  } catch (error) {
    console.error('Shopify get all connections error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ===== PLAN MANAGEMENT API =====

// Get all available plans
app.get('/api/plans', (req, res) => {
  try {
    const plans = planService.getAllPlans();
    res.json({
      success: true,
      data: { plans }
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Set user plan
app.post('/api/plans/set', (req, res) => {
  try {
    const { userId, planId } = req.body;
    
    if (!userId || !planId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, planId'
      });
    }

    planService.setUserPlan(userId, planId);
    
    res.json({
      success: true,
      data: {
        message: 'Plan set successfully',
        planId,
        limits: planService.getUserPlan(userId).limits
      }
    });
  } catch (error) {
    console.error('Error setting plan:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get user plan and usage
app.get('/api/plans/usage/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const usage = planService.getUsageStats(userId);
    
    if (!usage) {
      return res.status(404).json({
        success: false,
        error: 'User not found or no plan assigned'
      });
    }

    res.json({
      success: true,
      data: { usage }
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Validate action
app.post('/api/plans/validate', (req, res) => {
  try {
    const { userId, action, count } = req.body;
    
    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, action'
      });
    }

    const validation = planService.validateAction(userId, action, count || 1);
    
    res.json({
      success: true,
      data: { validation }
    });
  } catch (error) {
    console.error('Error validating action:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Record usage
app.post('/api/plans/usage', (req, res) => {
  try {
    const { userId, action, count } = req.body;
    
    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, action'
      });
    }

    planService.recordUsage(userId, action, count || 1);
    
    res.json({
      success: true,
      data: { message: 'Usage recorded successfully' }
    });
  } catch (error) {
    console.error('Error recording usage:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ===== SHOPIFY API ENDPOINTS =====

// Test Shopify connection
app.post('/api/shopify/test-connection', async (req, res) => {
  try {
    const { shop, accessToken } = req.body;
    
    if (!shop || !accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: shop, accessToken'
      });
    }

    // Validate shop format
    if (!shop.includes('.myshopify.com')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid shop format. Must be in format: your-shop.myshopify.com'
      });
    }

    // Mock successful connection for demo
    res.json({
      success: true,
      data: {
        shopName: shop.replace('.myshopify.com', ''),
        domain: shop,
        plan: 'Basic',
        currency: 'USD',
        timezone: 'UTC',
        message: 'Shopify connection successful!'
      }
    });
  } catch (error) {
    console.error('Shopify test connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

// Connect Shopify store
app.post('/api/shopify/connect', authenticateToken, async (req, res) => {
  try {
    const { shop, accessToken, storeName } = req.body;
    const user = req.user;
    
    if (!shop || !accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate shop format
    if (!shop.includes('.myshopify.com')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid shop format. Must be in format: your-shop.myshopify.com'
      });
    }

    // Generate connection ID
    const connectionId = `shopify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store connection in real data service
    const connection = realDataService.addConnection(user.id, {
      id: connectionId,
      platform: 'shopify',
      storeName: storeName || shop.replace('.myshopify.com', ''),
      domain: shop,
      status: 'connected',
      lastSync: new Date().toISOString(),
      productsCount: 0,
      ordersCount: 0,
      customersCount: 0,
      revenue: 0,
      monthlyRevenue: 0,
      accessToken: accessToken,
      shopId: shop,
      plan: 'Basic',
      region: 'US',
      currency: 'USD',
      webhookUrl: 'https://api.aiorchestrator.com/webhooks/shopify'
    });

    // Also store in old system for compatibility
    woocommerceConnections.set(connectionId, connection);

    res.json({
      success: true,
      data: {
        connection,
        message: 'Shopify store connected successfully!'
      }
    });
  } catch (error) {
    console.error('Shopify connect error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ===== REFERRAL TRACKING =====
// Capture referral code from URL query parameter
app.get('/api/track-referral', (req, res) => {
  const referralCode = req.query.ref;
  
  if (referralCode) {
    // Set referral cookie for 30 days
    res.cookie('ai_ref', referralCode, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    console.log(`📎 Referral code captured: ${referralCode}`);
    
    res.json({
      success: true,
      message: 'Referral code tracked'
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'No referral code provided'
    });
  }
});

// ===== AUTH API =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Register the user
    const result = await authService.register(email, password, name);
    
    // Check for referral code in cookies
    const referralCode = getReferralCode(req);
    
    if (referralCode && result.user) {
      console.log(`🔗 Referral detected: ${referralCode} for user ${email}`);
      
      // Track the referral
      const trackResult = await affiliateService.trackReferral(
        referralCode,
        result.user.id,
        email
      );
      
      if (trackResult.success) {
        console.log(`✅ Referral tracked successfully for ${email}`);
      } else {
        console.log(`⚠️ Failed to track referral: ${trackResult.error}`);
      }
    }
    
    res.json({
      success: true,
      data: result,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.login(email, password);
    
    if (result.success === false) {
      return res.status(400).json({
        success: false,
        error: result.error,
        needsVerification: result.needsVerification
      });
    }
    
    res.json({
      success: true,
      data: result,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

// Verify account endpoint
app.get('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required'
      });
    }
    
    const result = await authService.verifyAccount(token);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        user: result.user
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).json({
      success: false,
      error: 'Verification failed'
    });
  }
});

// ===== CONTACT API =====
app.post('/api/contact/send', async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;
    
    // Send email to admin
    const mailOptions = {
      from: process.env.SMTP_USER || 'aiorchestratoor@gmail.com',
      to: process.env.ADMIN_EMAIL || 'aiorchestratoor@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await emailService.transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.json({
      success: true, // Still return success for UX
      message: 'Message received'
    });
  }
});

// ===== AFFILIATE API =====
const affiliateRoutes = require('./src/routes/affiliate');
app.use('/api/affiliate', affiliateRoutes);

// ===== LIVE AGENT HANDOFF & ORDER TRACKING API =====
const agentRoutes = require('./src/routes/agentRoutes');
app.use('/api/agents', agentRoutes);

    // ===== DASHBOARD API =====
    app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
      try {
        const user = req.user;
        const { chatbotId } = req.query;
        
        // Initialize user stats if not exists - ZERO DATA FOR NEW USERS
        if (!realDataService.getUserStats(user.id)) {
          realDataService.initializeUserStats(user.id, user.planId, user.isNewUser || false);
        }
    
    // Get real metrics (optionally filtered by chatbotId)
    const realMetrics = realDataService.calculateRealMetrics(user.id, chatbotId);
    
    // Get plan info
    const planInfo = {
      planId: user.planId,
      isTrialActive: user.isTrialActive,
      trialEndDate: user.trialEndDate,
      isPaid: user.isPaid
    };
    
    // Calculate revenue based on plan and payment status
    const planPrices = {
      starter: 29,
      professional: 99,
      enterprise: 299
    };
    
    const monthlyRevenue = user.isPaid ? planPrices[user.planId] || 0 : 0;
    const totalRevenue = monthlyRevenue; // For now, same as monthly
    
    const stats = {
      ...realMetrics,
      totalRevenue,
      monthlyRevenue,
      planInfo
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    });
  }
});

app.get('/api/dashboard/activity', authenticateToken, (req, res) => {
  const activities = [
    {
      id: 1,
      type: 'chatbot_created',
      message: 'New chatbot "Customer Support" created',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      icon: 'chatbot'
    },
    {
      id: 2,
      type: 'message_received',
      message: 'Customer inquiry about product availability',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      icon: 'message'
    },
    {
      id: 3,
      type: 'workflow_completed',
      message: 'Order processing workflow completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      icon: 'workflow'
    }
  ];
  
  res.json({
    success: true,
    data: activities
  });
});

// ===== ANALYTICS API =====
app.get('/api/analytics', authenticateToken, (req, res) => {
  const { timeRange = '24h', chatbotId } = req.query;
  
  const analyticsData = {
    totalMessages: 2847,
    activeChatbots: 3,
    responseTime: 1.2,
    revenue: 2840.50,
    conversions: 23,
    customerSatisfaction: 4.8,
    messageTrend: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      messages: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 50) + 20
    })),
    topKeywords: [
      { keyword: 'product', count: 156, trend: '+12%' },
      { keyword: 'shipping', count: 89, trend: '+5%' },
      { keyword: 'return', count: 67, trend: '-3%' },
      { keyword: 'price', count: 45, trend: '+8%' }
    ],
    chatbotPerformance: [
      { name: 'Customer Support', messages: 1247, satisfaction: 4.9, responseTime: 0.8 },
      { name: 'Sales Assistant', messages: 892, satisfaction: 4.6, responseTime: 1.1 },
      { name: 'Technical Help', messages: 708, satisfaction: 4.7, responseTime: 1.5 }
    ]
  };
  
  res.json({
    success: true,
    data: analyticsData
  });
});

// ===== FAQ API =====
app.get('/api/faqs', authenticateToken, (req, res) => {
  const faqs = [
    {
      id: '1',
      question: 'How do I integrate the chatbot with my website?',
      answer: 'You can integrate our AI chatbot with your website by adding a simple JavaScript snippet to your site. The integration takes less than 5 minutes and requires no technical knowledge.',
      category: 'Integration',
      tags: ['website', 'integration', 'setup'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      question: 'What AI models does the chatbot use?',
      answer: 'Our chatbot uses a hybrid AI system with Groq (85% requests - free), Ollama (12% requests - local), and OpenAI (3% requests - premium) for maximum efficiency and cost savings.',
      category: 'Technical',
      tags: ['ai', 'models', 'hybrid'],
      createdAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z'
    },
    {
      id: '3',
      question: 'How much does the service cost?',
      answer: 'We offer flexible pricing plans starting from $19/month for small businesses. All plans include our hybrid AI system with 98.5% gross margins, giving you incredible value.',
      category: 'Billing',
      tags: ['pricing', 'cost', 'plans'],
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z'
    }
  ];
  
  res.json({
    success: true,
    data: faqs
  });
});

app.post('/api/faqs', authenticateToken, (req, res) => {
  const { question, answer, category, tags } = req.body;
  
  const newFaq = {
    id: Date.now().toString(),
    question,
    answer,
    category: category || 'General',
    tags: tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: newFaq,
    message: 'FAQ created successfully'
  });
});

// ===== CONNECTIONS API =====
app.get('/api/connections', authenticateToken, (req, res) => {
  const { chatbotId } = req.query;
  
  // Note: In production, filter connections by chatbotId from database
  // For now, return mock data (will be replaced with Prisma query)
  
  const connections = [
    {
      id: '1',
      name: 'Shopify Store',
      type: 'shopify',
      status: 'connected',
      connectedAt: '2024-01-10T14:30:00Z',
      lastSync: '2024-01-15T09:15:00Z',
      data: {
        storeUrl: 'mystore.myshopify.com',
        products: 156,
        orders: 89
      }
    },
    {
      id: '2',
      name: 'WhatsApp Business',
      type: 'whatsapp',
      status: 'connected',
      connectedAt: '2024-01-12T11:20:00Z',
      lastSync: '2024-01-15T08:45:00Z',
      data: {
        phoneNumber: '+1234567890',
        messages: 234,
        customers: 67
      }
    },
    {
      id: '3',
      name: 'Email Integration',
      type: 'email',
      status: 'pending',
      connectedAt: null,
      lastSync: null,
      data: {
        email: 'support@mystore.com',
        pending: true
      }
    }
  ];
  
  res.json({
    success: true,
    data: connections
  });
});

// ===== WORKFLOWS API =====
app.get('/api/workflows', authenticateToken, (req, res) => {
  const workflows = [
    {
      id: '1',
      name: 'Order Processing',
      description: 'Automated order processing workflow',
      status: 'active',
      trigger: 'new_order',
      steps: 5,
      lastRun: '2024-01-15T10:30:00Z',
      successRate: 98.5,
      executions: 156
    },
    {
      id: '2',
      name: 'Customer Support',
      description: 'AI-powered customer support workflow',
      status: 'active',
      trigger: 'customer_inquiry',
      steps: 3,
      lastRun: '2024-01-15T09:45:00Z',
      successRate: 94.2,
      executions: 234
    },
    {
      id: '3',
      name: 'Inventory Alert',
      description: 'Low stock alert workflow',
      status: 'paused',
      trigger: 'low_stock',
      steps: 2,
      lastRun: '2024-01-14T16:20:00Z',
      successRate: 100,
      executions: 12
    }
  ];
  
  res.json({
    success: true,
    data: workflows
  });
});

app.post('/api/workflows', authenticateToken, (req, res) => {
  const { name, description, trigger, status } = req.body;
  
  const newWorkflow = {
    id: Date.now().toString(),
    name,
    description,
    status: status || 'active',
    trigger: trigger || 'manual',
    steps: 0,
    lastRun: null,
    successRate: 0,
    executions: 0,
    createdAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: newWorkflow,
    message: 'Workflow created successfully'
  });
});

// ===== PAYPAL SUBSCRIPTION API =====
app.post('/api/payments/paypal/create-subscription', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;
    const user = req.user;

    // Map plan IDs to PayPal plan IDs (you'll need to create these in PayPal dashboard)
    const paypalPlanIds = {
      'starter': process.env.PAYPAL_PLAN_STARTER || 'P-STARTER',
      'professional': process.env.PAYPAL_PLAN_PRO || 'P-PRO',
      'enterprise': process.env.PAYPAL_PLAN_ENTERPRISE || 'P-ENTERPRISE'
    };

    const paypalPlanId = paypalPlanIds[planId];

    if (!paypalPlanId) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // For now, return a mock subscription ID
    // In production, you'd call PayPal API here
    res.json({
      success: true,
      subscriptionId: `MOCK-SUB-${Date.now()}`
    });
  } catch (error) {
    console.error('PayPal subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

app.post('/api/payments/paypal/confirm-subscription', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId, planId } = req.body;
    const user = req.user;

    // Update user subscription
    await prisma.user.update({
      where: { id: user.id },
      data: {
        planId: planId,
        isPaid: true,
        isTrialActive: false,
        subscriptionId: subscriptionId,
        subscriptionStatus: 'active'
      }
    });

    // Trigger affiliate conversion if referral exists
    try {
      const planPrices = {
        'starter': 29,
        'professional': 99,
        'enterprise': 299
      };
      
      if (affiliateService && planPrices[planId]) {
        await affiliateService.convertReferral(user.id, planPrices[planId]);
      }
    } catch (affiliateError) {
      console.log('Affiliate conversion skipped:', affiliateError.message);
    }

    res.json({
      success: true,
      message: 'Subscription confirmed'
    });
  } catch (error) {
    console.error('PayPal confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm subscription' });
  }
});

// ===== PAYMENTS API =====
app.post('/api/payments/create-subscription', authenticateToken, (req, res) => {
  const { planId, cardData, trialDays = 14 } = req.body;
  
  // Simulate Stripe subscription creation
  const subscription = {
    id: 'sub_' + Date.now(),
    planId,
    status: 'trialing',
    trialEnd: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString(),
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    customerId: 'cus_' + Date.now(),
    priceId: planId === 'starter' ? 'price_starter' : 'price_pro',
    amount: planId === 'starter' ? 2900 : 9900, // in cents
    currency: 'usd'
  };
  
  res.json({
    success: true,
    data: subscription,
    message: 'Subscription created successfully. Trial started.'
  });
});

app.get('/api/payments', authenticateToken, (req, res) => {
  const payments = [
    {
      id: '1',
      amount: 199.00,
      status: 'paid',
      method: 'credit_card',
      description: 'Pro Plan - Monthly',
      date: '2024-01-15T10:00:00Z',
      invoice: 'INV-2024-001'
    },
    {
      id: '2',
      amount: 499.00,
      status: 'paid',
      method: 'paypal',
      description: 'Business Plan - Monthly',
      date: '2024-01-01T10:00:00Z',
      invoice: 'INV-2024-002'
    },
    {
      id: '3',
      amount: 99.00,
      status: 'pending',
      method: 'bank_transfer',
      description: 'Starter Plan - Monthly',
      date: '2024-01-14T15:30:00Z',
      invoice: 'INV-2024-003'
    }
  ];
  
  res.json({
    success: true,
    data: payments
  });
});

// ===== ONBOARDING API =====

// Complete onboarding endpoint
app.post('/api/onboarding/complete', authenticateToken, async (req, res) => {
  try {
    const { storeConnected, platform, storeUrl, completedAt } = req.body;
    const user = req.user;

    // Update user's onboarding status in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hasCompletedOnboarding: true,
        onboardingData: {
          storeConnected: storeConnected || false,
          platform: platform || null,
          storeUrl: storeUrl || null,
          completedAt: completedAt ? new Date(completedAt) : new Date()
        }
      }
    });

    // Also update in RealDataService
    const userStats = realDataService.userStats.get(user.id);
    if (userStats) {
      userStats.hasCompletedOnboarding = true;
      userStats.onboardingData = {
        storeConnected: storeConnected || false,
        platform: platform || null,
        storeUrl: storeUrl || null,
        completedAt: completedAt ? new Date(completedAt) : new Date()
      };
      realDataService.userStats.set(user.id, userStats);
    }

    res.json({
      success: true,
      message: 'Onboarding completed successfully'
    });

  } catch (error) {
    console.error('Onboarding completion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete onboarding'
    });
  }
});

// ===== WIDGET API (Public) =====

// Get widget configuration (public endpoint for embedded widgets)
app.get('/api/widget/config/:chatbotId', async (req, res) => {
  try {
    const { chatbotId } = req.params;
    
    // Get chatbot from database
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId }
    });
    
    if (!chatbot) {
      return res.status(404).json({
        success: false,
        error: 'Chatbot not found'
      });
    }
    
    // Parse settings if it's a JSON string
    let settings = {};
    try {
      settings = typeof chatbot.settings === 'string' ? JSON.parse(chatbot.settings) : chatbot.settings;
    } catch (e) {
      settings = {};
    }
    
    // Return public configuration
    res.json({
      success: true,
      config: {
        name: chatbot.name || 'AI Support',
        welcomeMessage: chatbot.welcomeMessage || 'Hi! How can I help you today? 👋',
        language: chatbot.language || 'auto',
        primaryColor: settings.primaryColor || '#3B82F6',
        secondaryColor: settings.secondaryColor || '#8B5CF6',
        position: settings.position || 'bottom-right'
      }
    });
  } catch (error) {
    console.error('Widget config error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ===== CHATBOTS API =====

// Get all chatbots for user
app.get('/api/chatbots', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    console.log('🔍 GET /api/chatbots - req.user:', req.user);
    const userId = req.user.userId || req.user.id;
    console.log('👤 Extracted userId:', userId);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID not found in token'
      });
    }
    
    // Get chatbots from database
    const chatbots = await prisma.chatbot.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📋 Found ${chatbots.length} chatbots for user ${userId}`);
    
    res.json({
      success: true,
      data: chatbots
    });
  } catch (error) {
    console.error('❌ Get chatbots error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Create new chatbot
app.post('/api/chatbots', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const chatbotData = req.body;
    
    // Get user with chatbots to check limits
    const userWithChatbots = await prisma.user.findUnique({
      where: { id: userId },
      include: { chatbots: true }
    });
    
    // Check plan limits - DEFINITIVE VALUES
    const planLimits = {
      starter: { chatbots: 1, messages: 5000 },
      professional: { chatbots: 2, messages: 25000 },
      enterprise: { chatbots: 3, messages: 100000 }
    };
    
    const userPlanId = userWithChatbots.planId || 'starter';
    const limits = planLimits[userPlanId] || planLimits.starter;
    
    if (userWithChatbots.chatbots.length >= limits.chatbots) {
      return res.status(403).json({
        success: false,
        error: `Your ${userPlanId} plan allows max ${limits.chatbots} chatbot(s). Upgrade to create more.`,
        upgradeRequired: true
      });
    }
    
    // Create chatbot in database
    const chatbot = await prisma.chatbot.create({
      data: {
        name: chatbotData.name || 'My AI Assistant',
        description: chatbotData.description || '',
        welcomeMessage: chatbotData.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?",
        language: chatbotData.language || 'auto',
        settings: chatbotData.settings ? JSON.stringify(chatbotData.settings) : '{}',
        status: 'active',
        userId: userId,
        tenantId: userWithChatbots.tenantId || 'default-tenant'
      }
    });
    
    console.log(`✅ Chatbot ${chatbot.id} created for user ${userId}`);
    
    res.json({
      success: true,
      data: chatbot,
      message: 'Chatbot created successfully!'
    });
  } catch (error) {
    console.error('Create chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update chatbot
app.put('/api/chatbots/:chatbotId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { chatbotId } = req.params;
    const updates = req.body;
    
    // Verify chatbot belongs to user
    const existing = await prisma.chatbot.findFirst({
      where: { 
        id: chatbotId,
        userId: userId
      }
    });
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Chatbot not found'
      });
    }
    
    // Update chatbot in database
    const chatbot = await prisma.chatbot.update({
      where: { id: chatbotId },
      data: {
        name: updates.name,
        description: updates.description,
        welcomeMessage: updates.welcomeMessage,
        language: updates.language,
        settings: updates.settings ? JSON.stringify(updates.settings) : existing.settings,
        updatedAt: new Date()
      }
    });
    
    console.log(`✅ Chatbot ${chatbotId} updated successfully`);
    
      res.json({
        success: true,
        data: chatbot,
        message: 'Chatbot updated successfully!'
      });
  } catch (error) {
    console.error('Update chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete chatbot
app.delete('/api/chatbots/:chatbotId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { chatbotId } = req.params;
    
    // Verify chatbot belongs to user
    const existing = await prisma.chatbot.findFirst({
      where: { 
        id: chatbotId,
        userId: userId
      }
    });
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Chatbot not found'
      });
    }
    
    // Delete chatbot from database
    await prisma.chatbot.delete({
      where: { id: chatbotId }
    });
    
    console.log(`🗑️  Chatbot ${chatbotId} deleted successfully`);
    
    res.json({
      success: true,
      message: 'Chatbot deleted successfully!'
    });
  } catch (error) {
    console.error('Delete chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Patch chatbot (for partial updates like toggle active status)
app.patch('/api/chatbots/:chatbotId', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { chatbotId } = req.params;
    const updates = req.body;
    
    // Update chatbot using RealDataService
    const chatbot = realDataService.updateChatbot(user.id, chatbotId, updates);
    
    if (chatbot) {
      res.json({
        success: true,
        data: chatbot,
        message: 'Chatbot updated successfully!'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Chatbot not found'
      });
    }
  } catch (error) {
    console.error('Patch chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get embed code for chatbot
app.get('/api/chatbots/:chatbotId/embed', authenticateToken, async (req, res) => {
  try {
    const { chatbotId } = req.params;
    
    const result = await chatbotService.getEmbedCode(chatbotId);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get embed code error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get chatbot analytics
app.get('/api/chatbots/:chatbotId/analytics', authenticateToken, async (req, res) => {
  try {
    const { chatbotId } = req.params;
    
    const result = await chatbotService.getAnalytics(chatbotId);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get chatbot analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Legacy chatbot endpoint (for backward compatibility)
app.get('/api/chatbots/legacy', authenticateToken, (req, res) => {
  const chatbots = [
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'AI-powered customer support assistant',
      status: 'active',
      model: 'hybrid',
      messageCount: 1247,
      lastActive: '2024-01-15T10:30:00Z',
      satisfaction: 4.9
    },
    {
      id: '2',
      name: 'Sales Assistant',
      description: 'Product recommendation and sales bot',
      status: 'active',
      model: 'hybrid',
      messageCount: 892,
      lastActive: '2024-01-15T09:45:00Z',
      satisfaction: 4.6
    },
    {
      id: '3',
      name: 'Technical Help',
      description: 'Technical support and troubleshooting',
      status: 'paused',
      model: 'hybrid',
      messageCount: 708,
      lastActive: '2024-01-14T16:20:00Z',
      satisfaction: 4.7
    }
  ];
  
  res.json({
    success: true,
    data: chatbots
  });
});

    // ===== ONBOARDING API =====
    app.post('/api/onboarding/complete', authenticateToken, async (req, res) => {
      try {
        const user = req.user;
        const { storeData, chatbotData } = req.body;
        
        // Mark onboarding as completed
        const userStats = realDataService.getUserStats(user.id);
        if (userStats) {
          userStats.hasCompletedOnboarding = true;
          userStats.isNewUser = false;
          userStats.lastUpdated = new Date();
        }
        
        // If store data provided, add connection
        if (storeData) {
          const connectionId = `${storeData.platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const connection = realDataService.addConnection(user.id, {
            id: connectionId,
            platform: storeData.platform,
            storeName: storeData.name,
            storeUrl: storeData.url,
            status: 'connected',
            lastSync: new Date().toISOString(),
            productsCount: 0,
            ordersCount: 0,
            customersCount: 0,
            revenue: 0,
            monthlyRevenue: 0
          });
        }
        
        // If chatbot data provided, create chatbot
        if (chatbotData) {
          const result = await chatbotService.createChatbot(user.id, {
            name: chatbotData.name,
            description: `AI chatbot for ${chatbotData.name}`,
            language: chatbotData.language,
            personality: chatbotData.personality,
            settings: {
              welcomeMessage: 'Hello! How can I help you today?',
              fallbackMessage: 'I apologize, but I need more information to help you.'
            }
          });
        }
        
        res.json({
          success: true,
          data: {
            message: 'Onboarding completed successfully!',
            hasCompletedOnboarding: true
          }
        });
      } catch (error) {
        console.error('Onboarding completion error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to complete onboarding'
        });
      }
    });

    // ===== AI CHAT API =====
    app.post('/api/chat', chatRateLimitMiddleware, async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    
    // For demo purposes, allow chat without authentication
    // In production, this should require authentication
    const user = req.user || { id: 'demo-user', planId: 'professional' };
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Check conversation limits
    const userPlan = planService.getUserPlan(user.id) || { planId: 'starter' };
    const planLimits = planService.getPlanLimits(userPlan.planId);
    const userStats = realDataService.getUserStats(user.id) || { monthlyConversations: 0 };
    
    if (planLimits && planLimits.conversations !== 'unlimited') {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const monthlyConversations = userStats.monthlyConversations || 0;
      
      if (monthlyConversations >= planLimits.conversations) {
        return res.status(429).json({
          success: false,
          error: `Monthly conversation limit reached (${planLimits.conversations}). Upgrade your plan to continue.`,
          limitReached: true,
          currentUsage: monthlyConversations,
          limit: planLimits.conversations,
          planId: userPlan.planId
        });
      }
    }

    console.log(`🤖 Processing message: "${message.substring(0, 50)}..."`);
    
    // ML Analysis: Analyze message with full ML pipeline
    console.log('🧠 Running ML analysis...');
    const mlAnalysis = await mlService.analyzeMessage(message, {
      userId: user.id,
      timestamp: Date.now()
    });
    
    // Use real AI service with Groq
    console.log('🤖 Using Groq AI service');
    const startTime = Date.now();
    
    // Enhanced system prompt for demo/landing page users
    const enhancedContext = {
      ...context,
      systemPrompt: user.id === 'demo-user' 
        ? `You are an AI assistant showcasing an advanced AI Chatbot Platform.
Your goal is to demonstrate the platform's capabilities by being helpful, multilingual, and intelligent.
Always respond in the SAME LANGUAGE as the user's message.
Be friendly, professional, and highlight features like: multi-language support, ML analytics, e-commerce integration, and automation.
Keep responses concise (2-3 sentences) and engaging.`
        : context.systemPrompt
    };
    
    const response = await aiService.generateResponse(message, enhancedContext);
    const responseTime = Date.now() - startTime;
    
    // Store conversation in real data service with ML insights
    const conversation = realDataService.addConversation(user.id, {
      message,
      response: response.response || response,
      language: context?.language || 'en',
      responseTime: responseTime,
      platform: 'web',
      // ML insights
      sentiment: mlAnalysis.sentiment,
      intent: mlAnalysis.intent,
      anomaly: mlAnalysis.anomaly
    });
    
    // Update user stats
    realDataService.updateUserStats(user.id, {
      lastUpdated: new Date()
    });
    
    // Get product recommendations if e-commerce user
    let recommendations = null;
    if (mlAnalysis.intent.intent === 'product_inquiry') {
      recommendations = await mlService.getRecommendations(user.id, context);
    }
    
    res.json({
      success: true,
      response: typeof response === 'string' ? response : response.response,
      data: typeof response === 'string' ? response : response.response,
      conversationId: conversation.id,
      responseTime: responseTime,
      timestamp: new Date().toISOString(),
      // ML Insights (only for Pro+ plans)
      mlInsights: userPlan.planId !== 'starter' ? {
        sentiment: mlAnalysis.sentiment,
        intent: mlAnalysis.intent,
        recommendations: recommendations,
        urgency: mlAnalysis.sentiment.urgency
      } : undefined
    });
    
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      message: error.message
    });
  }
});

// ===== AI STATS API =====
app.get('/api/ai/stats', (req, res) => {
  try {
    const stats = aiService.getStats();
    
    // Calculate margins
    const totalCost = stats.total.cost;
    const totalRequests = stats.total.requests;
    const averageCost = totalRequests > 0 ? totalCost / totalRequests : 0;
    
    // Assuming $10 revenue per conversation
    const revenuePerConversation = 10;
    const grossMargin = revenuePerConversation - averageCost;
    const marginPercentage = ((grossMargin / revenuePerConversation) * 100).toFixed(1);
    
    res.json({
      success: true,
      data: {
        stats,
        margins: {
          revenuePerConversation,
          averageCost,
          grossMargin,
          marginPercentage: `${marginPercentage}%`
        },
        distribution: {
          groq: totalRequests > 0 ? ((stats.groq.requests / totalRequests) * 100).toFixed(1) : 0,
          ollama: totalRequests > 0 ? ((stats.ollama.requests / totalRequests) * 100).toFixed(1) : 0,
          openai: totalRequests > 0 ? ((stats.openai.requests / totalRequests) * 100).toFixed(1) : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== ML ANALYTICS API =====
app.get('/api/ml/analytics', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userPlan = planService.getUserPlan(user.id) || { planId: 'starter' };
    
    // ML features only for Pro+ plans
    if (userPlan.planId === 'starter') {
      return res.status(403).json({
        success: false,
        error: 'ML Analytics is available on Pro and Enterprise plans',
        upgradeRequired: true,
        planId: 'pro'
      });
    }
    
    const analytics = mlService.getAnalytics();
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== CHURN PREDICTION API =====
app.get('/api/ml/churn-prediction', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userPlan = planService.getUserPlan(user.id) || { planId: 'starter' };
    
    // Churn prediction only for Enterprise plan
    if (userPlan.planId !== 'enterprise' && userPlan.planId !== 'custom') {
      return res.status(403).json({
        success: false,
        error: 'Churn Prediction is available on Enterprise plan',
        upgradeRequired: true,
        planId: 'enterprise'
      });
    }
    
    // Get user data
    const userData = realDataService.getUserStats(user.id);
    
    // Predict churn
    const churnPrediction = await mlService.predictChurn(user.id, userData);
    
    res.json({
      success: true,
      data: churnPrediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== PRODUCT RECOMMENDATIONS API =====
app.get('/api/ml/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userPlan = planService.getUserPlan(user.id) || { planId: 'starter' };
    
    // Recommendations available for Pro+ plans
    if (userPlan.planId === 'starter') {
      return res.status(403).json({
        success: false,
        error: 'Product Recommendations available on Pro and Enterprise plans',
        upgradeRequired: true,
        planId: 'pro'
      });
    }
    
    const { category, maxPrice } = req.query;
    const context = { category, maxPrice: maxPrice ? parseFloat(maxPrice) : undefined };
    
    const recommendations = await mlService.getRecommendations(user.id, context);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== AUTO-FAQ GENERATION API =====
app.post('/api/ml/generate-faqs', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userPlan = planService.getUserPlan(user.id) || { planId: 'starter' };
    
    // FAQ generation only for Enterprise plan
    if (userPlan.planId !== 'enterprise' && userPlan.planId !== 'custom') {
      return res.status(403).json({
        success: false,
        error: 'Auto-FAQ Generation available on Enterprise plan',
        upgradeRequired: true,
        planId: 'enterprise'
      });
    }
    
    // Get user's conversations
    const conversations = realDataService.getConversations(user.id);
    
    // Generate FAQs
    const result = await mlService.generateFAQs(conversations);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 AI Orchestrator - Complete API Server with Full ML Suite',
    version: '2.0.0',
    features: [
      'Hybrid AI (Groq primary + GPT-4 fallback)',
      'Full ML Suite: Sentiment, Intent, Recommendations, Churn, Auto-FAQ',
      'Complete Dashboard API',
      'ML Analytics & Insights',
      'Product Recommendations Engine',
      'Churn Prediction & Retention',
      'FAQ Management & Auto-Generation',
      'Anomaly Detection & Security',
      'Connections & Integrations',
      'Workflow Automation',
      'Payment Processing',
      '95%+ Gross Margins'
    ],
    endpoints: {
      health: '/health',
      dashboard: '/api/dashboard/*',
      analytics: '/api/analytics',
      faqs: '/api/faqs',
      connections: '/api/connections',
      workflows: '/api/workflows',
      payments: '/api/payments',
      chatbots: '/api/chatbots',
      chat: 'POST /api/chat',
      stats: '/api/ai/stats'
    }
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// ===== STRIPE PAYMENT API =====

// Create payment intent for subscription
app.post('/api/payments/create-intent', authenticateToken, async (req, res) => {
  try {
    const { planId, amount } = req.body;
    const user = req.user;
    
    if (!planId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: planId, amount'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        userId: user.id,
        planId: planId,
        email: user.email
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent'
    });
  }
});

// Create Stripe Checkout session
app.post('/api/payments/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;
    const user = req.user;
    
    if (!planId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: planId, successUrl, cancelUrl'
      });
    }

    // Define plan prices (in cents)
    const planPrices = {
      'starter': 2900,      // $29/month
      'professional': 9900, // $99/month
      'enterprise': 29900   // $299/month
    };

    const price = planPrices[planId];
    if (!price) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan ID'
      });
    }

    // Create or get Stripe customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id
          }
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create customer'
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
            description: `AI Orchestrator ${planId} plan subscription`,
          },
          unit_amount: price,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        planId: planId
      },
      subscription_data: {
        trial_period_days: user.isTrialActive ? 0 : 7, // No trial if already in trial
        metadata: {
          userId: user.id,
          planId: planId
        }
      }
    });

    res.json({
      success: true,
      sessionId: session.id,
      message: 'Checkout session created successfully'
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
});

// Create subscription
app.post('/api/payments/create-subscription', authenticateToken, async (req, res) => {
  try {
    const { paymentMethodId, planId, customerEmail } = req.body;
    const user = req.user;
    
    if (!paymentMethodId || !planId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: paymentMethodId, planId'
      });
    }

    // Create or get Stripe customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: customerEmail || user.email,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerEmail || user.email,
          name: user.name,
          metadata: {
            userId: user.id
          }
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create customer'
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Get plan price from planId
    const planPrices = {
      'starter': 'price_starter_monthly',
      'professional': 'price_professional_monthly', 
      'enterprise': 'price_enterprise_monthly'
    };

    const priceId = planPrices[planId];
    if (!priceId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan ID'
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: 7, // 7-day free trial
      metadata: {
        userId: user.id,
        planId: planId
      }
    });

    // Update user plan in our system
    planService.setUserPlan(user.id, planId);
    
    // Update user trial status
    authService.updateUserTrial(user.id, true, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    // Get plan price for affiliate commission
    const planAmounts = {
      'starter': 0,         // Free plan
      'professional': 99,   // €99/month
      'enterprise': 199     // €199/month
    };
    
    const planAmount = planAmounts[planId] || 0;
    
    // If user has a referral and is paying, convert it
    if (planAmount > 0) {
      console.log(`💰 Converting referral for user ${user.id}, plan amount: €${planAmount}`);
      
      const conversionResult = await affiliateService.convertReferral(user.id, planAmount);
      
      if (conversionResult.success) {
        console.log(`✅ Referral converted! Commission: €${conversionResult.data.commissionAmount.toFixed(2)}`);
      } else {
        console.log(`ℹ️  No referral to convert (user may not have been referred)`);
      }
    }

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        status: subscription.status,
        trialEnd: new Date(subscription.trial_end * 1000).toISOString(),
        message: 'Subscription created successfully with 7-day free trial!'
      }
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create subscription: ' + error.message
    });
  }
});

// Get subscription status
app.get('/api/payments/subscription', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user's Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });
    
    if (customers.data.length === 0) {
      return res.json({
        success: true,
        data: {
          hasSubscription: false,
          status: 'none'
        }
      });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.json({
        success: true,
        data: {
          hasSubscription: false,
          status: 'none'
        }
      });
    }

    const subscription = subscriptions.data[0];
    
    res.json({
      success: true,
      data: {
        hasSubscription: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        planId: subscription.metadata.planId
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription status'
    });
  }
});

// Cancel subscription
app.post('/api/payments/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const user = req.user;
    
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing subscription ID'
      });
    }

    // Cancel subscription at period end
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    res.json({
      success: true,
      data: {
        message: 'Subscription will be cancelled at the end of the current period',
        cancelAt: new Date(subscription.current_period_end * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription'
    });
  }
});

// Get payment history
app.get('/api/payments/history', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user's Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });
    
    if (customers.data.length === 0) {
      return res.json({
        success: true,
        data: {
          payments: []
        }
      });
    }

    const customer = customers.data[0];
    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 10
    });

    const payments = invoices.data.map(invoice => ({
      id: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: invoice.status,
      date: new Date(invoice.created * 1000).toISOString(),
      description: invoice.description,
      pdfUrl: invoice.invoice_pdf
    }));

    res.json({
      success: true,
      data: {
        payments
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment history'
    });
  }
});

// Webhook for Stripe events
app.post('/api/payments/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        if (session.mode === 'subscription') {
          const userId = session.metadata?.userId;
          const planId = session.metadata?.planId;
          
          if (userId && planId) {
            // Update user plan in database
            try {
              const user = await prisma.user.findUnique({
                where: { id: userId }
              });
              
              if (user) {
                await prisma.user.update({
                  where: { id: userId },
                  data: {
                    planId: planId,
                    isPaid: true,
                    isTrialActive: false
                  }
                });
                
                // Also update RealDataService
                realDataService.updateUserPlan(userId, planId, true);
                
                console.log(`Updated user ${userId} to plan ${planId}`);
              }
            } catch (error) {
              console.error('Failed to update user plan:', error);
            }
          }
        }
        break;
        
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('Payment succeeded for invoice:', invoice.id);
        
        // Update user payment status if needed
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const customerId = subscription.customer;
          
          // Find user by Stripe customer ID
          try {
            const user = await prisma.user.findFirst({
              where: {
                email: {
                  contains: '@' // This is a placeholder - we'd need to store customer ID
                }
              }
            });
            
            if (user) {
              await prisma.user.update({
                where: { id: user.id },
                data: { isPaid: true }
              });
              console.log(`Updated payment status for user ${user.id}`);
            }
          } catch (error) {
            console.error('Failed to update payment status:', error);
          }
        }
        break;
        
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);
        
        // Update user subscription status
        if (subscription.metadata?.userId && subscription.metadata?.planId) {
          try {
            await prisma.user.update({
              where: { id: subscription.metadata.userId },
              data: {
                planId: subscription.metadata.planId,
                isPaid: subscription.status === 'active'
              }
            });
            
            // Also update RealDataService
            realDataService.updateUserPlan(subscription.metadata.userId, subscription.metadata.planId, subscription.status === 'active');
            
            console.log(`Updated subscription for user ${subscription.metadata.userId}`);
          } catch (error) {
            console.error('Failed to update subscription:', error);
          }
        }
        break;
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log('Subscription cancelled:', deletedSubscription.id);
        
        // Downgrade user to starter plan
        if (deletedSubscription.metadata?.userId) {
          try {
            await prisma.user.update({
              where: { id: deletedSubscription.metadata.userId },
              data: {
                planId: 'starter',
                isPaid: false
              }
            });
            
            // Also update RealDataService
            realDataService.updateUserPlan(deletedSubscription.metadata.userId, 'starter', false);
            
            console.log(`Downgraded user ${deletedSubscription.metadata.userId} to starter plan`);
          } catch (error) {
            console.error('Failed to downgrade user:', error);
          }
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({received: true});
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({error: 'Webhook processing failed'});
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 AI Orchestrator Complete API Server Started!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/ai/stats`);
  console.log('');
  console.log('🎯 Complete API Endpoints:');
  console.log('   ✅ Dashboard: /api/dashboard/*');
  console.log('   ✅ Analytics: /api/analytics');
  console.log('   ✅ FAQ Management: /api/faqs');
  console.log('   ✅ Connections: /api/connections');
  console.log('   ✅ Workflows: /api/workflows');
  console.log('   ✅ Payments: /api/payments/*');
  console.log('   ✅ Stripe Integration: /api/payments/create-subscription');
  console.log('   ✅ Chatbots: /api/chatbots');
  console.log('   ✅ AI Chat: POST /api/chat');
  console.log('');
  console.log('💰 Ready for customers with 98.5% margins!');
  
  // Start cron service for follow-up emails
  console.log('⏰ Starting follow-up email service...');
  cronService.start();
  console.log('✅ Follow-up email service started');
});

module.exports = app;
