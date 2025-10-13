import React, { useState } from 'react';

interface ChatbotWidgetProps {
  chatbotConfig: {
    id: string;
    name: string;
    primaryColor: string;
    gradient: { from: string; to: string };
    theme: 'light' | 'dark';
    welcomeMessage: string;
    language: string;
    avatar?: string;
    chatIcon?: string;
    fontFamily: string;
    fontSize: string;
    bubbleShape: string;
  };
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ chatbotConfig }) => {
  const [copied, setCopied] = useState(false);

  const generateWidgetCode = () => {
    const config = {
      chatbotId: chatbotConfig.id,
      name: chatbotConfig.name,
      primaryColor: chatbotConfig.primaryColor,
      gradient: chatbotConfig.gradient,
      theme: chatbotConfig.theme,
      welcomeMessage: chatbotConfig.welcomeMessage,
      language: chatbotConfig.language,
      avatar: chatbotConfig.avatar,
      chatIcon: chatbotConfig.chatIcon,
      fontFamily: chatbotConfig.fontFamily,
      fontSize: chatbotConfig.fontSize,
      bubbleShape: chatbotConfig.bubbleShape,
      apiUrl: process.env.REACT_APP_API_URL || 'https://api.chatbot.com'
    };

    return `<!-- AI Chatbot Widget -->
<script>
(function() {
  // Chatbot Configuration
  window.ChatbotConfig = ${JSON.stringify(config, null, 2)};
  
  // Create widget styles
  const styles = \`
    .chatbot-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: ${chatbotConfig.fontFamily}, sans-serif;
    }
    
    .chatbot-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${chatbotConfig.gradient.from}, ${chatbotConfig.gradient.to});
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
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
      background: ${chatbotConfig.theme === 'dark' ? '#1f2937' : '#ffffff'};
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
    }
    
    .chatbot-header {
      background: linear-gradient(135deg, ${chatbotConfig.gradient.from}, ${chatbotConfig.gradient.to});
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .chatbot-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: ${chatbotConfig.primaryColor};
    }
    
    .chatbot-name {
      font-weight: 600;
      font-size: 16px;
    }
    
    .chatbot-status {
      font-size: 12px;
      opacity: 0.8;
    }
    
    .chatbot-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: ${chatbotConfig.theme === 'dark' ? '#374151' : '#f9fafb'};
    }
    
    .chatbot-message {
      margin-bottom: 12px;
      display: flex;
      gap: 8px;
    }
    
    .chatbot-message.user {
      flex-direction: row-reverse;
    }
    
    .chatbot-message-content {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: ${chatbotConfig.bubbleShape === 'rounded-full' ? '20px' : 
                      chatbotConfig.bubbleShape === 'rounded-xl' ? '12px' : 
                      chatbotConfig.bubbleShape === 'rounded-md' ? '6px' : '0'};
      font-size: ${chatbotConfig.fontSize === 'sm' ? '14px' : 
                  chatbotConfig.fontSize === 'md' ? '16px' : '18px'};
    }
    
    .chatbot-message.bot .chatbot-message-content {
      background: ${chatbotConfig.theme === 'dark' ? '#4b5563' : '#e5e7eb'};
      color: ${chatbotConfig.theme === 'dark' ? '#f9fafb' : '#374151'};
    }
    
    .chatbot-message.user .chatbot-message-content {
      background: ${chatbotConfig.primaryColor};
      color: white;
    }
    
    .chatbot-input {
      padding: 16px;
      background: ${chatbotConfig.theme === 'dark' ? '#1f2937' : '#ffffff'};
      border-top: 1px solid ${chatbotConfig.theme === 'dark' ? '#374151' : '#e5e7eb'};
      display: flex;
      gap: 8px;
    }
    
    .chatbot-input input {
      flex: 1;
      padding: 12px;
      border: 1px solid ${chatbotConfig.theme === 'dark' ? '#4b5563' : '#d1d5db'};
      border-radius: 8px;
      background: ${chatbotConfig.theme === 'dark' ? '#374151' : '#ffffff'};
      color: ${chatbotConfig.theme === 'dark' ? '#f9fafb' : '#374151'};
      font-family: ${chatbotConfig.fontFamily}, sans-serif;
      font-size: ${chatbotConfig.fontSize === 'sm' ? '14px' : 
                  chatbotConfig.fontSize === 'md' ? '16px' : '18px'};
    }
    
    .chatbot-input input:focus {
      outline: none;
      border-color: ${chatbotConfig.primaryColor};
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
    
    .chatbot-send {
      padding: 12px 16px;
      background: ${chatbotConfig.primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    
    .chatbot-send:hover {
      background: ${chatbotConfig.gradient.to};
    }
    
    .chatbot-close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 20px;
      opacity: 0.7;
    }
    
    .chatbot-close:hover {
      opacity: 1;
    }
  \`;
  
  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // Create widget HTML
  const widgetHTML = \`
    <div class="chatbot-widget">
      <button class="chatbot-toggle" onclick="toggleChatbot()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
      </button>
      
      <div class="chatbot-container" id="chatbotContainer">
        <div class="chatbot-header">
          <div class="chatbot-avatar">${chatbotConfig.name.charAt(0)}</div>
          <div>
            <div class="chatbot-name">${chatbotConfig.name}</div>
            <div class="chatbot-status">Online</div>
          </div>
          <button class="chatbot-close" onclick="toggleChatbot()">×</button>
        </div>
        
        <div class="chatbot-messages" id="chatbotMessages">
          <div class="chatbot-message bot">
            <div class="chatbot-message-content">${chatbotConfig.welcomeMessage}</div>
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
  \`;
  
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
    
    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
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
    messageDiv.className = \`chatbot-message \${sender}\`;
    messageDiv.innerHTML = \`<div class="chatbot-message-content">\${text}</div>\`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Initialize chatbot
  console.log('AI Chatbot loaded successfully!');
})();
</script>`;
  };

  const handleCopyCode = async () => {
    const code = generateWidgetCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Installation Code</h3>
          <p className="mt-1 text-sm text-gray-500">
            Copy this code and paste it into your website
          </p>
        </div>
        <button
          onClick={handleCopyCode}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Code
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Copy the JavaScript code below</li>
            <li>Paste it before the &lt;/body&gt; tag of your website</li>
            <li>The chatbot will automatically appear in the bottom right corner</li>
            <li>Visitors can start chatting by clicking the icon</li>
          </ol>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
            <code>{generateWidgetCode()}</code>
          </pre>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Make sure to insert the code only once per page. The chatbot will automatically adapt 
                  to your configured settings and will be available on all devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget; 