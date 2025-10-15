const axios = require('axios');
const cheerio = require('cheerio'); // Will need to install this

/**
 * Universal Embed Service
 * Advanced features for non-Shopify embedded chatbots
 * - Website Content Scraping
 * - FAQ Auto-Import
 * - Context Awareness (current page)
 * - Intelligent Lead Capture
 */
class UniversalEmbedService {
  constructor() {
    this.websiteCache = new Map();
    this.faqCache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * 1. WEBSITE CONTENT SCRAPING
   * Extract and index website content for better responses
   */
  async scrapeWebsiteContent(url, options = {}) {
    try {
      console.log('🕷️ Scraping website:', url);
      
      const cacheKey = `website_${url}`;
      
      // Check cache
      if (this.websiteCache.has(cacheKey)) {
        const cached = this.websiteCache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('✅ Using cached website content');
          return cached.data;
        }
      }
      
      // Fetch website
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'AI-Orchestrator-Bot/1.0 (Website Analysis)',
          'Accept': 'text/html,application/xhtml+xml'
        },
        maxRedirects: 5
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract metadata
      const title = $('title').text() || $('h1').first().text() || '';
      const description = $('meta[name="description"]').attr('content') || '';
      const keywords = $('meta[name="keywords"]').attr('content') || '';
      
      // Extract main content (remove scripts, styles, nav, footer)
      $('script, style, nav, footer, header[role="banner"], aside').remove();
      
      // Get text content from main areas
      const mainContent = [];
      
      // Prioritize main content areas
      const contentSelectors = ['main', 'article', '[role="main"]', '.content', '#content', 'body'];
      
      for (const selector of contentSelectors) {
        const content = $(selector).first();
        if (content.length > 0) {
          // Extract headings and paragraphs
          content.find('h1, h2, h3, h4, p').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text.length > 20) {
              mainContent.push({
                type: elem.name,
                text: text,
                importance: elem.name.startsWith('h') ? parseInt(elem.name[1]) : 5
              });
            }
          });
          break;
        }
      }
      
      // Extract links (for navigation context)
      const links = [];
      $('a[href]').each((i, elem) => {
        const href = $(elem).attr('href');
        const text = $(elem).text().trim();
        if (text && href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          links.push({
            url: this.resolveUrl(url, href),
            text: text
          });
        }
      });
      
      // Detect FAQ sections
      const faqs = this.extractFAQs($, url);
      
      // Detect contact information
      const contactInfo = this.extractContactInfo($);
      
      // Build searchable index
      const searchableContent = mainContent
        .map(c => c.text)
        .join(' ')
        .toLowerCase();
      
      const result = {
        url,
        title,
        description,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        mainContent: mainContent.slice(0, 50), // Limit to first 50 items
        links: links.slice(0, 20), // Limit to 20 links
        faqs,
        contactInfo,
        searchableContent,
        scrapedAt: new Date().toISOString()
      };
      
      // Cache result
      this.websiteCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      console.log('✅ Website scraped successfully:', {
        title,
        contentItems: mainContent.length,
        faqs: faqs.length,
        links: links.length
      });
      
      return result;
    } catch (error) {
      console.error('❌ Website scraping error:', error.message);
      return {
        success: false,
        error: error.message,
        url
      };
    }
  }

  /**
   * 2. FAQ AUTO-IMPORT
   * Automatically extract and format FAQs from website
   */
  extractFAQs($, baseUrl) {
    const faqs = [];
    
    // Common FAQ patterns
    const faqPatterns = [
      { question: 'dt', answer: 'dd' },
      { question: '.faq-question', answer: '.faq-answer' },
      { question: '.question', answer: '.answer' },
      { question: '[class*="question"]', answer: '[class*="answer"]' },
      { question: 'h3, h4', answer: 'p' }
    ];
    
    // Try each pattern
    for (const pattern of faqPatterns) {
      $(pattern.question).each((i, elem) => {
        const question = $(elem).text().trim();
        if (question.endsWith('?') && question.length > 10) {
          // Find corresponding answer
          let answer = '';
          if (pattern.answer) {
            const answerElem = $(elem).next(pattern.answer);
            answer = answerElem.text().trim();
          }
          
          if (answer.length > 10) {
            faqs.push({
              question,
              answer,
              source: baseUrl
            });
          }
        }
      });
      
      if (faqs.length > 0) break; // Stop if we found FAQs
    }
    
    return faqs;
  }

  /**
   * Extract contact information
   */
  extractContactInfo($) {
    const contactInfo = {
      emails: [],
      phones: [],
      addresses: []
    };
    
    // Extract emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    $('body').text().match(emailRegex)?.forEach(email => {
      if (!contactInfo.emails.includes(email) && !email.includes('example')) {
        contactInfo.emails.push(email);
      }
    });
    
    // Extract phone numbers (simple patterns)
    const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g;
    $('body').text().match(phoneRegex)?.forEach(phone => {
      if (!contactInfo.phones.includes(phone)) {
        contactInfo.phones.push(phone);
      }
    });
    
    // Limit to first 3 of each
    contactInfo.emails = contactInfo.emails.slice(0, 3);
    contactInfo.phones = contactInfo.phones.slice(0, 3);
    
    return contactInfo;
  }

  /**
   * 3. CONTEXT AWARENESS
   * Understand which page the user is on for relevant responses
   */
  async analyzePageContext(pageUrl, pageTitle, chatHistory = []) {
    try {
      console.log('🔍 Analyzing page context:', pageUrl);
      
      // Parse URL to understand context
      const urlObj = new URL(pageUrl);
      const path = urlObj.pathname;
      const pageName = path.split('/').filter(p => p).pop() || 'home';
      
      // Determine page type
      let pageType = 'general';
      let pageIntent = 'browse';
      
      if (path.includes('product') || path.includes('item') || path.includes('shop')) {
        pageType = 'product';
        pageIntent = 'purchase';
      } else if (path.includes('cart') || path.includes('checkout')) {
        pageType = 'checkout';
        pageIntent = 'purchase_ready';
      } else if (path.includes('about') || path.includes('team')) {
        pageType = 'about';
        pageIntent = 'learn_more';
      } else if (path.includes('contact') || path.includes('support')) {
        pageType = 'support';
        pageIntent = 'get_help';
      } else if (path.includes('blog') || path.includes('article')) {
        pageType = 'content';
        pageIntent = 'read';
      } else if (path.includes('pricing') || path.includes('plans')) {
        pageType = 'pricing';
        pageIntent = 'evaluate';
      }
      
      // Analyze chat history for user journey
      const userJourney = this.analyzeUserJourney(chatHistory);
      
      // Generate contextual greeting
      const greeting = this.generateContextualGreeting(pageType, pageIntent, pageTitle);
      
      // Suggest relevant questions
      const suggestedQuestions = this.generateSuggestedQuestions(pageType, pageIntent);
      
      return {
        success: true,
        context: {
          url: pageUrl,
          title: pageTitle,
          pageName,
          pageType,
          pageIntent,
          userJourney,
          greeting,
          suggestedQuestions
        }
      };
    } catch (error) {
      console.error('❌ Page context analysis error:', error.message);
      return {
        success: false,
        context: {
          pageType: 'general',
          greeting: 'Hi! How can I help you today?'
        }
      };
    }
  }

  /**
   * 4. INTELLIGENT LEAD CAPTURE
   * Smart form for collecting user information
   */
  generateLeadCaptureForm(context = {}) {
    const { intent = 'general', previousMessages = [] } = context;
    
    // Determine which fields to ask for based on context
    const fields = [];
    
    // Always ask for name and email
    fields.push({
      id: 'name',
      label: 'Your Name',
      type: 'text',
      required: true,
      placeholder: 'John Doe'
    });
    
    fields.push({
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'john@example.com'
    });
    
    // Add phone for urgent requests
    if (intent === 'urgent' || intent === 'callback') {
      fields.push({
        id: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: false,
        placeholder: '+1 (555) 123-4567'
      });
    }
    
    // Add company for B2B
    if (intent === 'demo' || intent === 'enterprise') {
      fields.push({
        id: 'company',
        label: 'Company Name',
        type: 'text',
        required: false,
        placeholder: 'Acme Inc.'
      });
    }
    
    // Add message field
    fields.push({
      id: 'message',
      label: 'How can we help?',
      type: 'textarea',
      required: false,
      placeholder: 'Tell us more about your needs...',
      rows: 4
    });
    
    return {
      title: this.getLeadCaptureTitle(intent),
      description: this.getLeadCaptureDescription(intent),
      fields,
      submitButtonText: 'Send Message',
      privacyNotice: 'We respect your privacy and will never share your information.'
    };
  }

  /**
   * Process lead submission
   */
  async processLeadSubmission(data, chatbotId) {
    try {
      console.log('📧 Processing lead submission:', data.email);
      
      // Validate data
      if (!data.email || !data.name) {
        return {
          success: false,
          error: 'Name and email are required'
        };
      }
      
      // TODO: Store in database (add to Prisma schema)
      // For now, just return success
      
      return {
        success: true,
        message: 'Thank you! We\'ve received your information and will get back to you soon.',
        leadId: `lead_${Date.now()}`
      };
    } catch (error) {
      console.error('❌ Lead processing error:', error.message);
      return {
        success: false,
        error: 'Failed to process your submission. Please try again.'
      };
    }
  }

  /**
   * Search website content for relevant information
   */
  searchWebsiteContent(websiteData, query) {
    try {
      if (!websiteData || !websiteData.mainContent) {
        return {
          success: false,
          results: []
        };
      }
      
      const queryLower = query.toLowerCase();
      const keywords = queryLower.split(' ').filter(w => w.length > 2);
      
      // Search in main content
      const results = [];
      
      websiteData.mainContent.forEach(content => {
        let relevanceScore = 0;
        const textLower = content.text.toLowerCase();
        
        keywords.forEach(keyword => {
          if (textLower.includes(keyword)) {
            relevanceScore += content.importance === 1 ? 10 : // h1
                            content.importance === 2 ? 5 :  // h2
                            content.importance === 3 ? 3 :  // h3
                            1; // p
          }
        });
        
        if (relevanceScore > 0) {
          results.push({
            text: content.text,
            type: content.type,
            relevanceScore
          });
        }
      });
      
      // Search in FAQs
      websiteData.faqs?.forEach(faq => {
        let relevanceScore = 0;
        const questionLower = faq.question.toLowerCase();
        const answerLower = faq.answer.toLowerCase();
        
        keywords.forEach(keyword => {
          if (questionLower.includes(keyword)) relevanceScore += 10;
          if (answerLower.includes(keyword)) relevanceScore += 5;
        });
        
        if (relevanceScore > 0) {
          results.push({
            text: `Q: ${faq.question}\nA: ${faq.answer}`,
            type: 'faq',
            relevanceScore
          });
        }
      });
      
      // Sort by relevance
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      return {
        success: true,
        results: results.slice(0, 5) // Top 5 results
      };
    } catch (error) {
      console.error('❌ Content search error:', error.message);
      return {
        success: false,
        results: []
      };
    }
  }

  // ============ HELPER METHODS ============

  resolveUrl(baseUrl, relativeUrl) {
    try {
      return new URL(relativeUrl, baseUrl).href;
    } catch {
      return relativeUrl;
    }
  }

  analyzeUserJourney(chatHistory) {
    if (!chatHistory || chatHistory.length === 0) {
      return { stage: 'initial', messageCount: 0 };
    }
    
    const messageCount = chatHistory.length;
    let stage = 'initial';
    
    if (messageCount >= 5) stage = 'engaged';
    if (messageCount >= 10) stage = 'highly_engaged';
    
    // Look for buying signals
    const buyingKeywords = ['price', 'cost', 'buy', 'purchase', 'order', 'checkout'];
    const hasBuyingSignal = chatHistory.some(msg => 
      buyingKeywords.some(keyword => msg.toLowerCase().includes(keyword))
    );
    
    if (hasBuyingSignal) stage = 'ready_to_convert';
    
    return { stage, messageCount, hasBuyingSignal };
  }

  generateContextualGreeting(pageType, pageIntent, pageTitle) {
    const greetings = {
      product: "👋 Hi! I see you're checking out this product. Need any help or have questions?",
      checkout: "💳 Hi! Ready to complete your order? I'm here if you need any assistance!",
      pricing: "💰 Hi! Looking at our pricing? I'd be happy to help you choose the right plan!",
      support: "🤝 Hi! How can I help you today? I'm here to assist!",
      about: `👋 Welcome! Interested in learning more about ${pageTitle || 'us'}? Ask me anything!`,
      content: "📖 Hi! Enjoying the article? Let me know if you have any questions!",
      general: "👋 Hi! How can I help you today?"
    };
    
    return greetings[pageType] || greetings.general;
  }

  generateSuggestedQuestions(pageType, pageIntent) {
    const suggestions = {
      product: [
        "Is this in stock?",
        "What are the shipping options?",
        "Do you have a return policy?",
        "Are there any discounts available?"
      ],
      checkout: [
        "What payment methods do you accept?",
        "How long does shipping take?",
        "Can I track my order?",
        "Do you ship internationally?"
      ],
      pricing: [
        "What's included in each plan?",
        "Is there a free trial?",
        "Can I upgrade later?",
        "Do you offer discounts for annual plans?"
      ],
      support: [
        "How can I contact support?",
        "What are your hours?",
        "Do you have a phone number?",
        "How do I reset my password?"
      ],
      about: [
        "What services do you offer?",
        "Where are you located?",
        "How long have you been in business?",
        "Who is your target customer?"
      ],
      general: [
        "What services do you offer?",
        "How can I contact you?",
        "Do you have any special offers?",
        "Where are you located?"
      ]
    };
    
    return suggestions[pageType] || suggestions.general;
  }

  getLeadCaptureTitle(intent) {
    const titles = {
      demo: '📅 Schedule a Demo',
      callback: '📞 Request a Callback',
      urgent: '🚨 Urgent Inquiry',
      quote: '💰 Get a Quote',
      general: '💬 Get in Touch'
    };
    return titles[intent] || titles.general;
  }

  getLeadCaptureDescription(intent) {
    const descriptions = {
      demo: 'Fill out this quick form and we\'ll schedule a personalized demo for you!',
      callback: 'Leave your details and we\'ll call you back as soon as possible.',
      urgent: 'We\'ve noted this as urgent. Leave your details and we\'ll prioritize your request.',
      quote: 'Tell us about your needs and we\'ll prepare a custom quote for you.',
      general: 'We\'d love to hear from you! Fill out this form and we\'ll get back to you soon.'
    };
    return descriptions[intent] || descriptions.general;
  }
}

module.exports = UniversalEmbedService;

