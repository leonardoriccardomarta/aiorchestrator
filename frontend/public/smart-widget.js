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

  // Get configuration from the live preview widget (if it exists)
  function getLivePreviewConfig() {
    // First check if there's a global configuration from the live preview
    if (window.AIOrchestratorConfig) {
      console.log('AI Orchestrator: Found global configuration from live preview:', window.AIOrchestratorConfig);
      return window.AIOrchestratorConfig;
    }
    
    // Fallback: Look for the live preview widget configuration
    const liveWidget = document.querySelector('#ai-orchestrator-widget-preview, [id^="ai-orchestrator-widget-"]');
    
    if (liveWidget) {
      console.log('AI Orchestrator: Found live preview widget, extracting configuration...');
      
      // Extract configuration from the live widget with more specific selectors
      const title = liveWidget.querySelector('[class*="title"], .title')?.textContent?.trim() || 'My AI';
      const welcomeMessage = liveWidget.querySelector('[class*="message-text"], .message-text')?.textContent?.trim() || 'Hello! I\'m your ai';
      const placeholder = liveWidget.querySelector('input[type="text"]')?.placeholder || 'Type your id';
      const showAvatar = liveWidget.querySelector('[class*="avatar"], .avatar') !== null;
      
      // Extract theme and colors from CSS classes or computed styles
      let theme = 'teal';
      let themeColors = {
        primary: 'rgb(13 148 136)',
        primaryDark: 'rgb(15 118 110)',
        headerLight: 'rgb(153 246 228)',
        headerDark: 'rgb(94 234 212)',
        text: 'rgb(19 78 74)',
        accent: 'rgb(34 197 94)'
      };
      
      const header = liveWidget.querySelector('[class*="header"], .header');
      if (header) {
        const computedStyle = window.getComputedStyle(header);
        const bgColor = computedStyle.backgroundColor;
        
        // Check for specific teal colors
        if (bgColor.includes('153, 246, 228') || bgColor.includes('94, 234, 212')) {
          theme = 'teal';
          themeColors = {
            primary: 'rgb(13 148 136)',
            primaryDark: 'rgb(15 118 110)',
            headerLight: 'rgb(153 246 228)',
            headerDark: 'rgb(94 234 212)',
            text: 'rgb(19 78 74)',
            accent: 'rgb(34 197 94)'
          };
        } else if (bgColor.includes('191, 219, 254') || bgColor.includes('147, 197, 253')) {
          theme = 'blue';
          themeColors = {
            primary: 'rgb(37 99 235)',
            primaryDark: 'rgb(29 78 216)',
            headerLight: 'rgb(191 219 254)',
            headerDark: 'rgb(147 197 253)',
            text: 'rgb(30 64 175)',
            accent: 'rgb(34 197 94)'
          };
        } else if (bgColor.includes('196, 181, 253') || bgColor.includes('167, 139, 250')) {
          theme = 'purple';
          themeColors = {
            primary: 'rgb(124 58 237)',
            primaryDark: 'rgb(109 40 217)',
            headerLight: 'rgb(196 181 253)',
            headerDark: 'rgb(167 139 250)',
            text: 'rgb(88 28 135)',
            accent: 'rgb(34 197 94)'
          };
        } else if (bgColor.includes('187, 247, 208') || bgColor.includes('134, 239, 172')) {
          theme = 'green';
          themeColors = {
            primary: 'rgb(34 197 94)',
            primaryDark: 'rgb(22 163 74)',
            headerLight: 'rgb(187 247 208)',
            headerDark: 'rgb(134 239 172)',
            text: 'rgb(22 101 52)',
            accent: 'rgb(34 197 94)'
          };
        } else if (bgColor.includes('254, 202, 202') || bgColor.includes('252, 165, 165')) {
          theme = 'red';
          themeColors = {
            primary: 'rgb(239 68 68)',
            primaryDark: 'rgb(220 38 38)',
            headerLight: 'rgb(254 202 202)',
            headerDark: 'rgb(252 165 165)',
            text: 'rgb(153 27 27)',
            accent: 'rgb(34 197 94)'
          };
        } else if (bgColor.includes('254, 215, 170') || bgColor.includes('251, 191, 143')) {
          theme = 'orange';
          themeColors = {
            primary: 'rgb(249 115 22)',
            primaryDark: 'rgb(234 88 12)',
            headerLight: 'rgb(254 215 170)',
            headerDark: 'rgb(251 191 143)',
            text: 'rgb(154 52 18)',
            accent: 'rgb(34 197 94)'
          };
        } else if (bgColor.includes('251, 207, 232') || bgColor.includes('249, 168, 212')) {
          theme = 'pink';
          themeColors = {
            primary: 'rgb(236 72 153)',
            primaryDark: 'rgb(219 39 119)',
            headerLight: 'rgb(251 207 232)',
            headerDark: 'rgb(249 168 212)',
            text: 'rgb(157 23 77)',
            accent: 'rgb(34 197 94)'
          };
        } else if (bgColor.includes('199, 210, 254') || bgColor.includes('165, 180, 252')) {
          theme = 'indigo';
          themeColors = {
            primary: 'rgb(99 102 241)',
            primaryDark: 'rgb(79 70 229)',
            headerLight: 'rgb(199 210 254)',
            headerDark: 'rgb(165 180 252)',
            text: 'rgb(67 56 202)',
            accent: 'rgb(34 197 94)'
          };
        }
      }
      
      console.log('AI Orchestrator: Extracted configuration:', {
        title, welcomeMessage, placeholder, showAvatar, theme, themeColors
      });
      
      return {
        chatbotId: 'live-preview',
        apiKey: 'demo-key',
        theme: theme,
        themeColors: themeColors,
        title: title,
        welcomeMessage: welcomeMessage,
        placeholder: placeholder,
        showAvatar: showAvatar,
        size: 'medium',
        primaryLanguage: 'en'
      };
    }
    
    return null;
  }

  // Initialize widget when DOM is ready
  waitForDOM(function() {
    console.log('AI Orchestrator: DOM ready, detecting environment...');
    
    // Wait a bit for the live preview widget to load first
    setTimeout(() => {
      // First try to get configuration from live preview widget
      let config = getLivePreviewConfig();
      
      // If no live preview, try to get from script attributes
      if (!config) {
        config = getConfig();
      }
      
      if (!config) {
        console.error('AI Orchestrator: No valid configuration found');
        return;
      }

      console.log('AI Orchestrator: Using configuration:', config);

      const isShopifyEnv = isShopify();
      console.log('AI Orchestrator: Environment detected - Shopify:', isShopifyEnv);

      if (isShopifyEnv) {
        console.log('AI Orchestrator: Using iframe method for Shopify compatibility');
        loadIframeWidget(config);
      } else {
        console.log('AI Orchestrator: Using standard widget for other platforms');
        loadStandardWidget(config);
      }
    }, 1000); // Wait 1 second for live preview to load
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
    
    // Add theme colors if available
    if (config.themeColors) {
      iframeUrl.searchParams.set('primaryColor', config.themeColors.primary);
      iframeUrl.searchParams.set('primaryDarkColor', config.themeColors.primaryDark);
      iframeUrl.searchParams.set('headerLightColor', config.themeColors.headerLight);
      iframeUrl.searchParams.set('headerDarkColor', config.themeColors.headerDark);
      iframeUrl.searchParams.set('textColor', config.themeColors.text);
      iframeUrl.searchParams.set('accentColor', config.themeColors.accent);
    }

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
        
        // Set up communication with iframe
        setupIframeCommunication(iframe, config);
      }, 1000);
    };

    console.log('AI Orchestrator: Shopify iframe widget initialized!');
  }

  // Set up communication with iframe for toggle functionality
  function setupIframeCommunication(iframe, config) {
    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
      // Check if message is from our iframe
      if (event.source !== iframe.contentWindow) return;
      
      const { action, data } = event.data;
      
      switch (action) {
        case 'toggleWidget':
          // Toggle the iframe visibility
          if (iframe.style.display === 'none') {
            iframe.style.display = 'block';
          } else {
            iframe.style.display = 'none';
          }
          break;
        case 'closeWidget':
          iframe.style.display = 'none';
          break;
        case 'minimizeWidget':
          iframe.style.display = 'none';
          break;
      }
    });
    
    // Send initial configuration to iframe
    iframe.contentWindow.postMessage({
      action: 'init',
      config: {
        chatbotId: config.chatbotId,
        apiKey: config.apiKey,
        theme: config.theme,
        title: config.title,
        welcomeMessage: config.welcomeMessage,
        placeholder: config.placeholder,
        showAvatar: config.showAvatar,
        primaryLanguage: config.primaryLanguage,
        themeColors: config.themeColors
      }
    }, '*');
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
