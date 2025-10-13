/**
 * Churn Predictor
 * Predicts customer churn risk and suggests retention strategies
 * 
 * Features:
 * - Churn risk scoring (0-100%)
 * - Risk factor identification
 * - Retention strategy recommendations
 * - Lifetime value prediction
 * - Engagement scoring
 */
class ChurnPredictor {
  constructor() {
    // Churn risk weights
    this.riskWeights = {
      lastActivityDays: 0.25,
      engagementScore: 0.20,
      supportTickets: 0.15,
      planDowngrade: 0.15,
      messageVolume: 0.10,
      satisfactionScore: 0.10,
      paymentIssues: 0.05
    };

    // Stats
    this.stats = {
      totalPredictions: 0,
      churnPrevented: 0,
      averageRisk: 0,
      highRiskUsers: 0
    };
  }

  /**
   * Predict churn risk for a user
   */
  async predict(userId, userData = {}) {
    this.stats.totalPredictions++;

    // Extract features
    const features = this.extractFeatures(userData);

    // Calculate churn risk score
    const riskScore = this.calculateRiskScore(features);

    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(features);

    // Get retention strategy
    const retentionStrategy = this.getRetentionStrategy(riskScore, riskFactors, userData);

    // Predict lifetime value
    const lifetimeValue = this.predictLifetimeValue(userData, riskScore);

    // Update stats
    this.updateStats(riskScore);

    return {
      userId,
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      riskFactors,
      retentionStrategy,
      lifetimeValue,
      engagement: features.engagementScore,
      prediction: {
        churnProbability: riskScore / 100,
        timeToChurn: this.estimateTimeToChurn(riskScore, features),
        confidence: this.calculateConfidence(features)
      }
    };
  }

  /**
   * Extract features from user data
   */
  extractFeatures(userData) {
    const now = Date.now();
    const lastActivity = userData.lastActivityDate || now;
    const lastActivityDays = Math.floor((now - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));

    return {
      // Activity features
      lastActivityDays: Math.min(lastActivityDays, 90),
      messagesLast30Days: userData.messagesLast30Days || 0,
      loginFrequency: userData.loginFrequency || 0,
      
      // Engagement features
      engagementScore: this.calculateEngagementScore(userData),
      featureUsage: userData.featureUsage || 0,
      
      // Support features
      supportTickets: userData.supportTickets || 0,
      unresolvedIssues: userData.unresolvedIssues || 0,
      
      // Plan features
      planLevel: userData.planId || 'starter',
      planDowngrade: userData.planDowngraded || false,
      trialStatus: userData.isTrialActive || false,
      
      // Satisfaction features
      satisfactionScore: userData.satisfactionScore || 0.5,
      npsScore: userData.npsScore || 0,
      
      // Payment features
      paymentIssues: userData.paymentIssues || 0,
      subscriptionLength: userData.subscriptionLength || 0
    };
  }

  /**
   * Calculate engagement score
   */
  calculateEngagementScore(userData) {
    let score = 0;

    // Message activity (0-30 points)
    const messages = userData.messagesLast30Days || 0;
    score += Math.min(messages / 100 * 30, 30);

    // Login frequency (0-25 points)
    const logins = userData.loginFrequency || 0;
    score += Math.min(logins / 20 * 25, 25);

    // Feature usage (0-25 points)
    const features = userData.featureUsage || 0;
    score += Math.min(features / 10 * 25, 25);

    // Active chatbots (0-20 points)
    const chatbots = userData.activeChatbots || 0;
    score += Math.min(chatbots / 5 * 20, 20);

    return score / 100; // Normalize to 0-1
  }

  /**
   * Calculate churn risk score (0-100)
   */
  calculateRiskScore(features) {
    let risk = 0;

    // Last activity (inverse scoring - more days = higher risk)
    const activityRisk = Math.min(features.lastActivityDays / 30 * 100, 100);
    risk += activityRisk * this.riskWeights.lastActivityDays;

    // Engagement (inverse scoring - lower engagement = higher risk)
    const engagementRisk = (1 - features.engagementScore) * 100;
    risk += engagementRisk * this.riskWeights.engagementScore;

    // Support tickets (more tickets = higher risk)
    const supportRisk = Math.min(features.supportTickets / 5 * 100, 100);
    risk += supportRisk * this.riskWeights.supportTickets;

    // Plan downgrade (boolean - direct risk)
    const downgradeRisk = features.planDowngrade ? 100 : 0;
    risk += downgradeRisk * this.riskWeights.planDowngrade;

    // Message volume (inverse scoring - fewer messages = higher risk)
    const messageRisk = Math.max(0, 100 - features.messagesLast30Days / 10);
    risk += messageRisk * this.riskWeights.messageVolume;

    // Satisfaction (inverse scoring - lower satisfaction = higher risk)
    const satisfactionRisk = (1 - features.satisfactionScore) * 100;
    risk += satisfactionRisk * this.riskWeights.satisfactionScore;

    // Payment issues (more issues = higher risk)
    const paymentRisk = Math.min(features.paymentIssues / 3 * 100, 100);
    risk += paymentRisk * this.riskWeights.paymentIssues;

    return Math.min(Math.max(risk, 0), 100);
  }

