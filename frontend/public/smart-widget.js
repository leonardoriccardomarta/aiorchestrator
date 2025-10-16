// AI Orchestrator Smart Widget - Auto-detects Shopify and uses appropriate method
(function() {
  'use strict';

  console.log('AI Orchestrator: Loading smart widget...');

  // Detect if we're in Shopify
  function isShopify() {
    return (
      window.Shopify ||
      window.location.hostname.includes('myshopify.com') ||
      window.location.hostname.includes('shopify.com') ||
      document.querySelector('meta[name="shopify-checkout-api-token"]') ||
      document.querySelector('script[src*="shopify"]') ||
      document.querySelector('link[href*="shopify"]')
    );
  }

  // Wait for DOM to be ready
  function waitForDOM(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  // Get configuration from data attributes
  function getConfig() {
    const script = document.querySelector('script[data-chatbot-id]');
    
    if (script) {
      return {
        chatbotId: script.dataset.chatbotId,
        apiKey: script.dataset.apiKey || 'demo-key',
        theme: script.dataset.theme || 'teal',
        title: script.dataset.title || 'My AI',
        welcomeMessage: script.dataset.welcomeMessage || 'Hello! I\'m your ai',
        placeholder: script.dataset.placeholder || 'Type your id',
        showAvatar: script.dataset.showAvatar !== 'false',
        size: script.dataset.size || 'medium',
        primaryLanguage: script.dataset.primaryLanguage || 'en'
      };
    }
    
    return null;
  }

  // Initialize widget when DOM is ready
  waitForDOM(function() {
    console.log('AI Orchestrator: DOM ready, detecting environment...');
    
    const config = getConfig();
    if (!config) {
      console.error('AI Orchestrator: No valid configuration found');
      return;
    }

    const isShopifyEnv = isShopify();
    console.log('AI Orchestrator: Environment detected - Shopify:', isShopifyEnv);

    if (isShopifyEnv) {
      console.log('AI Orchestrator: Using iframe method for Shopify compatibility');
      loadIframeWidget(config);
    } else {
      console.log('AI Orchestrator: Using standard widget for other platforms');
      loadStandardWidget(config);
    }
  });

  // Load iframe widget for Shopify
  function loadIframeWidget(config) {
    // Remove any existing widgets
    const existingWidgets = document.querySelectorAll('[id^="ai-orchestrator-"]');
    existingWidgets.forEach(widget => widget.remove());

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'ai-orchestrator-iframe-widget';
    iframeContainer.style.cssText = `
      position: fixed !important;
      bottom: 0 !important;
      right: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 999999999 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'ai-orchestrator-iframe';
    iframe.style.cssText = `
      position: fixed !important;
      bottom: 0 !important;
      right: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      border: none !important;
      background: transparent !important;
      pointer-events: none !important;
      z-index: 999999999 !important;
    `;

    // Build iframe URL with parameters
    const iframeUrl = new URL('https://www.aiorchestrator.dev/shopify-widget.html');
    iframeUrl.searchParams.set('chatbotId', config.chatbotId);
    iframeUrl.searchParams.set('apiKey', config.apiKey);
    iframeUrl.searchParams.set('theme', config.theme);
    iframeUrl.searchParams.set('title', config.title);
    iframeUrl.searchParams.set('welcomeMessage', config.welcomeMessage);
    iframeUrl.searchParams.set('placeholder', config.placeholder);
    iframeUrl.searchParams.set('showAvatar', config.showAvatar);
    iframeUrl.searchParams.set('primaryLanguage', config.primaryLanguage);

    iframe.src = iframeUrl.toString();
    iframe.allow = 'microphone; camera';

    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);

    // Enable pointer events after load
    iframe.onload = function() {
      console.log('AI Orchestrator: Iframe widget loaded successfully');
      setTimeout(() => {
        iframe.style.pointerEvents = 'auto';
        iframeContainer.style.pointerEvents = 'auto';
      }, 1000);
    };

    console.log('AI Orchestrator: Shopify iframe widget initialized!');
  }

  // Load standard widget for other platforms
  function loadStandardWidget(config) {
    // Load the standard widget script
    const script = document.createElement('script');
    script.src = 'https://www.aiorchestrator.dev/chatbot-widget.js';
    script.setAttribute('data-chatbot-id', config.chatbotId);
    script.setAttribute('data-api-key', config.apiKey);
    script.setAttribute('data-theme', config.theme);
    script.setAttribute('data-title', config.title);
    script.setAttribute('data-welcome-message', config.welcomeMessage);
    script.setAttribute('data-placeholder', config.placeholder);
    script.setAttribute('data-show-avatar', config.showAvatar);
    script.setAttribute('data-primary-language', config.primaryLanguage);
    script.defer = true;
    
    document.head.appendChild(script);
    console.log('AI Orchestrator: Standard widget script loaded!');
  }

})();
