/**
 * AI Orchestrator Chatbot Widget - Shopify Inline Version
 * Version: 3.0.0 - LIVE PREVIEW EXACT MATCH
 * 
 * This widget is IDENTICAL to the live preview shown in the dashboard.
 * Uses Tailwind CSS CDN for styling consistency and Shopify compatibility.
 */

(function() {
  'use strict';
  console.log('🚀 AI Orchestrator Widget v3.0 - Shopify Inline Version');

  // Get configuration from data attributes
  function getConfig() {
    const script = document.querySelector('script[data-chatbot-id]') || 
                   document.querySelector('script[data-ai-orchestrator-id]');
    
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
        autoOpen: script.dataset.autoOpen === 'true'
      };
      
      console.log('✅ Config loaded from script tag:', config);
      return config;
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

      // Create widget HTML - EXACT MATCH from live preview with FULL CSS ISOLATION
      const widgetHTML = `
      <style>
        /* FULL CSS ISOLATION - Override ALL Shopify styles */
        #${widgetId} * {
          box-sizing: border-box !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          outline: none !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          line-height: 1.5 !important;
          color: inherit !important;
          background: transparent !important;
          text-decoration: none !important;
          list-style: none !important;
        }
        
        .ai-orchestrator-toggle-button {
            position: fixed !important;
            bottom: 24px !important;
            right: 24px !important;
            width: 60px !important;
            height: 60px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4) !important;
            cursor: pointer !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            z-index: 999999 !important;
            border: none !important;
            background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
        }
        .ai-orchestrator-toggle-button:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6) !important;
        }
        @keyframes ai-orchestrator-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-8px,0); }
          70% { transform: translate3d(0,-4px,0); }
          90% { transform: translate3d(0,-2px,0); }
        }
        #${widgetId} .ai-orchestrator-chat-widget {
          position: fixed !important;
          bottom: 100px !important;
          right: 24px !important;
          width: 384px !important;
          height: 560px !important;
          z-index: 999998 !important;
          max-height: calc(100vh - 148px) !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          background: white !important;
          border-radius: 16px !important;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
          overflow: hidden !important;
          border: 1px solid #e5e7eb !important;
        }
        #${widgetId} .ai-orchestrator-chat-widget.hidden { 
          display: none !important;
        }
        #${widgetId} .ai-orchestrator-chat-widget.collapsed { 
          height: 64px !important;
          overflow: hidden !important;
        }
        #${widgetId} .ai-orchestrator-chat-widget.collapsed .ai-orchestrator-messages {
          display: none !important;
        }
        #${widgetId} .ai-orchestrator-chat-widget.collapsed .ai-orchestrator-input {
          display: none !important;
        }
      </style>

      <div id="${widgetId}">
      <!-- Toggle Button -->
        <div class="ai-orchestrator-toggle-button" id="${widgetId}-toggle">
          <svg style="color: white; width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: #10B981; border-radius: 50%; border: 2px solid white; animation: ai-orchestrator-pulse 2s infinite;"></div>
        </div>

      <!-- Chat Widget -->
        <div class="ai-orchestrator-chat-widget ${config.autoOpen ? '' : 'hidden'}" id="${widgetId}-chat">
        <!-- Header -->
          <div style="background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border-bottom: 2px solid #a7f3d0; padding: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
            ${config.showAvatar ? `
                  <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #14b8a6, #0d9488); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <svg style="width: 20px; height: 20px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
            ` : ''}
              <div>
                  <div style="font-weight: bold; color: #0f766e; font-size: 16px;">${config.title}</div>
                  <div style="font-size: 12px; color: #6b7280; display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                    <span>Online 24/7</span>
                    ${config.primaryLanguage && config.primaryLanguage !== 'auto' ? `<span style="padding: 2px 8px; font-size: 10px; border-radius: 4px; background: #f3f4f6; color: #374151;">${config.primaryLanguage.toUpperCase()}</span>` : ''}
              </div>
            </div>
          </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button id="${widgetId}-minimize" style="color: #6b7280; background: transparent; border: none; border-radius: 8px; padding: 8px; cursor: pointer; transition: background-color 0.2s;" title="Minimize">
                  <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
            </button>
                <button id="${widgetId}-close" style="color: #6b7280; background: transparent; border: none; border-radius: 8px; padding: 8px; cursor: pointer; transition: background-color 0.2s;" title="Close">
                  <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
              </div>
          </div>
          </div>
          
        <!-- Messages -->
          <div class="ai-orchestrator-messages" style="height: 384px; overflow-y: auto; padding: 16px; background: #f9fafb;" id="${widgetId}-messages">
            <div style="margin-bottom: 16px; display: flex; justify-content: flex-start;">
              <div style="max-width: 80%; border-radius: 16px; padding: 16px; background: white; color: #111827; border: 1px solid #e5e7eb;">
                <div style="font-size: 14px;">${config.welcomeMessage}</div>
                <div style="font-size: 12px; margin-top: 4px; color: #6b7280;">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
              </div>
            </div>
          </div>
          
        <!-- Input -->
          <div class="ai-orchestrator-input" style="padding: 16px; background: white; border-top: 1px solid #e5e7eb;">
            <div style="display: flex; gap: 8px;">
          <input
            type="text"
                id="${widgetId}-input"
            placeholder="${config.placeholder}"
                style="flex: 1; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; outline: none; font-size: 14px; background: white;"
          />
              <button id="${widgetId}-send" style="background: #14b8a6; color: white; padding: 12px 16px; border: none; border-radius: 8px; cursor: pointer; transition: opacity 0.2s;">
                <svg style="width: 20px; height: 20px; transform: rotate(45deg);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  // Send message
      const sendMessage = async () => {
        const message = inputField.value.trim();
    if (!message) return;
    
    // Add user message
        const userMessageHTML = `
          <div style="margin-bottom: 16px; display: flex; justify-content: flex-end;">
            <div style="max-width: 80%; border-radius: 16px; padding: 16px; background: #14b8a6; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="font-size: 14px;">${message}</div>
              <div style="font-size: 12px; margin-top: 4px; color: white; opacity: 0.8;">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            </div>
      </div>
    `;
        messagesContainer.innerHTML += userMessageHTML;
        inputField.value = '';

        // Add typing indicator
        const typingHTML = `
          <div style="display: flex; justify-content: flex-start; margin-bottom: 16px;" id="${widgetId}-typing">
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px 16px;">
        <div style="display: flex; gap: 4px;">
          <div style="width: 8px; height: 8px; background: #9ca3af; border-radius: 50%; animation: bounce 1s infinite;"></div>
          <div style="width: 8px; height: 8px; background: #9ca3af; border-radius: 50%; animation: bounce 1s infinite; animation-delay: 0.1s;"></div>
          <div style="width: 8px; height: 8px; background: #9ca3af; border-radius: 50%; animation: bounce 1s infinite; animation-delay: 0.2s;"></div>
              </div>
        </div>
      </div>
    `;
        messagesContainer.innerHTML += typingHTML;
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
          document.getElementById(`${widgetId}-typing`)?.remove();

          // Add AI response
          const aiMessageHTML = `
            <div style="margin-bottom: 16px; display: flex; justify-content: flex-start;">
              <div style="max-width: 80%; border-radius: 16px; padding: 16px; background: white; color: #111827; border: 1px solid #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="font-size: 14px;">${data.response || 'Sorry, I couldn\'t process that.'}</div>
                <div style="font-size: 12px; margin-top: 4px; color: #6b7280;">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
              </div>
            </div>
          `;
          messagesContainer.innerHTML += aiMessageHTML;
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
          console.error('❌ Message send error:', error);
          document.getElementById(`${widgetId}-typing`)?.remove();
          
          const errorHTML = `
            <div style="margin-bottom: 16px; display: flex; justify-content: flex-start;">
              <div style="max-width: 80%; border-radius: 16px; padding: 16px; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;">
                <div style="font-size: 14px;">Sorry, there was an error. Please try again.</div>
                <div style="font-size: 12px; margin-top: 4px; color: #b91c1c;">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
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

    console.log('✅ Widget initialized successfully');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
