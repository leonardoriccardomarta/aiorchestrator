const axios = require('axios');

class MultiGroqAIService {
  constructor() {
    // Multiple Groq API keys for rotation
    this.groqKeys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3
    ].filter(key => key); // Remove undefined keys
    
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.groqBaseUrl = 'https://api.groq.com/openai/v1';
    this.openaiBaseUrl = 'https://api.openai.com/v1';
    
    // Track usage per key
    this.keyUsage = {};
    this.groqKeys.forEach((key, index) => {
      this.keyUsage[`groq_${index + 1}`] = {
        requestsToday: 0,
        lastReset: new Date().toDateString()
      };
    });
    
    console.log(`✅ MultiGroqAIService initialized with ${this.groqKeys.length} Groq keys`);
  }

  resetDailyCounters() {
    const today = new Date().toDateString();
    Object.keys(this.keyUsage).forEach(key => {
      if (this.keyUsage[key].lastReset !== today) {
        this.keyUsage[key].requestsToday = 0;
        this.keyUsage[key].lastReset = today;
        console.log(`🔄 Reset counter for ${key}`);
      }
    });
  }

  logUsage() {
    this.resetDailyCounters();
    console.log('📊 Current API Usage:');
    Object.entries(this.keyUsage).forEach(([key, stats]) => {
      console.log(`  ${key}: ${stats.requestsToday}/14,400 requests today`);
    });
  }

  async generateResponse(message, context = {}) {
    try {
      this.resetDailyCounters();
      
      // Try each Groq key in sequence
      for (let i = 0; i < this.groqKeys.length; i++) {
        const keyName = `groq_${i + 1}`;
        const response = await this.tryGroqWithKey(message, context, this.groqKeys[i], keyName);
        
        if (response) {
          this.keyUsage[keyName].requestsToday++;
          console.log(`✅ Success with ${keyName} (${this.keyUsage[keyName].requestsToday}/14,400 today)`);
          return response;
        }
      }

      // All Groq keys exhausted, try OpenAI
      console.log('⚠️  All Groq keys exhausted, falling back to OpenAI');
      const openaiResponse = await this.tryOpenAI(message, context);
      if (openaiResponse) {
        return openaiResponse;
      }

      throw new Error('All AI services failed');
    } catch (error) {
      console.error('AI Service Error:', error);
      return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
    }
  }

  async tryGroqWithKey(message, context, apiKey, keyName) {
    if (!apiKey) {
      console.log(`${keyName} not configured`);
      return null;
    }

    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      const response = await axios.post(
        `${this.groqBaseUrl}/chat/completions`,
        {
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response?.status === 429) {
        console.log(`⚠️  ${keyName} rate limit reached`);
      } else {
        console.log(`❌ ${keyName} error:`, error.message);
      }
      return null;
    }
  }

  async tryOpenAI(message, context) {
    if (!this.openaiApiKey) {
      console.log('OpenAI API key not available');
      return null;
    }

    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      const response = await axios.post(
        `${this.openaiBaseUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      console.log('✅ OpenAI fallback successful');
      return response.data.choices[0].message.content;
    } catch (error) {
      console.log('❌ OpenAI error:', error.message);
      return null;
    }
  }

  buildSystemPrompt(context) {
    const basePrompt = `You are a helpful AI assistant for an e-commerce platform. 
You help customers with product inquiries, order information, and general support.
Be friendly, professional, and concise in your responses.`;

    if (context.language) {
      return `${basePrompt}\n\nRespond in ${context.language}.`;
    }

    return basePrompt;
  }

  // Get usage stats
  getUsageStats() {
    this.resetDailyCounters();
    
    const totalGroqRequests = Object.values(this.keyUsage)
      .reduce((sum, stats) => sum + stats.requestsToday, 0);
    
    const totalCapacity = this.groqKeys.length * 14400;
    const usagePercentage = (totalGroqRequests / totalCapacity * 100).toFixed(2);

    return {
      groqKeys: this.groqKeys.length,
      totalCapacity,
      totalUsed: totalGroqRequests,
      remaining: totalCapacity - totalGroqRequests,
      usagePercentage: `${usagePercentage}%`,
      perKey: this.keyUsage
    };
  }
}

module.exports = MultiGroqAIService;

