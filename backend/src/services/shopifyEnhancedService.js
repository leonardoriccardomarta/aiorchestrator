const axios = require('axios');

/**
 * Shopify Enhanced Service
 * Advanced features for Shopify-connected chatbots
 * - Product Recommendations
 * - Order Tracking
 * - Inventory Check
 * - Customer History
 */
class ShopifyEnhancedService {
  constructor() {
    this.cache = new Map(); // Cache for product data
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get Shopify API headers
   */
  getHeaders(accessToken) {
    return {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    };
  }

  /**
   * 1. AI PRODUCT RECOMMENDATIONS
   * Analyzes customer query and recommends relevant products
   */
  async getProductRecommendations(shop, accessToken, query, context = {}) {
    try {
      console.log('🎯 Getting product recommendations for:', query);
      console.log('📦 Shopify shop:', shop);
      console.log('🔑 Access token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'MISSING');
      
      // Extract keywords from query
      const keywords = this.extractKeywords(query);
      console.log('🔍 Extracted keywords:', keywords);
      
      // Search products based on keywords
      console.log('🔍 Calling Shopify API...');
      const products = await this.searchProducts(shop, accessToken, keywords);
      console.log('✅ Shopify API returned', products?.length || 0, 'products');
      
      if (!products || products.length === 0) {
        return {
          success: true,
          recommendations: [],
          message: "I couldn't find specific products matching your query. Let me show you our popular items!"
        };
      }
      
      // Rank products by relevance
      const rankedProducts = this.rankProductsByRelevance(products, keywords, context);
      
      // Format recommendations
      const recommendations = rankedProducts.slice(0, 5).map(product => ({
        id: product.id,
        title: product.title,
        description: product.body_html?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
        price: product.variants[0]?.price || 'N/A',
        image: product.image?.src || product.images?.[0]?.src || null,
        url: `https://${shop}/products/${product.handle}`,
        inStock: product.variants?.[0]?.inventory_quantity > 0,
        variants: product.variants?.length || 0
      }));
      
      return {
        success: true,
        recommendations,
        message: this.generateRecommendationMessage(recommendations, query)
      };
    } catch (error) {
      console.error('❌ Product recommendations error:', error.message);
      return {
        success: false,
        recommendations: [],
        message: "I'm having trouble accessing product information right now."
      };
    }
  }

  /**
   * 2. ORDER TRACKING
   * Track order status by order number or email
   */
  async trackOrder(shop, accessToken, orderIdentifier) {
    try {
      console.log('📦 Tracking order:', orderIdentifier);
      
      let order = null;
      
      // Try to find order by order number (name field in Shopify)
      if (orderIdentifier.startsWith('#')) {
        const orderName = orderIdentifier; // e.g., #1001
        const response = await axios.get(
          `https://${shop}/admin/api/2023-10/orders.json?name=${encodeURIComponent(orderName)}&status=any`,
          { headers: this.getHeaders(accessToken), timeout: 10000 }
        );
        order = response.data.orders?.[0];
      } else if (orderIdentifier.includes('@')) {
        // Search by email
        const response = await axios.get(
          `https://${shop}/admin/api/2023-10/orders.json?email=${encodeURIComponent(orderIdentifier)}&status=any&limit=5`,
          { headers: this.getHeaders(accessToken), timeout: 10000 }
        );
        // Get most recent order
        order = response.data.orders?.[0];
      } else {
        // Try by order ID
        try {
          const response = await axios.get(
            `https://${shop}/admin/api/2023-10/orders/${orderIdentifier}.json`,
            { headers: this.getHeaders(accessToken), timeout: 10000 }
          );
          order = response.data.order;
        } catch (err) {
          // If not found by ID, search by name without #
          const response = await axios.get(
            `https://${shop}/admin/api/2023-10/orders.json?name=${encodeURIComponent('#' + orderIdentifier)}&status=any`,
            { headers: this.getHeaders(accessToken), timeout: 10000 }
          );
          order = response.data.orders?.[0];
        }
      }
      
      if (!order) {
        return {
          success: false,
          message: `I couldn't find an order matching "${orderIdentifier}". Please check the order number or email and try again.`
        };
      }
      
      // Format order information
      const orderInfo = {
        orderNumber: order.name,
        orderDate: new Date(order.created_at).toLocaleDateString(),
        status: this.formatOrderStatus(order.fulfillment_status, order.financial_status),
        total: `${order.currency} ${order.total_price}`,
        items: order.line_items?.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: `${order.currency} ${item.price}`
        })) || [],
        shippingAddress: order.shipping_address ? {
          name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
          address: `${order.shipping_address.address1}, ${order.shipping_address.city}, ${order.shipping_address.province_code} ${order.shipping_address.zip}`,
          country: order.shipping_address.country
        } : null,
        trackingNumber: order.fulfillments?.[0]?.tracking_number || null,
        trackingUrl: order.fulfillments?.[0]?.tracking_url || null,
        estimatedDelivery: this.estimateDelivery(order)
      };
      
      return {
        success: true,
        order: orderInfo,
        message: this.generateOrderStatusMessage(orderInfo)
      };
    } catch (error) {
      console.error('❌ Order tracking error:', error.message);
      return {
        success: false,
        message: "I'm having trouble accessing order information right now. Please try again later."
      };
    }
  }

  /**
   * 3. INVENTORY CHECK
   * Check product availability in real-time
   */
  async checkInventory(shop, accessToken, productQuery) {
    try {
      console.log('📊 Checking inventory for:', productQuery);
      
      // Search for product
      const response = await axios.get(
        `https://${shop}/admin/api/2023-10/products.json?title=${encodeURIComponent(productQuery)}&limit=5`,
        { headers: this.getHeaders(accessToken), timeout: 10000 }
      );
      
      const products = response.data.products;
      
      if (!products || products.length === 0) {
        return {
          success: false,
          message: `I couldn't find a product named "${productQuery}". Could you try a different name or be more specific?`
        };
      }
      
      // Get the most relevant product
      const product = products[0];
      
      // Get inventory for all variants
      const inventory = product.variants.map(variant => ({
        variantId: variant.id,
        title: variant.title !== 'Default Title' ? variant.title : product.title,
        sku: variant.sku,
        price: `${product.variants[0].currency || 'USD'} ${variant.price}`,
        available: variant.inventory_quantity > 0,
        quantity: variant.inventory_quantity,
        inventoryPolicy: variant.inventory_policy // 'deny' or 'continue'
      }));
      
      return {
        success: true,
        product: {
          id: product.id,
          title: product.title,
          handle: product.handle,
          url: `https://${shop}/products/${product.handle}`
        },
        inventory,
        message: this.generateInventoryMessage(product, inventory)
      };
    } catch (error) {
      console.error('❌ Inventory check error:', error.message);
      return {
        success: false,
        message: "I'm having trouble checking inventory right now. Please try again later."
      };
    }
  }

  /**
   * 4. CUSTOMER HISTORY
   * Recognize returning customers and personalize experience
   */
  async getCustomerHistory(shop, accessToken, email) {
    try {
      console.log('👤 Getting customer history for:', email);
      
      // Search for customer by email
      const response = await axios.get(
        `https://${shop}/admin/api/2023-10/customers/search.json?query=email:${encodeURIComponent(email)}`,
        { headers: this.getHeaders(accessToken), timeout: 10000 }
      );
      
      const customer = response.data.customers?.[0];
      
      if (!customer) {
        return {
          success: false,
          isNewCustomer: true,
          message: "Welcome! It looks like you're new here. How can I help you today?"
        };
      }
      
      // Get customer's orders
      const ordersResponse = await axios.get(
        `https://${shop}/admin/api/2023-10/customers/${customer.id}/orders.json?status=any&limit=10`,
        { headers: this.getHeaders(accessToken), timeout: 10000 }
      );
      
      const orders = ordersResponse.data.orders || [];
      
      // Calculate customer stats
      const totalSpent = parseFloat(customer.total_spent || 0);
      const totalOrders = orders.length;
      const lastOrderDate = orders[0] ? new Date(orders[0].created_at) : null;
      
      // Get favorite products (most purchased)
      const productCounts = {};
      orders.forEach(order => {
        order.line_items?.forEach(item => {
          productCounts[item.product_id] = (productCounts[item.product_id] || 0) + item.quantity;
        });
      });
      
      const favoriteProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([productId, count]) => ({
          productId,
          purchaseCount: count
        }));
      
      return {
        success: true,
        isNewCustomer: false,
        customer: {
          id: customer.id,
          name: `${customer.first_name} ${customer.last_name}`,
          email: customer.email,
          totalSpent: `${orders[0]?.currency || 'USD'} ${totalSpent.toFixed(2)}`,
          totalOrders,
          lastOrderDate: lastOrderDate ? lastOrderDate.toLocaleDateString() : null,
          createdAt: new Date(customer.created_at).toLocaleDateString(),
          tags: customer.tags ? customer.tags.split(',').map(t => t.trim()) : []
        },
        recentOrders: orders.slice(0, 3).map(order => ({
          orderNumber: order.name,
          date: new Date(order.created_at).toLocaleDateString(),
          total: `${order.currency} ${order.total_price}`,
          status: this.formatOrderStatus(order.fulfillment_status, order.financial_status)
        })),
        favoriteProducts,
        message: this.generateWelcomeBackMessage(customer, totalOrders, totalSpent)
      };
    } catch (error) {
      console.error('❌ Customer history error:', error.message);
      return {
        success: false,
        isNewCustomer: true,
        message: "Welcome! How can I help you today?"
      };
    }
  }

  // ============ HELPER METHODS ============

  /**
   * Extract keywords from user query
   */
  extractKeywords(query) {
    const stopWords = ['i', 'want', 'need', 'looking', 'for', 'a', 'an', 'the', 'show', 'me', 'find', 'get', 'buy', 'purchase'];
    const words = query.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
    return words;
  }

  /**
   * Search products by keywords
   */
  async searchProducts(shop, accessToken, keywords) {
    const cacheKey = `products_${shop}_${keywords.join('_')}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }
    
    // Search by title
    const searchQuery = keywords.join(' ');
    const response = await axios.get(
      `https://${shop}/admin/api/2023-10/products.json?title=${encodeURIComponent(searchQuery)}&limit=20`,
      { headers: this.getHeaders(accessToken), timeout: 10000 }
    );
    
    const products = response.data.products || [];
    
    // Cache results
    this.cache.set(cacheKey, {
      data: products,
      timestamp: Date.now()
    });
    
    return products;
  }

  /**
   * Rank products by relevance to query
   */
  rankProductsByRelevance(products, keywords, context = {}) {
    return products.map(product => {
      let score = 0;
      const titleLower = product.title.toLowerCase();
      const bodyLower = (product.body_html || '').toLowerCase();
      
      // Title match (higher weight)
      keywords.forEach(keyword => {
        if (titleLower.includes(keyword)) score += 10;
        if (bodyLower.includes(keyword)) score += 3;
      });
      
      // Availability bonus
      if (product.variants?.[0]?.inventory_quantity > 0) score += 5;
      
      // Price range match (if provided in context)
      if (context.maxPrice && product.variants?.[0]?.price) {
        const price = parseFloat(product.variants[0].price);
        if (price <= context.maxPrice) score += 3;
      }
      
      return { ...product, relevanceScore: score };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Generate recommendation message
   */
  generateRecommendationMessage(recommendations, query) {
    if (recommendations.length === 0) {
      return "I couldn't find exact matches, but I'd be happy to help you find what you're looking for!";
    }
    
    const inStockCount = recommendations.filter(r => r.inStock).length;
    
    if (inStockCount === recommendations.length) {
      return `Great news! I found ${recommendations.length} perfect matches for "${query}" and they're all in stock! 🎉`;
    } else if (inStockCount > 0) {
      return `I found ${recommendations.length} products matching "${query}". ${inStockCount} are currently in stock!`;
    } else {
      return `I found ${recommendations.length} products matching "${query}", but they're currently out of stock. Would you like to see similar items?`;
    }
  }

  /**
   * Format order status
   */
  formatOrderStatus(fulfillmentStatus, financialStatus) {
    if (fulfillmentStatus === 'fulfilled') return '✅ Delivered';
    if (fulfillmentStatus === 'partial') return '📦 Partially Shipped';
    if (fulfillmentStatus === null && financialStatus === 'paid') return '⏳ Processing';
    if (financialStatus === 'pending') return '💳 Payment Pending';
    if (financialStatus === 'refunded') return '↩️ Refunded';
    return '📋 Order Received';
  }

  /**
   * Generate order status message
   */
  generateOrderStatusMessage(orderInfo) {
    let message = `📦 Order ${orderInfo.orderNumber}\n\n`;
    message += `Status: ${orderInfo.status}\n`;
    message += `Order Date: ${orderInfo.orderDate}\n`;
    message += `Total: ${orderInfo.total}\n\n`;
    
    if (orderInfo.trackingNumber) {
      message += `🚚 Tracking Number: ${orderInfo.trackingNumber}\n`;
      if (orderInfo.estimatedDelivery) {
        message += `📅 Estimated Delivery: ${orderInfo.estimatedDelivery}\n`;
      }
    }
    
    if (orderInfo.items.length > 0) {
      message += `\n📋 Items:\n`;
      orderInfo.items.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - ${item.price}\n`;
      });
    }
    
    return message;
  }

  /**
   * Estimate delivery date
   */
  estimateDelivery(order) {
    if (order.fulfillment_status === 'fulfilled') {
      return 'Delivered';
    }
    
    if (order.fulfillments && order.fulfillments.length > 0) {
      // If shipped, estimate 3-5 business days
      const shipDate = new Date(order.fulfillments[0].created_at);
      const estimatedDate = new Date(shipDate);
      estimatedDate.setDate(estimatedDate.getDate() + 5);
      return estimatedDate.toLocaleDateString();
    }
    
    return null;
  }

  /**
   * Generate inventory message
   */
  generateInventoryMessage(product, inventory) {
    const totalAvailable = inventory.reduce((sum, v) => sum + (v.quantity > 0 ? v.quantity : 0), 0);
    
    if (totalAvailable === 0) {
      return `Unfortunately, "${product.title}" is currently out of stock. Would you like me to show you similar products?`;
    }
    
    if (inventory.length === 1) {
      return `Great news! "${product.title}" is in stock with ${inventory[0].quantity} units available at ${inventory[0].price}! 🎉`;
    }
    
    let message = `"${product.title}" is available in ${inventory.length} variants:\n\n`;
    inventory.forEach(v => {
      if (v.available) {
        message += `✅ ${v.title} - ${v.price} (${v.quantity} in stock)\n`;
      } else {
        message += `❌ ${v.title} - Out of stock\n`;
      }
    });
    
    return message;
  }

  /**
   * Generate welcome back message
   */
  generateWelcomeBackMessage(customer, totalOrders, totalSpent) {
    const firstName = customer.first_name || 'there';
    
    if (totalOrders === 0) {
      return `Welcome back, ${firstName}! It's great to see you again! How can I help you today?`;
    }
    
    if (totalOrders === 1) {
      return `Welcome back, ${firstName}! 🎉 Thank you for your previous order. How can I assist you today?`;
    }
    
    return `Welcome back, ${firstName}! 🌟 It's wonderful to see a valued customer like you (${totalOrders} orders, $${totalSpent.toFixed(0)} total). How can I help you today?`;
  }

  /**
   * Detect intent from message
   */
  detectIntent(message) {
    const msgLower = message.toLowerCase();
    
    // Order tracking
    if (msgLower.includes('order') || msgLower.includes('track') || msgLower.includes('#') || msgLower.includes('where is')) {
      return 'order_tracking';
    }
    
    // Product search/recommendation
    if (msgLower.includes('show') || msgLower.includes('find') || msgLower.includes('looking for') || 
        msgLower.includes('want') || msgLower.includes('recommend')) {
      return 'product_search';
    }
    
    // Inventory check
    if (msgLower.includes('in stock') || msgLower.includes('available') || msgLower.includes('inventory')) {
      return 'inventory_check';
    }
    
    return 'general';
  }
}

module.exports = ShopifyEnhancedService;

