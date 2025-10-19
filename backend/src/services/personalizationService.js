/**
 * Personalization Service
 * Tracks user behavior and personalizes chatbot responses
 */

class PersonalizationService {
  constructor() {
    this.userProfiles = new Map(); // userId → profile
    this.behaviorTracking = new Map(); // sessionId → behaviors
  }

  /**
   * 1. TRACK USER BEHAVIOR
   * Records user interactions for personalization
   */
  trackBehavior(sessionId, behavior) {
    try {
      if (!this.behaviorTracking.has(sessionId)) {
        this.behaviorTracking.set(sessionId, {
          sessionId,
          startedAt: new Date(),
          behaviors: [],
          pageViews: [],
          interactions: [],
          purchases: []
        });
      }

      const session = this.behaviorTracking.get(sessionId);
      
      // Add behavior
      session.behaviors.push({
        type: behavior.type,
        data: behavior.data,
        timestamp: new Date()
      });

      // Update specific tracking lists
      if (behavior.type === 'page_view') {
        session.pageViews.push(behavior.data);
      } else if (behavior.type === 'product_view') {
        session.interactions.push(behavior.data);
      } else if (behavior.type === 'purchase') {
        session.purchases.push(behavior.data);
      }

      console.log('📊 Behavior tracked:', behavior.type, sessionId);

      return {
        success: true,
        sessionId,
        totalBehaviors: session.behaviors.length
      };
    } catch (error) {
      console.error('❌ Track behavior error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 2. BUILD USER PROFILE
   * Creates/updates user profile based on behavior
   */
  buildUserProfile(userId, sessionData) {
    try {
      const existingProfile = this.userProfiles.get(userId) || {
        userId,
        createdAt: new Date(),
        totalSessions: 0,
        totalPageViews: 0,
        totalInteractions: 0,
        totalPurchases: 0,
        totalSpent: 0,
        interests: [],
        preferredCategories: [],
        averageOrderValue: 0,
        purchaseFrequency: 0,
        lastVisit: new Date(),
        segment: 'new' // new, active, loyal, at_risk, dormant
      };

      // Update with session data
      existingProfile.totalSessions++;
      existingProfile.totalPageViews += sessionData.pageViews?.length || 0;
      existingProfile.totalInteractions += sessionData.interactions?.length || 0;
      existingProfile.lastVisit = new Date();

      // Extract interests from page views and interactions
      const viewedProducts = sessionData.interactions || [];
      viewedProducts.forEach(product => {
        if (product.category && !existingProfile.preferredCategories.includes(product.category)) {
          existingProfile.preferredCategories.push(product.category);
        }
        if (product.tags) {
          product.tags.forEach(tag => {
            if (!existingProfile.interests.includes(tag)) {
              existingProfile.interests.push(tag);
            }
          });
        }
      });

      // Update purchase data
      if (sessionData.purchases && sessionData.purchases.length > 0) {
        existingProfile.totalPurchases += sessionData.purchases.length;
        const sessionSpent = sessionData.purchases.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
        existingProfile.totalSpent += sessionSpent;
        existingProfile.averageOrderValue = existingProfile.totalSpent / existingProfile.totalPurchases;
      }

      // Calculate segment
      existingProfile.segment = this.calculateSegment(existingProfile);

      this.userProfiles.set(userId, existingProfile);

      console.log('👤 User profile updated:', userId, existingProfile.segment);

      return {
        success: true,
        profile: existingProfile
      };
    } catch (error) {
      console.error('❌ Build user profile error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calculate user segment based on behavior
   */
  calculateSegment(profile) {
    const daysSinceLastVisit = (Date.now() - profile.lastVisit.getTime()) / (1000 * 60 * 60 * 24);
    
    // Dormant: No visit in 30+ days
    if (daysSinceLastVisit > 30) {
      return 'dormant';
    }
    
    // At Risk: No purchase but visited recently
    if (profile.totalPurchases === 0 && profile.totalSessions > 3) {
      return 'at_risk';
    }
    
    // Loyal: 3+ purchases
    if (profile.totalPurchases >= 3) {
      return 'loyal';
    }
    
    // Active: 1-2 purchases or high engagement
    if (profile.totalPurchases > 0 || profile.totalSessions > 5) {
      return 'active';
    }
    
    // New: Default
    return 'new';
  }

  /**
   * 3. GET PERSONALIZED GREETING
   * Returns personalized welcome message based on user profile
   */
  getPersonalizedGreeting(userId) {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      return {
        greeting: "👋 Welcome! How can I help you today?",
        segment: 'new'
      };
    }

    const greetings = {
      new: `👋 Welcome! I'm here to help you find what you need.`,
      active: `Hey there! Great to see you again! 🎉`,
      loyal: `Welcome back, valued customer! 💎 Thanks for your continued support.`,
      at_risk: `Hi! We've missed you. 🌟 Let me help you find something special today.`,
      dormant: `Welcome back! 🎊 It's been a while. We have new products you might love!`
    };

    // Add personalized context
    let context = '';
    if (profile.preferredCategories.length > 0) {
      const topCategory = profile.preferredCategories[0];
      context = ` Looking for more ${topCategory}?`;
    }

    return {
      greeting: greetings[profile.segment] + context,
      segment: profile.segment,
      profile
    };
  }

  /**
   * 4. GET PERSONALIZED RECOMMENDATIONS
   * ML-based product recommendations
   */
  getPersonalizedRecommendations(userId, allProducts) {
    const profile = this.userProfiles.get(userId);
    
    if (!profile || !allProducts || allProducts.length === 0) {
      return {
        success: true,
        recommendations: [],
        reason: 'No personalization data yet'
      };
    }

    // Score products based on user preferences
    const scoredProducts = allProducts.map(product => {
      let score = 0;
      
      // Match preferred categories
      if (profile.preferredCategories.includes(product.category)) {
        score += 40;
      }
      
      // Match interests/tags
      const matchingTags = product.tags?.filter(tag => 
        profile.interests.includes(tag)
      ) || [];
      score += matchingTags.length * 15;
      
      // Price preference (based on AOV)
      const productPrice = parseFloat(product.price || 0);
      if (profile.averageOrderValue > 0) {
        const priceDiff = Math.abs(productPrice - profile.averageOrderValue);
        if (priceDiff < 20) {
          score += 20; // Similar price range
        }
      }
      
      // Boost for loyal customers - show premium products
      if (profile.segment === 'loyal' && productPrice > profile.averageOrderValue) {
        score += 10;
      }
      
      // Boost for at-risk customers - show deals
      if (profile.segment === 'at_risk' && product.discount) {
        score += 25;
      }

      return { product, score };
    });

    // Sort by score and return top recommendations
    const recommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .filter(item => item.score > 20)
      .map(item => ({
        ...item.product,
        personalizedScore: item.score,
        reason: this.getRecommendationReason(profile, item.product)
      }));

    return {
      success: true,
      recommendations,
      reason: `Based on your interest in ${profile.preferredCategories.join(', ')}`
    };
  }

  /**
   * Get recommendation reason
   */
  getRecommendationReason(profile, product) {
    if (profile.preferredCategories.includes(product.category)) {
      return `Because you love ${product.category}`;
    }
    
    const matchingTags = product.tags?.filter(tag => 
      profile.interests.includes(tag)
    ) || [];
    
    if (matchingTags.length > 0) {
      return `Matches your interest in ${matchingTags[0]}`;
    }
    
    if (profile.segment === 'loyal') {
      return 'Premium pick for our loyal customers';
    }
    
    return 'Recommended for you';
  }

  /**
   * 5. PERSONALIZED DISCOUNT OFFER
   * Segment-based discount strategy
   */
  getPersonalizedDiscount(userId) {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      return null;
    }

    const discountStrategies = {
      new: {
        code: 'WELCOME15',
        value: 15,
        type: 'percentage',
        message: '🎁 Welcome! Get 15% off your first purchase with code <strong>WELCOME15</strong>'
      },
      active: {
        code: 'THANKYOU10',
        value: 10,
        type: 'percentage',
        message: '💝 Thanks for being awesome! Use code <strong>THANKYOU10</strong> for 10% off'
      },
      loyal: {
        code: 'VIP20',
        value: 20,
        type: 'percentage',
        message: '👑 VIP Offer: Enjoy 20% off with code <strong>VIP20</strong> - you earned it!'
      },
      at_risk: {
        code: 'COMEBACK25',
        value: 25,
        type: 'percentage',
        message: '🌟 We miss you! Come back with 25% off using code <strong>COMEBACK25</strong>'
      },
      dormant: {
        code: 'WELCOME_BACK30',
        value: 30,
        type: 'percentage',
        message: '🎊 Welcome back! Special 30% off with code <strong>WELCOME_BACK30</strong>'
      }
    };

    return discountStrategies[profile.segment] || null;
  }

  /**
   * 6. TRACK CONVERSION
   * Records when user makes a purchase
   */
  trackConversion(userId, orderData) {
    try {
      const profile = this.userProfiles.get(userId);
      
      if (profile) {
        profile.totalPurchases++;
        profile.totalSpent += parseFloat(orderData.total || 0);
        profile.averageOrderValue = profile.totalSpent / profile.totalPurchases;
        profile.segment = this.calculateSegment(profile);
        
        this.userProfiles.set(userId, profile);
      }

      console.log('💰 Conversion tracked:', userId, orderData.total);

      return {
        success: true,
        profile
      };
    } catch (error) {
      console.error('❌ Track conversion error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 7. GET USER PROFILE
   * Retrieve user profile
   */
  getUserProfile(userId) {
    const profile = this.userProfiles.get(userId);
    
    return {
      success: true,
      profile: profile || null,
      hasProfile: !!profile
    };
  }

  /**
   * 8. CLEANUP OLD SESSIONS
   * Remove old session data (privacy)
   */
  cleanupOldSessions(daysOld = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    let cleaned = 0;

    for (const [sessionId, session] of this.behaviorTracking.entries()) {
      if (session.startedAt < cutoffDate) {
        this.behaviorTracking.delete(sessionId);
        cleaned++;
      }
    }

    console.log(`🧹 Cleaned ${cleaned} old sessions`);

    return {
      success: true,
      cleaned
    };
  }
}

module.exports = PersonalizationService;

