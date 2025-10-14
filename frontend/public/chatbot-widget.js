// AI Orchestrator Chatbot Widget - Original Working Version
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
      apiUrl: 'https://aiorchestrator-vtihz.ondigitalocean.app'
    };
  }
  
  // Fallback to window.AIChatbotConfig for backward compatibility
  function getLegacyConfig() {
    if (window.AIChatbotConfig) {
      return {
        chatbotId: window.AIChatbotConfig.chatbotId,
        apiKey: 'demo-key',
        apiUrl: window.AIChatbotConfig.apiUrl || 'https://aiorchestrator-vtihz.ondigitalocean.app'
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
  
  console.log('AI Orchestrator: Initializing original widget with config:', config);
  
  // Create widget HTML
  const widgetHTML = `
    <div id="ai-orchestrator-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div class="ai-widget-container">
        <button class="ai-widget-button" id="ai-widget-toggle" style="width: 60px; height: 60px; background: #3B82F6; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s ease; color: white; border: none;">
          <span style="font-size: 24px;">🤖</span>
        </button>
        
        <div class="ai-widget-chat" id="ai-widget-chat" style="position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px; background: #FFFFFF; border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); display: none; flex-direction: column; overflow: hidden; border: 1px solid #E5E7EB;">
          <div class="ai-widget-header" style="background: #3B82F6; color: white; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div class="ai-widget-title" style="display: flex; align-items: center; gap: 12px;">
              <div class="ai-widget-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; font-size: 20px;">🤖</div>
              <div>
                <div class="ai-widget-name" style="font-weight: 600; font-size: 16px;">AI Assistant</div>
                <div class="ai-widget-status" style="font-size: 12px; opacity: 0.8;">Online</div>
              </div>
            </div>
            <button class="ai-widget-close" id="ai-widget-close" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">×</button>
          </div>
          
          <div class="ai-widget-messages" id="ai-widget-messages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
            <div class="ai-widget-message ai-widget-message-bot" style="display: flex; gap: 8px; align-items: flex-start;">
              <div class="ai-widget-content" style="max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.4; background: #F3F4F6; color: #1F2937;">
                <div class="ai-widget-text">Hello! I'm your AI assistant. How can I help you today?</div>
                <div class="ai-widget-time" style="font-size: 11px; opacity: 0.7;">Just now</div>
              </div>
            </div>
          </div>
          
          <div class="ai-widget-input-container" style="padding: 16px; border-top: 1px solid #E5E7EB; display: flex; gap: 8px;">
            <input type="text" id="ai-widget-input" placeholder="Type a message..." style="flex: 1; padding: 12px 16px; border: 1px solid #D1D5DB; border-radius: 24px; outline: none; font-size: 14px;">
            <button id="ai-widget-send" style="background: #3B82F6; color: white; border: none; border-radius: 24px; padding: 12px 20px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s ease;">Send</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Inject widget
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  
  // Widget state
  let isOpen = false;
  let conversationHistory = [];
  
  // Widget functions
  window.toggleChatbot = function() {
    const chat = document.getElementById('ai-widget-chat');
    isOpen = !isOpen;
    chat.classList.toggle('open', isOpen);
    if (isOpen) {
      chat.style.display = 'flex';
      document.getElementById('ai-widget-input').focus();
    } else {
      chat.style.display = 'none';
    }
  };
  
  window.closeChatbot = function() {
    isOpen = false;
    document.getElementById('ai-widget-chat').style.display = 'none';
  };
  
  window.sendChatbotMessage = async function() {
    const input = document.getElementById('ai-widget-input');
    const sendButton = document.getElementById('ai-widget-send');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    input.value = '';
    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';
    
    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-widget-message ai-widget-message-bot';
    typingDiv.innerHTML = `
      <div class="ai-widget-content" style="max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.4; background: #F3F4F6; color: #1F2937;">
        <div class="ai-widget-text">Typing...</div>
      </div>
    `;
    document.getElementById('ai-widget-messages').appendChild(typingDiv);
    
    try {
      // Send to API
      const response = await fetch(`${config.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Chatbot-ID': config.chatbotId
        },
        body: JSON.stringify({
          message: message,
          chatbotId: config.chatbotId,
          userId: 'widget-user',
          language: 'auto'
        })
      });
      
      const data = await response.json();
      
      // Remove typing indicator
      typingDiv.remove();
      
      // Add bot response
      const botMessage = data.response || data.message || 'Sorry, I could not process your request.';
      addMessage(botMessage, false);
      
      // Store in conversation history
      conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: botMessage }
      );
      
    } catch (error) {
      typingDiv.remove();
      addMessage('Sorry, I encountered an error. Please try again.', false);
      console.error('AI Orchestrator Widget Error:', error);
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  };
  
  window.handleChatbotKeypress = function(event) {
    if (event.key === 'Enter') {
      sendChatbotMessage();
    }
  };
  
  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('ai-widget-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-widget-message ${isUser ? 'ai-widget-message-user' : 'ai-widget-message-bot'}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="ai-widget-content" style="max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.4; ${isUser ? 'background: #3B82F6; color: white;' : 'background: #F3F4F6; color: #1F2937;'}">
        <div class="ai-widget-text">${content}</div>
        <div class="ai-widget-time" style="font-size: 11px; opacity: 0.7;">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Event listeners
  document.getElementById('ai-widget-toggle').addEventListener('click', toggleChatbot);
  document.getElementById('ai-widget-close').addEventListener('click', closeChatbot);
  document.getElementById('ai-widget-send').addEventListener('click', sendChatbotMessage);
  document.getElementById('ai-widget-input').addEventListener('keypress', handleChatbotKeypress);
  
  // Initialize chatbot
  console.log('AI Orchestrator: Original widget loaded successfully!');
})();
