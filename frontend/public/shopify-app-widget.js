// Widget completamente isolato per Shopify
(function() {
  'use strict';
  
  // Configurazione dal tuo SaaS - sincronizzata con live preview
  let config = window.AIOrchestratorConfig || {
    chatbotId: 'default',
    apiKey: '',
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

  // Funzione per sincronizzare con live preview
  function syncWithLivePreview() {
    // Cerca il widget live preview nella pagina
    const liveWidget = document.querySelector('[id*="ai-orchestrator-widget"]:not([id*="ai-orchestrator-widget-' + config.chatbotId + '"])');
    
    if (liveWidget) {
      console.log('🔄 Syncing with live preview widget...');
      
      // Estrai configurazione dal live widget
      const liveConfig = window.AIOrchestratorConfig || {};
      
      // Aggiorna configurazione locale
      config = { ...config, ...liveConfig };
      
      // Aggiorna i colori del tema
      updateThemeColors();
      
      console.log('✅ Synced with live preview:', config);
    }
  }

  // Funzione per aggiornare i colori del tema
  function updateThemeColors() {
    const colors = {
      primary: config.primaryColor || '#14b8a6',
      primaryDark: config.primaryDarkColor || '#0d9488'
    };
    
    // Aggiorna i colori del toggle button
    const toggleBtn = document.getElementById(`ai-orchestrator-toggle-${config.chatbotId}`);
    if (toggleBtn) {
      toggleBtn.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`;
    }
    
    // Aggiorna i colori dell'header
    const header = document.querySelector(`#ai-orchestrator-chat-${config.chatbotId} > div:first-child`);
    if (header) {
      header.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`;
    }
    
    // Aggiorna i colori del send button
    const sendBtn = document.getElementById(`send-btn-${config.chatbotId}`);
    if (sendBtn) {
      sendBtn.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`;
    }
  }
  
  // Colori del tema
  const themeColors = {
    teal: { primary: '#14b8a6', primaryDark: '#0d9488' },
    blue: { primary: '#3b82f6', primaryDark: '#1d4ed8' },
    purple: { primary: '#8b5cf6', primaryDark: '#7c3aed' },
    green: { primary: '#10b981', primaryDark: '#059669' },
    red: { primary: '#ef4444', primaryDark: '#dc2626' }
  };
  
  const colors = themeColors[config.theme] || {
    primary: config.primaryColor || '#14b8a6',
    primaryDark: config.primaryDarkColor || '#0d9488'
  };
  
  // Widget HTML con stili inline
  const widgetHTML = `
    <div id="ai-orchestrator-widget-${config.chatbotId}" style="
      position: fixed !important;
      bottom: 1.5rem !important;
      right: 1.5rem !important;
      z-index: 999999999 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    ">
      <!-- Toggle Button -->
      <button id="ai-orchestrator-toggle-${config.chatbotId}" style="
        position: fixed !important;
        bottom: 1.5rem !important;
        right: 1.5rem !important;
        width: 4rem !important;
        height: 4rem !important;
        border-radius: 50% !important;
        background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark}) !important;
        border: none !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        color: white !important;
        font-size: 1.5rem !important;
        z-index: 999999999 !important;
        transition: transform 0.2s ease !important;
      ">
        💬
      </button>
      
      <!-- Chat Widget -->
      <div id="ai-orchestrator-chat-${config.chatbotId}" style="
        position: fixed !important;
        bottom: 6rem !important;
        right: 1.5rem !important;
        width: 350px !important;
        height: 500px !important;
        background: white !important;
        border-radius: 1rem !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        display: none !important;
        flex-direction: column !important;
        z-index: 999999998 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      ">
        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark}) !important;
          color: white !important;
          padding: 1rem !important;
          border-radius: 1rem 1rem 0 0 !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        ">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="
              width: 2rem !important;
              height: 2rem !important;
              background: rgba(255, 255, 255, 0.2) !important;
              border-radius: 0.5rem !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            ">
              🤖
            </div>
            <div>
              <div style="font-weight: 600; font-size: 1rem;">${config.title}</div>
              <div style="font-size: 0.75rem; opacity: 0.8;">Online 24/7</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button id="minimize-btn-${config.chatbotId}" style="
              background: none !important;
              border: none !important;
              color: white !important;
              cursor: pointer !important;
              padding: 0.25rem !important;
              font-size: 1.2rem !important;
            ">−</button>
            <button id="close-btn-${config.chatbotId}" style="
              background: none !important;
              border: none !important;
              color: white !important;
              cursor: pointer !important;
              padding: 0.25rem !important;
              font-size: 1.2rem !important;
            ">×</button>
          </div>
        </div>
        
        <!-- Messages -->
        <div id="messages-${config.chatbotId}" style="
          flex: 1 !important;
          padding: 1rem !important;
          overflow-y: auto !important;
          background: #f8fafc !important;
        ">
          <div style="
            background: white !important;
            padding: 0.75rem !important;
            border-radius: 0.5rem !important;
            margin-bottom: 0.5rem !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            font-size: 0.875rem !important;
            line-height: 1.4 !important;
          ">
            ${config.welcomeMessage}
          </div>
        </div>
        
        <!-- Input -->
        <div style="
          padding: 1rem !important;
          background: white !important;
          border-radius: 0 0 1rem 1rem !important;
          display: flex !important;
          gap: 0.5rem !important;
        ">
          <input id="message-input-${config.chatbotId}" type="text" placeholder="${config.placeholder}" style="
            flex: 1 !important;
            padding: 0.75rem !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 0.5rem !important;
            outline: none !important;
            font-size: 0.875rem !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          ">
          <button id="send-btn-${config.chatbotId}" style="
            background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark}) !important;
            color: white !important;
            border: none !important;
            border-radius: 0.5rem !important;
            padding: 0.75rem !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 1rem !important;
          ">
            ➤
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Inietta il widget
  const widgetContainer = document.createElement('div');
  widgetContainer.innerHTML = widgetHTML;
  document.body.appendChild(widgetContainer);
  
  // Logica del widget
  const toggleBtn = document.getElementById(`ai-orchestrator-toggle-${config.chatbotId}`);
  const chatWidget = document.getElementById(`ai-orchestrator-chat-${config.chatbotId}`);
  const closeBtn = document.getElementById(`close-btn-${config.chatbotId}`);
  const minimizeBtn = document.getElementById(`minimize-btn-${config.chatbotId}`);
  const sendBtn = document.getElementById(`send-btn-${config.chatbotId}`);
  const messageInput = document.getElementById(`message-input-${config.chatbotId}`);
  
  let isOpen = false;
  
  // Toggle chat
  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWidget.style.display = isOpen ? 'flex' : 'none';
  });
  
  // Close chat
  closeBtn.addEventListener('click', () => {
    isOpen = false;
    chatWidget.style.display = 'none';
  });
  
  // Minimize chat
  minimizeBtn.addEventListener('click', () => {
    isOpen = false;
    chatWidget.style.display = 'none';
  });
  
  // Send message
  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Aggiungi messaggio utente
    const messagesContainer = document.getElementById(`messages-${config.chatbotId}`);
    const userMessage = document.createElement('div');
    userMessage.style.cssText = `
      background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark}) !important;
      color: white !important;
      padding: 0.75rem !important;
      border-radius: 0.5rem !important;
      margin-bottom: 0.5rem !important;
      margin-left: 2rem !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
      font-size: 0.875rem !important;
      line-height: 1.4 !important;
    `;
    userMessage.textContent = message;
    messagesContainer.appendChild(userMessage);
    
    // Pulisci input
    messageInput.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simula risposta (sostituisci con la tua API)
    setTimeout(() => {
      const botMessage = document.createElement('div');
      botMessage.style.cssText = `
        background: white !important;
        padding: 0.75rem !important;
        border-radius: 0.5rem !important;
        margin-bottom: 0.5rem !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        font-size: 0.875rem !important;
        line-height: 1.4 !important;
      `;
      botMessage.textContent = 'Thanks for your message! This is a demo response.';
      messagesContainer.appendChild(botMessage);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  }
  
  // Sincronizza con live preview ogni 2 secondi
  setInterval(syncWithLivePreview, 2000);
  
  // Sincronizza immediatamente
  setTimeout(syncWithLivePreview, 1000);
  
  console.log('✅ AI Orchestrator Shopify Widget loaded successfully!');
})();
