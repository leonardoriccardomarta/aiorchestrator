// AI Orchestrator Shopify Iframe Widget - Completely Isolated
(function() {
  'use strict';

  console.log('AI Orchestrator: Loading Shopify iframe widget...');

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
    
    console.log('AI Orchestrator: Looking for script tag...');
    console.log('AI Orchestrator: Found script:', script);
    
    if (script) {
      console.log('AI Orchestrator: Script dataset:', script.dataset);
      
      const config = {
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
      
      console.log('AI Orchestrator: Parsed config:', config);
      return config;
    }
    
    console.log('AI Orchestrator: No script tag found');
    return null;
  }

  // Initialize widget when DOM is ready
  waitForDOM(function() {
    console.log('AI Orchestrator: DOM ready, looking for config...');
    
    const config = getConfig();
    
    if (!config) {
      console.error('AI Orchestrator: No valid configuration found');
      return;
    }

    console.log('AI Orchestrator: Initializing Shopify iframe widget with config:', config);
    initializeIframeWidget(config);
  });

  function initializeIframeWidget(config) {
    // Remove any existing widgets
    const existingWidgets = document.querySelectorAll('[id^="ai-orchestrator-iframe-widget"]');
    existingWidgets.forEach(widget => {
      console.log('AI Orchestrator: Removing existing iframe widget:', widget.id);
      widget.remove();
    });

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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
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
      margin: 0 !important;
      padding: 0 !important;
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

    console.log('AI Orchestrator: Iframe URL:', iframe.src);

    // Add iframe to container
    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);

    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'widgetReady') {
        console.log('AI Orchestrator: Widget iframe is ready');
        // Enable pointer events once widget is ready
        iframe.style.pointerEvents = 'auto';
        iframeContainer.style.pointerEvents = 'auto';
      }
    });

    // Handle iframe load
    iframe.onload = function() {
      console.log('AI Orchestrator: Iframe loaded successfully');
      // Enable pointer events after a short delay
      setTimeout(() => {
        iframe.style.pointerEvents = 'auto';
        iframeContainer.style.pointerEvents = 'auto';
      }, 1000);
    };

    // Handle iframe errors
    iframe.onerror = function() {
      console.error('AI Orchestrator: Failed to load iframe widget');
    };

    console.log('AI Orchestrator: Shopify iframe widget initialized successfully!');
  }

})();
