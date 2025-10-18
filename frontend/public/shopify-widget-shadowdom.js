/**
 * AI Orchestrator Chatbot Widget - Shopify Shadow DOM Edition
 * Version: 4.0.0 - ISOLATED WITH SHADOW DOM
 * 
 * This widget uses Shadow DOM to completely isolate styles from the host page.
 * Perfect for Shopify and other platforms with aggressive global CSS.
 */

(function() {
  'use strict';

  console.log('🚀 AI Orchestrator Widget v4.0 - Shadow DOM Edition');

  // Get configuration from script tag or global config
  function getConfig() {
    // PRIORITY 1: Check window.AIOrchestratorConfig (for Shopify and manual configs)
    if (window.AIOrchestratorConfig) {
      console.log('✅ Config loaded from window.AIOrchestratorConfig');
      return {
        chatbotId: window.AIOrchestratorConfig.chatbotId,
        apiKey: window.AIOrchestratorConfig.apiKey || 'https://aiorchestrator-vtihz.ondigitalocean.app',
        theme: window.AIOrchestratorConfig.theme || 'teal',
        title: window.AIOrchestratorConfig.title || 'AI Support',
        welcomeMessage: window.AIOrchestratorConfig.welcomeMessage || 'Hi! I\'m your AI support assistant. How can I help you today? 👋',
        placeholder: window.AIOrchestratorConfig.placeholder || 'Type your message...',
        showAvatar: window.AIOrchestratorConfig.showAvatar !== false,
        primaryLanguage: window.AIOrchestratorConfig.primaryLanguage || 'en',
        autoOpen: window.AIOrchestratorConfig.autoOpen === true // Default: false (chiuso)
      };
    }

    // PRIORITY 2: Try script tag data attributes
    const script = document.querySelector('script[data-chatbot-id]') || 
                   document.querySelector('script[data-ai-orchestrator-id]') ||
                   document.querySelector('script[src*="shopify-widget-shadowdom"]');
    
    if (script) {
      const config = {
        chatbotId: script.dataset.chatbotId || script.dataset.aiOrchestratorId,
        apiKey: script.dataset.apiKey || 'https://aiorchestrator-vtihz.ondigitalocean.app',
        theme: script.dataset.theme || 'teal',
        title: script.dataset.title || 'AI Support',
        welcomeMessage: script.dataset.welcomeMessage || 'Hi! I\'m your AI support assistant. How can I help you today? 👋',
        placeholder: script.dataset.placeholder || 'Type your message...',
        showAvatar: script.dataset.showAvatar !== 'false',
        primaryLanguage: script.dataset.primaryLanguage || 'en',
        autoOpen: script.dataset.autoOpen === 'true' // Default: false (chiuso)
      };
      
      console.log('✅ Config loaded from script tag:', config);
      return config;
    }

    console.error('❌ No configuration found');
    return null;
  }

  // Theme colors - hardcoded CSS values
  const themeColors = {
    blue: {
      primary: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
      secondary: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
      accent: '#2563eb',
      text: '#1e3a8a',
      border: '#bfdbfe',
      userMessage: '#2563eb'
    },
    purple: {
      primary: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      secondary: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
      accent: '#7c3aed',
      text: '#581c87',
      border: '#d8b4fe',
      userMessage: '#7c3aed'
    },
    green: {
      primary: 'linear-gradient(135deg, #059669, #047857)',
      secondary: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
      accent: '#059669',
      text: '#065f46',
      border: '#bbf7d0',
      userMessage: '#059669'
    },
    red: {
      primary: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      secondary: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
      accent: '#dc2626',
      text: '#7f1d1d',
      border: '#fecaca',
      userMessage: '#dc2626'
    },
    orange: {
      primary: 'linear-gradient(135deg, #ea580c, #c2410c)',
      secondary: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
      accent: '#ea580c',
      text: '#7c2d12',
      border: '#fed7aa',
      userMessage: '#ea580c'
    },
    pink: {
      primary: 'linear-gradient(135deg, #db2777, #be185d)',
      secondary: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
      accent: '#db2777',
      text: '#831843',
      border: '#fbcfe8',
      userMessage: '#db2777'
    },
    indigo: {
      primary: 'linear-gradient(135deg, #4f46e5, #4338ca)',
      secondary: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
      accent: '#4f46e5',
      text: '#3730a3',
      border: '#c7d2fe',
      userMessage: '#4f46e5'
    },
    teal: {
      primary: 'linear-gradient(135deg, #0d9488, #0f766e)',
      secondary: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
      accent: '#0d9488',
      text: '#134e4a',
      border: '#99f6e4',
      userMessage: '#0d9488'
    }
  };

  // Initialize widget
  function init() {
    const config = getConfig();
    if (!config) {
      console.error('❌ Widget initialization failed: No config');
      return;
    }

    const theme = themeColors[config.theme] || themeColors.teal;
    const widgetId = `ai-orchestrator-widget-${config.chatbotId}`;

    // Create container for shadow DOM
    const shadowHost = document.createElement('div');
    shadowHost.id = widgetId;
    shadowHost.style.cssText = 'all: initial; position: fixed; bottom: 0; right: 0; z-index: 2147483647;';
    document.body.appendChild(shadowHost);

    // Attach shadow DOM
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // Complete widget HTML with ALL styles inline
    const widgetHTML = `
      <style>
        /* Reset all styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Toggle Button */
        .toggle-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          background: ${theme.primary};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2147483647;
          border: none;
        }

        .toggle-button:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .toggle-button svg {
          width: 24px;
          height: 24px;
          color: white;
        }

        .online-dot {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          background: #10B981;
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Chat Widget */
        .chat-widget {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 384px;
          height: 560px;
          z-index: 2147483646;
          max-height: calc(100vh - 148px);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
        }

        .chat-widget.hidden {
          display: none !important;
        }

        .chat-widget.collapsed {
          height: 64px !important;
          overflow: hidden !important;
        }

        .chat-widget.collapsed .messages-container {
          display: none !important;
        }

        .chat-widget.collapsed .input-container {
          display: none !important;
        }

        /* Header */
        .chat-header {
          background: ${theme.secondary};
          border-bottom: 2px solid ${theme.border};
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: ${theme.primary};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar svg {
          width: 20px;
          height: 20px;
          color: white;
        }

        .header-info {
          display: flex;
          flex-direction: column;
        }

        .header-title {
          font-weight: 700;
          font-size: 14px;
          color: ${theme.text};
        }

        .header-status {
          font-size: 12px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
        }

        .language-badge {
          padding: 2px 8px;
          font-size: 10px;
          border-radius: 4px;
          background: #f3f4f6;
          color: #374151;
        }

        .chat-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-button {
          background: transparent;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
          color: #6b7280;
        }

        .header-button:hover {
          background: #e5e7eb;
        }

        .header-button svg {
          width: 16px;
          height: 16px;
        }

        /* Messages Container */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f9fafb;
        }

        .message {
          margin-bottom: 16px;
          display: flex;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.bot {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 80%;
          border-radius: 16px;
          padding: 12px 16px;
          font-size: 14px;
        }

        .message.bot .message-bubble {
          background: white;
          color: #111827;
          border: 1px solid #e5e7eb;
        }

        .message.user .message-bubble {
          background: ${theme.userMessage};
          color: white;
        }

        .message-time {
          font-size: 11px;
          margin-top: 4px;
          opacity: 0.7;
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          max-width: 80px;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: #9ca3af;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        /* Input Container */
        .input-container {
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
          flex-shrink: 0;
          display: flex;
          gap: 8px;
        }

        .message-input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .message-input:focus {
          border-color: ${theme.accent};
          box-shadow: 0 0 0 3px ${theme.accent}22;
        }

        .send-button {
          background: ${theme.accent};
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:hover {
          opacity: 0.9;
        }

        .send-button svg {
          width: 20px;
          height: 20px;
          transform: rotate(45deg);
        }
      </style>

      <div class="widget-root">
        <!-- Toggle Button -->
        <div class="toggle-button" id="toggle">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <div class="online-dot"></div>
        </div>

        <!-- Chat Widget -->
        <div class="chat-widget ${config.autoOpen ? '' : 'hidden'}" id="chat">
          <!-- Header -->
          <div class="chat-header">
            <div class="chat-header-left">
              ${config.showAvatar ? `
                <div class="avatar">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
              ` : ''}
              <div class="header-info">
                <div class="header-title">${config.title}</div>
                <div class="header-status">
                  <div class="status-dot"></div>
                  <span>Online 24/7</span>
                  ${config.primaryLanguage && config.primaryLanguage !== 'auto' ? `<span class="language-badge">${config.primaryLanguage.toUpperCase()}</span>` : ''}
                </div>
              </div>
            </div>
            <div class="chat-header-right">
              <button class="header-button" id="minimize" title="Minimize">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <button class="header-button" id="close" title="Close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div class="messages-container" id="messages">
            <div class="message bot">
              <div class="message-bubble">
                <div>${config.welcomeMessage}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="input-container">
            <input
              type="text"
              class="message-input"
              id="input"
              placeholder="${config.placeholder}"
            />
            <button class="send-button" id="send">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    shadowRoot.innerHTML = widgetHTML;

    // Get elements from shadow DOM
    const toggleBtn = shadowRoot.getElementById('toggle');
    const chatWidget = shadowRoot.getElementById('chat');
    const minimizeBtn = shadowRoot.getElementById('minimize');
    const closeBtn = shadowRoot.getElementById('close');
    const sendBtn = shadowRoot.getElementById('send');
    const inputField = shadowRoot.getElementById('input');
    const messagesContainer = shadowRoot.getElementById('messages');

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

    // Send message
    const sendMessage = async () => {
      const message = inputField.value.trim();
      if (!message) return;

      // Add user message
      const userMessageDiv = document.createElement('div');
      userMessageDiv.className = 'message user';
      userMessageDiv.innerHTML = `
        <div class="message-bubble">
          <div>${message}</div>
          <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
        </div>
      `;
      messagesContainer.appendChild(userMessageDiv);
      inputField.value = '';

      // Add typing indicator
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message bot';
      typingDiv.id = 'typing';
      typingDiv.innerHTML = `
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Send to API
      try {
        const response = await fetch(`${config.apiKey}/api/chatbots/${config.chatbotId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });

        const data = await response.json();
        
        // Remove typing indicator
        const typingElement = shadowRoot.getElementById('typing');
        if (typingElement) typingElement.remove();

        // Add AI response
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message bot';
        aiMessageDiv.innerHTML = `
          <div class="message-bubble">
            <div>${data.response || 'Sorry, I couldn\'t process that.'}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
          </div>
        `;
        messagesContainer.appendChild(aiMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } catch (error) {
        console.error('❌ Message send error:', error);
        const typingElement = shadowRoot.getElementById('typing');
        if (typingElement) typingElement.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message bot';
        errorDiv.innerHTML = `
          <div class="message-bubble" style="background: #fef2f2; color: #7f1d1d; border-color: #fecaca;">
            <div>Sorry, there was an error. Please try again.</div>
            <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
          </div>
        `;
        messagesContainer.appendChild(errorDiv);
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

    console.log('✅ Widget initialized with Shadow DOM');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

