// Order Tracking Service - Shopify & WooCommerce Integration
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

class OrderTrackingService {
  // ================================================
  // SHOPIFY ORDER TRACKING
  // ================================================

  /**
   * Fetch order from Shopify
   */
  async fetchShopifyOrder(connection, orderNumber) {
    try {
      const { shopDomain, accessToken } = JSON.parse(connection.credentials);
      
      const response = await axios.get(
        `https://${shopDomain}/admin/api/2024-01/orders.json`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken
          },
          params: {
            name: orderNumber, // Order number like #1001
            status: 'any'
          }
        }
      );

      if (response.data.orders.length === 0) {
        return null;
      }

      return response.data.orders[0];
    } catch (error) {
      console.error('Error fetching Shopify order:', error);
      throw error;
    }
  }

  /**
   * Sync Shopify order to database
   */
  async syncShopifyOrder(tenantId, connection, shopifyOrder) {
    try {
      const tracking = shopifyOrder.fulfillments?.[0]?.tracking_number || null;
      const trackingUrl = shopifyOrder.fulfillments?.[0]?.tracking_url || null;

      const order = await prisma.order.upsert({
        where: {
          tenantId_platformOrderId: {
            tenantId,
            platformOrderId: shopifyOrder.id.toString()
          }
        },
        update: {
          orderNumber: shopifyOrder.name,
          customerEmail: shopifyOrder.email || shopifyOrder.customer?.email || 'unknown@email.com',
          customerName: shopifyOrder.customer?.first_name && shopifyOrder.customer?.last_name
            ? `${shopifyOrder.customer.first_name} ${shopifyOrder.customer.last_name}`
            : shopifyOrder.billing_address?.name || 'Unknown',
          status: this.mapShopifyStatus(shopifyOrder.financial_status, shopifyOrder.fulfillment_status),
          total: parseFloat(shopifyOrder.total_price),
          currency: shopifyOrder.currency,
          trackingNumber: tracking,
          trackingUrl: trackingUrl,
          shippedAt: shopifyOrder.fulfillments?.[0]?.created_at ? new Date(shopifyOrder.fulfillments[0].created_at) : null,
          metadata: JSON.stringify(shopifyOrder),
          updatedAt: new Date()
        },
        create: {
          tenantId,
          platform: 'shopify',
          platformOrderId: shopifyOrder.id.toString(),
          orderNumber: shopifyOrder.name,
          customerEmail: shopifyOrder.email || shopifyOrder.customer?.email || 'unknown@email.com',
          customerName: shopifyOrder.customer?.first_name && shopifyOrder.customer?.last_name
            ? `${shopifyOrder.customer.first_name} ${shopifyOrder.customer.last_name}`
            : shopifyOrder.billing_address?.name || 'Unknown',
          status: this.mapShopifyStatus(shopifyOrder.financial_status, shopifyOrder.fulfillment_status),
          total: parseFloat(shopifyOrder.total_price),
          currency: shopifyOrder.currency,
          trackingNumber: tracking,
          trackingUrl: trackingUrl,
          shippedAt: shopifyOrder.fulfillments?.[0]?.created_at ? new Date(shopifyOrder.fulfillments[0].created_at) : null,
          metadata: JSON.stringify(shopifyOrder)
        }
      });

      return order;
    } catch (error) {
      console.error('Error syncing Shopify order:', error);
      throw error;
    }
  }

  /**
   * Map Shopify status to our status
   */
  mapShopifyStatus(financialStatus, fulfillmentStatus) {
    if (fulfillmentStatus === 'fulfilled') return 'delivered';
    if (fulfillmentStatus === 'partial') return 'shipped';
    if (financialStatus === 'paid') return 'processing';
    if (financialStatus === 'pending') return 'pending';
    return 'pending';
  }

  // ================================================
  // WOOCOMMERCE ORDER TRACKING
  // ================================================

  /**
   * Fetch order from WooCommerce
   */
  async fetchWooCommerceOrder(connection, orderNumber) {
    try {
      const { siteUrl, consumerKey, consumerSecret } = JSON.parse(connection.credentials);
      
      const response = await axios.get(
        `${siteUrl}/wp-json/wc/v3/orders`,
        {
          auth: {
            username: consumerKey,
            password: consumerSecret
          },
          params: {
            search: orderNumber
          }
        }
      );

      if (response.data.length === 0) {
        return null;
      }

      return response.data[0];
    } catch (error) {
      console.error('Error fetching WooCommerce order:', error);
      throw error;
    }
  }

  /**
   * Sync WooCommerce order to database
   */
  async syncWooCommerceOrder(tenantId, connection, wooOrder) {
    try {
      const tracking = wooOrder.meta_data?.find(m => m.key === '_tracking_number')?.value || null;
      const trackingUrl = wooOrder.meta_data?.find(m => m.key === '_tracking_url')?.value || null;

      const order = await prisma.order.upsert({
        where: {
          tenantId_platformOrderId: {
            tenantId,
            platformOrderId: wooOrder.id.toString()
          }
        },
        update: {
          orderNumber: wooOrder.number,
          customerEmail: wooOrder.billing.email,
          customerName: `${wooOrder.billing.first_name} ${wooOrder.billing.last_name}`,
          status: this.mapWooCommerceStatus(wooOrder.status),
          total: parseFloat(wooOrder.total),
          currency: wooOrder.currency,
          trackingNumber: tracking,
          trackingUrl: trackingUrl,
          shippedAt: wooOrder.status === 'completed' ? new Date(wooOrder.date_completed) : null,
          deliveredAt: wooOrder.status === 'completed' ? new Date(wooOrder.date_completed) : null,
          metadata: JSON.stringify(wooOrder),
          updatedAt: new Date()
        },
        create: {
          tenantId,
          platform: 'woocommerce',
          platformOrderId: wooOrder.id.toString(),
          orderNumber: wooOrder.number,
          customerEmail: wooOrder.billing.email,
          customerName: `${wooOrder.billing.first_name} ${wooOrder.billing.last_name}`,
          status: this.mapWooCommerceStatus(wooOrder.status),
          total: parseFloat(wooOrder.total),
          currency: wooOrder.currency,
          trackingNumber: tracking,
          trackingUrl: trackingUrl,
          shippedAt: wooOrder.status === 'completed' ? new Date(wooOrder.date_completed) : null,
          deliveredAt: wooOrder.status === 'completed' ? new Date(wooOrder.date_completed) : null,
          metadata: JSON.stringify(wooOrder)
        }
      });

      return order;
    } catch (error) {
      console.error('Error syncing WooCommerce order:', error);
      throw error;
    }
  }

  /**
   * Map WooCommerce status to our status
   */
  mapWooCommerceStatus(status) {
    const statusMap = {
      'pending': 'pending',
      'processing': 'processing',
      'on-hold': 'pending',
      'completed': 'delivered',
      'cancelled': 'cancelled',
      'refunded': 'cancelled',
      'failed': 'cancelled'
    };
    return statusMap[status] || 'pending';
  }

  // ================================================
  // UNIFIED ORDER TRACKING
  // ================================================

  /**
   * Track order by number (auto-detect platform)
   */
  async trackOrder(tenantId, orderNumber, customerEmail = null) {
    try {
      // First, check if order exists in database
      let order = await prisma.order.findFirst({
        where: {
          tenantId,
          OR: [
            { orderNumber: orderNumber },
            { orderNumber: `#${orderNumber}` },
            { platformOrderId: orderNumber }
          ]
        }
      });

      if (order) {
        return this.formatOrderResponse(order);
      }

      // If not in database, fetch from platforms
      const connections = await prisma.connection.findMany({
        where: {
          tenantId,
          status: 'active'
        }
      });

      for (const connection of connections) {
        try {
          let platformOrder = null;

          if (connection.type === 'shopify') {
            platformOrder = await this.fetchShopifyOrder(connection, orderNumber);
            if (platformOrder) {
              order = await this.syncShopifyOrder(tenantId, connection, platformOrder);
            }
          } else if (connection.type === 'woocommerce') {
            platformOrder = await this.fetchWooCommerceOrder(connection, orderNumber);
            if (platformOrder) {
              order = await this.syncWooCommerceOrder(tenantId, connection, platformOrder);
            }
          }

          if (order) {
            return this.formatOrderResponse(order);
          }
        } catch (error) {
          console.error(`Error checking ${connection.type}:`, error);
          continue;
        }
      }

      return null; // Order not found
    } catch (error) {
      console.error('Error tracking order:', error);
      throw error;
    }
  }

  /**
   * Format order for chatbot response
   */
  formatOrderResponse(order) {
    const metadata = order.metadata ? JSON.parse(order.metadata) : {};

    let statusMessage = '';
    switch (order.status) {
      case 'pending':
        statusMessage = 'Your order has been received and is being processed.';
        break;
      case 'processing':
        statusMessage = 'Your order is being prepared for shipment.';
        break;
      case 'shipped':
        statusMessage = 'Your order has been shipped!';
        break;
      case 'delivered':
        statusMessage = 'Your order has been delivered.';
        break;
      case 'cancelled':
        statusMessage = 'Your order has been cancelled.';
        break;
      default:
        statusMessage = 'Your order is being processed.';
    }

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      statusMessage,
      total: `${order.currency} ${order.total.toFixed(2)}`,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      estimatedDelivery: this.estimateDelivery(order),
      items: metadata.line_items || metadata.items || []
    };
  }

  /**
   * Estimate delivery date
   */
  estimateDelivery(order) {
    if (order.status === 'delivered') {
      return 'Delivered';
    }

    if (order.shippedAt) {
      const deliveryDate = new Date(order.shippedAt);
      deliveryDate.setDate(deliveryDate.getDate() + 5); // +5 days
      return deliveryDate.toLocaleDateString();
    }

    const orderDate = new Date(order.createdAt);
    orderDate.setDate(orderDate.getDate() + 7); // +7 days
    return orderDate.toLocaleDateString();
  }

  /**
   * Get customer orders
   */
  async getCustomerOrders(tenantId, customerEmail) {
    try {
      const orders = await prisma.order.findMany({
        where: {
          tenantId,
          customerEmail: {
            equals: customerEmail,
            mode: 'insensitive'
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      });

      return orders.map(order => this.formatOrderResponse(order));
    } catch (error) {
      console.error('Error getting customer orders:', error);
      throw error;
    }
  }
}

module.exports = new OrderTrackingService();

