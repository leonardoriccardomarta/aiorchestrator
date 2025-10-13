const EmailFollowUpService = require('./emailFollowUpService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const emailFollowUpService = new EmailFollowUpService();

class CronService {
  constructor() {
    this.isRunning = false;
    console.log('⏰ Cron Service initialized');
  }

  // Check for users who need follow-up emails
  async checkFollowUpEmails() {
    if (this.isRunning) {
      console.log('⏰ Cron job already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('⏰ Starting follow-up email check...');

    try {
      const now = new Date();
      
      // 🔴 EXCLUDE TEST ACCOUNTS - Only send to real users
      const trialUsers = await prisma.user.findMany({
        where: {
          isActive: true,
          isVerified: true,
          // 🔴 EXCLUDE test accounts
          email: {
            notIn: [
              'affiliate1@test.com',
              'affiliate2@test.com', 
              'affiliate3@test.com',
              'referral1@test.com',
              'referral2@test.com',
              'referral3@test.com',
              'referral4@test.com',
              'referral5@test.com',
              'demo@test.com',
              'test@test.com'
            ],
            not: {
              endsWith: '@test.com' // Exclude ALL @test.com emails
            }
          }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          trialEndDate: true,
          lastFollowUpSent: true,
          followUpCount: true
        }
      });

      console.log(`📊 Found ${trialUsers.length} real users to check (test accounts excluded)`);

      for (const user of trialUsers) {
        await this.checkUserFollowUp(user, now);
      }

    } catch (error) {
      console.error('❌ Error in follow-up email check:', error);
    } finally {
      this.isRunning = false;
      console.log('✅ Follow-up email check completed');
    }
  }

  async checkUserFollowUp(user, now) {
    try {
      const trialStart = new Date(user.createdAt);
      const trialEnd = user.trialEndDate ? new Date(user.trialEndDate) : new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const daysSinceStart = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
      const daysUntilEnd = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

      console.log(`👤 Checking user ${user.email}: ${daysSinceStart} days since start, ${daysUntilEnd} days until end`);

      // Mid-trial follow-up at day 3 (for 7-day trial)
      if (daysSinceStart >= 3 && (!user.lastFollowUpSent || user.followUpCount < 1)) {
        console.log(`📧 Sending day 7 follow-up to ${user.email}`);
        const result = await emailFollowUpService.sendDay7FollowUp(
          user.email, 
          `${user.firstName} ${user.lastName}`, 
          daysUntilEnd
        );
        
        if (result.success) {
          await this.updateUserFollowUp(user.id, 1);
          console.log(`✅ Day 7 follow-up sent to ${user.email}`);
        } else {
          console.error(`❌ Failed to send day 7 follow-up to ${user.email}:`, result.error);
        }
      }

      // Last-day follow-up at day 6 (for 7-day trial)
      if (daysSinceStart >= 6 && (!user.lastFollowUpSent || user.followUpCount < 2)) {
        console.log(`📧 Sending day 13 follow-up to ${user.email}`);
        const result = await emailFollowUpService.sendDay1FollowUp(
          user.email, 
          `${user.firstName} ${user.lastName}`, 
          daysUntilEnd
        );
        
        if (result.success) {
          await this.updateUserFollowUp(user.id, 2);
          console.log(`✅ Day 13 follow-up sent to ${user.email}`);
        } else {
          console.error(`❌ Failed to send day 13 follow-up to ${user.email}:`, result.error);
        }
      }

      // Trial expired follow-up
      if (daysUntilEnd <= 0 && (!user.lastFollowUpSent || user.followUpCount < 3)) {
        console.log(`📧 Sending trial expired follow-up to ${user.email}`);
        const result = await emailFollowUpService.sendTrialExpiredEmail(
          user.email, 
          `${user.firstName} ${user.lastName}`
        );
        
        if (result.success) {
          await this.updateUserFollowUp(user.id, 3);
          console.log(`✅ Trial expired follow-up sent to ${user.email}`);
        } else {
          console.error(`❌ Failed to send trial expired follow-up to ${user.email}:`, result.error);
        }
      }

    } catch (error) {
      console.error(`❌ Error checking follow-up for user ${user.email}:`, error);
    }
  }

  async updateUserFollowUp(userId, followUpCount) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          lastFollowUpSent: new Date(),
          followUpCount: followUpCount
        }
      });
    } catch (error) {
      console.error(`❌ Error updating follow-up for user ${userId}:`, error);
    }
  }

  // Start the cron job (runs every hour)
  start() {
    console.log('⏰ Starting cron service...');
    
    // Run immediately
    this.checkFollowUpEmails();
    
    // Then run every hour
    setInterval(() => {
      this.checkFollowUpEmails();
    }, 60 * 60 * 1000); // 1 hour

    console.log('✅ Cron service started - running every hour');
  }

  // Stop the cron job
  stop() {
    console.log('⏰ Stopping cron service...');
    this.isRunning = false;
  }
}

module.exports = CronService;
