/**
 * Product Recommender
 * ML-powered product recommendations for e-commerce
 * 
 * Features:
 * - Collaborative filtering
 * - Content-based filtering
 * - Hybrid recommendations
 * - Cross-sell & up-sell suggestions
 * - Personalized offers
 */
class ProductRecommender {
  constructor() {
    // User-product interaction matrix
    this.interactions = new Map();
    
    // Product similarity matrix
    this.productSimilarity = new Map();
    
    // User preferences
    this.userPreferences = new Map();

    // Stats
    this.stats = {
      totalRecommendations: 0,
      averageClickRate: 0,
      averageConversionRate: 0,
      totalRevenue: 0
    };
  }

  /**
   * Get product recommendations for user
   */
  async recommend(userId, context = {}) {
    this.stats.totalRecommendations++;

    // Get user history
    const userHistory = this.getUserHistory(userId);
    
    // Get recommendations based on different strategies
    const collaborative = this.collaborativeFiltering(userId, userHistory);
    const contentBased = this.contentBasedFiltering(userId, userHistory, context);
    const trending = this.getTrendingProducts(context);

    // Combine and rank recommendations
    const combined = this.combineRecommendations(
      collaborative,
      contentBased,
      trending,
      userHistory
    );

    // Generate cross-sell and up-sell
    const crossSell = this.getCrossSellProducts(userHistory, context);
    const upSell = this.getUpSellProducts(userHistory, context);

    return {
      recommended: combined.slice(0, 10),
      crossSell: crossSell.slice(0, 5),
      upSell: upSell.slice(0, 3),
      trending: trending.slice(0, 5),
      personalized: true,
      confidence: this.calculateConfidence(userHistory)
    };
  }

