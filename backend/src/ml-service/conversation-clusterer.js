const natural = require('natural');

/**
 * Conversation Clusterer
 * Clusters conversations by topic and auto-generates FAQs
 * 
 * Features:
 * - Topic clustering
 * - FAQ auto-generation
 * - Question similarity detection
 * - Answer improvement suggestions
 */
class ConversationClusterer {
  constructor() {
    this.TfIdf = natural.TfIdf;
    this.tfidf = new this.TfIdf();
    this.tokenizer = new natural.WordTokenizer();
    
    // Conversation clusters
    this.clusters = new Map();
    
    // FAQ database
    this.faqs = [];

    // Stats
    this.stats = {
      totalConversations: 0,
      totalClusters: 0,
      totalFAQs: 0,
      averageClusterSize: 0
    };
  }

  /**
   * Cluster conversations by topic
   */
  async cluster(conversations) {
    if (!conversations || conversations.length === 0) {
      return { clusters: [], faqs: [] };
    }

    this.stats.totalConversations += conversations.length;

    // Prepare documents for TF-IDF
    const documents = conversations.map(conv => 
      `${conv.question} ${conv.answer}`.toLowerCase()
    );

    // Build TF-IDF model
    documents.forEach(doc => this.tfidf.addDocument(doc));

    // Extract key terms for each conversation
    const conversationsWithTerms = conversations.map((conv, idx) => {
      const terms = [];
      this.tfidf.listTerms(idx).slice(0, 5).forEach(item => {
        terms.push(item.term);
      });
      
      return {
        ...conv,
        index: idx,
        terms,
        vector: this.getTermVector(idx)
      };
    });

    // Perform clustering (simple k-means-like approach)
    const clusters = this.performClustering(conversationsWithTerms);

    // Generate FAQs from clusters
    const generatedFAQs = this.generateFAQsFromClusters(clusters);

    // Update stats
    this.stats.totalClusters = clusters.length;
    this.stats.totalFAQs = generatedFAQs.length;
    this.stats.averageClusterSize = 
      conversations.length / Math.max(clusters.length, 1);

    return {
      clusters,
      faqs: generatedFAQs,
      suggestions: this.getImprovementSuggestions(clusters)
    };
  }

  /**
   * Get term vector for document
   */
  getTermVector(docIndex) {
    const vector = {};
    this.tfidf.listTerms(docIndex).forEach(item => {
      vector[item.term] = item.tfidf;
    });
    return vector;
  }

  /**
   * Perform clustering
   */
  performClustering(conversations, maxClusters = 10) {
    if (conversations.length === 0) return [];

    // Start with each conversation as its own cluster
    const clusters = conversations.map(conv => ({
      id: `cluster_${conv.index}`,
      conversations: [conv],
      centroid: conv.vector,
      topTerms: conv.terms,
      topic: this.generateTopicName(conv.terms)
    }));

    // Merge similar clusters iteratively
    while (clusters.length > Math.min(maxClusters, conversations.length / 3)) {
      let minDistance = Infinity;
      let mergeIndices = [0, 1];

      // Find most similar clusters
      for (let i = 0; i < clusters.length - 1; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const distance = this.calculateClusterDistance(
            clusters[i],
            clusters[j]
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            mergeIndices = [i, j];
          }
        }
      }

      // Stop if clusters are too dissimilar
      if (minDistance > 0.7) break;

      // Merge clusters
      const [i, j] = mergeIndices;
      clusters[i].conversations.push(...clusters[j].conversations);
      clusters[i].centroid = this.updateCentroid(clusters[i].conversations);
      clusters[i].topTerms = this.extractTopTerms(clusters[i].conversations);
      clusters[i].topic = this.generateTopicName(clusters[i].topTerms);
      clusters.splice(j, 1);
    }

