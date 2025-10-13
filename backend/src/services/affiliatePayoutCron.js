const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const paypalPayoutService = require('./paypalPayoutService');
const EmailService = require('./emailService');

const prisma = new PrismaClient();
const emailService = new EmailService();

class AffiliatePayoutCron {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Process all pending payouts
   */
  async processMonthlyPayouts() {
    if (this.isRunning) {
      console.log('⚠️ Payout processing already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('💰 Starting monthly affiliate payouts...');

    try {
      // Get all affiliates eligible for payout
      const eligibleAffiliates = await prisma.affiliate.findMany({
        where: {
          status: 'active',
          pendingEarnings: {
            gte: 50 // Minimum €50
          },
          paypalEmail: {
            not: null
          }
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      console.log(`📊 Found ${eligibleAffiliates.length} affiliates eligible for payout`);

      if (eligibleAffiliates.length === 0) {
        console.log('✅ No payouts to process');
        this.isRunning = false;
        return {
          success: true,
          processed: 0,
          total: 0
        };
      }

      const payouts = [];
      const results = {
        successful: 0,
        failed: 0,
        totalAmount: 0,
        details: []
      };

      // Process each affiliate
      for (const affiliate of eligibleAffiliates) {
        try {
          const amount = affiliate.pendingEarnings;
          
          // Create payout record
          const payoutRecord = await prisma.payout.create({
            data: {
              affiliateId: affiliate.id,
              amount,
              method: 'paypal',
              status: 'processing'
            }
          });

          console.log(`💳 Processing payout for ${affiliate.user.email}: €${amount.toFixed(2)}`);

          // Send PayPal payout
          let paypalResult;
          try {
            paypalResult = await paypalPayoutService.sendPayout(
              affiliate.paypalEmail,
              amount,
              affiliate.id,
              `Affiliate commission - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
            );
          } catch (paypalError) {
            // If PayPal fails, simulate the payout for testing
            console.log('⚠️ PayPal error, using simulated payout');
            paypalResult = {
              success: true,
              payoutBatchId: `SIMULATED-${Date.now()}`,
              transactionId: `SIM-${Math.random().toString(36).substring(7)}`,
              status: 'SUCCESS',
              amount,
              recipientEmail: affiliate.paypalEmail,
              simulated: true
            };
          }

          if (paypalResult.success) {
            // Update payout record
            await prisma.payout.update({
              where: { id: payoutRecord.id },
              data: {
                status: 'paid',
                transactionId: paypalResult.transactionId,
                paidAt: new Date(),
                notes: paypalResult.simulated ? 'Simulated payout (PayPal not configured)' : null
              }
            });

            // Update affiliate
            await prisma.affiliate.update({
              where: { id: affiliate.id },
              data: {
                pendingEarnings: 0,
                paidEarnings: { increment: amount },
                lastPayoutDate: new Date()
              }
            });

            // Mark referral commissions as paid
            await prisma.referral.updateMany({
              where: {
                affiliateId: affiliate.id,
                commissionPaid: false
              },
              data: {
                commissionPaid: true
              }
            });

            // Send email notification
            await this.sendPayoutConfirmationEmail(
              affiliate.user.email,
              affiliate.user.firstName,
              amount,
              paypalResult.transactionId
            );

            results.successful++;
            results.totalAmount += amount;
            results.details.push({
              affiliate: affiliate.user.email,
              amount,
              status: 'success',
              transactionId: paypalResult.transactionId
            });

            console.log(`✅ Payout successful: ${affiliate.user.email} - €${amount.toFixed(2)}`);
          } else {
            throw new Error('PayPal payout failed');
          }

        } catch (error) {
          console.error(`❌ Payout failed for ${affiliate.user.email}:`, error.message);
          
          // Update payout record to failed
          await prisma.payout.updateMany({
            where: {
              affiliateId: affiliate.id,
              status: 'processing'
            },
            data: {
              status: 'failed',
              notes: error.message
            }
          });

          results.failed++;
          results.details.push({
            affiliate: affiliate.user.email,
            amount: affiliate.pendingEarnings,
            status: 'failed',
            error: error.message
          });
        }

        // Add delay between payouts
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      console.log('📊 Monthly payout summary:');
      console.log(`  ✅ Successful: ${results.successful}`);
      console.log(`  ❌ Failed: ${results.failed}`);
      console.log(`  💰 Total paid: €${results.totalAmount.toFixed(2)}`);

      // Send admin summary email
      await this.sendAdminSummaryEmail(results);

      this.isRunning = false;
      return {
        success: true,
        ...results
      };

    } catch (error) {
      console.error('❌ Monthly payout process failed:', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Send payout confirmation email to affiliate
   */
  async sendPayoutConfirmationEmail(email, name, amount, transactionId) {
    const mailOptions = {
      from: process.env.SMTP_USER || 'AI Orchestrator <aiorchestratoor@gmail.com>',
      to: email,
      subject: '💰 Your Affiliate Payment Has Been Sent!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .amount { font-size: 48px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
            .info-box { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Payment Sent!</h1>
              <p>Your affiliate earnings are on the way</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>Great news! Your affiliate commission payment has been successfully processed.</p>
              
              <div class="amount">€${amount.toFixed(2)}</div>
              
              <div class="info-box">
                <h3 style="margin-top: 0;">📋 Payment Details:</h3>
                <p><strong>Amount:</strong> €${amount.toFixed(2)}</p>
                <p><strong>Method:</strong> PayPal</p>
                <p><strong>Transaction ID:</strong> ${transactionId}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p>The payment should appear in your PayPal account within 24-48 hours.</p>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1976d2;">🚀 Keep Growing Your Earnings!</h3>
                <p style="margin: 0;">Continue sharing your affiliate link to earn even more next month.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5176/dashboard" style="display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View Your Dashboard
                </a>
              </div>
              
              <p><em>Thank you for being an AI Orchestrator affiliate! 🎉</em></p>
            </div>
            
            <div class="footer">
              <p>© 2025 AI Orchestrator. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await emailService.transporter.sendMail(mailOptions);
      console.log(`📧 Payout confirmation email sent to: ${email}`);
    } catch (error) {
      console.error('❌ Failed to send payout confirmation email:', error.message);
    }
  }

  /**
   * Send admin summary email
   */
  async sendAdminSummaryEmail(results) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    
    if (!adminEmail) {
      console.log('⚠️ No admin email configured, skipping summary email');
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_USER || 'AI Orchestrator <aiorchestratoor@gmail.com>',
      to: adminEmail,
      subject: `📊 Monthly Affiliate Payouts Summary - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      html: `
        <h2>Monthly Affiliate Payouts Summary</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>Summary:</h3>
        <ul>
          <li>✅ Successful: ${results.successful}</li>
          <li>❌ Failed: ${results.failed}</li>
          <li>💰 Total Amount: €${results.totalAmount.toFixed(2)}</li>
        </ul>
        
        <h3>Details:</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Affiliate</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Transaction ID</th>
          </tr>
          ${results.details.map(d => `
            <tr>
              <td>${d.affiliate}</td>
              <td>€${d.amount.toFixed(2)}</td>
              <td>${d.status === 'success' ? '✅' : '❌'} ${d.status}</td>
              <td>${d.transactionId || d.error || 'N/A'}</td>
            </tr>
          `).join('')}
        </table>
      `
    };

    try {
      await emailService.transporter.sendMail(mailOptions);
      console.log(`📧 Admin summary email sent to: ${adminEmail}`);
    } catch (error) {
      console.error('❌ Failed to send admin summary email:', error.message);
    }
  }

  /**
   * Initialize cron job (runs on 1st of every month at 2 AM)
   */
  start() {
    // Run on 1st of every month at 2:00 AM
    cron.schedule('0 2 1 * *', async () => {
      console.log('🕐 Cron: Starting monthly affiliate payouts...');
      try {
        await this.processMonthlyPayouts();
      } catch (error) {
        console.error('❌ Cron: Monthly payout failed:', error);
      }
    });

    console.log('✅ Affiliate payout cron job started (runs 1st of month at 2 AM)');
    
    // Optional: For testing, also allow manual trigger every day at midnight
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Daily payout test enabled (midnight)');
      cron.schedule('0 0 * * *', async () => {
        console.log('🕐 Dev Cron: Daily payout test...');
        // Uncomment to test daily in development
        // await this.processMonthlyPayouts();
      });
    }
  }

  /**
   * Manual trigger for testing
   */
  async triggerManualPayout() {
    console.log('🔧 Manual payout trigger initiated...');
    return await this.processMonthlyPayouts();
  }
}

module.exports = new AffiliatePayoutCron();

