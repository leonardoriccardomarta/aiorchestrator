/**
 * Anomaly Detector
 * Detects anomalous behavior, spam, and security threats
 * 
 * Features:
 * - Spam detection
 * - Bot detection
 * - Fraud detection
 * - Abuse detection
 * - Unusual pattern detection
 */
class AnomalyDetector {
  constructor() {
    // Spam keywords and patterns
    this.spamPatterns = [
      /\b(viagra|cialis|pharmacy|pills)\b/i,
      /\b(lottery|winner|prize|claim)\b/i,
      /\b(crypto|bitcoin|invest|roi)\b/i,
      /\b(click here|act now|limited time)\b/i,
      /\$\$\$|💰|🤑/,
      /(https?:\/\/[^\s]+){3,}/, // Multiple links
    ];

    // Bot detection patterns
    this.botPatterns = {
      repeatedMessages: 3,      // Same message repeated
      rapidFire: 5,             // Messages per second
      randomChars: 0.3,         // Ratio of random characters
      allCaps: 0.7              // Ratio of uppercase
    };

    // User behavior baselines
    this.userBaselines = new Map();

    // Stats
    this.stats = {
      totalChecks: 0,
      anomaliesDetected: 0,
      spamDetected: 0,
      botsDetected: 0,
      fraudDetected: 0,
      falsePositives: 0
    };
  }

  /**
   * Detect anomalies in message or behavior
   */
  async detect(message, context = {}) {
    this.stats.totalChecks++;

    const userId = context.userId;
    const timestamp = context.timestamp || Date.now();

    // Run all detection checks
    const checks = await Promise.all([
      this.detectSpam(message),
      this.detectBot(message, userId, timestamp),
      this.detectFraud(message, context),
      this.detectAbuse(message, context),
      this.detectUnusualPattern(userId, context)
    ]);

    const [spam, bot, fraud, abuse, unusual] = checks;

    // Aggregate results
    const isAnomalous = spam.detected || bot.detected || 
                        fraud.detected || abuse.detected || 
                        unusual.detected;

    // Determine severity
    const severity = this.calculateSeverity(checks);

    // Get recommended action
    const action = this.getRecommendedAction(checks, severity);

    // Update stats
    if (isAnomalous) {
      this.stats.anomaliesDetected++;
      if (spam.detected) this.stats.spamDetected++;
      if (bot.detected) this.stats.botsDetected++;
      if (fraud.detected) this.stats.fraudDetected++;
    }

    return {
      anomalous: isAnomalous,
      severity,
      action,
      details: {
        spam,
        bot,
        fraud,
        abuse,
        unusual
      },
      confidence: this.calculateConfidence(checks),
      timestamp
    };
  }

