/**
 * ML Service Module
 * Full Machine Learning Suite for AI Orchestrator
 * 
 * Features:
 * - Sentiment Analysis & Emotion Detection
 * - Intent Classification
 * - Product Recommendations
 * - Churn Prediction
 * - Conversation Clustering & Auto-FAQ
 * - Anomaly Detection
 */

const SentimentAnalyzer = require('./sentiment-analyzer');
const IntentClassifier = require('./intent-classifier');
const ProductRecommender = require('./product-recommender');
const ChurnPredictor = require('./churn-predictor');
const ConversationClusterer = require('./conversation-clusterer');
const AnomalyDetector = require('./anomaly-detector');

class MLService {
  constructor() {
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.intentClassifier = new IntentClassifier();
    this.productRecommender = new ProductRecommender();
    this.churnPredictor = new ChurnPredictor();
    this.conversationClusterer = new ConversationClusterer();
    this.anomalyDetector = new AnomalyDetector();

    console.log('🧠 ML Service initialized - Full Suite ready');
  }

  /**
   * Analyze message with full ML pipeline
   */
  async analyzeMessage(message, context = {}) {
    const startTime = Date.now();

    // Run ML analysis
    const [sentiment, intent, anomaly] = await Promise.all([
      this.sentimentAnalyzer.analyze(message),
      this.intentClassifier.classify(message),
      this.anomalyDetector.detect(message, context)
    ]);

    return {
      sentiment,
      intent,
      anomaly,
      processingTime: Date.now() - startTime
    };
  }

  /**
   * Get product recommendations
   */
  async getRecommendations(userId, context = {}) {
    return await this.productRecommender.recommend(userId, context);
  }

  /**
   * Predict churn risk for user
   */
  async predictChurn(userId, userData = {}) {
    return await this.churnPredictor.predict(userId, userData);
  }

  /**
   * Cluster conversations and generate FAQs
   */
  async generateFAQs(conversations) {
    return await this.conversationClusterer.cluster(conversations);
  }

  /**
   * Get ML analytics
   */
  getAnalytics() {
    return {
      sentiment: this.sentimentAnalyzer.getStats(),
      intent: this.intentClassifier.getStats(),
      recommendations: this.productRecommender.getStats(),
      churn: this.churnPredictor.getStats(),
      clustering: this.conversationClusterer.getStats(),
      anomaly: this.anomalyDetector.getStats()
    };
  }
}

module.exports = MLService;
