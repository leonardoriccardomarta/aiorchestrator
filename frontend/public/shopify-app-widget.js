// AI Orchestrator Shopify Widget - EXACT COPY FROM CHATBOT-WIDGET.JS
(function() {
  'use strict';
  
  console.log('AI Orchestrator: Loading Shopify widget...');
  
  // Configurazione dal window
  const config = window.AIOrchestratorConfig || {
    chatbotId: 'default',
    apiKey: 'https://aiorchestrator-vtihz.ondigitalocean.app',
    theme: 'teal',
    title: 'AI Support',
    placeholder: 'Type your message...',
    showAvatar: true,
    welcomeMessage: 'Hello! How can I help you today?',
    primaryLanguage: 'en',
    primaryColor: '#14b8a6',
    primaryDarkColor: '#0d9488',
    headerLightColor: '#14b8a6',
    headerDarkColor: '#0d9488',
    textColor: '#1f2937',
    accentColor: '#14b8a6'
  };
  
  console.log('AI Orchestrator: Using configuration:', config);

  // Rimuovi widget esistenti
  const existingWidgets = document.querySelectorAll('[id*="ai-widget"], [id*="ai-orchestrator"]');
  existingWidgets.forEach(widget => widget.remove());

  // Crea widget IDENTICO al chatbot-widget.js
  function createExactWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = `ai-orchestrator-widget-${config.chatbotId}`;
    widgetContainer.style.cssText = `
      position: fixed !important;
      bottom: 0 !important;
      right: 0 !important;
      z-index: 999999999 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
    `;
    
    // Widget HTML IDENTICO al chatbot-widget.js
    widgetContainer.innerHTML = `
      <!-- Toggle Button -->
      <div id="ai-orchestrator-toggle-${config.chatbotId}" class="ai-widget-toggle" style="
        position: fixed !important;
        bottom: 1.5rem !important;
        right: 1.5rem !important;
        width: 4rem !important;
        height: 4rem !important;
        background: ${config.primaryColor} !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        transition: all 0.3s ease !important;
        border: none !important;
        z-index: 999999999 !important;
      ">
        <svg style="width: 1.5rem !important; height: 1.5rem !important; color: white !important;" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>

      <!-- Chat Widget -->
      <div id="ai-orchestrator-chat-${config.chatbotId}" class="ai-widget-chat" style="
        position: fixed !important;
        bottom: 5.5rem !important;
        right: 1.5rem !important;
        width: 22rem !important;
        height: 32rem !important;
        background: white !important;
        border-radius: 1rem !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
        display: none !important;
        flex-direction: column !important;
        overflow: hidden !important;
        border: 1px solid #e5e7eb !important;
        z-index: 999999999 !important;
      ">
        <!-- Header -->
        <div class="ai-widget-header" style="
          background: ${config.headerLightColor} !important;
          color: white !important;
          padding: 1rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          border-radius: 1rem 1rem 0 0 !important;
        ">
          <div class="ai-widget-title" style="
            font-size: 1rem !important;
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          ">
            ${config.showAvatar ? `
              <div class="ai-widget-avatar" style="
                width: 2rem !important;
                height: 2rem !important;
                border-radius: 50% !important;
                background: rgba(255, 255, 255, 0.2) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin-right: 0.5rem !important;
                font-size: 1rem !important;
              ">🤖</div>
            ` : ''}
            ${config.title}
          </div>
          <div class="header-right" style="
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          ">
            <button id="ai-orchestrator-minimize-${config.chatbotId}" class="header-button" style="
              color: white !important;
              background: none !important;
              border: none !important;
              cursor: pointer !important;
              padding: 0.25rem !important;
              border-radius: 0.25rem !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h12v2H6z"/>
              </svg>
            </button>
            <button id="ai-orchestrator-close-${config.chatbotId}" class="header-button" style="
              color: white !important;
              background: none !important;
              border: none !important;
              cursor: pointer !important;
              padding: 0.25rem !important;
              border-radius: 0.25rem !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div id="ai-orchestrator-messages-${config.chatbotId}" class="ai-widget-messages" style="
          flex: 1 !important;
          padding: 1rem !important;
          overflow-y: auto !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 1rem !important;
        ">
          <div class="ai-widget-message bot" style="
            max-width: 80% !important;
            padding: 0.75rem 1rem !important;
            border-radius: 1rem 1rem 1rem 0.25rem !important;
            font-size: 0.875rem !important;
            line-height: 1.4 !important;
            background: #f3f4f6 !important;
            color: ${config.textColor} !important;
            align-self: flex-start !important;
          ">
            ${config.welcomeMessage}
          </div>
        </div>

        <!-- Input -->
        <div class="ai-widget-input-container" style="
          padding: 1rem !important;
          border-top: 1px solid #e5e7eb !important;
          display: flex !important;
          gap: 0.5rem !important;
          align-items: center !important;
        ">
          <input 
            type="text" 
            id="ai-orchestrator-input-${config.chatbotId}" 
            placeholder="${config.placeholder}"
            style="
              flex: 1 !important;
              border: 1px solid #d1d5db !important;
              border-radius: 0.5rem !important;
              padding: 0.75rem !important;
              font-size: 0.875rem !important;
              outline: none !important;
              transition: border-color 0.2s !important;
            "
          >
          <button id="ai-orchestrator-send-${config.chatbotId}" style="
            background: ${config.primaryColor} !important;
            color: white !important;
            border: none !important;
            border-radius: 0.5rem !important;
            padding: 0.75rem !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: background-color 0.2s !important;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    return widgetContainer;
  }
  
  // Crea widget
  const widget = createExactWidget();
  document.body.appendChild(widget);
  
  // Event listeners
  const toggle = document.getElementById(`ai-orchestrator-toggle-${config.chatbotId}`);
  const chat = document.getElementById(`ai-orchestrator-chat-${config.chatbotId}`);
  const close = document.getElementById(`ai-orchestrator-close-${config.chatbotId}`);
  const minimize = document.getElementById(`ai-orchestrator-minimize-${config.chatbotId}`);
  const input = document.getElementById(`ai-orchestrator-input-${config.chatbotId}`);
  const send = document.getElementById(`ai-orchestrator-send-${config.chatbotId}`);
  const messages = document.getElementById(`ai-orchestrator-messages-${config.chatbotId}`);
  
  let isOpen = false;
  
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    chat.style.display = isOpen ? 'flex' : 'none';
  });
  
  close.addEventListener('click', () => {
    isOpen = false;
    chat.style.display = 'none';
  });
  
  minimize.addEventListener('click', () => {
    isOpen = false;
    chat.style.display = 'none';
  });
  
  send.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  function sendMessage() {
    const message = input.value.trim();
    if (!message) return;
    
    // Aggiungi messaggio utente
    const userMessage = document.createElement('div');
    userMessage.className = 'ai-widget-message user';
    userMessage.style.cssText = `
      max-width: 80% !important;
      padding: 0.75rem 1rem !important;
      border-radius: 1rem 1rem 0.25rem 1rem !important;
      font-size: 0.875rem !important;
      line-height: 1.4 !important;
      background: ${config.primaryColor} !important;
      color: white !important;
      align-self: flex-end !important;
    `;
    userMessage.textContent = message;
    messages.appendChild(userMessage);
    
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    // Simula risposta bot
    setTimeout(() => {
      const botMessage = document.createElement('div');
      botMessage.className = 'ai-widget-message bot';
      botMessage.style.cssText = `
        max-width: 80% !important;
        padding: 0.75rem 1rem !important;
        border-radius: 1rem 1rem 1rem 0.25rem !important;
        font-size: 0.875rem !important;
        line-height: 1.4 !important;
        background: #f3f4f6 !important;
        color: ${config.textColor} !important;
        align-self: flex-start !important;
      `;
      botMessage.textContent = 'Grazie per il tuo messaggio! Come posso aiutarti?';
      messages.appendChild(botMessage);
      messages.scrollTop = messages.scrollHeight;
    }, 1000);
  }
  
  console.log('✅ AI Orchestrator Shopify Widget loaded successfully!');
})();