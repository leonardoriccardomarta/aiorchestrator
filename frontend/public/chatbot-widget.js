/**
 * AI Orchestrator Chatbot Widget
 * Version: 3.0.0 - LIVE PREVIEW EXACT MATCH
 * 
 * This widget is now IDENTICAL to the live preview shown in the dashboard.
 * Uses Tailwind CSS CDN for styling consistency.
 */

(function() {
  'use strict';

  console.log('🚀 AI Orchestrator Widget v3.0 - Live Preview Match');

  // Get configuration from script tag or global config
  function getConfig() {
    // Try script tag first
    const script = document.querySelector('script[data-chatbot-id]') || 
                   document.querySelector('script[data-ai-orchestrator-id]');
    
    if (script) {
      const config = {
        chatbotId: script.dataset.chatbotId || script.dataset.aiOrchestratorId,
        apiKey: script.dataset.apiKey || 'https://aiorchestrator-vtihz.ondigitalocean.app',
        theme: script.dataset.theme || 'teal',
        title: script.dataset.title || 'AI Support',
        welcomeMessage: script.dataset.welcomeMessage || 'Hi! I'm your AI support assistant. How can I help you today? 👋',
        placeholder: script.dataset.placeholder || 'Type your message...',
        showAvatar: script.dataset.showAvatar !== 'false',
        primaryLanguage: script.dataset.primaryLanguage || script.dataset['primary-language'] || 'en',
        autoOpen: script.dataset.autoOpen === 'true'
      };
      
      console.log('✅ Config loaded from script tag:', config);
      return config;
  }

    // Fallback to window config
    if (window.AIChatbotConfig) {
      console.log('✅ Config loaded from window.AIChatbotConfig');
      return {
        chatbotId: window.AIChatbotConfig.chatbotId,
        apiKey: window.AIChatbotConfig.apiKey || 'https://aiorchestrator-vtihz.ondigitalocean.app',
        theme: window.AIChatbotConfig.theme || 'teal',
        title: window.AIChatbotConfig.title || 'AI Support',
        welcomeMessage: window.AIChatbotConfig.welcomeMessage || 'Hi! I'm your AI support assistant. How can I help you today? 👋',
        placeholder: window.AIChatbotConfig.placeholder || 'Type your message...',
        showAvatar: window.AIChatbotConfig.showAvatar !== false,
        primaryLanguage: window.AIChatbotConfig.primaryLanguage || 'en',
        autoOpen: window.AIChatbotConfig.autoOpen === true
      };
    }

    console.error('❌ No configuration found');
    return null;
  }

  // Theme colors matching live preview
  const themes = {
    blue: { primary: 'from-blue-600 to-blue-700', secondary: 'from-blue-50 to-blue-100', accent: 'bg-blue-600', text: 'text-blue-900', border: 'border-blue-200', userMessage: 'bg-blue-600' },
    purple: { primary: 'from-purple-600 to-purple-700', secondary: 'from-purple-50 to-purple-100', accent: 'bg-purple-600', text: 'text-purple-900', border: 'border-purple-200', userMessage: 'bg-purple-600' },
    green: { primary: 'from-green-600 to-green-700', secondary: 'from-green-50 to-green-100', accent: 'bg-green-600', text: 'text-green-900', border: 'border-green-200', userMessage: 'bg-green-600' },
    red: { primary: 'from-red-600 to-red-700', secondary: 'from-red-50 to-red-100', accent: 'bg-red-600', text: 'text-red-900', border: 'border-red-200', userMessage: 'bg-red-600' },
    orange: { primary: 'from-orange-600 to-orange-700', secondary: 'from-orange-50 to-orange-100', accent: 'bg-orange-600', text: 'text-orange-900', border: 'border-orange-200', userMessage: 'bg-orange-600' },
    pink: { primary: 'from-pink-600 to-pink-700', secondary: 'from-pink-50 to-pink-100', accent: 'bg-pink-600', text: 'text-pink-900', border: 'border-pink-200', userMessage: 'bg-pink-600' },
    indigo: { primary: 'from-indigo-600 to-indigo-700', secondary: 'from-indigo-50 to-indigo-100', accent: 'bg-indigo-600', text: 'text-indigo-900', border: 'border-indigo-200', userMessage: 'bg-indigo-600' },
    teal: { primary: 'from-teal-600 to-teal-700', secondary: 'from-teal-50 to-teal-100', accent: 'bg-teal-600', text: 'text-teal-900', border: 'border-teal-200', userMessage: 'bg-teal-600' }
  };

  // Initialize widget
  function init() {
    const config = getConfig();
    if (!config) {
      console.error('❌ Widget initialization failed: No config');
      return;
    }

    // Load Tailwind CSS
    if (!document.querySelector('script[src*="tailwindcss"]')) {
      const tailwindScript = document.createElement('script');
      tailwindScript.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(tailwindScript);
      console.log('✅ Tailwind CSS loaded');
    }

    const themeColors = themes[config.theme] || themes.teal;
    const widgetId = `ai-orchestrator-widget-${config.chatbotId}`;

    // Create widget HTML - RESPONSIVE for Desktop & Mobile
    const widgetHTML = `
      <style>
        /* Toggle Button */
        .toggle-button {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            border: none;
        }
        .toggle-button:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        /* Chat Widget - Desktop */
        #${widgetId} .chat-widget {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 384px;
          height: 560px;
          z-index: 999;
          max-height: calc(100vh - 148px);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #${widgetId} .chat-widget.hidden { 
          display: none !important;
        }
        #${widgetId} .chat-widget.collapsed { 
          height: 64px !important;
          overflow: hidden !important;
        }
        #${widgetId} .chat-widget.collapsed .h-96 {
          display: none !important;
        }
        #${widgetId} .chat-widget.collapsed .p-4.bg-white.border-t {
          display: none !important;
        }
        
      /* 📱 MOBILE RESPONSIVE - Migliora leggibilità ma mantiene floating design */
      @media (max-width: 768px) {
        /* Toggle button leggermente più grande */
        .toggle-button {
          width: 58px;
          height: 58px;
          bottom: 20px;
          right: 20px;
        }
        
        /* Chat widget - mantiene floating ma ottimizzato */
        #${widgetId} .chat-widget {
          bottom: 90px;
          right: 12px;
          width: calc(100% - 24px);
          max-width: 380px;
          height: 450px;
          max-height: calc(100vh - 140px);
        }
        
        /* Font più leggibili su mobile */
        #${widgetId} .text-sm {
          font-size: 15px !important;
          line-height: 1.5 !important;
        }
        
        #${widgetId} .text-xs {
          font-size: 12px !important;
        }
        
        #${widgetId} input {
          font-size: 16px !important; /* Previene zoom su iOS */
          padding: 12px 16px !important;
        }
        
        #${widgetId} button {
          min-height: 44px !important; /* iOS touch target size */
        }
        
        /* Header più leggibile */
        #${widgetId} .font-bold {
          font-size: 16px !important;
        }
      }
      
      /* 📱 MOBILE SMALL (iPhone SE, etc.) */
      @media (max-width: 390px) {
        .toggle-button {
          width: 54px;
          height: 54px;
          bottom: 16px;
          right: 16px;
        }
        
        #${widgetId} .chat-widget {
          width: calc(100% - 16px);
          right: 8px;
          bottom: 80px;
          height: 420px;
          max-height: calc(100vh - 120px);
        }
      }
      </style>

      <div id="${widgetId}">
      <!-- Toggle Button -->
        <div class="toggle-button bg-gradient-to-br ${themeColors.primary}" id="${widgetId}-toggle">
          <svg style="color: white; width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: #10B981; border-radius: 50%; border: 2px solid white; animation: pulse 2s infinite;"></div>
        </div>

      <!-- Chat Widget -->
        <div class="chat-widget bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 ${config.autoOpen ? '' : 'hidden'}" id="${widgetId}-chat">
        <!-- Header -->
          <div class="bg-gradient-to-br ${themeColors.secondary} border-b-2 ${themeColors.border} p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
            ${config.showAvatar ? `
                  <div class="w-10 h-10 bg-gradient-to-br ${themeColors.primary} rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
            ` : ''}
              <div>
                  <div class="font-bold ${themeColors.text}">${config.title}</div>
                  <div class="text-xs text-gray-600 flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online 24/7</span>
                    ${config.primaryLanguage && config.primaryLanguage !== 'auto' ? `<span class="px-2 py-0.5 text-[10px] rounded bg-gray-100 text-gray-700">${config.primaryLanguage.toUpperCase()}</span>` : ''}
              </div>
            </div>
          </div>
              <div class="flex items-center gap-2">
                <button id="${widgetId}-minimize" class="text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors" title="Minimize">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
            </button>
                <button id="${widgetId}-close" class="text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors" title="Close">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
              </div>
          </div>
          </div>
          
        <!-- Messages -->
          <div class="h-96 overflow-y-auto p-4 bg-gray-50" id="${widgetId}-messages">
            <div class="mb-4 flex justify-start">
              <div class="max-w-[80%] rounded-2xl px-4 py-2 bg-white text-gray-900 border border-gray-200">
                <div class="text-sm">${config.welcomeMessage.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\')}</div>
                <div class="text-xs mt-1 text-gray-500">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
              </div>
            </div>
          </div>
          
        <!-- Input -->
          <div class="p-4 bg-white border-t border-gray-200">
            <div class="flex gap-2">
          <input
            type="text"
                id="${widgetId}-input"
            placeholder="${config.placeholder}"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
              <button id="${widgetId}-send" class="${themeColors.accent} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all">
                <svg class="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject widget HTML
    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    document.body.appendChild(container);
    console.log('✅ Widget HTML injected');

    // Force toggle visibility immediately
    const toggleBtn = document.getElementById(`${widgetId}-toggle`);
    if (toggleBtn) {
      toggleBtn.style.opacity = '1';
      toggleBtn.style.visibility = 'visible';
      toggleBtn.style.display = 'flex';
      console.log('✅ Toggle forced visible');
    }
    
    // Wait for Tailwind to load and force color
    setTimeout(() => {
      const toggleBtn = document.getElementById(`${widgetId}-toggle`);
      if (toggleBtn) {
        // Force background color after Tailwind loads
        const primaryColor = themeColors.primary || 'from-indigo-500 to-indigo-600';
        toggleBtn.style.background = `linear-gradient(135deg, ${getGradientColors(primaryColor).from}, ${getGradientColors(primaryColor).to})`;
        
        
        console.log('✅ Toggle color and green dot applied after Tailwind load');
      }
    }, 100);
    
    // Helper function to get gradient colors from Tailwind class
    function getGradientColors(tailwindClass) {
      const colorMap = {
        'from-indigo-500 to-indigo-600': { from: '#6366f1', to: '#4f46e5' },
        'from-indigo-600 to-indigo-700': { from: '#4f46e5', to: '#4338ca' },
        'from-teal-500 to-teal-600': { from: '#14b8a6', to: '#0d9488' },
        'from-teal-600 to-teal-700': { from: '#0d9488', to: '#0f766e' },
        'from-blue-500 to-blue-600': { from: '#3b82f6', to: '#2563eb' },
        'from-blue-600 to-blue-700': { from: '#2563eb', to: '#1d4ed8' },
        'from-purple-500 to-purple-600': { from: '#8b5cf6', to: '#7c3aed' },
        'from-purple-600 to-purple-700': { from: '#7c3aed', to: '#6d28d9' },
        'from-pink-500 to-pink-600': { from: '#ec4899', to: '#db2777' },
        'from-pink-600 to-pink-700': { from: '#db2777', to: '#be185d' },
        'from-red-500 to-red-600': { from: '#ef4444', to: '#dc2626' },
        'from-red-600 to-red-700': { from: '#dc2626', to: '#b91c1c' },
        'from-green-500 to-green-600': { from: '#10b981', to: '#059669' },
        'from-green-600 to-green-700': { from: '#059669', to: '#047857' },
        'from-yellow-500 to-yellow-600': { from: '#eab308', to: '#ca8a04' },
        'from-yellow-600 to-yellow-700': { from: '#ca8a04', to: '#a16207' },
        'from-orange-500 to-orange-600': { from: '#f97316', to: '#ea580c' },
        'from-orange-600 to-orange-700': { from: '#ea580c', to: '#c2410c' }
      };
      return colorMap[tailwindClass] || { from: '#6366f1', to: '#4f46e5' };
    }

      // Add event listeners
      setTimeout(() => {
        const toggleBtn = document.getElementById(`${widgetId}-toggle`);
        const chatWidget = document.getElementById(`${widgetId}-chat`);
        const minimizeBtn = document.getElementById(`${widgetId}-minimize`);
        const closeBtn = document.getElementById(`${widgetId}-close`);
        const sendBtn = document.getElementById(`${widgetId}-send`);
        const inputField = document.getElementById(`${widgetId}-input`);
        const messagesContainer = document.getElementById(`${widgetId}-messages`);


        let isOpen = config.autoOpen;

      // Toggle button
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          if (isOpen) {
            chatWidget.classList.add('hidden');
            isOpen = false;
          } else {
            chatWidget.classList.remove('hidden');
            isOpen = true;
          }
        });
      }

      // Minimize button
      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
          chatWidget.classList.toggle('collapsed');
        });
      }

      // Close button
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          chatWidget.classList.add('hidden');
      isOpen = false;
        });
      }

  // Extract customer email from message
  function extractCustomerEmail(message) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = message.match(emailRegex);
    return match ? match[0] : null;
  }

  // Render Shopify Enhanced Features
  function renderShopifyEnhancements(enhancements) {
    let html = '';
    
    // Product Recommendations
    if (enhancements.recommendations && enhancements.recommendations.length > 0) {
      html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">';
      html += '<h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">🛍️ Product Recommendations</h4>';
      enhancements.recommendations.forEach(product => {
        html += `<div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border: 1px solid #e0f2fe;">`;
        html += `<div style="font-weight: 600; color: #0c4a6e;">${product.title}</div>`;
        if (product.description) html += `<div style="font-size: 12px; color: #64748b; margin: 4px 0;">${product.description}</div>`;
        html += `<div style="font-weight: 600; color: #059669;">$${product.price} ${product.inStock ? '✅ In Stock' : '❌ Out of Stock'}</div>`;
        if (product.url) html += `<a href="${product.url}" target="_blank" style="color: #0ea5e9; text-decoration: none; font-size: 12px;">View Product →</a>`;
        html += `</div>`;
      });
      html += '</div>';
    }
    
    // Order Tracking
    if (enhancements.order) {
      html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">';
      html += '<h4 style="margin: 0 0 8px 0; color: #166534; font-size: 14px; font-weight: 600;">📦 Order Status</h4>';
      html += `<div style="font-weight: 600; color: #166534;">Order #${enhancements.order.name}</div>`;
      html += `<div style="color: #16a34a; margin: 4px 0;">Status: ${enhancements.order.fulfillment_status || 'Processing'}</div>`;
      html += `<div style="font-size: 12px; color: #64748b;">Total: $${enhancements.order.total_price}</div>`;
      html += '</div>';
    }
    
    // Customer History
    if (enhancements.customerHistory) {
      html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #fefce8; border-radius: 8px; border-left: 4px solid #eab308;">';
      html += '<h4 style="margin: 0 0 8px 0; color: #a16207; font-size: 14px; font-weight: 600;">👤 Customer History</h4>';
      html += `<div style="color: #a16207;">Total Orders: ${enhancements.customerHistory.totalOrders || 0}</div>`;
      html += `<div style="color: #a16207;">Total Spent: $${enhancements.customerHistory.totalSpent || 0}</div>`;
      html += '</div>';
    }
    
    return html;
  }

  // Render Universal Embed Features
  function renderEmbedEnhancements(enhancements) {
    let html = '';
    
    if (enhancements.websiteData) {
      html += '<div class="embed-enhancements" style="margin-top: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1;">';
      html += '<h4 style="margin: 0 0 8px 0; color: #4338ca; font-size: 14px; font-weight: 600;">🌐 Website Information</h4>';
      if (enhancements.websiteData.title) html += `<div style="font-weight: 600; color: #4338ca;">${enhancements.websiteData.title}</div>`;
      if (enhancements.websiteData.description) html += `<div style="font-size: 12px; color: #64748b; margin: 4px 0;">${enhancements.websiteData.description}</div>`;
      html += '</div>';
    }
    
    return html;
  }

  // Render ML Analysis
  function renderMLAnalysis(analysis) {
    let html = '';
    
    if (analysis.sentiment) {
      const sentimentEmoji = analysis.sentiment === 'positive' ? '😊' : analysis.sentiment === 'negative' ? '😔' : '😐';
      html += '<div class="ml-analysis" style="margin-top: 12px; padding: 8px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #475569;">';
      html += `${sentimentEmoji} Sentiment: ${analysis.sentiment}`;
      if (analysis.confidence) html += ` (${Math.round(analysis.confidence * 100)}% confidence)`;
      html += '</div>';
    }
    
    return html;
  }

  // Send message
      const sendMessage = async () => {
        const message = inputField.value.trim();
    if (!message) return;
    
    // Add user message
        const userMessageHTML = `
          <div class="mb-4 flex justify-end">
            <div class="max-w-[80%] rounded-2xl px-4 py-2 ${themeColors.userMessage} text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div class="text-sm">${message}</div>
              <div class="text-xs mt-1 text-white opacity-80">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            </div>
      </div>
    `;
        messagesContainer.innerHTML += userMessageHTML;
        inputField.value = '';

        // Add typing indicator
        const typingHTML = `
          <div class="flex justify-start mb-4" id="${widgetId}-typing">
      <div class="bg-white border border-gray-200 rounded-2xl px-4 py-3">
        <div class="flex gap-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
        </div>
      </div>
    `;
        messagesContainer.innerHTML += typingHTML;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Send to API
        try {
          const response = await fetch(`${config.apiKey}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message,
              context: {
                chatbotId: config.chatbotId,
                primaryLanguage: config.primaryLanguage,
                connectionType: 'universal',
                websiteUrl: window.location.origin,
                customerEmail: extractCustomerEmail(message)
              }
            })
          });

          const data = await response.json();
          
          // Remove typing indicator
          document.getElementById(`${widgetId}-typing`)?.remove();

          // Add AI response with enhanced features
          let aiResponse = data.response || data.message || 'Sorry, I couldn\'t process that.';
          
          // Add Shopify Enhanced Features if available
          if (data.shopifyEnhancements) {
            aiResponse += renderShopifyEnhancements(data.shopifyEnhancements);
          }
          
          // Add Universal Embed Features if available
          if (data.embedEnhancements) {
            aiResponse += renderEmbedEnhancements(data.embedEnhancements);
          }
          
          // Add ML Analysis if available
          if (data.mlAnalysis) {
            aiResponse += renderMLAnalysis(data.mlAnalysis);
          }
          
          const aiMessageHTML = `
            <div class="mb-4 flex justify-start">
              <div class="max-w-[80%] rounded-2xl px-4 py-2 bg-white text-gray-900 border border-gray-200" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div class="text-sm">${aiResponse}</div>
                <div class="text-xs mt-1 text-gray-500">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                ${data.suggestions ? `
                  <div class="mt-2 flex flex-wrap gap-1">
                    ${data.suggestions.map(suggestion => `
                      <button class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" onclick="this.parentElement.parentElement.parentElement.parentElement.querySelector('input').value='${suggestion}'; this.parentElement.parentElement.parentElement.parentElement.querySelector('input').focus();">
                        ${suggestion}
                      </button>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          `;
          messagesContainer.innerHTML += aiMessageHTML;
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
          console.error('❌ Message send error:', error);
          document.getElementById(`${widgetId}-typing`)?.remove();
          
          const errorHTML = `
            <div class="mb-4 flex justify-start">
              <div class="max-w-[80%] rounded-2xl px-4 py-2 bg-red-50 text-red-900 border border-red-200">
                <div class="text-sm">Sorry, there was an error. Please try again.</div>
                <div class="text-xs mt-1 text-red-700">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
              </div>
            </div>
          `;
          messagesContainer.innerHTML += errorHTML;
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      };

      if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
      }

      if (inputField) {
        inputField.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });
      }

      console.log('✅ Event listeners attached');
    }, 100);

    // Expose config globally
    window.AIOrchestratorConfig = {
      chatbotId: config.chatbotId,
      apiKey: config.apiKey,
      theme: config.theme,
      title: config.title,
      placeholder: config.placeholder,
      showAvatar: config.showAvatar,
      welcomeMessage: config.welcomeMessage,
      primaryLanguage: config.primaryLanguage
    };
    console.log('✅ Config exposed globally');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
