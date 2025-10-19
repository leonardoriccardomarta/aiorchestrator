/**
 * Shopify Cart Service
 * Manages cart operations for chatbot: add to cart, checkout, abandoned cart recovery
 */

class ShopifyCartService {
  constructor() {
    this.carts = new Map(); // In-memory cart tracking (userId → cartData)
  }

  /**
   * 1. ADD TO CART via Chat
   * Adds product to Shopify cart via Ajax API
   */
  async addToCart(shop, productId, variantId, quantity = 1) {
    try {
      console.log('🛒 Adding to cart:', { shop, productId, variantId, quantity });
      
      // Shopify Ajax API doesn't need accessToken (runs client-side)
      // But we can return the data to widget to execute client-side
      return {
        success: true,
        action: 'add_to_cart',
        data: {
          id: variantId,
          quantity: quantity,
          properties: {
            '_chatbot_recommendation': 'true',
            '_recommended_at': new Date().toISOString()
          }
        },
        cartScript: this.generateAddToCartScript(variantId, quantity),
        message: `✅ Added to cart! <a href="https://${shop}/cart" target="_blank" style="color: #0ea5e9; font-weight: 600;">View Cart →</a>`
      };
    } catch (error) {
      console.error('❌ Add to cart error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate JavaScript to add to cart (executed by widget)
   */
  generateAddToCartScript(variantId, quantity) {
    return `
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ${variantId},
          quantity: ${quantity},
          properties: {
            '_chatbot_recommendation': 'true',
            '_recommended_at': '${new Date().toISOString()}'
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('✅ Added to cart:', data);
        // Update cart count in theme
        fetch('/cart.js')
          .then(r => r.json())
          .then(cart => {
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) cartCount.textContent = cart.item_count;
          });
      })
      .catch(error => console.error('❌ Cart error:', error));
    `;
  }

  /**
   * 2. CHECKOUT ASSISTANCE
   * Guides user through checkout process
   */
  async getCheckoutGuidance(shop, cartId = null) {
    try {
      return {
        success: true,
        guidance: {
          steps: [
            {
              step: 1,
              title: '🛒 Review Your Cart',
              action: 'view_cart',
              url: `https://${shop}/cart`,
              description: 'Check your items and apply any discount codes'
            },
            {
              step: 2,
              title: '📦 Shipping Information',
              action: 'enter_shipping',
              description: 'We\'ll need your delivery address'
            },
            {
              step: 3,
              title: '💳 Payment',
              action: 'enter_payment',
              description: 'Secure payment via Shopify Payments'
            },
            {
              step: 4,
              title: '✅ Order Confirmation',
              action: 'confirm',
              description: 'Review and place your order'
            }
          ],
          checkoutUrl: `https://${shop}/checkout`,
          message: 'Ready to checkout? I can help you through each step!',
          quickCheckout: `<a href="https://${shop}/checkout" target="_blank" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 12px;">🚀 Proceed to Checkout</a>`
        }
      };
    } catch (error) {
      console.error('❌ Checkout guidance error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 3. ABANDONED CART RECOVERY
   * Tracks abandoned carts and creates recovery messages
   */
  async trackAbandonedCart(userId, cartData) {
    try {
      const abandonedCart = {
        userId,
        cartData,
        abandonedAt: new Date(),
        recoveryAttempts: 0,
        status: 'abandoned'
      };

      this.carts.set(userId, abandonedCart);

      console.log('📊 Abandoned cart tracked:', {
        userId,
        items: cartData.items?.length || 0,
        total: cartData.total
      });

      return {
        success: true,
        message: 'Cart tracked for recovery'
      };
    } catch (error) {
      console.error('❌ Track abandoned cart error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get abandoned cart recovery message
   */
  getRecoveryMessage(userId) {
    const cart = this.carts.get(userId);
    
    if (!cart) {
      return null;
    }

    const itemsCount = cart.cartData.items?.length || 0;
    const total = cart.cartData.total || 0;

    return {
      success: true,
      message: `🛒 Hey! You left ${itemsCount} item(s) in your cart (Total: $${total}). Still interested? I can help you complete your purchase!`,
      discount: {
        code: 'COMEBACK10',
        value: 10,
        type: 'percentage',
        message: '💝 Special offer: Use code <strong>COMEBACK10</strong> for 10% off!'
      },
      cartUrl: cart.cartData.checkoutUrl || '/cart'
    };
  }

  /**
   * 4. AI UPSELLING / CROSS-SELLING
   * Suggests related or complementary products
   */
  async getUpsellRecommendations(shop, accessToken, currentProduct) {
    try {
      console.log('🎯 Getting upsell recommendations for:', currentProduct);

      // Get product details
      const response = await fetch(
        `https://${shop}/admin/api/2024-01/products.json?limit=10`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      const products = data.products || [];

      // Simple ML: recommend products with similar tags or higher price
      const currentPrice = parseFloat(currentProduct.price) || 0;
      
      const upsells = products
        .filter(p => p.id !== currentProduct.id)
        .map(product => {
          const price = parseFloat(product.variants?.[0]?.price || 0);
          const priceIncrease = price - currentPrice;
          
          // Calculate relevance score
          let score = 0;
          if (priceIncrease > 0 && priceIncrease < 50) score += 30; // Upsell opportunity
          if (product.product_type === currentProduct.product_type) score += 40;
          if (product.tags?.some(tag => currentProduct.tags?.includes(tag))) score += 30;
          
          return {
            product,
            price,
            priceIncrease,
            score,
            reason: priceIncrease > 0 ? 'Premium upgrade' : 'Similar item'
          };
        })
        .filter(item => item.score > 30)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      return {
        success: true,
        upsells: upsells.map(item => ({
          id: item.product.id,
          title: item.product.title,
          description: item.product.body_html?.replace(/<[^>]*>/g, '').substring(0, 100),
          price: item.price,
          priceIncrease: item.priceIncrease,
          image: item.product.image?.src || item.product.images?.[0]?.src,
          url: `https://${shop}/products/${item.product.handle}`,
          reason: item.reason,
          badge: item.priceIncrease > 0 ? '⭐ Upgrade' : '🔄 Alternative'
        })),
        message: upsells.length > 0 
          ? 'Customers who bought this also loved:' 
          : 'Great choice! This is one of our best products.'
      };
    } catch (error) {
      console.error('❌ Upsell recommendations error:', error.message);
      return {
        success: false,
        upsells: [],
        error: error.message
      };
    }
  }

  /**
   * 5. CALCULATE CART TOTAL
   * Calculate total with discounts
   */
  calculateTotal(items, discountCode = null) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;

    if (discountCode) {
      // Apply discount logic
      if (discountCode.type === 'percentage') {
        discount = subtotal * (discountCode.value / 100);
      } else if (discountCode.type === 'fixed') {
        discount = discountCode.value;
      }
    }

    const total = subtotal - discount;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
      currency: 'USD'
    };
  }

  /**
   * 6. GET CART STATUS
   * Check if user has active cart
   */
  getCartStatus(userId) {
    const cart = this.carts.get(userId);
    
    if (!cart) {
      return { hasCart: false };
    }

    const itemsCount = cart.cartData.items?.length || 0;
    const total = this.calculateTotal(cart.cartData.items || []);

    return {
      hasCart: true,
      itemsCount,
      total: total.total,
      abandonedMinutesAgo: Math.floor((Date.now() - cart.abandonedAt.getTime()) / 60000),
      items: cart.cartData.items
    };
  }
}

module.exports = ShopifyCartService;

