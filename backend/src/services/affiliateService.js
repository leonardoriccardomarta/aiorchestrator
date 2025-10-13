const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const EmailService = require('./emailService');

const prisma = new PrismaClient();
const emailService = new EmailService();

class AffiliateService {
  /**
   * Generate unique affiliate code
   */
  generateAffiliateCode(userId, email) {
    const hash = crypto.createHash('md5').update(`${userId}${email}${Date.now()}`).digest('hex');
    return hash.substring(0, 8).toUpperCase();
  }

  /**
   * Create affiliate account for user
   */
  async createAffiliate(userId, paypalEmail = null, bankAccount = null) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if affiliate already exists
      const existing = await prisma.affiliate.findUnique({
        where: { userId }
      });

      if (existing) {
        return { success: false, error: 'Affiliate account already exists' };
      }

      const affiliateCode = this.generateAffiliateCode(userId, user.email);

      const affiliate = await prisma.affiliate.create({
        data: {
          userId,
          affiliateCode,
          paypalEmail,
          bankAccount,
          commissionRate: 0.50, // 50% commission
          minimumPayout: 50 // €50 minimum
        }
      });

      return {
        success: true,
        data: affiliate
      };
    } catch (error) {
      console.error('❌ Error creating affiliate:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Track referral signup
   */
  async trackReferral(affiliateCode, referredUserId, referredEmail) {
    try {
      const affiliate = await prisma.affiliate.findUnique({
        where: { affiliateCode }
      });

      if (!affiliate) {
        return { success: false, error: 'Invalid affiliate code' };
      }

      // Create referral record
      const referral = await prisma.referral.create({
        data: {
          affiliateId: affiliate.id,
          referredUserId,
          referredEmail,
          status: 'pending'
        }
      });

      return {
        success: true,
        data: referral
      };
    } catch (error) {
      console.error('❌ Error tracking referral:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark referral as converted and calculate commission
   */
  async convertReferral(referredUserId, subscriptionAmount) {
    try {
      const referral = await prisma.referral.findUnique({
        where: { referredUserId },
        include: { affiliate: true }
      });

      if (!referral) {
        return { success: false, error: 'Referral not found' };
      }

      if (referral.status === 'converted') {
        return { success: false, error: 'Referral already converted' };
      }

      const commissionAmount = subscriptionAmount * referral.affiliate.commissionRate;

      // Update referral
      await prisma.referral.update({
        where: { id: referral.id },
        data: {
          status: 'converted',
          commissionAmount,
          conversionDate: new Date()
        }
      });

      // Update affiliate earnings
      const updatedAffiliate = await prisma.affiliate.update({
        where: { id: referral.affiliateId },
        data: {
          totalEarnings: { increment: commissionAmount },
          pendingEarnings: { increment: commissionAmount }
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

      // Get plan name from amount
      const planNames = {
        99: 'Professional',
        199: 'Enterprise',
        49: 'Starter'
      };
      const planName = planNames[subscriptionAmount] || `Custom Plan (€${subscriptionAmount})`;

      // Send email notification to affiliate
      console.log(`📧 Sending conversion email to ${updatedAffiliate.user.email}...`);
      await emailService.sendReferralConversionEmail(
        updatedAffiliate.user.email,
        updatedAffiliate.user.firstName || 'Affiliate',
        referral.referredEmail,
        commissionAmount,
        planName
      );

      return {
        success: true,
        data: {
          referral,
          commissionAmount
        }
      };
    } catch (error) {
      console.error('❌ Error converting referral:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get affiliate stats
   */
  async getAffiliateStats(userId) {
    try {
      const affiliate = await prisma.affiliate.findUnique({
        where: { userId },
        include: {
          referrals: {
            orderBy: { createdAt: 'desc' }
          },
          payouts: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!affiliate) {
        return { success: false, error: 'Affiliate not found' };
      }

      const stats = {
        affiliateCode: affiliate.affiliateCode,
        commissionRate: affiliate.commissionRate * 100, // Convert to percentage
        totalEarnings: affiliate.totalEarnings,
        pendingEarnings: affiliate.pendingEarnings,
        paidEarnings: affiliate.paidEarnings,
        minimumPayout: affiliate.minimumPayout,
        lastPayoutDate: affiliate.lastPayoutDate,
        totalReferrals: affiliate.referrals.length,
        convertedReferrals: affiliate.referrals.filter(r => r.status === 'converted').length,
        pendingReferrals: affiliate.referrals.filter(r => r.status === 'pending').length,
        recentReferrals: affiliate.referrals.slice(0, 10),
        recentPayouts: affiliate.payouts.slice(0, 5),
        canRequestPayout: affiliate.pendingEarnings >= affiliate.minimumPayout
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('❌ Error getting affiliate stats:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Request payout
   */
  async requestPayout(userId, method = 'paypal') {
    try {
      const affiliate = await prisma.affiliate.findUnique({
        where: { userId }
      });

      if (!affiliate) {
        return { success: false, error: 'Affiliate not found' };
      }

      if (affiliate.pendingEarnings < affiliate.minimumPayout) {
        return {
          success: false,
          error: `Minimum payout amount is €${affiliate.minimumPayout}. Current pending: €${affiliate.pendingEarnings.toFixed(2)}`
        };
      }

      if (method === 'paypal' && !affiliate.paypalEmail) {
        return { success: false, error: 'PayPal email not configured' };
      }

      if (method === 'bank_transfer' && !affiliate.bankAccount) {
        return { success: false, error: 'Bank account not configured' };
      }

      // Create payout request
      const payout = await prisma.payout.create({
        data: {
          affiliateId: affiliate.id,
          amount: affiliate.pendingEarnings,
          method,
          status: 'pending'
        }
      });

      // Update affiliate
      await prisma.affiliate.update({
        where: { id: affiliate.id },
        data: {
          pendingEarnings: 0
        }
      });

      return {
        success: true,
        data: payout,
        message: `Payout request for €${payout.amount.toFixed(2)} created successfully`
      };
    } catch (error) {
      console.error('❌ Error requesting payout:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process payout (admin function)
   */
  async processPayout(payoutId, transactionId, notes = null) {
    try {
      const payout = await prisma.payout.update({
        where: { id: payoutId },
        data: {
          status: 'paid',
          transactionId,
          paidAt: new Date(),
          notes
        },
        include: { affiliate: true }
      });

      // Update affiliate
      await prisma.affiliate.update({
        where: { id: payout.affiliateId },
        data: {
          paidEarnings: { increment: payout.amount },
          lastPayoutDate: new Date()
        }
      });

      // Mark referral commissions as paid
      await prisma.referral.updateMany({
        where: {
          affiliateId: payout.affiliateId,
          commissionPaid: false
        },
        data: {
          commissionPaid: true
        }
      });

      return {
        success: true,
        data: payout,
        message: `Payout of €${payout.amount.toFixed(2)} processed successfully`
      };
    } catch (error) {
      console.error('❌ Error processing payout:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update affiliate payment info
   */
  async updatePaymentInfo(userId, paypalEmail = null, bankAccount = null) {
    try {
      const affiliate = await prisma.affiliate.update({
        where: { userId },
        data: {
          paypalEmail,
          bankAccount
        }
      });

      return {
        success: true,
        data: affiliate
      };
    } catch (error) {
      console.error('❌ Error updating payment info:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all pending payouts (admin function)
   */
  async getPendingPayouts() {
    try {
      const payouts = await prisma.payout.findMany({
        where: { status: 'pending' },
        include: {
          affiliate: {
            include: {
              user: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      return {
        success: true,
        data: payouts
      };
    } catch (error) {
      console.error('❌ Error getting pending payouts:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new AffiliateService();