  /**
   * Identify specific risk factors
   */
  identifyRiskFactors(features) {
    const factors = [];

    if (features.lastActivityDays > 7) {
      factors.push({
        factor: 'low_engagement',
        severity: features.lastActivityDays > 30 ? 'high' : 'medium',
        description: `Last activity was ${features.lastActivityDays} days ago`
      });
    }

    if (features.engagementScore < 0.3) {
      factors.push({
        factor: 'poor_engagement',
        severity: 'high',
        description: 'Very low engagement with the platform'
      });
    }

    if (features.supportTickets > 3) {
      factors.push({
        factor: 'support_issues',
        severity: 'high',
        description: `${features.supportTickets} support tickets opened`
      });
    }

    if (features.planDowngrade) {
      factors.push({
        factor: 'plan_downgrade',
        severity: 'high',
        description: 'Recently downgraded subscription plan'
      });
    }

    if (features.satisfactionScore < 0.4) {
      factors.push({
        factor: 'low_satisfaction',
        severity: 'high',
        description: 'Low customer satisfaction score'
      });
    }

    if (features.paymentIssues > 0) {
      factors.push({
        factor: 'payment_issues',
        severity: 'medium',
        description: `${features.paymentIssues} payment issue(s) detected`
      });
    }

    return factors;
  }

  /**
   * Get retention strategy based on risk
   */
  getRetentionStrategy(riskScore, riskFactors, userData) {
    const riskLevel = this.getRiskLevel(riskScore);

    if (riskLevel === 'low') {
      return {
        action: 'monitor',
        recommendations: [
          'Continue providing excellent service',
          'Send periodic engagement emails',
          'Offer loyalty rewards'
        ],
        priority: 'low',
        automatedActions: []
      };
    }

    if (riskLevel === 'medium') {
      return {
        action: 'engage',
        recommendations: [
          'Send personalized re-engagement email',
          'Offer feature tutorial or webinar',
          'Provide special discount (10-15%)',
          'Schedule check-in call'
        ],
        priority: 'medium',
        automatedActions: [
          'send_reengagement_email',
          'offer_discount_10'
        ],
        discount: 15,
        timing: 'within_7_days'
      };
    }

    // High risk
    return {
      action: 'immediate_intervention',
      recommendations: [
        'Immediate personal outreach from account manager',
        'Offer significant discount (25-30%)',
        'Provide exclusive features or early access',
        'Schedule executive call',
        'Offer personalized onboarding session'
      ],
      priority: 'high',
      automatedActions: [
        'alert_account_manager',
        'send_executive_email',
        'offer_discount_30'
      ],
      discount: 30,
      timing: 'immediate',
      escalation: true
    };
  }

  /**
   * Predict lifetime value
   */
  predictLifetimeValue(userData, riskScore) {
    const planValues = {
      starter: 29,
      pro: 99,
      enterprise: 299,
      custom: 999
    };

    const monthlyValue = planValues[userData.planId] || 29;
    const subscriptionMonths = userData.subscriptionLength || 1;
    
    // Calculate expected lifetime based on churn risk
    const churnFactor = 1 - (riskScore / 100);
    const expectedLifetimeMonths = subscriptionMonths + (24 * churnFactor);

    return {
      currentValue: monthlyValue * subscriptionMonths,
      predictedValue: monthlyValue * expectedLifetimeMonths,
      monthlyValue,
      expectedLifetimeMonths: Math.round(expectedLifetimeMonths),
      riskAdjusted: true
    };
  }

  /**
   * Get risk level from score
   */
  getRiskLevel(score) {
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    return 'high';
  }

  /**
   * Estimate time to churn
   */
  estimateTimeToChurn(riskScore, features) {
    if (riskScore < 30) return '6+ months';
    if (riskScore < 50) return '3-6 months';
    if (riskScore < 70) return '1-3 months';
    if (riskScore < 85) return '2-4 weeks';
    return '< 2 weeks';
  }

  /**
   * Calculate prediction confidence
   */
  calculateConfidence(features) {
    let confidence = 0.5; // Base confidence

    // More data = higher confidence
    if (features.subscriptionLength > 3) confidence += 0.2;
    if (features.messagesLast30Days > 10) confidence += 0.1;
    if (features.loginFrequency > 5) confidence += 0.1;
    if (features.supportTickets > 0) confidence += 0.1;

    return Math.min(confidence, 1);
  }

  /**
   * Update statistics
   */
  updateStats(riskScore) {
    // Update average risk
    this.stats.averageRisk = 
      (this.stats.averageRisk * (this.stats.totalPredictions - 1) + riskScore) / 
      this.stats.totalPredictions;

    // Count high risk users
    if (riskScore > 70) {
      this.stats.highRiskUsers++;
    }
  }

  /**
   * Track churn prevention success
   */
  trackChurnPrevention(userId, prevented = true) {
    if (prevented) {
      this.stats.churnPrevented++;
    }
  }

  /**
   * Get analytics
   */
  getStats() {
    return {
      ...this.stats,
      preventionRate: this.stats.totalPredictions > 0 
        ? (this.stats.churnPrevented / this.stats.totalPredictions * 100).toFixed(1)
        : 0,
      highRiskPercentage: this.stats.totalPredictions > 0
        ? (this.stats.highRiskUsers / this.stats.totalPredictions * 100).toFixed(1)
        : 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalPredictions: 0,
      churnPrevented: 0,
      averageRisk: 0,
      highRiskUsers: 0
    };
  }
}

module.exports = ChurnPredictor;