  /**
   * Collaborative filtering recommendations
   */
  collaborativeFiltering(userId, userHistory) {
    // Find similar users
    const similarUsers = this.findSimilarUsers(userId);
    
    // Get products liked by similar users
    const recommendations = [];
    const userProducts = new Set(userHistory.map(p => p.id));

    for (const similarUser of similarUsers) {
      const similarUserHistory = this.getUserHistory(similarUser.userId);
      
      for (const product of similarUserHistory) {
        if (!userProducts.has(product.id)) {
          recommendations.push({
            ...product,
            score: similarUser.similarity * product.rating,
            reason: 'Users like you also bought this'
          });
        }
      }
    }

    // Sort by score and return top items
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  /**
   * Content-based filtering recommendations
   */
  contentBasedFiltering(userId, userHistory, context) {
    if (userHistory.length === 0) {
      return this.getColdStartRecommendations(context);
    }

    const recommendations = [];
    const userProducts = new Set(userHistory.map(p => p.id));

    // Find similar products based on user's history
    for (const product of userHistory) {
      const similarProducts = this.findSimilarProducts(product.id);
      
      for (const similar of similarProducts) {
        if (!userProducts.has(similar.id)) {
          recommendations.push({
            ...similar,
            score: similar.similarity * product.rating,
            reason: `Similar to ${product.name}`
          });
        }
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  /**
   * Get trending products
   */
  getTrendingProducts(context = {}) {
    // Mock trending products (in production, get from database)
    const trending = [
      { id: 'trend_1', name: 'Best Seller Widget', price: 49.99, rating: 4.8, views: 5000 },
      { id: 'trend_2', name: 'Popular Gadget', price: 79.99, rating: 4.6, views: 4200 },
      { id: 'trend_3', name: 'Trending Item', price: 39.99, rating: 4.7, views: 3800 },
      { id: 'trend_4', name: 'Hot Product', price: 99.99, rating: 4.9, views: 3500 },
      { id: 'trend_5', name: 'Top Rated', price: 129.99, rating: 5.0, views: 3200 }
    ];

    // Filter by context (category, price range, etc.)
    let filtered = trending;
    
    if (context.category) {
      // Filter by category (mock)
      filtered = trending;
    }

    if (context.maxPrice) {
      filtered = filtered.filter(p => p.price <= context.maxPrice);
    }

    return filtered.map(p => ({
      ...p,
      score: (p.rating * 0.5 + (p.views / 1000) * 0.5),
      reason: 'Trending now'
    }));
  }

  /**
   * Get cross-sell products
   */
  getCrossSellProducts(userHistory, context = {}) {
    if (userHistory.length === 0) return [];

    // Frequently bought together
    const crossSell = [
      { id: 'cross_1', name: 'Accessory Bundle', price: 29.99, rating: 4.5, boost: 1.3 },
      { id: 'cross_2', name: 'Complementary Product', price: 19.99, rating: 4.4, boost: 1.2 },
      { id: 'cross_3', name: 'Related Item', price: 39.99, rating: 4.6, boost: 1.1 }
    ];

    return crossSell.map(p => ({
      ...p,
      score: p.rating * p.boost,
      reason: 'Frequently bought together',
      discount: 15 // 15% discount for bundle
    }));
  }

  /**
   * Get up-sell products
   */
  getUpSellProducts(userHistory, context = {}) {
    if (userHistory.length === 0) return [];

    // Higher-tier versions
    const upSell = [
      { id: 'up_1', name: 'Premium Version', price: 149.99, rating: 4.9, boost: 1.5 },
      { id: 'up_2', name: 'Pro Edition', price: 199.99, rating: 4.8, boost: 1.4 },
      { id: 'up_3', name: 'Deluxe Package', price: 249.99, rating: 4.7, boost: 1.3 }
    ];

    return upSell.map(p => ({
      ...p,
      score: p.rating * p.boost,
      reason: 'Upgrade for more features',
      savings: 20 // $20 off for upgrade
    }));
  }

  /**
   * Combine recommendations from different sources
   */
  combineRecommendations(collaborative, contentBased, trending, userHistory) {
    const combined = new Map();

    // Add all recommendations with weighted scores
    const addToMap = (items, weight) => {
      items.forEach(item => {
        if (combined.has(item.id)) {
          combined.get(item.id).score += item.score * weight;
        } else {
          combined.set(item.id, {
            ...item,
            score: item.score * weight
          });
        }
      });
    };

    addToMap(collaborative, 0.4);  // 40% weight
    addToMap(contentBased, 0.35);  // 35% weight
    addToMap(trending, 0.25);      // 25% weight

    // Convert to array and sort
    return Array.from(combined.values())
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Find similar users (collaborative filtering)
   */
  findSimilarUsers(userId) {
    // Mock similar users (in production, use real similarity calculation)
    return [
      { userId: 'user_2', similarity: 0.85 },
      { userId: 'user_3', similarity: 0.78 },
      { userId: 'user_4', similarity: 0.72 }
    ];
  }

  /**
   * Find similar products (content-based filtering)
   */
  findSimilarProducts(productId) {
    // Mock similar products (in production, use real similarity calculation)
    return [
      { id: 'prod_2', name: 'Similar Product 1', price: 45.99, rating: 4.5, similarity: 0.9 },
      { id: 'prod_3', name: 'Similar Product 2', price: 55.99, rating: 4.6, similarity: 0.85 },
      { id: 'prod_4', name: 'Similar Product 3', price: 42.99, rating: 4.4, similarity: 0.8 }
    ];
  }

  /**
   * Get user history
   */
  getUserHistory(userId) {
    // Mock user history (in production, get from database)
    return this.interactions.get(userId) || [
      { id: 'prod_1', name: 'Previous Purchase', price: 49.99, rating: 4.5 }
    ];
  }

  /**
   * Cold start recommendations (for new users)
   */
  getColdStartRecommendations(context = {}) {
    return this.getTrendingProducts(context);
  }

  /**
   * Calculate recommendation confidence
   */
  calculateConfidence(userHistory) {
    if (userHistory.length === 0) return 0.3; // Low confidence for new users
    if (userHistory.length < 3) return 0.5;   // Medium confidence
    if (userHistory.length < 10) return 0.7;  // Good confidence
    return 0.9; // High confidence
  }

  /**
   * Track recommendation interaction
   */
  trackInteraction(userId, productId, interactionType = 'view') {
    if (!this.interactions.has(userId)) {
      this.interactions.set(userId, []);
    }

    this.interactions.get(userId).push({
      productId,
      type: interactionType,
      timestamp: Date.now()
    });

    // Update stats
    if (interactionType === 'purchase') {
      this.stats.averageConversionRate = 
        (this.stats.averageConversionRate * 0.9 + 0.1); // Exponential moving average
    }
  }

  /**
   * Get analytics
   */
  getStats() {
    return {
      ...this.stats,
      totalUsers: this.interactions.size,
      averageRecommendationsPerUser: this.stats.totalRecommendations / Math.max(this.interactions.size, 1)
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalRecommendations: 0,
      averageClickRate: 0,
      averageConversionRate: 0,
      totalRevenue: 0
    };
  }
}

module.exports = ProductRecommender;
