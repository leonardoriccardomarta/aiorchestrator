const Sentiment = require('sentiment');
const natural = require('natural');

/**
 * Sentiment Analyzer
 * Analyzes sentiment and emotions in customer messages
 * Features:
 * - Sentiment score (-1 to +1)
 * - Emotion detection (joy, anger, sadness, fear, etc.)
 * - Urgency level detection
 * - Language detection
 */
class SentimentAnalyzer {
  constructor() {
    this.sentiment = new Sentiment();
    this.tokenizer = new natural.WordTokenizer();
    
    // Emotion keywords
    this.emotionKeywords = {
      joy: ['happy', 'great', 'awesome', 'excellent', 'love', 'perfect', 'amazing', 'wonderful', 'fantastic', 'pleased', 'delighted', 'satisfied'],
      anger: ['angry', 'frustrated', 'annoyed', 'furious', 'upset', 'mad', 'irritated', 'outraged', 'disgusted'],
      sadness: ['sad', 'disappointed', 'unhappy', 'depressed', 'sorry', 'regret', 'unfortunate', 'terrible'],
      fear: ['worried', 'concerned', 'anxious', 'scared', 'afraid', 'nervous', 'uncertain'],
      surprise: ['wow', 'amazing', 'surprised', 'unexpected', 'shocked', 'unbelievable'],
      trust: ['thank', 'thanks', 'appreciate', 'grateful', 'reliable', 'trustworthy']
    };

    // Urgency indicators
    this.urgencyKeywords = {
      high: ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'now', 'help!', 'please help'],
      medium: ['soon', 'quick', 'fast', 'when', 'how long'],
      low: ['maybe', 'sometime', 'whenever', 'no rush']
    };

    // Stats
    this.stats = {
      totalAnalyzed: 0,
      sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
      emotionDistribution: {},
      averageScore: 0
    };
  }

  /**
   * Analyze sentiment and emotions
   */
  analyze(message) {
    this.stats.totalAnalyzed++;

    // Get sentiment score
    const sentimentResult = this.sentiment.analyze(message);
    const normalizedScore = this.normalizeScore(sentimentResult.score, message.split(' ').length);

    // Detect emotions
    const emotions = this.detectEmotions(message);

    // Detect urgency
    const urgency = this.detectUrgency(message);

    // Classify sentiment
    const classification = this.classifySentiment(normalizedScore);
    
    // Update stats
    this.updateStats(classification, emotions, normalizedScore);

    return {
      score: normalizedScore,
      classification,
      emotions,
      urgency,
      rawScore: sentimentResult.score,
      comparative: sentimentResult.comparative,
      tokens: sentimentResult.tokens,
      positive: sentimentResult.positive,
      negative: sentimentResult.negative
    };
  }

  /**
   * Normalize sentiment score to -1 to +1 range
   */
  normalizeScore(score, wordCount) {
    // Normalize by word count
    if (wordCount === 0) return 0;
    const comparative = score / wordCount;
    // Clamp to -1 to +1
    return Math.max(-1, Math.min(1, comparative));
  }

  /**
   * Classify sentiment
   */
  classifySentiment(score) {
    if (score > 0.2) return 'positive';
    if (score < -0.2) return 'negative';
    return 'neutral';
  }

  /**
   * Detect emotions in message
   */
  detectEmotions(message) {
    const messageLower = message.toLowerCase();
    const tokens = this.tokenizer.tokenize(messageLower);
    const emotions = {};

    for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
      const matches = keywords.filter(keyword => 
        tokens.some(token => token.includes(keyword) || keyword.includes(token))
      );
      
      if (matches.length > 0) {
        emotions[emotion] = {
          detected: true,
          confidence: Math.min(matches.length * 0.3, 1),
          keywords: matches
        };
      }
    }

    return emotions;
  }

  /**
   * Detect urgency level
   */
  detectUrgency(message) {
    const messageLower = message.toLowerCase();
    
    // Check for high urgency
    for (const keyword of this.urgencyKeywords.high) {
      if (messageLower.includes(keyword)) {
        return { level: 'high', confidence: 0.9 };
      }
    }

    // Check for medium urgency
    for (const keyword of this.urgencyKeywords.medium) {
      if (messageLower.includes(keyword)) {
        return { level: 'medium', confidence: 0.6 };
      }
    }

    // Check for low urgency
    for (const keyword of this.urgencyKeywords.low) {
      if (messageLower.includes(keyword)) {
        return { level: 'low', confidence: 0.4 };
      }
    }

    return { level: 'medium', confidence: 0.5 };
  }

  /**
   * Update statistics
   */
  updateStats(classification, emotions, score) {
    // Update sentiment distribution
    this.stats.sentimentDistribution[classification]++;

    // Update emotion distribution
    for (const emotion of Object.keys(emotions)) {
      this.stats.emotionDistribution[emotion] = 
        (this.stats.emotionDistribution[emotion] || 0) + 1;
    }

    // Update average score
    this.stats.averageScore = 
      (this.stats.averageScore * (this.stats.totalAnalyzed - 1) + score) / 
      this.stats.totalAnalyzed;
  }

  /**
   * Get analytics
   */
  getStats() {
    const total = this.stats.totalAnalyzed;
    
    return {
      ...this.stats,
      sentimentPercentage: {
        positive: total > 0 ? (this.stats.sentimentDistribution.positive / total * 100).toFixed(1) : 0,
        neutral: total > 0 ? (this.stats.sentimentDistribution.neutral / total * 100).toFixed(1) : 0,
        negative: total > 0 ? (this.stats.sentimentDistribution.negative / total * 100).toFixed(1) : 0
      }
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalAnalyzed: 0,
      sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
      emotionDistribution: {},
      averageScore: 0
    };
  }
}

module.exports = SentimentAnalyzer;