  /**
   * Detect spam
   */
  async detectSpam(message) {
    const messageLower = message.toLowerCase();
    let spamScore = 0;
    const indicators = [];

    // Check spam patterns
    for (const pattern of this.spamPatterns) {
      if (pattern.test(message)) {
        spamScore += 0.3;
        indicators.push(`Pattern match: ${pattern.source}`);
      }
    }

    // Check for excessive links
    const linkCount = (message.match(/https?:\/\//g) || []).length;
    if (linkCount > 2) {
      spamScore += linkCount * 0.2;
      indicators.push(`Multiple links: ${linkCount}`);
    }

    // Check for excessive exclamation marks
    const exclamationCount = (message.match(/!/g) || []).length;
    if (exclamationCount > 3) {
      spamScore += 0.2;
      indicators.push(`Excessive punctuation: ${exclamationCount} exclamations`);
    }

    // Check for all caps
    const capsRatio = message.replace(/[^A-Z]/g, '').length / message.length;
    if (capsRatio > 0.7 && message.length > 10) {
      spamScore += 0.3;
      indicators.push(`All caps: ${(capsRatio * 100).toFixed(0)}%`);
    }

    // Normalize score
    spamScore = Math.min(spamScore, 1);

    return {
      detected: spamScore > 0.5,
      score: spamScore,
      indicators,
      type: 'spam'
    };
  }

  /**
   * Detect bot behavior
   */
  async detectBot(message, userId, timestamp) {
    if (!userId) {
      return { detected: false, score: 0, indicators: [] };
    }

    // Get user's message history
    const userHistory = this.getUserHistory(userId);
    
    let botScore = 0;
    const indicators = [];

    // Check for repeated messages
    const repeatedCount = userHistory.filter(m => m.message === message).length;
    if (repeatedCount >= this.botPatterns.repeatedMessages) {
      botScore += 0.4;
      indicators.push(`Repeated message ${repeatedCount} times`);
    }

    // Check message frequency (rapid fire)
    const recentMessages = userHistory.filter(
      m => timestamp - m.timestamp < 1000
    );
    if (recentMessages.length >= this.botPatterns.rapidFire) {
      botScore += 0.5;
      indicators.push(`Rapid fire: ${recentMessages.length} msg/sec`);
    }

    // Check for random characters
    const randomRatio = this.calculateRandomness(message);
    if (randomRatio > this.botPatterns.randomChars) {
      botScore += 0.3;
      indicators.push(`Random characters: ${(randomRatio * 100).toFixed(0)}%`);
    }

    // Check for identical timing patterns
    const timingPattern = this.detectTimingPattern(userHistory);
    if (timingPattern) {
      botScore += 0.4;
      indicators.push('Identical timing pattern detected');
    }

    // Store message in history
    this.addToHistory(userId, { message, timestamp });

    // Normalize score
    botScore = Math.min(botScore, 1);

    return {
      detected: botScore > 0.6,
      score: botScore,
      indicators,
      type: 'bot'
    };
  }

  /**
   * Detect fraud
   */
  async detectFraud(message, context) {
    let fraudScore = 0;
    const indicators = [];

    // Check for suspicious keywords
    const fraudKeywords = [
      'bank account', 'credit card', 'ssn', 'social security',
      'password', 'pin', 'verify account', 'suspended',
      'urgent action', 'confirm identity'
    ];

    const messageLower = message.toLowerCase();
    fraudKeywords.forEach(keyword => {
      if (messageLower.includes(keyword)) {
        fraudScore += 0.3;
        indicators.push(`Suspicious keyword: ${keyword}`);
      }
    });

    // Check for phishing patterns
    if (/verify|confirm|update.*account/i.test(message)) {
      fraudScore += 0.4;
      indicators.push('Phishing pattern detected');
    }

    // Check IP/location mismatch (if available)
    if (context.ipMismatch) {
      fraudScore += 0.5;
      indicators.push('IP location mismatch');
    }

    // Normalize score
    fraudScore = Math.min(fraudScore, 1);

    return {
      detected: fraudScore > 0.5,
      score: fraudScore,
      indicators,
      type: 'fraud'
    };
  }

  /**
   * Detect abuse
   */
  async detectAbuse(message, context) {
    let abuseScore = 0;
    const indicators = [];

    // Check for profanity (basic list)
    const profanityPatterns = [
      /\b(fuck|shit|damn|hell|ass)\b/i,
      // Add more patterns as needed
    ];

    profanityPatterns.forEach(pattern => {
      if (pattern.test(message)) {
        abuseScore += 0.3;
        indicators.push('Profanity detected');
      }
    });

    // Check for threats or harassment
    const threatKeywords = ['kill', 'hurt', 'harm', 'threat', 'attack'];
    const messageLower = message.toLowerCase();
    
    threatKeywords.forEach(keyword => {
      if (messageLower.includes(keyword)) {
        abuseScore += 0.5;
        indicators.push(`Threat keyword: ${keyword}`);
      }
    });

    // Check for excessive negative sentiment (would integrate with sentiment analyzer)
    if (context.sentimentScore && context.sentimentScore < -0.8) {
      abuseScore += 0.3;
      indicators.push('Extremely negative sentiment');
    }

    // Normalize score
    abuseScore = Math.min(abuseScore, 1);

    return {
      detected: abuseScore > 0.6,
      score: abuseScore,
      indicators,
      type: 'abuse'
    };
  }

  /**
   * Detect unusual patterns
   */
  async detectUnusualPattern(userId, context) {
    if (!userId) {
      return { detected: false, score: 0, indicators: [] };
    }

    const baseline = this.userBaselines.get(userId);
    if (!baseline) {
      // No baseline yet, create one
      this.updateBaseline(userId, context);
      return { detected: false, score: 0, indicators: [] };
    }

    let unusualScore = 0;
    const indicators = [];

    // Check for unusual time of activity
    const hour = new Date().getHours();
    if (baseline.activeHours && !baseline.activeHours.includes(hour)) {
      unusualScore += 0.3;
      indicators.push(`Unusual activity time: ${hour}:00`);
    }

    // Check for unusual message volume
    const currentVolume = context.messagesLast24h || 0;
    if (currentVolume > baseline.avgDailyMessages * 3) {
      unusualScore += 0.4;
      indicators.push(`Message volume spike: ${currentVolume} vs avg ${baseline.avgDailyMessages}`);
    }

    // Check for unusual location (if available)
    if (context.location && baseline.locations) {
      if (!baseline.locations.includes(context.location)) {
        unusualScore += 0.4;
        indicators.push(`Unusual location: ${context.location}`);
      }
    }

    // Update baseline
    this.updateBaseline(userId, context);

    // Normalize score
    unusualScore = Math.min(unusualScore, 1);

    return {
      detected: unusualScore > 0.5,
      score: unusualScore,
      indicators,
      type: 'unusual_pattern'
    };
  }

  /**
   * Calculate randomness in text
   */
  calculateRandomness(text) {
    const words = text.split(/\s+/);
    let randomCount = 0;

    words.forEach(word => {
      // Check if word has unusual character patterns
      const hasNumbers = /\d/.test(word);
      const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(word);
      const repeatingChars = /(.)\1{3,}/.test(word);

      if ((hasNumbers && hasSpecialChars) || repeatingChars) {
        randomCount++;
      }
    });

    return words.length > 0 ? randomCount / words.length : 0;
  }

  /**
   * Detect timing pattern (bot behavior)
   */
  detectTimingPattern(history) {
    if (history.length < 5) return false;

    const intervals = [];
    for (let i = 1; i < history.length; i++) {
      intervals.push(history[i].timestamp - history[i-1].timestamp);
    }

    // Check if intervals are too consistent (bot-like)
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0
    ) / intervals.length;

    // Very low variance suggests automated behavior
    return variance < 100; // milliseconds
  }

  /**
   * Calculate overall severity
   */
  calculateSeverity(checks) {
    const maxScore = Math.max(...checks.map(c => c.score || 0));

    if (maxScore > 0.8) return 'critical';
    if (maxScore > 0.6) return 'high';
    if (maxScore > 0.4) return 'medium';
    if (maxScore > 0.2) return 'low';
    return 'none';
  }

  /**
   * Get recommended action
   */
  getRecommendedAction(checks, severity) {
    const actions = {
      critical: {
        action: 'block',
        description: 'Block user immediately and escalate to security team',
        automated: true
      },
      high: {
        action: 'flag',
        description: 'Flag for review and limit capabilities',
        automated: true
      },
      medium: {
        action: 'monitor',
        description: 'Monitor closely and track patterns',
        automated: true
      },
      low: {
        action: 'log',
        description: 'Log for analysis',
        automated: true
      },
      none: {
        action: 'allow',
        description: 'No action needed',
        automated: false
      }
    };

    // Override for specific types
    const spam = checks.find(c => c.type === 'spam');
    if (spam && spam.detected && spam.score > 0.8) {
      return {
        action: 'block',
        description: 'Block spam message',
        automated: true
      };
    }

    return actions[severity];
  }

  /**
   * Calculate confidence
   */
  calculateConfidence(checks) {
    const detectedCount = checks.filter(c => c.detected).length;
    const totalIndicators = checks.reduce((sum, c) => 
      sum + (c.indicators?.length || 0), 0
    );

    return Math.min((detectedCount * 0.3 + totalIndicators * 0.1), 1);
  }

  /**
   * Get user history
   */
  getUserHistory(userId) {
    if (!this.userHistory) {
      this.userHistory = new Map();
    }
    return this.userHistory.get(userId) || [];
  }

  /**
   * Add to history
   */
  addToHistory(userId, entry) {
    if (!this.userHistory) {
      this.userHistory = new Map();
    }
    
    const history = this.getUserHistory(userId);
    history.push(entry);
    
    // Keep only last 100 messages
    if (history.length > 100) {
      history.shift();
    }
    
    this.userHistory.set(userId, history);
  }

  /**
   * Update user baseline
   */
  updateBaseline(userId, context) {
    const baseline = this.userBaselines.get(userId) || {
      activeHours: [],
      avgDailyMessages: 0,
      locations: []
    };

    // Update active hours
    const hour = new Date().getHours();
    if (!baseline.activeHours.includes(hour)) {
      baseline.activeHours.push(hour);
    }

    // Update average daily messages
    if (context.messagesLast24h) {
      baseline.avgDailyMessages = 
        (baseline.avgDailyMessages * 0.8 + context.messagesLast24h * 0.2);
    }

    // Update locations
    if (context.location && !baseline.locations.includes(context.location)) {
      baseline.locations.push(context.location);
    }

    this.userBaselines.set(userId, baseline);
  }

  /**
   * Report false positive
   */
  reportFalsePositive() {
    this.stats.falsePositives++;
  }

  /**
   * Get analytics
   */
  getStats() {
    return {
      ...this.stats,
      accuracy: this.stats.totalChecks > 0
        ? ((this.stats.totalChecks - this.stats.falsePositives) / this.stats.totalChecks * 100).toFixed(1)
        : 100,
      anomalyRate: this.stats.totalChecks > 0
        ? (this.stats.anomaliesDetected / this.stats.totalChecks * 100).toFixed(1)
        : 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalChecks: 0,
      anomaliesDetected: 0,
      spamDetected: 0,
      botsDetected: 0,
      fraudDetected: 0,
      falsePositives: 0
    };
  }
}

module.exports = AnomalyDetector;
