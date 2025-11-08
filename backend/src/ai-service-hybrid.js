const axios = require('axios');

class HybridAIService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.groqBaseUrl = 'https://api.groq.com/openai/v1';
    this.openaiBaseUrl = 'https://api.openai.com/v1';
    
    // Language detection patterns
    this.languagePatterns = {
      'en': ['hello', 'hi', 'thanks', 'perfect', 'how', 'what', 'features', 'help', 'can you', 'how can'],
      'it': ['ciao', 'buongiorno', 'grazie', 'perfetto', 'come', 'che', 'funzionalità', 'aiuto', 'puoi', 'come puoi'],
      'es': ['hola', 'buenos', 'gracias', 'perfecto', 'como', 'que', 'funciones', 'ayuda', 'puedes', 'como puedes'],
      'de': ['hallo', 'guten', 'danke', 'perfekt', 'wie', 'was', 'funktionen', 'hilfe', 'kannst', 'wie kannst'],
      'fr': ['bonjour', 'bonsoir', 'merci', 'parfait', 'comment', 'que', 'fonctionnalités', 'aide', 'peux', 'comment peux'],
      'sv': ['hej', 'god morgon', 'tack', 'perfekt', 'hur', 'vad', 'funktioner', 'hjälp', 'kan du', 'hur kan'],
      'zh': ['你好', '谢谢', '完美', '怎么', '什么', '功能', '帮助', '可以', '怎么可以'],
      'ja': ['こんにちは', 'ありがとう', '完璧', 'どう', '何', '機能', '助け', 'できます', 'どうできます'],
      'ko': ['안녕', '감사', '완벽', '어떻게', '무엇', '기능', '도움', '할 수', '어떻게 할 수'],
      'ar': ['مرحبا', 'شكرا', 'مثالي', 'كيف', 'ماذا', 'وظائف', 'مساعدة', 'يمكنك', 'كيف يمكنك'],
      'hi': ['नमस्ते', 'धन्यवाद', 'परफेक्ट', 'कैसे', 'क्या', 'फंक्शन्स', 'मदद', 'कर सकते हैं', 'कैसे कर सकते हैं'],
      'ru': ['привет', 'спасибо', 'отлично', 'как', 'что', 'функции', 'помощь', 'можешь', 'как можешь'],
      'pt': ['olá', 'bom dia', 'obrigado', 'perfeito', 'como', 'que', 'funcionalidades', 'ajuda', 'podes', 'como podes'],
      'nl': ['hallo', 'goedemorgen', 'dank je', 'perfect', 'hoe', 'wat', 'functionaliteiten', 'hulp', 'kun je', 'hoe kun je'],
      'tr': ['merhaba', 'teşekkürler', 'mükemmel', 'nasıl', 'ne', 'fonksiyonlar', 'yardım', 'yapabilirsin', 'nasıl yapabilirsin']
    };
  }

  detectLanguage(text) {
    if (!text || typeof text !== 'string') {
      return 'en';
    }
    const lowerText = text.toLowerCase();
    
    // Check for language requests first
    const languageRequests = {
      'en': ['speak english', 'talk english', 'english please'],
      'it': ['parla italiano', 'speak italian', 'italiano per favore'],
      'es': ['habla español', 'speak spanish', 'español por favor'],
      'de': ['sprechen sie deutsch', 'speak german', 'deutsch bitte'],
      'fr': ['parlez français', 'speak french', 'français s\'il vous plaît'],
      'sv': ['prata svenska', 'speak swedish', 'svenska tack'],
      'zh': ['说中文', 'speak chinese', '中文请'],
      'ja': ['日本語で話す', 'speak japanese', '日本語お願い'],
      'ko': ['한국어로 말하기', 'speak korean', '한국어 부탁'],
      'ar': ['تحدث العربية', 'speak arabic', 'العربية من فضلك'],
      'hi': ['हिन्दी बोलना', 'speak hindi', 'हिन्दी कृपया'],
      'ru': ['говорить по-русски', 'speak russian', 'русский пожалуйста'],
      'pt': ['falar português', 'speak portuguese', 'português por favor'],
      'nl': ['spreek nederlands', 'speak dutch', 'nederlands alsjeblieft'],
      'tr': ['türkçe konuş', 'speak turkish', 'türkçe lütfen']
    };

    for (const [langCode, patterns] of Object.entries(languageRequests)) {
      for (const pattern of patterns) {
        if (lowerText.includes(pattern.toLowerCase())) {
          return langCode;
        }
      }
    }
    
    // Then check for language content patterns
    for (const [langCode, patterns] of Object.entries(this.languagePatterns)) {
      for (const pattern of patterns) {
        if (lowerText.includes(pattern.toLowerCase())) {
          return langCode;
        }
      }
    }
    
    // Check for flag emojis
    const flagEmojis = {
      '🇬🇧': 'en', '🇺🇸': 'en', '🇮🇹': 'it', '🇪🇸': 'es', '🇩🇪': 'de', '🇫🇷': 'fr',
      '🇸🇪': 'sv', '🇨🇳': 'zh', '🇯🇵': 'ja', '🇰🇷': 'ko', '🇸🇦': 'ar', '🇮🇳': 'hi',
      '🇷🇺': 'ru', '🇵🇹': 'pt', '🇳🇱': 'nl', '🇹🇷': 'tr', '🇧🇷': 'pt', '🇲🇽': 'es'
    };

    for (const [flag, langCode] of Object.entries(flagEmojis)) {
      if (text.includes(flag)) {
        return langCode;
      }
    }
    
    // Default to English
    return 'en';
  }

  getLanguageInfo(langCode) {
    const languageNames = {
      'en': 'English', 'it': 'Italian', 'es': 'Spanish', 'de': 'German', 'fr': 'French',
      'sv': 'Swedish', 'zh': 'Chinese', 'ja': 'Japanese', 'ko': 'Korean', 'ar': 'Arabic',
      'hi': 'Hindi', 'ru': 'Russian', 'pt': 'Portuguese', 'nl': 'Dutch', 'tr': 'Turkish'
    };
    
    return {
      code: langCode,
      name: languageNames[langCode] || 'English',
      isRTL: ['ar', 'he', 'fa', 'ur'].includes(langCode)
    };
  }

  async generateResponse(message, context = {}) {
    try {
      // Detect or enforce language first
      const detectedLanguage = context.forceLanguage || this.detectLanguage(message);
      console.log(`Detected language: ${detectedLanguage}${context.forceLanguage ? ' (forced)' : ''}`);
      
      // Update context with language info
      const enhancedContext = {
        ...context,
        detectedLanguage,
        languageInfo: this.getLanguageInfo(detectedLanguage)
      };

      // Try Groq first (primary)
      const groqResponse = await this.tryGroq(message, enhancedContext);
      if (groqResponse) {
        return groqResponse;
      }

      // Fallback to OpenAI
      const openaiResponse = await this.tryOpenAI(message, enhancedContext);
      if (openaiResponse) {
        return openaiResponse;
      }

      throw new Error('Both AI services failed');
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        response: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
        detectedLanguage: 'en'
      };
    }
  }

  async tryGroq(message, context) {
    if (!this.groqApiKey) {
      console.log('Groq API key not available');
      return null;
    }

    try {
      // Use provided systemPrompt if available, otherwise build default
      const systemPrompt = context.systemPrompt || this.buildSystemPrompt(context);
      
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
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return {
        response: response.data.choices[0].message.content,
        detectedLanguage: context.detectedLanguage
      };
    } catch (error) {
      console.log('Groq API Error:', error.message);
      return null;
    }
  }

  async tryOpenAI(message, context) {
    if (!this.openaiApiKey) {
      console.log('OpenAI API key not available');
      return null;
    }

    try {
      // Use provided systemPrompt if available, otherwise build default
      const systemPrompt = context.systemPrompt || this.buildSystemPrompt(context);
      
      const response = await axios.post(
        `${this.openaiBaseUrl}/chat/completions`,
        {
          model: 'gpt-4',
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

      return {
        response: response.data.choices[0].message.content,
        detectedLanguage: context.detectedLanguage
      };
    } catch (error) {
      console.log('OpenAI API Error:', error.message);
      return null;
    }
  }

  buildSystemPrompt(context) {
    const detectedLanguage = context.detectedLanguage || 'en';
    const languageInfo = context.languageInfo || this.getLanguageInfo(detectedLanguage);
    
    // Debug logging
    console.log('🔍 Universal Language Detection:', {
      detectedLanguage: detectedLanguage,
      languageInfo: languageInfo
    });
    
    const languageInstructions = {
      'it': 'Rispondi SEMPRE in italiano. Mantieni la conversazione in italiano per tutta la durata della chat. Non cambiare mai lingua.',
      'es': 'Responde SIEMPRE en español. Mantén la conversación en español durante toda la duración del chat. Nunca cambies de idioma.',
      'fr': 'Réponds TOUJOURS en français. Maintiens la conversation en français pendant toute la durée du chat. Ne change jamais de langue.',
      'de': 'Antworte IMMER auf Deutsch. Halte die Unterhaltung während der gesamten Chat-Dauer auf Deutsch. Ändere niemals die Sprache.',
      'sv': 'Svara ALLTID på svenska. Håll konversationen på svenska under hela chattens varaktighet. Ändra aldrig språk.',
      'zh': '总是用中文回答。在整个聊天过程中保持中文对话。永远不要改变语言。',
      'ja': '常に日本語で答えてください。チャット全体を通じて日本語での会話を維持してください。決して言語を変えないでください。',
      'ko': '항상 한국어로 답변하세요. 전체 채팅 동안 한국어 대화를 유지하세요. 절대 언어를 바꾸지 마세요.',
      'ar': 'أجب دائماً بالعربية. حافظ على المحادثة بالعربية طوال مدة الدردشة. لا تغير اللغة أبداً.',
      'hi': 'हमेशा हिन्दी में जवाब दें। पूरी चैट के दौरान हिन्दी बातचीत बनाए रखें। कभी भी भाषा न बदलें।',
      'ru': 'Отвечай ВСЕГДА на русском языке. Поддерживай разговор на русском языке в течение всего чата. Никогда не меняй язык.',
      'pt': 'Responda SEMPRE em português. Mantenha a conversa em português durante toda a duração do chat. Nunca mude de idioma.',
      'nl': 'Antwoord ALTIJD in het Nederlands. Houd de conversatie in het Nederlands gedurende de hele chat. Verander nooit van taal.',
      'tr': 'Her zaman Türkçe cevap ver. Tüm sohbet boyunca Türkçe konuşmayı sürdür. Asla dil değiştirme.',
      'en': 'Always respond in English. Maintain the conversation in English throughout the entire chat. Never change languages.'
    };
    
    const languageInstruction = languageInstructions[detectedLanguage] || languageInstructions['en'];

    const basePrompt = `You are an AI assistant for AI Orchestrator, an e-commerce chatbot platform.

CRITICAL LANGUAGE RULE: ${languageInstruction}

EXACT PRICING AND LIMITS (MEMORIZE - NEVER DEVIATE):

Starter Plan - $29/month:
• 1 AI chatbot
• 5,000 messages per month
• 1 website integration
• 50+ languages included
• 7-day free trial (no credit card)
• Email support

Professional Plan - $99/month:
• 2 AI chatbots  
• 25,000 messages per month
• 2 website integrations
• 50+ languages included
• Priority support
• Advanced analytics
• Custom branding

Enterprise Plan - $299/month:
• 3 AI chatbots
• 100,000 messages per month
• 3 website integrations
• 50+ languages included
• Dedicated support
• API access
• White-label options
• SLA guarantee

CRITICAL: These are the ONLY plans. Do NOT say "unlimited", do NOT invent custom pricing, do NOT change message limits (NOT 10K, NOT 50K, NOT "unlimited"). The limits are EXACTLY: 5K, 25K, 100K messages.

KEY FEATURES:
- 50+ languages (automatic detection, no setup)
- 24/7 availability
- 5-minute setup (copy-paste embed code)
- Shopify & WooCommerce one-click integration
- Real-time analytics
- Powered by Groq AI (fast responses)

DIFFERENCE BETWEEN PLANS:
Starter → Pro: +1 chatbot, +20K messages, +1 website, priority support
Pro → Enterprise: +1 chatbot, +75K messages, +1 website, dedicated support, API access

🆕 ORDER TRACKING CAPABILITIES:
- If user asks about order status (e.g., "Where is my order #1234?"), acknowledge and say you're checking
- Extract order number from message (look for # followed by numbers, or just numbers)
- Inform: "Let me check the status of order #[NUMBER] for you..."
- In production, order info will be fetched automatically via API
- Provide helpful info about tracking: "You can track your order with the tracking number once it ships"

🆕 LIVE AGENT HANDOFF:
- If you cannot help or user seems frustrated, offer to connect to a human agent
- Watch for keywords: "speak to human", "real person", "agent", "representative", "manager", "not helpful"
- Offer: "Would you like me to connect you with one of our support specialists? They can help you further."
- If user confirms, respond: "Connecting you to a live agent now. One moment please..."
- Be proactive: if same question asked 3 times, suggest human agent

WHEN TO OFFER LIVE AGENT:
- Complex billing issues
- Account-specific problems  
- Refund requests
- Technical integration help
- Frustrated or angry customer (detected by tone)
- User explicitly asks for human

Always be accurate about pricing and limits. Never invent features or prices. If unsure, say "check our pricing page at /pricing".`;

    return basePrompt;
  }
}

module.exports = HybridAIService;