// AI Orchestrator Chatbot Widget - Beautiful Version
(function() {
  'use strict';
  
  // Get configuration from script tag data attributes
  function getConfig() {
    const script = document.currentScript;
    const chatbotId = script.getAttribute('data-chatbot-id');
    const apiKey = script.getAttribute('data-api-key');
    
    if (!chatbotId) {
      console.error('AI Orchestrator: data-chatbot-id is required');
      return null;
    }
    
    return {
      chatbotId,
      apiKey: apiKey || 'demo-key',
      apiUrl: 'https://aiorchestrator-vtihz.ondigitalocean.app/api'
    };
  }
  
  // Fallback to window.AIChatbotConfig for backward compatibility
  function getLegacyConfig() {
    if (window.AIChatbotConfig) {
      return {
        chatbotId: window.AIChatbotConfig.chatbotId,
        apiKey: 'demo-key',
        apiUrl: window.AIChatbotConfig.apiUrl || 'https://aiorchestrator-vtihz.ondigitalocean.app/api'
      };
    }
    return null;
  }
  
  // Get configuration
  const config = getConfig() || getLegacyConfig();
  
  if (!config) {
    console.error('AI Orchestrator: No valid configuration found');
    return;
  }
  
  console.log('AI Orchestrator: Initializing beautiful widget with config:', config);
  
  // Create beautiful widget styles
  const styles = `
    .chatbot-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .chatbot-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }
    
    .chatbot-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    
    .chatbot-container {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      border: 1px solid #e5e7eb;
    }
    
    .chatbot-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chatbot-title {
      font-weight: 600;
      font-size: 16px;
    }
    
    .chatbot-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    }
    
    .chatbot-close:hover {
      background: rgba(255,255,255,0.1);
    }
    
    .chatbot-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f9fafb;
    }
    
    .chatbot-message {
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
    }
    
    .chatbot-message.user {
      justify-content: flex-end;
    }
    
    .chatbot-message-content {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .chatbot-message.bot .chatbot-message-content {
      background: white;
      color: #374151;
      border: 1px solid #e5e7eb;
    }
    
    .chatbot-message.user .chatbot-message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .chatbot-input {
      padding: 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }
    
    .chatbot-input input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 24px;
      outline: none;
      font-size: 14px;
    }
    
    .chatbot-input input:focus {
      border-color: #667eea;
    }
    
    .chatbot-send {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    
    .chatbot-send:hover {
      transform: scale(1.05);
    }
    
    @media (max-width: 480px) {
      .chatbot-container {
        width: calc(100vw - 40px);
        height: calc(100vh - 100px);
        bottom: 80px;
        right: 20px;
        left: 20px;
      }
    }
  `;
  
  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // Create widget HTML
  const widgetHTML = `
    <div class="chatbot-widget">
      <button class="chatbot-toggle" onclick="toggleChatbot()">🤖</button>
      <div class="chatbot-container" id="chatbotContainer">
        <div class="chatbot-header">
          <div class="chatbot-title">AI Assistant</div>
          <button class="chatbot-close" onclick="toggleChatbot()">×</button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages">
          <div class="chatbot-message bot">
            <div class="chatbot-message-content">Hello! I'm your AI assistant. How can I help you today?</div>
          </div>
        </div>
        <div class="chatbot-input">
          <input type="text" placeholder="Type a message..." id="chatbotInput" onkeypress="handleChatbotKeypress(event)">
          <button class="chatbot-send" onclick="sendChatbotMessage()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Inject widget
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  
  // Widget functions
  window.toggleChatbot = function() {
    const container = document.getElementById('chatbotContainer');
    if (container.style.display === 'flex') {
      container.style.display = 'none';
    } else {
      container.style.display = 'flex';
      document.getElementById('chatbotInput').focus();
    }
  };
  
  window.sendChatbotMessage = function() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot';
    typingDiv.innerHTML = '<div class="chatbot-message-content">Typing...</div>';
    document.getElementById('chatbotMessages').appendChild(typingDiv);
    
    // Simulate API call
    setTimeout(() => {
      typingDiv.remove();
      addMessage('Thank you for your message! I will respond soon.', 'bot');
    }, 1000);
  };
  
  window.handleChatbotKeypress = function(event) {
    if (event.key === 'Enter') {
      sendChatbotMessage();
    }
  };
  
  function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    messageDiv.innerHTML = `<div class="chatbot-message-content">${text}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Initialize chatbot
  console.log('AI Orchestrator: Beautiful widget loaded successfully!');
})();
