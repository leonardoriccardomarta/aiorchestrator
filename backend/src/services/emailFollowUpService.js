const nodemailer = require('nodemailer');
const emailTracker = require('./emailTracker');

class EmailFollowUpService {
  constructor() {
    // Configurazione per Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });

    // Fallback per sviluppo locale
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
      this.transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false,
        auth: null
      });
    }

    console.log('📧 Email Follow-Up Service initialized');
  }

  async sendDay3FollowUp(email, name, trialDaysLeft) {
    const dashboardLink = `http://localhost:5176/dashboard`;
    const settingsLink = `http://localhost:5176/settings`;
    const pricingLink = `http://localhost:5176/pricing`;

    const mailOptions = {
      from: process.env.SMTP_USER || 'aiorchestratoor@gmail.com',
      to: email,
      subject: '🚀 Your trial is going well! Optimize your results',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
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
              <h1>🎉 Congratulations, ${name}!</h1>
              <p style="color: white; opacity: 0.9; font-size: 18px; margin: 10px 0 0 0;">Your 7-day trial is going well</p>
            </div>
            
            <div class="content">

              <p>Hello <strong>${name}</strong>,</p>
              
              <p>Fantastic! You've already used <strong>4 days</strong> of your 7-day free trial. 
              We're excited to see how you're leveraging AI power for your business!</p>

              <div style="background: #F3F4F6; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #2563EB;">
                <h3 style="color: #1F2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">📊 Your results so far:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #4B5563;">
                  <li style="margin-bottom: 8px;">✅ AI Chatbot configured and active</li>
                  <li style="margin-bottom: 8px;">✅ ML Analytics running</li>
                  <li style="margin-bottom: 8px;">✅ Multi-language support activated</li>
                  <li style="margin-bottom: 8px;">✅ E-commerce integrations ready</li>
                </ul>
              </div>

              <div style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
                <h3 style="color: #92400E; margin: 0 0 10px 0; font-size: 20px; font-weight: 700;">⏰ Only ${trialDaysLeft} days remaining!</h3>
                <p style="margin: 0; color: #92400E; font-size: 16px;">
                  Don't miss the opportunity to continue growing with us
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${pricingLink}" class="button">
                  🚀 Upgrade Now
                </a>
                <a href="${dashboardLink}" style="display: inline-block; padding: 16px 32px; background: white; color: #2563EB; text-decoration: none; border: 2px solid #2563EB; border-radius: 12px; margin: 0 10px 10px 0; font-weight: 700; font-size: 16px;">
                  📊 Go to Dashboard
                </a>
              </div>

              <div style="background: #DBEAFE; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h3 style="color: #1E40AF; margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">💡 Pro Tips for the next days:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #4B5563;">
                  <li style="margin-bottom: 8px;">🔧 Customize your chatbot with your brand identity</li>
                  <li style="margin-bottom: 8px;">📈 Analyze ML data to optimize conversations</li>
                  <li style="margin-bottom: 8px;">🛒 Test e-commerce integrations</li>
                  <li style="margin-bottom: 8px;">🌍 Configure multi-language support for your customers</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0; padding: 20px; background: #F3F4F6; border-radius: 12px;">
                <h3 style="color: #1F2937; margin: 0 0 10px 0; font-size: 18px; font-weight: 700;">🎯 Why choose AI Orchestrator?</h3>
                <div style="display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap;">
                  <div style="text-align: center; margin: 10px; flex: 1; min-width: 120px;">
                    <div style="font-size: 24px; margin-bottom: 5px;">95%</div>
                    <div style="font-size: 12px; color: #6B7280;">Profit Margins</div>
                  </div>
                  <div style="text-align: center; margin: 10px; flex: 1; min-width: 120px;">
                    <div style="font-size: 24px; margin-bottom: 5px;">50+</div>
                    <div style="font-size: 12px; color: #6B7280;">Languages Supported</div>
                  </div>
                  <div style="text-align: center; margin: 10px; flex: 1; min-width: 120px;">
                    <div style="font-size: 24px; margin-bottom: 5px;">24/7</div>
                    <div style="font-size: 12px; color: #6B7280;">Customer Support</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>AI Orchestrator</strong></p>
              <p>Revolutionizing E-commerce Support with AI</p>
              <p style="font-size: 12px; margin-top: 20px;">
                Have questions? Email: aiorchestratoor@gmail.com<br>
                © 2025 AI Orchestrator. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    if (!emailTracker.canSendEmail()) {
      console.error(`❌ Email limit reached`);
      return { success: false, error: 'Daily email limit reached' };
    }

    try {
      await this.transporter.sendMail(mailOptions);
      emailTracker.increment();
      console.log(`📧 Day 3 follow-up sent (${emailTracker.getStats().dailyCount}/${emailTracker.getStats().limit} today)`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendDay1FollowUp(email, name, trialDaysLeft) {
    const dashboardLink = `http://localhost:5176/dashboard`;
    const settingsLink = `http://localhost:5176/settings`;
    const pricingLink = `http://localhost:5176/pricing`;

    const mailOptions = {
      from: process.env.SMTP_USER || 'aiorchestratoor@gmail.com',
      to: email,
      subject: '⚠️ URGENT: Your trial expires in 1 day! Don\'t miss this opportunity',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding-bottom: 30px; border-bottom: 2px solid #f0f0f0;">
            <h1 style="color: #007bff; margin: 0; font-size: 32px; background: linear-gradient(45deg, #007bff, #00c6ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;">AI Orchestrator</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Your successful AI platform</p>
          </div>
          
          <div style="padding: 30px 0;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
              <h2 style="margin: 0 0 15px 0; font-size: 28px; font-weight: 700;">⚠️ ATTENTION, ${name}!</h2>
              <p style="margin: 0; font-size: 20px; opacity: 0.9;">Your trial expires in ${trialDaysLeft} days!</p>
            </div>

            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hello <strong>${name}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
              Your 7-day free trial is about to expire! Don't miss the opportunity to continue 
              growing with AI power. We've prepared a special offer just for you.
            </p>

            <div style="background: #fff3cd; border: 2px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 20px;">🎁 SPECIAL OFFER - Just for you!</h3>
              <div style="font-size: 24px; font-weight: 700; color: #d63031; margin: 10px 0;">
                20% OFF on first year
              </div>
              <p style="margin: 0; color: #856404; font-size: 16px;">
                Valid only for the next few hours
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${pricingLink}" style="display: inline-block; padding: 18px 35px; background: linear-gradient(45deg, #e74c3c, #c0392b); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 20px; font-weight: 700; margin: 0 10px 10px 0; box-shadow: 0 6px 20px rgba(231,76,60,0.4); text-transform: uppercase; letter-spacing: 1px;">
                🔥 UPGRADE NOW - 20% OFF
              </a>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">💎 What you'll lose if you don't upgrade:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #333;">
                <li style="margin-bottom: 8px;">❌ Dashboard and analytics access</li>
                <li style="margin-bottom: 8px;">❌ AI Chatbot and automation</li>
                <li style="margin-bottom: 8px;">❌ E-commerce integrations</li>
                <li style="margin-bottom: 8px;">❌ Multi-language support</li>
                <li style="margin-bottom: 8px;">❌ Machine Learning insights</li>
                <li style="margin-bottom: 8px;">❌ 24/7 technical support</li>
              </ul>
            </div>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 15px 0; font-size: 20px;">🚀 Our customers are already seeing incredible results:</h3>
              <div style="display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap;">
                <div style="text-align: center; margin: 10px; flex: 1; min-width: 120px;">
                  <div style="font-size: 28px; margin-bottom: 5px; font-weight: 700;">+300%</div>
                  <div style="font-size: 14px; opacity: 0.9;">Conversion Increase</div>
                </div>
                <div style="text-align: center; margin: 10px; flex: 1; min-width: 120px;">
                  <div style="font-size: 28px; margin-bottom: 5px; font-weight: 700;">-80%</div>
                  <div style="font-size: 14px; opacity: 0.9;">Support Cost Reduction</div>
                </div>
                <div style="text-align: center; margin: 10px; flex: 1; min-width: 120px;">
                  <div style="font-size: 28px; margin-bottom: 5px; font-weight: 700;">24/7</div>
                  <div style="font-size: 14px; opacity: 0.9;">Availability</div>
                </div>
              </div>
            </div>

            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px;">✅ 30-day money-back guarantee</h3>
              <p style="margin: 0; color: #155724; font-size: 16px;">
                If you're not satisfied within 30 days, we'll refund you completely. 
                <strong>Zero risk, maximum results!</strong>
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${settingsLink}" style="display: inline-block; padding: 12px 25px; background: #ffffff; color: #007bff; text-decoration: none; border: 2px solid #007bff; border-radius: 8px; font-size: 16px; font-weight: 600; margin: 0 10px 10px 0;">
                ⚙️ Manage Account
              </a>
              <a href="${dashboardLink}" style="display: inline-block; padding: 12px 25px; background: #ffffff; color: #007bff; text-decoration: none; border: 2px solid #007bff; border-radius: 8px; font-size: 16px; font-weight: 600; margin: 0 10px 10px 0;">
                📊 Go to Dashboard
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding-top: 30px; border-top: 2px solid #f0f0f0; color: #777; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">&copy; 2025 AI Orchestrator. All rights reserved.</p>
            <p style="margin: 0;">
              <strong>Don't miss this opportunity!</strong> 
              <a href="mailto:support@ai-orchestrator.com" style="color: #007bff; text-decoration: none;">Contact us</a> 
              for any questions.
            </p>
          </div>
        </div>
      `
    };

    if (!emailTracker.canSendEmail()) {
      console.error(`❌ Email limit reached`);
      return { success: false, error: 'Daily email limit reached' };
    }

    try {
      await this.transporter.sendMail(mailOptions);
      emailTracker.increment();
      console.log(`📧 Day 1 follow-up sent (${emailTracker.getStats().dailyCount}/${emailTracker.getStats().limit} today)`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendTrialExpiredEmail(email, name) {
    const pricingLink = `http://localhost:5176/pricing`;

    const mailOptions = {
      from: process.env.SMTP_USER || 'aiorchestratoor@gmail.com',
      to: email,
      subject: '😢 Your trial has expired - Come back anytime!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding-bottom: 30px; border-bottom: 2px solid #f0f0f0;">
            <h1 style="color: #007bff; margin: 0; font-size: 32px; background: linear-gradient(45deg, #007bff, #00c6ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;">AI Orchestrator</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Your successful AI platform</p>
          </div>
          
          <div style="padding: 30px 0;">
            <div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
              <h2 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">😢 We'll miss you, ${name}!</h2>
              <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your free trial has expired</p>
            </div>

            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hello <strong>${name}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
              Your 7-day free trial has expired. We hope you were able to experience 
              the power of AI for your business and see the results we can achieve together.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📊 Your data is safe</h3>
              <p style="margin: 0; color: #333; font-size: 16px;">
                Don't worry, all your data, configurations and chatbots have been saved. 
                When you decide to come back, you'll find everything exactly as you left it.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${pricingLink}" style="display: inline-block; padding: 18px 35px; background: linear-gradient(45deg, #007bff, #00c6ff); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 20px; font-weight: 700; margin: 0 10px 10px 0; box-shadow: 0 6px 20px rgba(0,123,255,0.4);">
                🔄 Resume Your Plan
              </a>
            </div>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 15px 0; font-size: 20px;">🎁 Special offer for your return</h3>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">
                When you return, you'll have access to exclusive discounts and new features
              </p>
            </div>

            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px;">💡 Still not convinced?</h3>
              <p style="margin: 0; color: #155724; font-size: 16px;">
                Contact us for a personalized demo and discover how we can help 
                your business grow with AI. <strong>The first consultation is free!</strong>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding-top: 30px; border-top: 2px solid #f0f0f0; color: #777; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">&copy; 2025 AI Orchestrator. All rights reserved.</p>
            <p style="margin: 0;">
              We hope to see you again soon! 
              <a href="mailto:support@ai-orchestrator.com" style="color: #007bff; text-decoration: none;">Contact us</a> 
              for any questions.
            </p>
          </div>
        </div>
      `
    };

    if (!emailTracker.canSendEmail()) {
      console.error(`❌ Email limit reached`);
      return { success: false, error: 'Daily email limit reached' };
    }

    try {
      await this.transporter.sendMail(mailOptions);
      emailTracker.increment();
      console.log(`📧 Trial expired email sent (${emailTracker.getStats().dailyCount}/${emailTracker.getStats().limit} today)`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailFollowUpService;
