/**
 * AI Orchestrator Chatbot Widget
 * Embed this script in any website to add AI chatbot functionality
 * 
 * Usage:
 * <script src="https://your-domain.com/chatbot-widget.js" 
 *         data-chatbot-id="your-chatbot-id"
 *         data-api-key="your-api-key">
 * </script>
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiBaseUrl: 'http://localhost:4000/api',
    widgetVersion: '1.0.0',
    defaultTheme: {
      primaryColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      borderRadius: '12px',
      position: 'bottom-right'
    }
  };

  // Widget state
  let isOpen = false;
  let isLoaded = false;
  let chatbotId = null;
  let apiKey = null;
  let conversationHistory = [];

  // Get configuration from script tag
  function getConfig() {
    const script = document.currentScript;
    chatbotId = script.getAttribute('data-chatbot-id');
    apiKey = script.getAttribute('data-api-key');
    
    if (!chatbotId) {
      console.error('AI Orchestrator: chatbot-id is required');
      return false;
    }
    
    return true;
  }

  // Create widget HTML
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'ai-orchestrator-widget';
    widget.innerHTML = `
      <div class="ai-widget-container">
        <!-- Chat Button -->
        <div class="ai-widget-button" id="ai-widget-toggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4609 20 9.0119 19.6565 7.74467 19.0511L3 21L4.94893 16.2553C4.34347 14.9881 4 13.5391 4 12C4 7.58172 8.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <!-- Chat Window -->
        <div class="ai-widget-chat" id="ai-widget-chat">
          <div class="ai-widget-header">
            <div class="ai-widget-title">
              <div class="ai-widget-avatar">🤖</div>
              <div>
                <div class="ai-widget-name">AI Assistant</div>
                <div class="ai-widget-status">Online</div>
              </div>
            </div>
            <button class="ai-widget-close" id="ai-widget-close">×</button>
          </div>
          
          <div class="ai-widget-messages" id="ai-widget-messages">
            <div class="ai-widget-message ai-widget-message-bot">
              <div class="ai-widget-avatar">🤖</div>
              <div class="ai-widget-content">
                <div class="ai-widget-text">Hello! I'm your AI assistant. How can I help you today?</div>
                <div class="ai-widget-time">Just now</div>
              </div>
            </div>
          </div>
          
          <div class="ai-widget-input-container">
            <input type="text" id="ai-widget-input" placeholder="Type your message..." />
            <button id="ai-widget-send">Send</button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      #ai-orchestrator-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .ai-widget-container {
        position: relative;
      }

      .ai-widget-button {
        width: 60px;
        height: 60px;
        background: ${CONFIG.defaultTheme.primaryColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        color: white;
      }

      .ai-widget-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .ai-widget-chat {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: ${CONFIG.defaultTheme.backgroundColor};
        border-radius: ${CONFIG.defaultTheme.borderRadius};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        display: none;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid #E5E7EB;
      }

      .ai-widget-chat.open {
        display: flex;
      }

      .ai-widget-header {
        background: ${CONFIG.defaultTheme.primaryColor};
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ai-widget-title {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .ai-widget-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .ai-widget-name {
        font-weight: 600;
        font-size: 16px;
      }

      .ai-widget-status {
        font-size: 12px;
        opacity: 0.8;
      }

      .ai-widget-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ai-widget-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .ai-widget-message {
        display: flex;
        gap: 8px;
        align-items: flex-start;
      }

      .ai-widget-message-user {
        flex-direction: row-reverse;
      }

      .ai-widget-message-user .ai-widget-content {
        background: ${CONFIG.defaultTheme.primaryColor};
        color: white;
      }

      .ai-widget-message-bot .ai-widget-content {
        background: #F3F4F6;
        color: ${CONFIG.defaultTheme.textColor};
      }

      .ai-widget-content {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
      }

      .ai-widget-text {
        margin-bottom: 4px;
      }

      .ai-widget-time {
        font-size: 11px;
        opacity: 0.7;
      }

      .ai-widget-input-container {
        padding: 16px;
        border-top: 1px solid #E5E7EB;
        display: flex;
        gap: 8px;
      }

      #ai-widget-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #D1D5DB;
        border-radius: 24px;
        outline: none;
        font-size: 14px;
      }

      #ai-widget-input:focus {
        border-color: ${CONFIG.defaultTheme.primaryColor};
      }

      #ai-widget-send {
        background: ${CONFIG.defaultTheme.primaryColor};
        color: white;
        border: none;
        border-radius: 24px;
        padding: 12px 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background 0.2s ease;
      }

      #ai-widget-send:hover {
        background: #2563EB;
      }

      #ai-widget-send:disabled {
        background: #9CA3AF;
        cursor: not-allowed;
      }

      /* Responsive */
      @media (max-width: 480px) {
        .ai-widget-chat {
          width: calc(100vw - 40px);
          height: calc(100vh - 100px);
          bottom: 80px;
          right: 20px;
          left: 20px;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(widget);

    return widget;
  }

  // Load chatbot configuration
  async function loadChatbotConfig() {
    try {
      const response = await fetch(`${CONFIG.apiBaseUrl}/widget/config/${chatbotId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey || 'demo-key'}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error('Error loading chatbot config:', error);
    }
    return null;
  }

  // Send message to API
  async function sendMessage(message) {
    try {
      const response = await fetch(`${CONFIG.apiBaseUrl}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey || 'demo-key'}`,
        },
        body: JSON.stringify({
          message: message,
          chatbotId: chatbotId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('AI Orchestrator Widget Error:', error);
      return {
        response: 'Sorry, I encountered an error. Please try again later.',
        tokensUsed: 0,
        cost: 0
      };
    }
  }

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('ai-widget-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-widget-message ${isUser ? 'ai-widget-message-user' : 'ai-widget-message-bot'}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="ai-widget-avatar">${isUser ? '👤' : '🤖'}</div>
      <div class="ai-widget-content">
        <div class="ai-widget-text">${content}</div>
        <div class="ai-widget-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Handle send message
  async function handleSendMessage() {
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
      <div class="ai-widget-avatar">🤖</div>
      <div class="ai-widget-content">
        <div class="ai-widget-text">Typing...</div>
      </div>
    `;
    document.getElementById('ai-widget-messages').appendChild(typingDiv);
    
    try {
      // Send to API
      const response = await sendMessage(message);
      
      // Remove typing indicator
      typingDiv.remove();
      
      // Add bot response
      addMessage(response.response);
      
      // Store in conversation history
      conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: response.response }
      );
      
    } catch (error) {
      typingDiv.remove();
      addMessage('Sorry, I encountered an error. Please try again.');
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  }

  // Initialize widget
  async function init() {
    if (!getConfig()) return;
    
    const widget = createWidget();
    
    // Load chatbot configuration
    const chatbotConfig = await loadChatbotConfig();
    if (chatbotConfig) {
      // Update widget with chatbot-specific data
      const nameElement = document.querySelector('.ai-widget-name');
      const statusElement = document.querySelector('.ai-widget-status');
      
      if (nameElement) nameElement.textContent = chatbotConfig.name;
      if (statusElement) statusElement.textContent = chatbotConfig.isActive ? 'Online' : 'Offline';
      
      // Update welcome message
      const welcomeMessage = document.querySelector('.ai-widget-message-bot .ai-widget-text');
      if (welcomeMessage) {
        welcomeMessage.textContent = `Hello! I'm ${chatbotConfig.name}. ${chatbotConfig.description || 'How can I help you today?'}`;
      }
    }
    
    // Event listeners
    document.getElementById('ai-widget-toggle').addEventListener('click', () => {
      isOpen = !isOpen;
      const chat = document.getElementById('ai-widget-chat');
      chat.classList.toggle('open', isOpen);
    });
    
    document.getElementById('ai-widget-close').addEventListener('click', () => {
      isOpen = false;
      document.getElementById('ai-widget-chat').classList.remove('open');
    });
    
    document.getElementById('ai-widget-send').addEventListener('click', handleSendMessage);
    
    document.getElementById('ai-widget-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
    
    isLoaded = true;
    console.log('AI Orchestrator Widget loaded successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.AIOrchestrator = {
    open: () => {
      isOpen = true;
      document.getElementById('ai-widget-chat').classList.add('open');
    },
    close: () => {
      isOpen = false;
      document.getElementById('ai-widget-chat').classList.remove('open');
    },
    sendMessage: (message) => {
      if (isLoaded) {
        document.getElementById('ai-widget-input').value = message;
        handleSendMessage();
      }
    },
    isLoaded: () => isLoaded
  };

})();
    } catch (error) {
      console.error('AI Orchestrator Widget Error:', error);
      return {
        response: 'Sorry, I encountered an error. Please try again later.',
        tokensUsed: 0,
        cost: 0
      };
    }
  }

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('ai-widget-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-widget-message ${isUser ? 'ai-widget-message-user' : 'ai-widget-message-bot'}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="ai-widget-avatar">${isUser ? '👤' : '🤖'}</div>
      <div class="ai-widget-content">
        <div class="ai-widget-text">${content}</div>
        <div class="ai-widget-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Handle send message
  async function handleSendMessage() {
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
      <div class="ai-widget-avatar">🤖</div>
      <div class="ai-widget-content">
        <div class="ai-widget-text">Typing...</div>
      </div>
    `;
    document.getElementById('ai-widget-messages').appendChild(typingDiv);
    
    try {
      // Send to API
      const response = await sendMessage(message);
      
      // Remove typing indicator
      typingDiv.remove();
      
      // Add bot response
      addMessage(response.response);
      
      // Store in conversation history
      conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: response.response }
      );
      
    } catch (error) {
      typingDiv.remove();
      addMessage('Sorry, I encountered an error. Please try again.');
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  }

  // Initialize widget
  async function init() {
    if (!getConfig()) return;
    
    const widget = createWidget();
    
    // Load chatbot configuration
    const chatbotConfig = await loadChatbotConfig();
    if (chatbotConfig) {
      // Update widget with chatbot-specific data
      const nameElement = document.querySelector('.ai-widget-name');
      const statusElement = document.querySelector('.ai-widget-status');
      
      if (nameElement) nameElement.textContent = chatbotConfig.name;
      if (statusElement) statusElement.textContent = chatbotConfig.isActive ? 'Online' : 'Offline';
      
      // Update welcome message
      const welcomeMessage = document.querySelector('.ai-widget-message-bot .ai-widget-text');
      if (welcomeMessage) {
        welcomeMessage.textContent = `Hello! I'm ${chatbotConfig.name}. ${chatbotConfig.description || 'How can I help you today?'}`;
      }
    }
    
    // Event listeners
    document.getElementById('ai-widget-toggle').addEventListener('click', () => {
      isOpen = !isOpen;
      const chat = document.getElementById('ai-widget-chat');
      chat.classList.toggle('open', isOpen);
    });
    
    document.getElementById('ai-widget-close').addEventListener('click', () => {
      isOpen = false;
      document.getElementById('ai-widget-chat').classList.remove('open');
    });
    
    document.getElementById('ai-widget-send').addEventListener('click', handleSendMessage);
    
    document.getElementById('ai-widget-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
    
    isLoaded = true;
    console.log('AI Orchestrator Widget loaded successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.AIOrchestrator = {
    open: () => {
      isOpen = true;
      document.getElementById('ai-widget-chat').classList.add('open');
    },
    close: () => {
      isOpen = false;
      document.getElementById('ai-widget-chat').classList.remove('open');
    },
    sendMessage: (message) => {
      if (isLoaded) {
        document.getElementById('ai-widget-input').value = message;
        handleSendMessage();
      }
    },
    isLoaded: () => isLoaded
  };

})();
    } catch (error) {
      console.error('AI Orchestrator Widget Error:', error);
      return {
        response: 'Sorry, I encountered an error. Please try again later.',
        tokensUsed: 0,
        cost: 0
      };
    }
  }

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('ai-widget-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-widget-message ${isUser ? 'ai-widget-message-user' : 'ai-widget-message-bot'}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="ai-widget-avatar">${isUser ? '👤' : '🤖'}</div>
      <div class="ai-widget-content">
        <div class="ai-widget-text">${content}</div>
        <div class="ai-widget-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Handle send message
  async function handleSendMessage() {
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
      <div class="ai-widget-avatar">🤖</div>
      <div class="ai-widget-content">
        <div class="ai-widget-text">Typing...</div>
      </div>
    `;
    document.getElementById('ai-widget-messages').appendChild(typingDiv);
    
    try {
      // Send to API
      const response = await sendMessage(message);
      
      // Remove typing indicator
      typingDiv.remove();
      
      // Add bot response
      addMessage(response.response);
      
      // Store in conversation history
      conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: response.response }
      );
      
    } catch (error) {
      typingDiv.remove();
      addMessage('Sorry, I encountered an error. Please try again.');
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  }

  // Initialize widget
  async function init() {
    if (!getConfig()) return;
    
    const widget = createWidget();
    
    // Load chatbot configuration
    const chatbotConfig = await loadChatbotConfig();
    if (chatbotConfig) {
      // Update widget with chatbot-specific data
      const nameElement = document.querySelector('.ai-widget-name');
      const statusElement = document.querySelector('.ai-widget-status');
      
      if (nameElement) nameElement.textContent = chatbotConfig.name;
      if (statusElement) statusElement.textContent = chatbotConfig.isActive ? 'Online' : 'Offline';
      
      // Update welcome message
      const welcomeMessage = document.querySelector('.ai-widget-message-bot .ai-widget-text');
      if (welcomeMessage) {
        welcomeMessage.textContent = `Hello! I'm ${chatbotConfig.name}. ${chatbotConfig.description || 'How can I help you today?'}`;
      }
    }
    
    // Event listeners
    document.getElementById('ai-widget-toggle').addEventListener('click', () => {
      isOpen = !isOpen;
      const chat = document.getElementById('ai-widget-chat');
      chat.classList.toggle('open', isOpen);
    });
    
    document.getElementById('ai-widget-close').addEventListener('click', () => {
      isOpen = false;
      document.getElementById('ai-widget-chat').classList.remove('open');
    });
    
    document.getElementById('ai-widget-send').addEventListener('click', handleSendMessage);
    
    document.getElementById('ai-widget-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
    
    isLoaded = true;
    console.log('AI Orchestrator Widget loaded successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.AIOrchestrator = {
    open: () => {
      isOpen = true;
      document.getElementById('ai-widget-chat').classList.add('open');
    },
    close: () => {
      isOpen = false;
      document.getElementById('ai-widget-chat').classList.remove('open');
    },
    sendMessage: (message) => {
      if (isLoaded) {
        document.getElementById('ai-widget-input').value = message;
        handleSendMessage();
      }
    },
    isLoaded: () => isLoaded
  };

})();