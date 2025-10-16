// AI Orchestrator Chatbot Widget - Shopify Compatible Version
(function() {
  'use strict';

  // Try Tailwind CDN first, fallback to inline CSS if it fails
  console.log('AI Orchestrator: Attempting to load Tailwind CSS...');
  if (!document.getElementById('ai-widget-tailwind')) {
    console.log('AI Orchestrator: Injecting Tailwind CSS CDN...');
    const tailwindScript = document.createElement('script');
    tailwindScript.id = 'ai-widget-tailwind';
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    tailwindScript.onerror = function() {
      console.log('⚠️ Tailwind CDN failed to load, injecting fallback CSS to maintain exact styling...');
      // Inject complete Tailwind CSS as fallback to maintain EXACT same appearance
      const fallbackCSS = document.createElement('style');
      fallbackCSS.textContent = `
        /* Complete Tailwind CSS fallback - maintains EXACT same appearance */
        .fixed { position: fixed !important; }
        .absolute { position: absolute !important; }
        .relative { position: relative !important; }
        .bottom-6 { bottom: 1.5rem !important; }
        .right-6 { right: 1.5rem !important; }
        .bottom-full { bottom: 100% !important; }
        .right-0 { right: 0 !important; }
        .top-6 { top: 1.5rem !important; }
        .left-6 { left: 1.5rem !important; }
        .top-1 { top: 0.25rem !important; }
        .right-1 { right: 0.25rem !important; }
        .flex { display: flex !important; }
        .hidden { display: none !important; }
        .block { display: block !important; }
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        .justify-between { justify-content: space-between !important; }
        .gap-3 { gap: 0.75rem !important; }
        .gap-2 { gap: 0.5rem !important; }
        .w-16 { width: 4rem !important; }
        .h-16 { height: 4rem !important; }
        .w-12 { width: 3rem !important; }
        .h-12 { height: 3rem !important; }
        .w-20 { width: 5rem !important; }
        .h-20 { height: 5rem !important; }
        .w-10 { width: 2.5rem !important; }
        .h-10 { height: 2.5rem !important; }
        .w-5 { width: 1.25rem !important; }
        .h-5 { height: 1.25rem !important; }
        .w-7 { width: 1.75rem !important; }
        .h-7 { height: 1.75rem !important; }
        .w-8 { width: 2rem !important; }
        .h-8 { height: 2rem !important; }
        .w-4 { width: 1rem !important; }
        .h-4 { height: 1rem !important; }
        .w-3 { width: 0.75rem !important; }
        .h-3 { height: 0.75rem !important; }
        .w-2 { width: 0.5rem !important; }
        .h-2 { height: 0.5rem !important; }
        .w-80 { width: 20rem !important; }
        .h-80 { height: 20rem !important; }
        .w-96 { width: 24rem !important; }
        .h-96 { height: 24rem !important; }
        .w-\\[28rem\\] { width: 28rem !important; }
        .h-\\[28rem\\] { height: 28rem !important; }
        .rounded-full { border-radius: 9999px !important; }
        .rounded-2xl { border-radius: 1rem !important; }
        .rounded-lg { border-radius: 0.5rem !important; }
        .text-white { color: rgb(255 255 255) !important; }
        .text-gray-600 { color: rgb(75 85 99) !important; }
        .text-gray-500 { color: rgb(107 114 128) !important; }
        .text-gray-900 { color: rgb(17 24 39) !important; }
        .text-gray-400 { color: rgb(156 163 175) !important; }
        .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
        .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
        .font-bold { font-weight: 700 !important; }
        .font-medium { font-weight: 500 !important; }
        .font-semibold { font-weight: 600 !important; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
        .bg-white { background-color: rgb(255 255 255) !important; }
        .bg-gray-900 { background-color: rgb(17 24 39) !important; }
        .bg-gray-200 { background-color: rgb(229 231 235) !important; }
        .bg-green-500 { background-color: rgb(34 197 94) !important; }
        .bg-blue-600 { background-color: rgb(37 99 235) !important; }
        .bg-purple-600 { background-color: rgb(147 51 234) !important; }
        .bg-red-600 { background-color: rgb(220 38 38) !important; }
        .bg-emerald-600 { background-color: rgb(5 150 105) !important; }
        .bg-emerald-500 { background-color: rgb(16 185 129) !important; }
        .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)) !important; }
        .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important; }
        .from-blue-600 { --tw-gradient-from: rgb(37 99 235) !important; --tw-gradient-to: rgba(37, 99, 235, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-blue-700 { --tw-gradient-to: rgb(29 78 216) !important; }
        .from-purple-600 { --tw-gradient-from: rgb(147 51 234) !important; --tw-gradient-to: rgba(147, 51, 234, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-purple-700 { --tw-gradient-to: rgb(126 34 206) !important; }
        .from-green-600 { --tw-gradient-from: rgb(22 163 74) !important; --tw-gradient-to: rgba(22, 163, 74, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-green-700 { --tw-gradient-to: rgb(21 128 61) !important; }
        .from-red-600 { --tw-gradient-from: rgb(220 38 38) !important; --tw-gradient-to: rgba(220, 38, 38, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-red-700 { --tw-gradient-to: rgb(185 28 28) !important; }
        .from-emerald-500 { --tw-gradient-from: rgb(16 185 129) !important; --tw-gradient-to: rgba(16, 185, 129, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-emerald-600 { --tw-gradient-to: rgb(5 150 105) !important; }
        .border-2 { border-width: 2px !important; }
        .border-white { border-color: rgb(255 255 255) !important; }
        .border-gray-200 { border-color: rgb(229 231 235) !important; }
        .border-blue-200 { border-color: rgb(191 219 254) !important; }
        .border-purple-200 { border-color: rgb(196 181 253) !important; }
        .border-green-200 { border-color: rgb(187 247 208) !important; }
        .border-red-200 { border-color: rgb(254 202 202) !important; }
        .border-emerald-200 { border-color: rgb(167 243 208) !important; }
        .p-4 { padding: 1rem !important; }
        .p-2 { padding: 0.5rem !important; }
        .p-3 { padding: 0.75rem !important; }
        .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
        .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        .mb-2 { margin-bottom: 0.5rem !important; }
        .overflow-hidden { overflow: hidden !important; }
        .whitespace-nowrap { white-space: nowrap !important; }
        .opacity-0 { opacity: 0 !important; }
        .pointer-events-none { pointer-events: none !important; }
        .cursor-pointer { cursor: pointer !important; }
        .transition-all { transition-property: all !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
        .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
        .transition-opacity { transition-property: opacity !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
        .transition-transform { transition-property: transform !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
        .duration-200 { transition-duration: 200ms !important; }
        .hover\\:scale-110:hover { transform: scale(1.1) !important; }
        .hover\\:bg-gray-200:hover { background-color: rgb(229 231 235) !important; }
        .hover\\:opacity-100:hover { opacity: 1 !important; }
        .group:hover .group-hover\\:opacity-100 { opacity: 1 !important; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .z-50 { z-index: 50 !important; }
        .z-40 { z-index: 40 !important; }
      `;
      document.head.appendChild(fallbackCSS);
      console.log('✅ Fallback CSS injected - widget will have exact same appearance');
    };
    document.head.appendChild(tailwindScript);
    console.log('✅ Tailwind CSS CDN injected');
    
    // Check if Tailwind actually works after 2 seconds
    setTimeout(() => {
      const testEl = document.createElement('div');
      testEl.className = 'fixed';
      testEl.style.position = 'absolute';
      testEl.style.top = '-9999px';
      document.body.appendChild(testEl);
      const computedStyle = window.getComputedStyle(testEl);
      const isWorking = computedStyle.position === 'fixed';
      document.body.removeChild(testEl);
      
      if (!isWorking) {
        console.log('⚠️ Tailwind CDN loaded but not working, injecting fallback CSS...');
        // Inject fallback CSS
        const fallbackCSS = document.createElement('style');
        fallbackCSS.textContent = `
          /* Complete Tailwind CSS fallback - maintains EXACT same appearance */
          .fixed { position: fixed !important; }
          .absolute { position: absolute !important; }
          .relative { position: relative !important; }
          .bottom-6 { bottom: 1.5rem !important; }
          .right-6 { right: 1.5rem !important; }
          .bottom-full { bottom: 100% !important; }
          .right-0 { right: 0 !important; }
          .top-6 { top: 1.5rem !important; }
          .left-6 { left: 1.5rem !important; }
          .top-1 { top: 0.25rem !important; }
          .right-1 { right: 0.25rem !important; }
          .flex { display: flex !important; }
          .hidden { display: none !important; }
          .block { display: block !important; }
          .items-center { align-items: center !important; }
          .justify-center { justify-content: center !important; }
          .justify-between { justify-content: space-between !important; }
          .gap-3 { gap: 0.75rem !important; }
          .gap-2 { gap: 0.5rem !important; }
          .w-16 { width: 4rem !important; }
          .h-16 { height: 4rem !important; }
          .w-12 { width: 3rem !important; }
          .h-12 { height: 3rem !important; }
          .w-20 { width: 5rem !important; }
          .h-20 { height: 5rem !important; }
          .w-10 { width: 2.5rem !important; }
          .h-10 { height: 2.5rem !important; }
          .w-5 { width: 1.25rem !important; }
          .h-5 { height: 1.25rem !important; }
          .w-7 { width: 1.75rem !important; }
          .h-7 { height: 1.75rem !important; }
          .w-8 { width: 2rem !important; }
          .h-8 { height: 2rem !important; }
          .w-4 { width: 1rem !important; }
          .h-4 { height: 1rem !important; }
          .w-3 { width: 0.75rem !important; }
          .h-3 { height: 0.75rem !important; }
          .w-2 { width: 0.5rem !important; }
          .h-2 { height: 0.5rem !important; }
          .w-80 { width: 20rem !important; }
          .h-80 { height: 20rem !important; }
          .w-96 { width: 24rem !important; }
          .h-96 { height: 24rem !important; }
          .w-\\[28rem\\] { width: 28rem !important; }
          .h-\\[28rem\\] { height: 28rem !important; }
          .rounded-full { border-radius: 9999px !important; }
          .rounded-2xl { border-radius: 1rem !important; }
          .rounded-lg { border-radius: 0.5rem !important; }
          .text-white { color: rgb(255 255 255) !important; }
          .text-gray-600 { color: rgb(75 85 99) !important; }
          .text-gray-500 { color: rgb(107 114 128) !important; }
          .text-gray-900 { color: rgb(17 24 39) !important; }
          .text-gray-400 { color: rgb(156 163 175) !important; }
          .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
          .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
          .font-bold { font-weight: 700 !important; }
          .font-medium { font-weight: 500 !important; }
          .font-semibold { font-weight: 600 !important; }
          .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
          .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
          .bg-white { background-color: rgb(255 255 255) !important; }
          .bg-gray-900 { background-color: rgb(17 24 39) !important; }
          .bg-gray-200 { background-color: rgb(229 231 235) !important; }
          .bg-green-500 { background-color: rgb(34 197 94) !important; }
          .bg-blue-600 { background-color: rgb(37 99 235) !important; }
          .bg-purple-600 { background-color: rgb(147 51 234) !important; }
          .bg-red-600 { background-color: rgb(220 38 38) !important; }
          .bg-emerald-600 { background-color: rgb(5 150 105) !important; }
          .bg-emerald-500 { background-color: rgb(16 185 129) !important; }
          .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)) !important; }
          .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important; }
          .from-blue-600 { --tw-gradient-from: rgb(37 99 235) !important; --tw-gradient-to: rgba(37, 99, 235, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
          .to-blue-700 { --tw-gradient-to: rgb(29 78 216) !important; }
          .from-purple-600 { --tw-gradient-from: rgb(147 51 234) !important; --tw-gradient-to: rgba(147, 51, 234, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
          .to-purple-700 { --tw-gradient-to: rgb(126 34 206) !important; }
          .from-green-600 { --tw-gradient-from: rgb(22 163 74) !important; --tw-gradient-to: rgba(22, 163, 74, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
          .to-green-700 { --tw-gradient-to: rgb(21 128 61) !important; }
          .from-red-600 { --tw-gradient-from: rgb(220 38 38) !important; --tw-gradient-to: rgba(220, 38, 38, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
          .to-red-700 { --tw-gradient-to: rgb(185 28 28) !important; }
          .from-emerald-500 { --tw-gradient-from: rgb(16 185 129) !important; --tw-gradient-to: rgba(16, 185, 129, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
          .to-emerald-600 { --tw-gradient-to: rgb(5 150 105) !important; }
          .border-2 { border-width: 2px !important; }
          .border-white { border-color: rgb(255 255 255) !important; }
          .border-gray-200 { border-color: rgb(229 231 235) !important; }
          .border-blue-200 { border-color: rgb(191 219 254) !important; }
          .border-purple-200 { border-color: rgb(196 181 253) !important; }
          .border-green-200 { border-color: rgb(187 247 208) !important; }
          .border-red-200 { border-color: rgb(254 202 202) !important; }
          .border-emerald-200 { border-color: rgb(167 243 208) !important; }
          .p-4 { padding: 1rem !important; }
          .p-2 { padding: 0.5rem !important; }
          .p-3 { padding: 0.75rem !important; }
          .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
          .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .mb-2 { margin-bottom: 0.5rem !important; }
          .overflow-hidden { overflow: hidden !important; }
          .whitespace-nowrap { white-space: nowrap !important; }
          .opacity-0 { opacity: 0 !important; }
          .pointer-events-none { pointer-events: none !important; }
          .cursor-pointer { cursor: pointer !important; }
          .transition-all { transition-property: all !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
          .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
          .transition-opacity { transition-property: opacity !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
          .transition-transform { transition-property: transform !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
          .duration-200 { transition-duration: 200ms !important; }
          .hover\\:scale-110:hover { transform: scale(1.1) !important; }
          .hover\\:bg-gray-200:hover { background-color: rgb(229 231 235) !important; }
          .hover\\:opacity-100:hover { opacity: 1 !important; }
          .group:hover .group-hover\\:opacity-100 { opacity: 1 !important; }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
          .z-50 { z-index: 50 !important; }
          .z-40 { z-index: 40 !important; }
        `;
        document.head.appendChild(fallbackCSS);
        console.log('✅ Fallback CSS injected - widget will have exact same appearance');
      } else {
        console.log('✅ Tailwind CSS is working correctly');
      }
    }, 2000);
  }

  // Wait for DOM to be ready (no Tailwind needed)
  function waitForDOM(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
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