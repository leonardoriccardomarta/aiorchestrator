// AI Orchestrator Chatbot Widget - Shopify Compatible Version
(function() {
  'use strict';

  // Inject Tailwind CSS CDN for Shopify compatibility
  console.log('AI Orchestrator: Checking for Tailwind CSS...');
  if (!document.getElementById('ai-widget-tailwind')) {
    console.log('AI Orchestrator: Injecting Tailwind CSS CDN...');
    const tailwindScript = document.createElement('script');
    tailwindScript.id = 'ai-widget-tailwind';
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);
    console.log('✅ Tailwind CSS CDN injected');
  }

  // Wait for DOM AND Tailwind to be ready
  function waitForDOM(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => waitForTailwind(callback));
    } else {
      waitForTailwind(callback);
    }
  }

  function waitForTailwind(callback) {
    // Check if Tailwind is loaded by testing a utility class
    const testEl = document.createElement('div');
    testEl.className = 'fixed';
    testEl.style.position = 'absolute';
    testEl.style.top = '-9999px';
    document.body.appendChild(testEl);
    
    const isLoaded = window.getComputedStyle(testEl).position === 'fixed';
    document.body.removeChild(testEl);
    
    if (isLoaded) {
      console.log('✅ Tailwind CSS is ready');
      callback();
    } else {
      console.log('⏳ Waiting for Tailwind CSS...');
      setTimeout(() => waitForTailwind(callback), 100);
    }
  }

  // Get configuration from data attributes or legacy config
  function getConfig() {
    const script = document.querySelector('script[data-chatbot-id]');
    if (script) {
      return {
        chatbotId: script.dataset.chatbotId,
        apiKey: script.dataset.apiKey || 'demo-key',
        position: script.dataset.position || 'bottom-right',
        theme: script.dataset.theme || 'blue',
        title: script.dataset.title || 'AI Support',
        welcomeMessage: script.dataset.welcomeMessage || 'Hi! I\'m your AI support assistant. How can I help you today? 👋',
        placeholder: script.dataset.placeholder || 'Type your message...',
        showAvatar: script.dataset.showAvatar !== 'false',
        size: script.dataset.size || 'medium',
        primaryLanguage: script.dataset.primaryLanguage || 'auto'
      };
    }
    return null;
  }

  // Legacy config support
  function getLegacyConfig() {
    if (window.AIChatbotConfig) {
      return {
        chatbotId: window.AIChatbotConfig.chatbotId,
        apiKey: window.AIChatbotConfig.apiKey || 'demo-key',
        position: window.AIChatbotConfig.position || 'bottom-right',
        theme: window.AIChatbotConfig.theme || 'blue',
        title: window.AIChatbotConfig.title || 'AI Support',
        welcomeMessage: window.AIChatbotConfig.welcomeMessage || 'Hi! I\'m your AI support assistant. How can I help you today? 👋',
        placeholder: window.AIChatbotConfig.placeholder || 'Type your message...',
        showAvatar: window.AIChatbotConfig.showAvatar !== false,
        size: window.AIChatbotConfig.size || 'medium',
        primaryLanguage: window.AIChatbotConfig.primaryLanguage || 'auto'
      };
    }
    return null;
  }

  // Initialize widget when DOM is ready
  waitForDOM(function() {
    console.log('AI Orchestrator: DOM ready, looking for config...');
    
    // Debug: Check all script tags
    const allScripts = document.querySelectorAll('script');
    console.log('AI Orchestrator: Found', allScripts.length, 'script tags');
    
    const config = getConfig() || getLegacyConfig();
    console.log('AI Orchestrator: Config found:', config);
    console.log('AI Orchestrator: Config details:', {
      chatbotId: config?.chatbotId,
      theme: config?.theme,
      title: config?.title,
      position: config?.position,
      showAvatar: config?.showAvatar,
      size: config?.size,
      primaryLanguage: config?.primaryLanguage
    });
    
    if (!config) {
      console.error('AI Orchestrator: No valid configuration found');
      console.error('AI Orchestrator: Make sure you have data-chatbot-id and data-api-key attributes');
      return;
    }

    console.log('AI Orchestrator: Initializing Shopify-compatible widget with config:', config);
    initializeWidget(config);
  });

  function initializeWidget(config) {

  // Theme configurations
  const themes = {
    blue: {
      primary: 'from-blue-600 to-blue-700',
      secondary: 'from-blue-50 to-blue-100',
      accent: 'bg-blue-600',
      text: 'text-blue-900',
      border: 'border-blue-200'
    },
    purple: {
      primary: 'from-purple-600 to-purple-700',
      secondary: 'from-purple-50 to-purple-100',
      accent: 'bg-purple-600',
      text: 'text-purple-900',
      border: 'border-purple-200'
    },
    green: {
      primary: 'from-green-600 to-green-700',
      secondary: 'from-green-50 to-green-100',
      accent: 'bg-green-600',
      text: 'text-green-900',
      border: 'border-green-200'
    },
    red: {
      primary: 'from-red-600 to-red-700',
      secondary: 'from-red-50 to-red-100',
      accent: 'bg-red-600',
      text: 'text-red-900',
      border: 'border-red-200'
    }
  };

  // Size configurations
  const sizes = {
    small: { width: 'w-80', height: 'h-80', buttonSize: 'w-12 h-12', iconSize: 'w-5 h-5' },
    medium: { width: 'w-96', height: 'h-96', buttonSize: 'w-16 h-16', iconSize: 'w-7 h-7' },
    large: { width: 'w-[28rem]', height: 'h-[28rem]', buttonSize: 'w-20 h-20', iconSize: 'w-8 h-8' }
  };

  const theme = themes[config.theme] || themes.blue;
  const size = sizes[config.size] || sizes.medium;
  
  console.log('AI Orchestrator: Theme selection:', {
    requestedTheme: config.theme,
    selectedTheme: theme,
    themeKeys: Object.keys(themes)
  });

  // Position configurations
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const position = positions[config.position] || positions['bottom-right'];

  // Create widget HTML
  const widgetHTML = `
    <div id="ai-chatbot-widget" class="fixed ${position} z-50">
      <!-- Toggle Button -->
      <button id="ai-widget-toggle" class="${size.buttonSize} bg-gradient-to-br ${theme.primary} text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group">
        <svg class="${size.iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        <div class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          ${config.title}
        </div>
      </button>

      <!-- Chat Widget -->
      <div id="ai-widget-chat" class="${size.width} ${size.height} bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 hidden">
        <!-- Header -->
        <div class="bg-gradient-to-br ${theme.secondary} border-b-2 ${theme.border} p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              ${config.showAvatar ? `
                <div class="w-10 h-10 bg-gradient-to-br ${theme.primary} rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
              ` : ''}
              <div>
                <div class="font-bold ${theme.text}">${config.title}</div>
                <div class="text-xs text-gray-600 flex items-center gap-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online 24/7
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button id="ai-widget-minimize" class="text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <button id="ai-widget-close" class="text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              </div>
            </div>
          </div>
          
        <!-- Messages -->
        <div id="ai-widget-messages" class="h-96 overflow-y-auto p-4 bg-gray-50">
          <div class="mb-4 flex justify-start">
            <div class="max-w-[80%] rounded-2xl px-4 py-2 bg-white text-gray-900 border border-gray-200">
              <div class="text-sm">${config.welcomeMessage}</div>
              <div class="text-xs mt-1 text-gray-500">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </div>
          
        <!-- Input -->
        <div class="p-4 bg-white border-t border-gray-200">
          <div class="flex gap-2">
            <input
              id="ai-widget-input"
              type="text"
              placeholder="${config.placeholder}"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button id="ai-widget-send" class="${theme.accent} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
          </div>
        </div>
      </div>
    `;

    // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #ai-chatbot-widget * {
      box-sizing: border-box;
    }
    #ai-chatbot-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    #ai-widget-messages::-webkit-scrollbar {
      width: 6px;
    }
    #ai-widget-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    #ai-widget-messages::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    #ai-widget-messages::-webkit-scrollbar-thumb:hover {
      background: #a1a1a1;
    }
  `;
  document.head.appendChild(style);

  // Add widget to page
  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  // Widget state
  let isOpen = false;
  let isMinimized = false;
  let conversationHistory = [];

  // Toggle widget
  window.toggleChatbot = function() {
    const chat = document.getElementById('ai-widget-chat');
    const button = document.getElementById('ai-widget-toggle');
    
    if (!isOpen) {
      chat.classList.remove('hidden');
      button.style.display = 'none';
      isOpen = true;
      document.getElementById('ai-widget-input').focus();
    } else {
      chat.classList.add('hidden');
      button.style.display = 'flex';
      isOpen = false;
    }
  };

  // Close widget
  window.closeChatbot = function() {
    const chat = document.getElementById('ai-widget-chat');
    const button = document.getElementById('ai-widget-toggle');
    
    chat.classList.add('hidden');
    button.style.display = 'flex';
    isOpen = false;
    isMinimized = false;
  };

  // Minimize widget
  window.minimizeChatbot = function() {
    const messages = document.getElementById('ai-widget-messages');
    const input = document.querySelector('#ai-widget-chat .p-4');
    
    if (!isMinimized) {
      messages.style.display = 'none';
      input.style.display = 'none';
      isMinimized = true;
    } else {
      messages.style.display = 'block';
      input.style.display = 'block';
      isMinimized = false;
    }
  };

  // Send message
  window.sendChatbotMessage = async function() {
    const input = document.getElementById('ai-widget-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
      // Simulate API call (replace with real API)
      const response = await fetch('https://aiorchestrator-vtihz.ondigitalocean.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          message: message,
          chatbotId: config.chatbotId,
          conversationHistory: conversationHistory,
          context: {
            primaryLanguage: config.primaryLanguage || 'auto',
            language: config.primaryLanguage || 'auto'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        hideTypingIndicator();
        addMessage(data.response || 'I understand your message. How can I help you further?', false);
  } else {
        hideTypingIndicator();
        addMessage('Sorry, I\'m having trouble responding right now. Please try again.', false);
      }
    } catch (error) {
      console.error('Chat error:', error);
      hideTypingIndicator();
      addMessage('Sorry, I\'m having trouble responding right now. Please try again.', false);
    }
  };

  // Handle enter key
  window.handleChatbotKeypress = function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendChatbotMessage();
    }
  };

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('ai-widget-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="max-w-[80%] rounded-2xl px-4 py-2 ${
        isUser
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-900 border border-gray-200'
      }">
        <div class="text-sm">${content}</div>
        <div class="text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Store in conversation history
    conversationHistory.push({
      role: isUser ? 'user' : 'assistant',
      content: content,
      timestamp: new Date()
    });
  }

  // Show typing indicator
  function showTypingIndicator() {
    const messagesContainer = document.getElementById('ai-widget-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex justify-start mb-4';
    typingDiv.innerHTML = `
      <div class="bg-white border border-gray-200 rounded-2xl px-4 py-3">
        <div class="flex gap-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) {
      typing.remove();
      }
    }
    
    // Event listeners
  document.getElementById('ai-widget-toggle').addEventListener('click', toggleChatbot);
  document.getElementById('ai-widget-close').addEventListener('click', closeChatbot);
  document.getElementById('ai-widget-minimize').addEventListener('click', minimizeChatbot);
  document.getElementById('ai-widget-send').addEventListener('click', sendChatbotMessage);
  document.getElementById('ai-widget-input').addEventListener('keypress', handleChatbotKeypress);

    console.log('AI Orchestrator: Shopify-compatible widget loaded successfully!');
    
    // Debug: Check if elements are actually visible
    const toggleButton = document.getElementById('ai-widget-toggle');
    const chatWidget = document.getElementById('ai-widget');
    
    console.log('AI Orchestrator: Toggle button added to page:', toggleButton ? 'YES' : 'NO');
    console.log('AI Orchestrator: Chat widget added to page:', chatWidget ? 'YES' : 'NO');
    
    if (toggleButton) {
      const toggleStyle = window.getComputedStyle(toggleButton);
      console.log('AI Orchestrator: Toggle button position:', toggleStyle.position);
      console.log('AI Orchestrator: Toggle button display:', toggleStyle.display);
      console.log('AI Orchestrator: Toggle button visibility:', toggleStyle.visibility);
      console.log('AI Orchestrator: Toggle button z-index:', toggleStyle.zIndex);
      console.log('AI Orchestrator: Toggle button bottom:', toggleStyle.bottom);
      console.log('AI Orchestrator: Toggle button right:', toggleStyle.right);
    }
    
    if (chatWidget) {
      const chatStyle = window.getComputedStyle(chatWidget);
      console.log('AI Orchestrator: Chat widget position:', chatStyle.position);
      console.log('AI Orchestrator: Chat widget display:', chatStyle.display);
      console.log('AI Orchestrator: Chat widget visibility:', chatStyle.visibility);
      console.log('AI Orchestrator: Chat widget z-index:', chatStyle.zIndex);
    }
    
    // Ensure maximum z-index for Shopify compatibility
    if (toggleButton) {
      console.log('AI Orchestrator: Setting maximum z-index for Shopify...');
      toggleButton.style.zIndex = '2147483647';
      console.log('✅ Widget ready! Toggle button z-index:', window.getComputedStyle(toggleButton).zIndex);
    }
    } // End of initializeWidget function

})(); // End of IIFE