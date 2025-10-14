/**
 * Shopify OAuth Service
 * Handles OAuth flow for Shopify store connections
 */

const crypto = require('crypto');

class ShopifyOAuthService {
  constructor() {
    this.apiKey = process.env.SHOPIFY_API_KEY;
    this.apiSecret = process.env.SHOPIFY_API_SECRET;
    this.scopes = 'read_products,read_orders,read_customers,read_inventory';
    this.redirectUri = `${process.env.FRONTEND_URL}/api/shopify/callback`;
    
    // Store for pending OAuth states (in production, use Redis/database)
    this.pendingStates = new Map();
    
    console.log('🛍️ Shopify OAuth Service initialized');
  }

  /**
   * Generate install URL for Shopify OAuth
   */
  getInstallUrl(shop, userId) {
    // Validate shop format
    if (!shop.includes('.myshopify.com')) {
      shop = `${shop}.myshopify.com`;
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');
    const nonce = crypto.randomBytes(32).toString('hex');
    
    // Store state with user info (expires in 10 minutes)
    this.pendingStates.set(state, {
      userId,
      shop,
      nonce,
      createdAt: Date.now()
    });

    // Clean old states
    this.cleanExpiredStates();

    // Build Shopify OAuth URL
    const params = new URLSearchParams({
      client_id: this.apiKey,
      scope: this.scopes,
      redirect_uri: this.redirectUri,
      state: state,
      grant_options: []
    });

    return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
  }

  /**
   * Verify HMAC signature from Shopify
   */
  verifyHmac(query) {
    const { hmac, ...params } = query;
    
    // Build message from sorted params
    const message = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // Calculate HMAC
    const generatedHash = crypto
      .createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('hex');

    return generatedHash === hmac;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(shop, code) {
    const url = `https://${shop}/admin/oauth/access_token`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.apiKey,
        client_secret: this.apiSecret,
        code: code
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Validate state and retrieve user info
   */
  validateState(state) {
    const stateData = this.pendingStates.get(state);
    
    if (!stateData) {
      throw new Error('Invalid or expired state');
    }

    // Check expiration (10 minutes)
    const age = Date.now() - stateData.createdAt;
    if (age > 10 * 60 * 1000) {
      this.pendingStates.delete(state);
      throw new Error('State expired');
    }

    // Delete used state
    this.pendingStates.delete(state);
    
    return stateData;
  }

  /**
   * Test connection with access token
   */
  async testConnection(shop, accessToken) {
    try {
      const response = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return { success: false, error: 'Invalid credentials' };
      }

      const data = await response.json();
      return { 
        success: true, 
        shop: data.shop,
        name: data.shop.name,
        email: data.shop.email,
        domain: data.shop.domain
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Fetch products from Shopify
   */
  async fetchProducts(shop, accessToken, limit = 50) {
    try {
      const response = await fetch(
        `https://${shop}/admin/api/2024-01/products.json?limit=${limit}`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  /**
   * Clean expired states
   */
  cleanExpiredStates() {
    const now = Date.now();
    for (const [state, data] of this.pendingStates.entries()) {
      if (now - data.createdAt > 10 * 60 * 1000) {
        this.pendingStates.delete(state);
      }
    }
  }
}

module.exports = ShopifyOAuthService;

