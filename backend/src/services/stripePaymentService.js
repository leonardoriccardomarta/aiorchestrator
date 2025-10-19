/**
 * Stripe Payment Service
 * Handles payments directly in chat widget
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripePaymentService {
  constructor() {
    this.paymentLinks = new Map(); // Store payment links
  }

  /**
   * 1. CREATE PAYMENT LINK
   * Creates a Stripe Payment Link for quick checkout
   */
  async createPaymentLink(productData) {
    try {
      console.log('💳 Creating Stripe payment link for:', productData);

      // Create or retrieve Stripe product
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        images: productData.images || [],
        metadata: {
          chatbot_sale: 'true',
          product_id: productData.id,
          source: 'chatbot_widget'
        }
      });

      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(parseFloat(productData.price) * 100), // Convert to cents
        currency: productData.currency || 'usd',
      });

      // Create payment link
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price: price.id,
            quantity: productData.quantity || 1,
          },
        ],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: productData.successUrl || productData.productUrl,
          },
        },
        allow_promotion_codes: true,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH'],
        },
        metadata: {
          chatbot_sale: 'true',
          product_id: productData.id,
          chatbot_id: productData.chatbotId
        }
      });

      // Store payment link
      this.paymentLinks.set(paymentLink.id, {
        productData,
        createdAt: new Date(),
        status: 'active'
      });

      console.log('✅ Payment link created:', paymentLink.url);

      return {
        success: true,
        paymentLink: {
          id: paymentLink.id,
          url: paymentLink.url,
          active: paymentLink.active
        },
        message: null, // AI will generate payment message in correct language
        paymentUrl: paymentLink.url,
        hasPaymentButton: true
      };
    } catch (error) {
      console.error('❌ Create payment link error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate payment button HTML
   */
  generatePaymentButton(paymentUrl, productData) {
    return `
      <div style="margin-top: 16px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 700; margin-bottom: 8px;">
          💳 ${productData.name}
        </div>
        <div style="color: rgba(255,255,255,0.9); font-size: 24px; font-weight: 800; margin-bottom: 12px;">
          $${productData.price}
        </div>
        <a 
          href="${paymentUrl}" 
          target="_blank" 
          style="display: inline-block; padding: 14px 32px; background: white; color: #667eea; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s;"
          onmouseover="this.style.transform='scale(1.05)'"
          onmouseout="this.style.transform='scale(1)'"
        >
          🚀 Pay Now with Stripe
        </a>
        <div style="margin-top: 8px; color: rgba(255,255,255,0.8); font-size: 12px;">
          🔒 Secure payment powered by Stripe
        </div>
      </div>
    `;
  }

  /**
   * 2. CREATE CHECKOUT SESSION
   * For more control, create a Stripe Checkout session
   */
  async createCheckoutSession(lineItems, successUrl, cancelUrl, metadata = {}) {
    try {
      console.log('💳 Creating Stripe checkout session');

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems.map(item => ({
          price_data: {
            currency: item.currency || 'usd',
            product_data: {
              name: item.name,
              description: item.description,
              images: item.images || [],
            },
            unit_amount: Math.round(parseFloat(item.price) * 100),
          },
          quantity: item.quantity || 1,
        })),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH'],
        },
        metadata: {
          ...metadata,
          chatbot_sale: 'true',
          source: 'chatbot_widget'
        }
      });

      console.log('✅ Checkout session created:', session.id);

      return {
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url,
        message: null, // AI will generate checkout message in correct language
        hasCheckoutButton: true
      };
    } catch (error) {
      console.error('❌ Create checkout session error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate checkout button HTML
   */
  generateCheckoutButton(checkoutUrl) {
    return `
      <a 
        href="${checkoutUrl}" 
        target="_blank" 
        style="display: inline-block; margin-top: 12px; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);"
      >
        💳 Checkout Now
      </a>
    `;
  }

  /**
   * 3. VERIFY PAYMENT
   * Verify payment completion
   */
  async verifyPayment(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      return {
        success: true,
        paid: session.payment_status === 'paid',
        status: session.payment_status,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total / 100
      };
    } catch (error) {
      console.error('❌ Verify payment error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 4. HANDLE STRIPE WEBHOOK
   * Process Stripe events (payment success, etc.)
   */
  async handleWebhook(event) {
    try {
      console.log('📨 Stripe webhook received:', event.type);

      switch (event.type) {
        case 'checkout.session.completed':
          return await this.handleCheckoutCompleted(event.data.object);
        
        case 'payment_intent.succeeded':
          return await this.handlePaymentSucceeded(event.data.object);
        
        case 'payment_intent.payment_failed':
          return await this.handlePaymentFailed(event.data.object);
        
        default:
          console.log('Unhandled event type:', event.type);
          return { success: true };
      }
    } catch (error) {
      console.error('❌ Webhook handling error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Handle successful checkout
   */
  async handleCheckoutCompleted(session) {
    console.log('✅ Checkout completed:', session.id);
    
    // TODO: Update database, send confirmation email, etc.
    // For now, just log the success
    
    return {
      success: true,
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total / 100
    };
  }

  /**
   * Handle successful payment intent
   */
  async handlePaymentSucceeded(paymentIntent) {
    console.log('✅ Payment succeeded:', paymentIntent.id);
    
    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100
    };
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(paymentIntent) {
    console.log('❌ Payment failed:', paymentIntent.id);
    
    return {
      success: false,
      paymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message || 'Payment failed'
    };
  }

  /**
   * 5. CREATE SUBSCRIPTION (for recurring payments)
   */
  async createSubscription(customerId, priceId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      return {
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      };
    } catch (error) {
      console.error('❌ Create subscription error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 6. GET PAYMENT STATUS
   * Check payment status by ID
   */
  async getPaymentStatus(paymentLinkId) {
    const link = this.paymentLinks.get(paymentLinkId);
    
    if (!link) {
      return {
        success: false,
        error: 'Payment link not found'
      };
    }

    return {
      success: true,
      status: link.status,
      createdAt: link.createdAt,
      productData: link.productData
    };
  }
}

module.exports = StripePaymentService;

