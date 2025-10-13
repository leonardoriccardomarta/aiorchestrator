const natural = require('natural');

/**
 * Intent Classifier
 * Classifies user intents for smart routing and responses
 * 
 * Supported Intents:
 * - product_inquiry (questions about products)
 * - order_status (tracking, delivery, shipping)
 * - return_request (returns, refunds, exchanges)
 * - technical_support (issues, errors, problems)
 * - complaint (negative feedback, complaints)
 * - pricing_question (price, cost, discount)
 * - general_inquiry (general questions)
 */
class IntentClassifier {
  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.tokenizer = new natural.WordTokenizer();
    
    // Intent patterns
    this.intentPatterns = {
      product_inquiry: [
        'product', 'item', 'available', 'stock', 'buy', 'purchase', 'get',
        'specs', 'features', 'details', 'information', 'about', 'what is',
        'color', 'size', 'model', 'version', 'variant'
      ],
      order_status: [
        'order', 'tracking', 'shipped', 'delivery', 'arrive', 'when',
        'status', 'track', 'package', 'shipping', 'received', 'eta',
        'where is', 'location', 'transit'
      ],
      return_request: [
        'return', 'refund', 'cancel', 'exchange', 'replace', 'money back',
        'not working', 'defective', 'wrong', 'incorrect', 'mistake',
        'send back', 'return policy'
      ],
      technical_support: [
        'not working', 'error', 'broken', 'help', 'issue', 'problem',
        'crash', 'bug', 'fix', 'support', 'technical', 'malfunction',
        'setup', 'install', 'configure', 'how to'
      ],
      complaint: [
        'angry', 'disappointed', 'terrible', 'horrible', 'worst',
        'unacceptable', 'poor', 'bad', 'awful', 'disgusted', 'frustrated',
        'complain', 'unhappy', 'dissatisfied'
      ],
      pricing_question: [
        'price', 'cost', 'how much', 'discount', 'sale', 'offer',
        'coupon', 'promo', 'deal', 'cheap', 'expensive', 'afford',
        'payment', 'pay', 'charge'
      ],
      general_inquiry: [
        'hello', 'hi', 'hey', 'question', 'ask', 'know', 'tell me',
        'explain', 'what', 'how', 'why', 'when', 'where', 'information',
        'hours', 'open', 'contact', 'reach'
      ]
    };

    // Train the classifier
    this.trainClassifier();