    return clusters.map((cluster, idx) => ({
      ...cluster,
      id: `cluster_${idx + 1}`,
      size: cluster.conversations.length,
      frequency: cluster.conversations.length / conversations.length
    }));
  }

  /**
   * Calculate distance between two clusters
   */
  calculateClusterDistance(cluster1, cluster2) {
    return this.cosineSimilarity(cluster1.centroid, cluster2.centroid);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vec1, vec2) {
    const terms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    terms.forEach(term => {
      const v1 = vec1[term] || 0;
      const v2 = vec2[term] || 0;
      dotProduct += v1 * v2;
      mag1 += v1 * v1;
      mag2 += v2 * v2;
    });

    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }

  /**
   * Update cluster centroid
   */
  updateCentroid(conversations) {
    const centroid = {};
    const count = conversations.length;

    conversations.forEach(conv => {
      Object.entries(conv.vector).forEach(([term, value]) => {
        centroid[term] = (centroid[term] || 0) + value;
      });
    });

    // Average
    Object.keys(centroid).forEach(term => {
      centroid[term] /= count;
    });

    return centroid;
  }

  /**
   * Extract top terms from conversations
   */
  extractTopTerms(conversations) {
    const termFreq = {};

    conversations.forEach(conv => {
      conv.terms.forEach(term => {
        termFreq[term] = (termFreq[term] || 0) + 1;
      });
    });

    return Object.entries(termFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([term]) => term);
  }

  /**
   * Generate topic name from terms
   */
  generateTopicName(terms) {
    if (!terms || terms.length === 0) return 'General Questions';

    const topicKeywords = {
      'order': 'Order & Shipping',
      'return': 'Returns & Refunds',
      'product': 'Product Information',
      'price': 'Pricing & Payment',
      'shipping': 'Shipping & Delivery',
      'payment': 'Payment Methods',
      'account': 'Account Management',
      'technical': 'Technical Support',
      'cancel': 'Cancellations'
    };

    for (const term of terms) {
      if (topicKeywords[term]) {
        return topicKeywords[term];
      }
    }

    // Generate from top terms
    return terms.slice(0, 2).join(' & ').toUpperCase();
  }

  /**
   * Generate FAQs from clusters
   */
  generateFAQsFromClusters(clusters) {
    const faqs = [];

    clusters.forEach(cluster => {
      if (cluster.conversations.length < 2) return; // Skip small clusters

      // Find most representative question
      const representative = this.findRepresentativeQuestion(cluster);

      // Generate answer
      const answer = this.generateAnswer(cluster);

      // Find similar questions
      const similarQuestions = cluster.conversations
        .filter(c => c.question !== representative.question)
        .map(c => c.question)
        .slice(0, 3);

      faqs.push({
        id: `faq_${cluster.id}`,
        topic: cluster.topic,
        question: representative.question,
        answer,
        similarQuestions,
        frequency: cluster.frequency,
        confidence: this.calculateFAQConfidence(cluster),
        sources: cluster.conversations.length
      });
    });

    return faqs.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Find most representative question in cluster
   */
  findRepresentativeQuestion(cluster) {
    // Find question closest to centroid
    let minDistance = Infinity;
    let representative = cluster.conversations[0];

    cluster.conversations.forEach(conv => {
      const distance = 1 - this.cosineSimilarity(conv.vector, cluster.centroid);
      if (distance < minDistance) {
        minDistance = distance;
        representative = conv;
      }
    });

    return representative;
  }

  /**
   * Generate answer from cluster
   */
  generateAnswer(cluster) {
    // Use most common answer or combine insights
    const answers = cluster.conversations.map(c => c.answer);
    
    // Simple approach: use answer from representative conversation
    const representative = this.findRepresentativeQuestion(cluster);
    
    return representative.answer || 
      'Our team will provide detailed information about this topic.';
  }

  /**
   * Calculate FAQ confidence score
   */
  calculateFAQConfidence(cluster) {
    // Confidence based on cluster size and cohesion
    const sizeFactor = Math.min(cluster.conversations.length / 10, 1);
    const cohesionFactor = 0.8; // Could calculate actual cohesion

    return (sizeFactor * 0.6 + cohesionFactor * 0.4);
  }

  /**
   * Get improvement suggestions
   */
  getImprovementSuggestions(clusters) {
    const suggestions = [];

    clusters.forEach(cluster => {
      if (cluster.conversations.length > 10) {
        suggestions.push({
          type: 'high_frequency_topic',
          cluster: cluster.id,
          topic: cluster.topic,
          message: `This topic appears frequently (${cluster.conversations.length} times). Consider creating dedicated help content.`,
          priority: 'high'
        });
      }

      if (cluster.conversations.length === 1) {
        suggestions.push({
          type: 'unique_question',
          cluster: cluster.id,
          topic: cluster.topic,
          message: 'Unique question that might need special attention.',
          priority: 'low'
        });
      }
    });

    return suggestions;
  }

  /**
   * Get analytics
   */
  getStats() {
    return {
      ...this.stats,
      avgQuestionsPerCluster: this.stats.totalClusters > 0
        ? (this.stats.totalConversations / this.stats.totalClusters).toFixed(1)
        : 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalConversations: 0,
      totalClusters: 0,
      totalFAQs: 0,
      averageClusterSize: 0
    };
  }
}

module.exports = ConversationClusterer;
