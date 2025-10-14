/**
 * WooCommerce OAuth Service
 * Handles authentication for WooCommerce connections
 */

const crypto = require('crypto');

class WooCommerceOAuthService {
  constructor() {
    // WooCommerce uses REST API authentication (not OAuth 2.0 like Shopify)
    console.log('🛒 WooCommerce OAuth Service initialized');
  }

  /**
   * Validate WooCommerce credentials
   * WooCommerce uses Consumer Key + Consumer Secret (not OAuth flow)
   */
  async validateCredentials(storeUrl, consumerKey, consumerSecret) {
    try {
      // Clean store URL
      let cleanUrl = storeUrl.replace(/\/$/, ''); // Remove trailing slash
      if (!cleanUrl.startsWith('http')) {
        cleanUrl = `https://${cleanUrl}`;
      }

      // Test connection by fetching system status
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      
      const response = await fetch(`${cleanUrl}/wp-json/wc/v3/system_status`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Try products endpoint as fallback
        const productsResponse = await fetch(`${cleanUrl}/wp-json/wc/v3/products?per_page=1`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        });

        if (!productsResponse.ok) {
          return { 
            success: false, 
            error: 'Invalid credentials or WooCommerce not properly configured' 
          };
        }
      }

      return { 
        success: true,
        storeUrl: cleanUrl
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Connection failed: ${error.message}` 
      };
    }
  }

  /**
   * Fetch products from WooCommerce
   */
  async fetchProducts(storeUrl, consumerKey, consumerSecret, perPage = 50) {
    try {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      
      const response = await fetch(
        `${storeUrl}/wp-json/wc/v3/products?per_page=${perPage}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const products = await response.json();
      return products || [];
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  /**
   * Fetch orders from WooCommerce
   */
  async fetchOrders(storeUrl, consumerKey, consumerSecret, perPage = 50) {
    try {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      
      const response = await fetch(
        `${storeUrl}/wp-json/wc/v3/orders?per_page=${perPage}&status=any`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const orders = await response.json();
      return orders || [];
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  /**
   * Get store info
   */
  async getStoreInfo(storeUrl, consumerKey, consumerSecret) {
    try {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      
      const response = await fetch(
        `${storeUrl}/wp-json/wc/v3/system_status`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch store info');
      }

      const data = await response.json();
      return {
        name: data.settings?.general_store_name || 'WooCommerce Store',
        version: data.environment?.version || 'Unknown',
        currency: data.settings?.currency || 'USD'
      };
    } catch (error) {
      // Return defaults if system_status fails
      return {
        name: 'WooCommerce Store',
        version: 'Unknown',
        currency: 'USD'
      };
    }
  }
}

module.exports = WooCommerceOAuthService;