    // Stats
    this.stats = {
      totalClassified: 0,
      intentDistribution: {},
      averageConfidence: 0
    };
  }

  /**
   * Train the Bayes classifier
   */
  trainClassifier() {
    console.log('🎯 Training Intent Classifier...');

    for (const [intent, keywords] of Object.entries(this.intentPatterns)) {
      // Create training samples from keywords
      keywords.forEach(keyword => {
        const samples = this.generateTrainingSamples(keyword, intent);
        samples.forEach(sample => {
          this.classifier.addDocument(sample, intent);
        });
      });
    }

    this.classifier.train();
    console.log('✅ Intent Classifier trained successfully');
  }

  /**
   * Generate training samples from keywords
   */
  generateTrainingSamples(keyword, intent) {
    const templates = {
      product_inquiry: [
        `what is ${keyword}`,
        `tell me about ${keyword}`,
        `${keyword} information`,
        `I want to know about ${keyword}`,
        `looking for ${keyword}`
      ],
      order_status: [
        `where is my ${keyword}`,
        `${keyword} status`,
        `check ${keyword}`,
        `when will ${keyword}`,
        `${keyword} update`
      ],
      return_request: [
        `I want to ${keyword}`,
        `how to ${keyword}`,
        `${keyword} my order`,
        `need to ${keyword}`,
        `${keyword} process`
      ],
      technical_support: [
        `${keyword} with product`,
        `having ${keyword}`,
        `${keyword} occurred`,
        `need ${keyword}`,
        `${keyword} issue`
      ],
      complaint: [
        `I am ${keyword}`,
        `this is ${keyword}`,
        `very ${keyword}`,
        `so ${keyword}`,
        `${keyword} experience`
      ],
      pricing_question: [
        `what is the ${keyword}`,
        `how much ${keyword}`,
        `${keyword} for this`,
        `any ${keyword} available`,
        `${keyword} information`
      ],
      general_inquiry: [
        `${keyword}`,
        `${keyword} please`,
        `can you ${keyword}`,
        `I want to ${keyword}`,
        `${keyword} help`
      ]
    };

    return templates[intent] || [keyword];
  }

  /**
   * Classify user intent
   */
  classify(message) {
    this.stats.totalClassified++;

    // Get classification
    const classification = this.classifier.classify(message);
    const probabilities = this.classifier.getClassifications(message);

    // Get confidence score
    const topIntent = probabilities[0];
    const confidence = topIntent ? topIntent.value : 0;

    // Pattern matching for additional confidence
    const patternMatch = this.patternMatching(message);

    // Combine results
    const finalIntent = confidence > 0.6 ? classification : patternMatch.intent;
    const finalConfidence = Math.max(confidence, patternMatch.confidence);

    // Update stats
    this.updateStats(finalIntent, finalConfidence);

    return {
      intent: finalIntent,
      confidence: finalConfidence,
      probabilities: probabilities.slice(0, 3), // Top 3 intents
      suggestedAction: this.getSuggestedAction(finalIntent),
      urgencyLevel: this.getUrgencyLevel(finalIntent)
    };
  }

  /**
   * Pattern matching for better accuracy
   */
  patternMatching(message) {
    const messageLower = message.toLowerCase();
    const matches = {};

    for (const [intent, keywords] of Object.entries(this.intentPatterns)) {
      const matchCount = keywords.filter(keyword => 
        messageLower.includes(keyword)
      ).length;

      if (matchCount > 0) {
        matches[intent] = matchCount / keywords.length;
      }
    }

    // Get best match
    const bestMatch = Object.entries(matches)
      .sort(([, a], [, b]) => b - a)[0];

    return bestMatch 
      ? { intent: bestMatch[0], confidence: Math.min(bestMatch[1] * 2, 1) }
      : { intent: 'general_inquiry', confidence: 0.3 };
  }

  /**
   * Get suggested action based on intent
   */
  getSuggestedAction(intent) {
    const actions = {
      product_inquiry: 'show_product_catalog',
      order_status: 'check_order_tracking',
      return_request: 'initiate_return_process',
      technical_support: 'escalate_to_support',
      complaint: 'escalate_to_manager',
      pricing_question: 'show_pricing_info',
      general_inquiry: 'provide_general_help'
    };

    return actions[intent] || 'provide_general_help';
  }

  /**
   * Get urgency level based on intent
   */
  getUrgencyLevel(intent) {
    const urgency = {
      product_inquiry: 'low',
      order_status: 'medium',
      return_request: 'high',
      technical_support: 'high',
      complaint: 'high',
      pricing_question: 'low',
      general_inquiry: 'low'
    };

    return urgency[intent] || 'medium';
  }

  /**
   * Update statistics
   */
  updateStats(intent, confidence) {
    // Update intent distribution
    this.stats.intentDistribution[intent] = 
      (this.stats.intentDistribution[intent] || 0) + 1;

    // Update average confidence
    this.stats.averageConfidence = 
      (this.stats.averageConfidence * (this.stats.totalClassified - 1) + confidence) / 
      this.stats.totalClassified;
  }

  /**
   * Get analytics
   */
  getStats() {
    const total = this.stats.totalClassified;
    
    const distribution = {};
    for (const [intent, count] of Object.entries(this.stats.intentDistribution)) {
      distribution[intent] = total > 0 ? (count / total * 100).toFixed(1) : 0;
    }

    return {
      ...this.stats,
      intentPercentage: distribution
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalClassified: 0,
      intentDistribution: {},
      averageConfidence: 0
    };
  }
}

module.exports = IntentClassifier;
