const nodemailer = require('nodemailer');
const emailTracker = require('./emailTracker');

class EmailService {
  constructor() {
    // Configurazione per Gmail (puoi cambiare con altri provider)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });

    // Fallback per sviluppo locale (MailHog, Mailtrap, etc.)
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
      this.transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false,
        auth: null
      });
    }

    console.log('📧 Email Service initialized');
  }

  async sendVerificationEmail(email, token, name) {
    const verificationLink = `http://localhost:5176/verify?token=${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_USER || 'AI Orchestrator <aiorchestratoor@gmail.com>',
      to: email,
      subject: '🔐 Verify Your Account - AI Orchestrator',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.8; 
              color: #1F2937; 
              background-color: #F9FAFB;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background: white; 
              border-radius: 16px; 
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%); 
              padding: 50px 30px; 
              text-align: center; 
            }
            .header h1 { 
              color: white; 
              margin: 0; 
              font-size: 36px; 
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .content { 
              padding: 40px 30px; 
              font-size: 16px;
            }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #2563EB, #7C3AED); 
              color: white; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 12px; 
              margin: 20px 0; 
              font-weight: 700;
              font-size: 16px;
            }
            .footer { 
              background: #F9FAFB; 
              padding: 30px; 
              text-align: center; 
              color: #6B7280; 
              border-top: 1px solid #E5E7EB;
              font-size: 14px;
            }
            .features { 
              background: #F3F4F6; 
              padding: 20px; 
              border-radius: 12px; 
              margin: 20px 0; 
            }
            .feature { 
              background: white; 
              padding: 12px 16px; 
              border-radius: 8px; 
              margin: 8px 0; 
              border-left: 4px solid #2563EB;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to AI Orchestrator!</h1>
              <p>The most advanced AI platform for your business</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>Thank you for registering with AI Orchestrator. To complete your registration and start using our platform, you need to verify your email address.</p>
              
              <div style="text-align: center;">
                <a href="${verificationLink}" class="button">✅ Verify Account</a>
              </div>
              
              <div class="features">
                <h3>🎯 What you can do with AI Orchestrator:</h3>
                <div class="feature">🌍 <strong>50+ Languages:</strong> Automatic multilingual chatbots</div>
                <div class="feature">🧠 <strong>ML Analytics:</strong> Advanced sentiment and intent analysis</div>
                <div class="feature">🛒 <strong>E-commerce:</strong> Shopify and WooCommerce integration</div>
                <div class="feature">⚡ <strong>Ultra-fast:</strong> Powered by Groq AI</div>
                <div class="feature">💰 <strong>95% Margins:</strong> Advantageous economics</div>
              </div>
              
              <p><strong>Verification link:</strong><br>
              <a href="${verificationLink}">${verificationLink}</a></p>
              
              <p><em>If you didn't request this account, you can ignore this email.</em></p>
            </div>
            
            <div class="footer">
              <p>© 2025 AI Orchestrator. All rights reserved.</p>
              <p>Powered by Groq AI & Machine Learning | 95%+ Gross Margins</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Check if we can send email
    if (!emailTracker.canSendEmail()) {
      console.error(`❌ Email limit reached: ${emailTracker.getStats().dailyCount}/${emailTracker.getStats().limit}`);
      return { 
        success: false, 
        error: 'Daily email limit reached',
        stats: emailTracker.getStats()
      };
    }

    try {
      const result = await this.transporter.sendMail(mailOptions);
      emailTracker.increment(); // Track successful send
      console.log(`📧 Verification email sent to: ${email} (${emailTracker.getStats().dailyCount}/${emailTracker.getStats().limit} today)`);
      console.log(`📧 Message ID: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: process.env.SMTP_USER || 'AI Orchestrator <aiorchestratoor@gmail.com>',
      to: email,
      subject: '🎉 Account Verified! Welcome to AI Orchestrator',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verified</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.8; 
              color: #1F2937; 
              background-color: #F9FAFB;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background: white; 
              border-radius: 16px; 
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%); 
              padding: 50px 30px; 
              text-align: center; 
            }
            .header h1 { 
              color: white; 
              margin: 0; 
              font-size: 36px; 
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .content { 
              padding: 40px 30px; 
              font-size: 16px;
            }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #2563EB, #7C3AED); 
              color: white; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 12px; 
              margin: 20px 0; 
              font-weight: 700;
              font-size: 16px;
            }
            .footer { 
              background: #F9FAFB; 
              padding: 30px; 
              text-align: center; 
              color: #6B7280; 
              border-top: 1px solid #E5E7EB;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Account Verified!</h1>
              <p>Your account has been successfully activated</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>Fantastic! Your account has been verified and you're ready to start using AI Orchestrator.</p>
              
              <div style="text-align: center;">
                <a href="http://localhost:5176/dashboard" class="button">🚀 Go to Dashboard</a>
              </div>
              
              <h3>🎯 Next steps:</h3>
              <ul>
                <li>Set up your first chatbot</li>
                <li>Integrate with your store (Shopify/WooCommerce)</li>
                <li>Customize AI responses</li>
                <li>Monitor performance with ML Analytics</li>
              </ul>
              
              <p>You have 7 days of free trial to explore all features!</p>
            </div>
            
            <div class="footer">
              <p>© 2025 AI Orchestrator. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    if (!emailTracker.canSendEmail()) {
      console.error(`❌ Email limit reached`);
      return { success: false, error: 'Daily email limit reached', stats: emailTracker.getStats() };
    }

    try {
      const result = await this.transporter.sendMail(mailOptions);
      emailTracker.increment();
      console.log(`📧 Welcome email sent to: ${email} (${emailTracker.getStats().dailyCount}/${emailTracker.getStats().limit} today)`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Welcome email failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendReferralConversionEmail(affiliateEmail, affiliateName, referredEmail, commissionAmount, planName) {
    const mailOptions = {
      from: process.env.SMTP_USER || 'AI Orchestrator <aiorchestratoor@gmail.com>',
      to: affiliateEmail,
      subject: '🎉 You earned a commission! New referral converted',
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
              <h1>🎉 Commission Earned!</h1>
              <p>Your referral just converted</p>
            </div>
            
            <div class="content">
              <h2>Congratulations ${affiliateName}! 🎊</h2>
              <p>Great news! One of your referrals just purchased a plan and you've earned a commission.</p>
              
              <div class="amount">€${commissionAmount.toFixed(2)}</div>
              
              <div class="info-box">
                <h3 style="margin-top: 0;">📋 Commission Details:</h3>
                <p><strong>Referral Email:</strong> ${referredEmail}</p>
                <p><strong>Plan Purchased:</strong> ${planName}</p>
                <p><strong>Your Commission (50%):</strong> €${commissionAmount.toFixed(2)}</p>
                <p><strong>Payout Date:</strong> 1st of next month</p>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1976d2;">💰 Your Earnings Update:</h3>
                <p style="margin: 0;">This commission will be added to your pending earnings and paid on the 1st of the month via PayPal (minimum €50).</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5176/affiliates" style="display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View Your Dashboard
                </a>
              </div>
              
              <p><strong>Keep sharing your link to earn more!</strong> 🚀</p>
            </div>
            
            <div class="footer">
              <p>© 2025 AI Orchestrator. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    if (!emailTracker.canSendEmail()) {
      console.error(`❌ Email limit reached`);
      return { success: false, error: 'Daily email limit reached', stats: emailTracker.getStats() };
    }

    try {
      const result = await this.transporter.sendMail(mailOptions);
      emailTracker.increment();
      console.log(`📧 Referral conversion email sent to: ${affiliateEmail} (${emailTracker.getStats().dailyCount}/${emailTracker.getStats().limit} today)`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Referral conversion email failed:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Get email tracker stats
   */
  getEmailStats() {
    return emailTracker.getStats();
  }
}

module.exports = EmailService;
