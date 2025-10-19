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

  // Global function for Add to Cart (called from product cards)
  window.addToCartFromChat = async function(productId, variantId) {
    try {
      console.log('🛒 Adding to cart from chat:', productId, variantId);
      
      // Use Shopify Ajax API to add to cart
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: variantId,
          quantity: 1,
          properties: {
            '_chatbot_recommendation': 'true',
            '_recommended_at': new Date().toISOString()
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Added to cart:', data);
        
        // Update cart count in theme
        fetch('/cart.js')
          .then(r => r.json())
          .then(cart => {
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) cartCount.textContent = cart.item_count;
            
            // Show success message in chat
            alert('✅ Product added to cart!');
          });
      } else {
        console.error('❌ Failed to add to cart');
        alert('❌ Sorry, couldn\'t add to cart. Please try again.');
      }
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      alert('❌ Sorry, an error occurred. Please try again.');
    }
  };

  // Get Shopify access token from connection
  async function getShopifyAccessToken(chatbotId, apiUrl) {
    try {
      // Try to get from window (set by Shopify app)
      if (window.ShopifyAccessToken) {
        console.log('🔑 Using accessToken from window.ShopifyAccessToken');
        return window.ShopifyAccessToken;
      }
      
      // Get shop domain from current URL
      const shopDomain = window.location.hostname;
      
      // Call PUBLIC endpoint - no authentication required
      const url = `${apiUrl}/api/public/shopify/connection?chatbotId=${encodeURIComponent(chatbotId)}&shop=${encodeURIComponent(shopDomain)}`;
      console.log('🔍 Fetching Shopify connection from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.hasConnection && data.data?.accessToken) {
          console.log('✅ Got Shopify accessToken for shop:', data.data.shop);
          return data.data.accessToken;
        } else {
          console.log('⚠️ No Shopify connection found for this chatbot');
          return null;
        }
      } else {
        console.warn('⚠️ Failed to fetch Shopify connection:', response.status);
        return null;
      }
    } catch (error) {
      console.log('⚠️ Could not get Shopify access token:', error.message);
      return null;
    }
  }

  // Initialize widget
  async function init() {
    const config = getConfig();
    if (!config) {
      console.error('❌ Widget initialization failed: No config');
      return;
    }

    const theme = themeColors[config.theme] || themeColors.teal;
    const widgetId = `ai-orchestrator-widget-${config.chatbotId}`;
    
    // Get Shopify access token for enhanced features
    const shopifyAccessToken = await getShopifyAccessToken(config.chatbotId, config.apiKey);
    console.log('🔑 Shopify access token:', shopifyAccessToken ? 'found ✅' : 'not found (widget will work without Shopify features)');

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
        
        /* 📱 MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          /* Toggle button più accessibile su mobile */
          .toggle-button {
            bottom: 16px;
            right: 16px;
            width: 56px;
            height: 56px;
          }
          
          /* Chat widget full-width su mobile */
          .chat-widget {
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
          }
          
          /* Quando collassato su mobile */
          .chat-widget.collapsed {
            height: 60px !important;
          }
        }
        
        /* 📱 MOBILE SMALL (iPhone SE, etc.) */
        @media (max-width: 390px) {
          .toggle-button {
            width: 50px;
            height: 50px;
            bottom: 12px;
            right: 12px;
          }
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

    // Extract customer email from message
    const extractCustomerEmail = (message) => {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const match = message.match(emailRegex);
      return match ? match[0] : null;
    };

    // Render Shopify Enhanced Features
    const renderShopifyEnhancements = (enhancements) => {
      let html = '';
      
      // Product Recommendations
      if (enhancements.recommendations && enhancements.recommendations.length > 0) {
        html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">';
        
        // Show personalization message if available
        if (enhancements.personalized && enhancements.personalizationReason) {
          html += `<div style="font-size: 11px; color: #0369a1; margin-bottom: 8px; font-weight: 500;">✨ ${enhancements.personalizationReason}</div>`;
        }
        
        html += '<h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">🛍️ Product Recommendations</h4>';
        enhancements.recommendations.forEach(product => {
          html += `<div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border: 1px solid #e0f2fe; position: relative;">`;
          
          // Personalized badge
          if (product.personalizedScore) {
            html += `<div style="position: absolute; top: 4px; right: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">PERFECT FOR YOU</div>`;
          }
          
          html += `<div style="font-weight: 600; color: #0c4a6e; margin-top: ${product.personalizedScore ? '20px' : '0'};">${product.title}</div>`;
          if (product.description) html += `<div style="font-size: 12px; color: #64748b; margin: 4px 0;">${product.description}</div>`;
          if (product.reason) html += `<div style="font-size: 11px; color: #0369a1; margin: 4px 0; font-style: italic;">💡 ${product.reason}</div>`;
          html += `<div style="font-weight: 600; color: #059669; margin: 4px 0;">$${product.price} ${product.inStock ? '✅ In Stock' : '❌ Out of Stock'}</div>`;
          
          // Action buttons
          html += `<div style="display: flex; gap: 8px; margin-top: 8px;">`;
          if (product.url) html += `<a href="${product.url}" target="_blank" style="flex: 1; text-align: center; padding: 6px 12px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 600;">View Product</a>`;
          html += `<button onclick="window.addToCartFromChat('${product.id}', '${product.variantId || product.id}')" style="flex: 1; padding: 6px 12px; background: #059669; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">🛒 Add to Cart</button>`;
          html += `</div>`;
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
      
      // 🛒 Cart Action (Add to Cart confirmation)
      if (enhancements.cartAction) {
        html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #d1fae5; border-radius: 8px; border-left: 4px solid #059669;">';
        html += `<div style="color: #065f46; font-weight: 600;">${enhancements.cartAction.message || '✅ Added to cart!'}</div>`;
        html += '</div>';
      }
      
      // 💳 Checkout Guidance
      if (enhancements.checkoutGuidance) {
        html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">';
        html += '<h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">💳 Checkout Guide</h4>';
        html += `<div style="color: #78350f; margin-bottom: 8px;">${enhancements.checkoutGuidance.message}</div>`;
        enhancements.checkoutGuidance.steps.forEach((step, idx) => {
          html += `<div style="margin: 4px 0; color: #78350f; font-size: 13px;">${step.step}. ${step.title}</div>`;
        });
        if (enhancements.checkoutGuidance.quickCheckout) {
          html += enhancements.checkoutGuidance.quickCheckout;
        }
        html += '</div>';
      }
      
      // 🎯 Upsell / Cross-sell
      if (enhancements.upsells && enhancements.upsells.length > 0) {
        html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #fce7f3; border-radius: 8px; border-left: 4px solid #ec4899;">';
        html += '<h4 style="margin: 0 0 8px 0; color: #9f1239; font-size: 14px; font-weight: 600;">✨ You might also love</h4>';
        if (enhancements.upsellMessage) html += `<div style="color: #9f1239; margin-bottom: 8px; font-size: 13px;">${enhancements.upsellMessage}</div>`;
        enhancements.upsells.forEach(upsell => {
          html += `<div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border: 1px solid #fbcfe8;">`;
          html += `<div style="display: flex; align-items: center; gap: 8px;">`;
          html += `<div style="font-weight: 600; color: #9f1239; flex: 1;">${upsell.title}</div>`;
          html += `<div style="background: #ec4899; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">${upsell.badge}</div>`;
          html += `</div>`;
          html += `<div style="font-weight: 600; color: #059669; margin: 4px 0;">$${upsell.price}</div>`;
          if (upsell.reason) html += `<div style="font-size: 11px; color: #831843; margin: 4px 0;">${upsell.reason}</div>`;
          if (upsell.url) html += `<a href="${upsell.url}" target="_blank" style="color: #ec4899; text-decoration: none; font-size: 12px; font-weight: 600;">View →</a>`;
          html += `</div>`;
        });
        html += '</div>';
      }
      
      // 💰 Stripe Payment
      if (enhancements.payment && enhancements.payment.button) {
        html += '<div class="shopify-enhancements" style="margin-top: 12px;">';
        html += enhancements.payment.button;
        html += '</div>';
      }
      
      return html;
    };

    // Render Universal Embed Features
    const renderEmbedEnhancements = (enhancements) => {
      let html = '';
      
      if (enhancements.websiteData) {
        html += '<div class="embed-enhancements" style="margin-top: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1;">';
        html += '<h4 style="margin: 0 0 8px 0; color: #4338ca; font-size: 14px; font-weight: 600;">🌐 Website Information</h4>';
        if (enhancements.websiteData.title) html += `<div style="font-weight: 600; color: #4338ca;">${enhancements.websiteData.title}</div>`;
        if (enhancements.websiteData.description) html += `<div style="font-size: 12px; color: #64748b; margin: 4px 0;">${enhancements.websiteData.description}</div>`;
        html += '</div>';
      }
      
      return html;
    };

    // Render ML Analysis
    const renderMLAnalysis = (analysis) => {
      let html = '';
      
      if (analysis.sentiment) {
        const sentimentEmoji = analysis.sentiment === 'positive' ? '😊' : analysis.sentiment === 'negative' ? '😔' : '😐';
        html += '<div class="ml-analysis" style="margin-top: 12px; padding: 8px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #475569;">';
        html += `${sentimentEmoji} Sentiment: ${analysis.sentiment}`;
        if (analysis.confidence) html += ` (${Math.round(analysis.confidence * 100)}% confidence)`;
        html += '</div>';
      }
      
      return html;
    };

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
          const response = await fetch(`${config.apiKey}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message,
              context: {
                chatbotId: config.chatbotId,
                primaryLanguage: config.primaryLanguage,
                connectionType: 'shopify',
                shopifyConnection: shopifyAccessToken ? {
                  shop: window.location.hostname,
                  accessToken: shopifyAccessToken
                } : null,
                websiteUrl: window.location.origin,
                customerEmail: extractCustomerEmail(message)
              }
            })
          });

        const data = await response.json();
        
        // Remove typing indicator
        const typingElement = shadowRoot.getElementById('typing');
        if (typingElement) typingElement.remove();

        // Add AI response with enhanced features
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message bot';
        
        let responseContent = data.response || 'Sorry, I couldn\'t process that.';
        
        // Add Personalized Greeting (if first message)
        if (data.personalization?.greeting) {
          responseContent = data.personalization.greeting.greeting + '<br><br>' + responseContent;
        }
        
        // Add Shopify Enhanced Features if available
        if (data.shopifyEnhancements) {
          responseContent += renderShopifyEnhancements(data.shopifyEnhancements);
        }
        
        // Add Universal Embed Features if available
        if (data.embedEnhancements) {
          responseContent += renderEmbedEnhancements(data.embedEnhancements);
        }
        
        // Add Personalized Discount if available
        if (data.personalization?.discount) {
          const discount = data.personalization.discount;
          responseContent += `<div style="margin-top: 12px; padding: 12px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 8px; color: white; text-align: center;">
            <div style="font-weight: 600; margin-bottom: 4px;">🎁 Special Offer</div>
            <div style="font-size: 13px;">${discount.message}</div>
          </div>`;
        }
        
        // Add ML Analysis if available
        if (data.mlAnalysis) {
          responseContent += renderMLAnalysis(data.mlAnalysis);
        }
        
        aiMessageDiv.innerHTML = `
          <div class="message-bubble">
            <div>${responseContent}</div>
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

