const axios = require('axios');

class PayPalPayoutService {
  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID;
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    this.mode = process.env.PAYPAL_MODE || 'sandbox'; // sandbox or live
    this.baseURL = this.mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
    
    console.log('💳 PayPal Payout Service initialized in', this.mode, 'mode');
  }

  /**
   * Get PayPal OAuth access token
   */
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios({
        method: 'post',
        url: `${this.baseURL}/v1/oauth2/token`,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials'
      });

      return response.data.access_token;
    } catch (error) {
      console.error('❌ PayPal auth error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with PayPal');
    }
  }

  /**
   * Send payout to affiliate
   */
  async sendPayout(recipientEmail, amount, affiliateId, note = '') {
    try {
      if (!this.clientId || this.clientId === 'your-paypal-client-id') {
        console.log('⚠️ PayPal not configured, simulating payout...');
        return {
          success: true,
          payoutBatchId: `SIMULATED-${Date.now()}`,
          transactionId: `SIM-${Math.random().toString(36).substring(7)}`,
          status: 'SUCCESS',
          amount,
          recipientEmail,
          simulated: true
        };
      }

      const accessToken = await this.getAccessToken();
      const senderBatchId = `PAYOUT-${affiliateId}-${Date.now()}`;

      const payoutData = {
        sender_batch_header: {
          sender_batch_id: senderBatchId,
          email_subject: 'You have a payment from AI Orchestrator',
          email_message: note || 'Congratulations! Your affiliate earnings have been paid.'
        },
        items: [
          {
            recipient_type: 'EMAIL',
            amount: {
              value: amount.toFixed(2),
              currency: 'EUR'
            },
            receiver: recipientEmail,
            note: note || `Affiliate commission payout - ${new Date().toLocaleDateString()}`,
            sender_item_id: `ITEM-${affiliateId}-${Date.now()}`
          }
        ]
      };

      const response = await axios({
        method: 'post',
        url: `${this.baseURL}/v1/payments/payouts`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        data: payoutData
      });

      const batchId = response.data.batch_header.payout_batch_id;
      
      // Get payout status
      const statusResponse = await this.getPayoutStatus(batchId, accessToken);

      return {
        success: true,
        payoutBatchId: batchId,
        transactionId: statusResponse.items?.[0]?.transaction_id || batchId,
        status: statusResponse.batch_header?.batch_status || 'PENDING',
        amount,
        recipientEmail
      };
    } catch (error) {
      console.error('❌ PayPal payout error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to process PayPal payout');
    }
  }

  /**
   * Get payout status
   */
  async getPayoutStatus(batchId, accessToken = null) {
    try {
      if (!accessToken) {
        accessToken = await this.getAccessToken();
      }

      const response = await axios({
        method: 'get',
        url: `${this.baseURL}/v1/payments/payouts/${batchId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ PayPal status check error:', error.response?.data || error.message);
      throw new Error('Failed to check payout status');
    }
  }

  /**
   * Send batch payouts (for monthly automation)
   */
  async sendBatchPayouts(payouts) {
    const results = {
      successful: [],
      failed: []
    };

    for (const payout of payouts) {
      try {
        const result = await this.sendPayout(
          payout.recipientEmail,
          payout.amount,
          payout.affiliateId,
          payout.note
        );

        results.successful.push({
          ...payout,
          ...result
        });

        // Add delay between payouts to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.failed.push({
          ...payout,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Verify PayPal email exists
   */
  async verifyPayPalEmail(email) {
    // Note: PayPal doesn't provide a direct API to verify email
    // This is a placeholder for future implementation
    // In production, you might want to send a small test payment and verify
    return {
      valid: true,
      email
    };
  }
}

module.exports = new PayPalPayoutService();

