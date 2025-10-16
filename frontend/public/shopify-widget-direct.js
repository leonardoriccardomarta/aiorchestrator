// AI Orchestrator Direct Shopify Widget - Bypasses all Shopify CSS
(function() {
  'use strict';
  
  console.log('AI Orchestrator: Loading direct Shopify widget...');
  console.log('AI Orchestrator: Document ready state:', document.readyState);
  console.log('AI Orchestrator: Body exists:', !!document.body);
  
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
  
  // Create completely isolated container
  const container = document.createElement('div');
  container.id = 'ai-orchestrator-direct-widget';
  container.style.cssText = `
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
  `;
  
  console.log('AI Orchestrator: Container created with styles');
  
  // Create shadow DOM for complete isolation
  const shadowRoot = container.attachShadow({ mode: 'open' });
  
  // Add CSS reset and styles
  const style = document.createElement('style');
  style.textContent = `
    * {
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      border: none !important;
      outline: none !important;
      background: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: inherit !important;
      font-weight: normal !important;
      line-height: 1.5 !important;
      color: inherit !important;
      text-decoration: none !important;
      text-align: left !important;
      vertical-align: baseline !important;
      white-space: normal !important;
      overflow: visible !important;
      position: static !important;
      z-index: auto !important;
      width: auto !important;
      height: auto !important;
      min-width: 0 !important;
      min-height: 0 !important;
      max-width: none !important;
      max-height: none !important;
      box-shadow: none !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    #widget-container {
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
      pointer-events: auto !important;
    }
    
    #toggleButton {
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
    }
    
    #toggleButton:hover {
      transform: scale(1.1) !important;
    }
    
    #toggleButton svg {
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
    }
    
    .status-dot {
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
    }
    
    #chatWidget {
      width: 24rem !important;
      height: 32rem !important;
      background: white !important;
      border-radius: 1rem !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      border: 1px solid rgb(229 231 235) !important;
      overflow: hidden !important;
      position: fixed !important;
      bottom: 6rem !important;
      right: 1.5rem !important;
      z-index: 999999998 !important;
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
    }
    
    #chatWidget.show {
      display: block !important;
    }
    
    .header {
      background: linear-gradient(135deg, ${themeColors.secondary}, ${themeColors.secondaryLight}) !important;
      border-bottom: 2px solid ${themeColors.border} !important;
      padding: 1rem !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      margin: 0 !important;
      border: none !important;
      outline: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 1rem !important;
      font-weight: normal !important;
      line-height: 1.5 !important;
      color: ${themeColors.text} !important;
      text-decoration: none !important;
      text-align: left !important;
      vertical-align: baseline !important;
      white-space: normal !important;
      overflow: visible !important;
      position: relative !important;
      z-index: 1 !important;
      width: 100% !important;
      height: auto !important;
      min-height: auto !important;
      max-height: none !important;
      box-sizing: border-box !important;
    }
    
    .header-left {
      display: flex !important;
      align-items: center !important;
      gap: 0.75rem !important;
    }
    
    .avatar {
      width: 2.5rem !important;
      height: 2.5rem !important;
      background: linear-gradient(135deg, ${themeColors.primary}, ${themeColors.primaryDark}) !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    .title {
      font-weight: 700 !important;
      color: ${themeColors.text} !important;
      font-size: 1rem !important;
      line-height: 1.25rem !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      outline: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      text-decoration: none !important;
      text-align: left !important;
      vertical-align: baseline !important;
      white-space: normal !important;
      overflow: visible !important;
      position: relative !important;
      z-index: 1 !important;
      width: auto !important;
      height: auto !important;
      min-height: auto !important;
      max-height: none !important;
      box-sizing: border-box !important;
      background: none !important;
      box-shadow: none !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    .status {
      font-size: 0.75rem !important;
      color: rgb(75 85 99) !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.25rem !important;
    }
    
    .status-dot-small {
      width: 0.5rem !important;
      height: 0.5rem !important;
      background: rgb(34 197 94) !important;
      border-radius: 50% !important;
    }
    
    .header-right {
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
    }
    
    .header-button {
      color: rgb(75 85 99) !important;
      background: none !important;
      border: none !important;
      padding: 0.5rem !important;
      border-radius: 0.5rem !important;
      cursor: pointer !important;
      transition: background-color 0.2s ease !important;
    }
    
    .header-button:hover {
      background: rgb(229 231 235) !important;
    }
    
    #messagesContainer {
      height: 24rem !important;
      overflow-y: auto !important;
      padding: 1rem !important;
      background: rgb(249 250 251) !important;
      margin: 0 !important;
      border: none !important;
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
      position: relative !important;
      z-index: 1 !important;
      width: 100% !important;
      min-height: 24rem !important;
      max-height: 24rem !important;
      box-sizing: border-box !important;
      box-shadow: none !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    #messagesContainer::-webkit-scrollbar {
      width: 6px !important;
    }
    #messagesContainer::-webkit-scrollbar-track {
      background: #f1f1f1 !important;
      border-radius: 3px !important;
    }
    #messagesContainer::-webkit-scrollbar-thumb {
      background: #c1c1c1 !important;
      border-radius: 3px !important;
    }
    #messagesContainer::-webkit-scrollbar-thumb:hover {
      background: #a1a1a1 !important;
    }
    
    .input-area {
      padding: 1rem !important;
      background: white !important;
      border-top: 1px solid rgb(229 231 235) !important;
      display: flex !important;
      gap: 0.5rem !important;
    }
    
    #messageInput {
      flex: 1 !important;
      padding: 0.75rem 1rem !important;
      border: 1px solid rgb(209 213 219) !important;
      border-radius: 0.5rem !important;
      font-size: 0.875rem !important;
      line-height: 1.25rem !important;
      outline: none !important;
      background: white !important;
    }
    
    #messageInput:focus {
      border-color: ${themeColors.primary} !important;
      box-shadow: 0 0 0 2px ${themeColors.primary.replace('rgb', 'rgba').replace(')', ', 0.2)')} !important;
    }
    
    #sendButton {
      background: ${themeColors.primary} !important;
      color: white !important;
      border: none !important;
      border-radius: 0.5rem !important;
      padding: 0.75rem 1rem !important;
      cursor: pointer !important;
      transition: opacity 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-width: 3rem !important;
      height: 2.75rem !important;
    }
    
    #sendButton:hover {
      opacity: 0.9 !important;
    }
    
    #sendButton svg {
      width: 1.25rem !important;
      height: 1.25rem !important;
    }
  `;
  
  shadowRoot.appendChild(style);
  
  // Create widget HTML
  const widgetHTML = `
    <div id="widget-container">
      <button id="toggleButton">
        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <div class="status-dot"></div>
      </button>
      
      <div id="chatWidget">
        <div class="header">
          <div class="header-left">
            <div class="avatar">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <div class="title">${config.title}</div>
              <div class="status">
                <div class="status-dot-small"></div>
                Online 24/7
                <span style="background: rgb(229 231 235); color: rgb(75 85 99); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.625rem; font-weight: 500; margin-left: 0.5rem;">EN</span>
              </div>
            </div>
          </div>
          <div class="header-right">
            <button class="header-button" id="minimizeButton">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <button class="header-button" id="closeButton">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div id="messagesContainer">
          <div style="font-size: 0.875rem; line-height: 1.25rem;">${config.welcomeMessage}</div>
          <div style="font-size: 0.75rem; margin-top: 0.25rem; color: rgb(107 114 128);">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        
        <div class="input-area">
          <input id="messageInput" type="text" placeholder="${config.placeholder}" />
          <button id="sendButton">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  shadowRoot.innerHTML = widgetHTML;
  
  // Add to page
  document.body.appendChild(container);
  console.log('AI Orchestrator: Widget container added to DOM');
  console.log('AI Orchestrator: Container in DOM:', document.body.contains(container));
  console.log('AI Orchestrator: Shadow root created:', !!shadowRoot);
  
  // Widget functionality
  let isOpen = false;
  let conversationHistory = [];
  
  const toggleButton = shadowRoot.getElementById('toggleButton');
  const chatWidget = shadowRoot.getElementById('chatWidget');
  const messagesContainer = shadowRoot.getElementById('messagesContainer');
  const messageInput = shadowRoot.getElementById('messageInput');
  const sendButton = shadowRoot.getElementById('sendButton');
  const closeButton = shadowRoot.getElementById('closeButton');
  const minimizeButton = shadowRoot.getElementById('minimizeButton');
  
  // Toggle widget
  function toggleWidget() {
    isOpen = !isOpen;
    if (isOpen) {
      chatWidget.classList.add('show');
      toggleButton.style.display = 'none';
    } else {
      chatWidget.classList.remove('show');
      toggleButton.style.display = 'flex';
    }
  }
  
  // Close widget
  function closeWidget() {
    isOpen = false;
    chatWidget.classList.remove('show');
    toggleButton.style.display = 'flex';
  }
  
  // Minimize widget
  function minimizeWidget() {
    isOpen = false;
    chatWidget.classList.remove('show');
    toggleButton.style.display = 'flex';
  }
  
  // Send message
  async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    conversationHistory.push({ role: 'user', content: message });
    
    const userMessageDiv = document.createElement('div');
    userMessageDiv.style.cssText = `
      margin-bottom: 1rem !important;
      display: flex !important;
      justify-content: flex-end !important;
    `;
    
    const userBubble = document.createElement('div');
    userBubble.style.cssText = `
      background: ${themeColors.primary} !important;
      color: white !important;
      padding: 0.75rem 1rem !important;
      border-radius: 1rem 1rem 0.25rem 1rem !important;
      max-width: 80% !important;
      word-wrap: break-word !important;
    `;
    userBubble.textContent = message;
    userMessageDiv.appendChild(userBubble);
    messagesContainer.appendChild(userMessageDiv);
    
    messageInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.style.cssText = `
      margin-bottom: 1rem !important;
      display: flex !important;
      justify-content: flex-start !important;
    `;
    
    const typingBubble = document.createElement('div');
    typingBubble.style.cssText = `
      background: white !important;
      color: rgb(75 85 99) !important;
      padding: 0.75rem 1rem !important;
      border-radius: 1rem 1rem 1rem 0.25rem !important;
      max-width: 80% !important;
      word-wrap: break-word !important;
      border: 1px solid rgb(229 231 235) !important;
    `;
    typingBubble.innerHTML = '...';
    typingDiv.appendChild(typingBubble);
    messagesContainer.appendChild(typingDiv);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      typingDiv.remove();
      
      // Add bot response
      const botMessageDiv = document.createElement('div');
      botMessageDiv.style.cssText = `
        margin-bottom: 1rem !important;
        display: flex !important;
        justify-content: flex-start !important;
      `;
      
      const botBubble = document.createElement('div');
      botBubble.style.cssText = `
        background: white !important;
        color: rgb(17 24 39) !important;
        padding: 0.75rem 1rem !important;
        border-radius: 1rem 1rem 1rem 0.25rem !important;
        max-width: 80% !important;
        word-wrap: break-word !important;
        border: 1px solid rgb(229 231 235) !important;
      `;
      botBubble.textContent = 'Thank you for your message! This is a demo response.';
      botMessageDiv.appendChild(botBubble);
      messagesContainer.appendChild(botMessageDiv);
      
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
    } catch (error) {
      console.error('Error sending message:', error);
      typingDiv.remove();
    }
  }
  
  // Event listeners
  toggleButton.addEventListener('click', toggleWidget);
  closeButton.addEventListener('click', closeWidget);
  minimizeButton.addEventListener('click', minimizeWidget);
  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
  
  console.log('AI Orchestrator: Direct Shopify widget loaded successfully!');
  console.log('AI Orchestrator: Toggle button found:', !!toggleButton);
  console.log('AI Orchestrator: Chat widget found:', !!chatWidget);
  console.log('AI Orchestrator: Widget should be visible now');
  
  // Debug positioning
  const widgetContainer = shadowRoot.getElementById('widget-container');
  if (widgetContainer) {
    const rect = widgetContainer.getBoundingClientRect();
    console.log('AI Orchestrator: Widget position:', {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    });
  }
})();
