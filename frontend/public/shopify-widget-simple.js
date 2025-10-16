// AI Orchestrator Simple Shopify Widget - Direct DOM approach
(function() {
  'use strict';
  
  console.log('AI Orchestrator: Loading simple Shopify widget...');
  
  // Parse configuration from script tag
  const script = document.currentScript;
  const config = {
    chatbotId: script.getAttribute('data-chatbot-id') || 'default',
    apiKey: script.getAttribute('data-api-key') || 'demo-key',
    theme: script.getAttribute('data-theme') || 'teal',
    title: script.getAttribute('data-title') || 'My AI',
    welcomeMessage: script.getAttribute('data-welcome-message') || 'Hello! I\'m your ai',
    placeholder: script.getAttribute('data-placeholder') || 'Type your id',
    showAvatar: script.getAttribute('data-show-avatar') !== 'false',
    primaryLanguage: script.getAttribute('data-primary-language') || 'en'
  };
  
  console.log('AI Orchestrator: Config:', config);
  
  // Theme colors
  const getThemeColors = (themeName) => {
    const themeMap = {
      'teal': {
        primary: 'rgb(13 148 136)',
        primaryDark: 'rgb(15 118 110)',
        secondary: 'rgb(153 246 228)',
        secondaryLight: 'rgb(94 234 212)',
        text: 'rgb(19 78 74)',
        textLight: 'rgb(75 85 99)',
        border: 'rgb(153 246 228)'
      },
      'blue': {
        primary: 'rgb(37 99 235)',
        primaryDark: 'rgb(29 78 216)',
        secondary: 'rgb(191 219 254)',
        secondaryLight: 'rgb(147 197 253)',
        text: 'rgb(30 64 175)',
        textLight: 'rgb(75 85 99)',
        border: 'rgb(191 219 254)'
      }
    };
    return themeMap[themeName] || themeMap['teal'];
  };
  
  const themeColors = getThemeColors(config.theme);
  
  // Remove any existing widgets
  const existingWidgets = document.querySelectorAll('[id*="ai-orchestrator"]');
  existingWidgets.forEach(widget => widget.remove());
  
  // Create main container
  const container = document.createElement('div');
  container.id = 'ai-orchestrator-simple-widget';
  container.style.cssText = `
    position: fixed !important;
    bottom: 1.5rem !important;
    right: 1.5rem !important;
    z-index: 999999999 !important;
    width: auto !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: none !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 16px !important;
    line-height: 1.5 !important;
    color: #000 !important;
    text-align: left !important;
    direction: ltr !important;
    unicode-bidi: normal !important;
    writing-mode: horizontal-tb !important;
    text-rendering: auto !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    pointer-events: auto !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    transform: none !important;
    box-sizing: border-box !important;
  `;
  
  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.id = 'ai-orchestrator-toggle-' + config.chatbotId;
  toggleButton.style.cssText = `
    position: relative !important;
    width: 4rem !important;
    height: 4rem !important;
    border-radius: 50% !important;
    background: linear-gradient(135deg, ${themeColors.primary}, ${themeColors.primaryDark}) !important;
    border: none !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: transform 0.2s ease !important;
    margin: 0 !important;
    padding: 0 !important;
    outline: none !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 1rem !important;
    font-weight: normal !important;
    line-height: 1 !important;
    color: white !important;
    text-decoration: none !important;
    text-align: center !important;
    vertical-align: middle !important;
    white-space: nowrap !important;
    overflow: visible !important;
    box-sizing: border-box !important;
    transform: none !important;
    animation: none !important;
    opacity: 1 !important;
    visibility: visible !important;
    z-index: 999999999 !important;
  `;
  
  // Add SVG to toggle button
  const toggleSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  toggleSVG.setAttribute('width', '28');
  toggleSVG.setAttribute('height', '28');
  toggleSVG.setAttribute('fill', 'none');
  toggleSVG.setAttribute('stroke', 'currentColor');
  toggleSVG.setAttribute('viewBox', '0 0 24 24');
  toggleSVG.style.cssText = `
    width: 1.75rem !important;
    height: 1.75rem !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    outline: none !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 1rem !important;
    font-weight: normal !important;
    line-height: 1 !important;
    color: white !important;
    text-decoration: none !important;
    text-align: center !important;
    vertical-align: middle !important;
    white-space: nowrap !important;
    overflow: visible !important;
    position: relative !important;
    z-index: 1 !important;
    min-width: 1.75rem !important;
    min-height: 1.75rem !important;
    max-width: 1.75rem !important;
    max-height: 1.75rem !important;
    box-sizing: border-box !important;
    box-shadow: none !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
    opacity: 1 !important;
    visibility: visible !important;
  `;
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('d', 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z');
  toggleSVG.appendChild(path);
  toggleButton.appendChild(toggleSVG);
  
  // Add status dot
  const statusDot = document.createElement('div');
  statusDot.style.cssText = `
    position: absolute !important;
    top: -4px !important;
    right: -4px !important;
    width: 12px !important;
    height: 12px !important;
    background: rgb(34 197 94) !important;
    border-radius: 50% !important;
    border: 2px solid white !important;
    margin: 0 !important;
    padding: 0 !important;
    outline: none !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 1rem !important;
    font-weight: normal !important;
    line-height: 1 !important;
    color: transparent !important;
    text-decoration: none !important;
    text-align: center !important;
    vertical-align: middle !important;
    white-space: nowrap !important;
    overflow: visible !important;
    box-sizing: border-box !important;
    box-shadow: none !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
    opacity: 1 !important;
    visibility: visible !important;
  `;
  toggleButton.appendChild(statusDot);
  
  // Create chat widget
  const chatWidget = document.createElement('div');
  chatWidget.id = 'ai-orchestrator-chat-' + config.chatbotId;
  chatWidget.style.cssText = `
    position: fixed !important;
    bottom: 6rem !important;
    right: 1.5rem !important;
    z-index: 999999998 !important;
    width: 24rem !important;
    height: 32rem !important;
    background: white !important;
    border-radius: 1rem !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
    border: 1px solid rgb(229 231 235) !important;
    overflow: hidden !important;
    display: none !important;
    margin: 0 !important;
    padding: 0 !important;
    outline: none !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 1rem !important;
    font-weight: normal !important;
    line-height: 1.5 !important;
    color: rgb(17 24 39) !important;
    text-decoration: none !important;
    text-align: left !important;
    vertical-align: baseline !important;
    white-space: normal !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
    box-sizing: border-box !important;
  `;
  
  // Add elements to container
  container.appendChild(toggleButton);
  container.appendChild(chatWidget);
  
  // Add to page
  document.body.appendChild(container);
  
  console.log('AI Orchestrator: Simple widget added to DOM');
  console.log('AI Orchestrator: Container dimensions:', {
    width: container.offsetWidth,
    height: container.offsetHeight,
    visible: container.offsetWidth > 0 && container.offsetHeight > 0
  });
  
  // Widget functionality
  let isOpen = false;
  
  // Toggle function
  function toggleWidget() {
    console.log('AI Orchestrator: Toggle clicked!');
    isOpen = !isOpen;
    if (isOpen) {
      chatWidget.style.display = 'block';
      toggleButton.style.display = 'none';
      console.log('AI Orchestrator: Chat opened');
    } else {
      chatWidget.style.display = 'none';
      toggleButton.style.display = 'flex';
      console.log('AI Orchestrator: Chat closed');
    }
  }
  
  // Event listener
  toggleButton.addEventListener('click', toggleWidget);
  
  // Force visibility check
  setTimeout(() => {
    console.log('AI Orchestrator: Final visibility check:', {
      containerVisible: container.offsetWidth > 0,
      toggleVisible: toggleButton.offsetWidth > 0,
      containerRect: container.getBoundingClientRect(),
      toggleRect: toggleButton.getBoundingClientRect()
    });
  }, 1000);
  
  console.log('AI Orchestrator: Simple Shopify widget loaded successfully!');
})();
