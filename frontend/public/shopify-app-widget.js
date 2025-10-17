// AI Orchestrator Chatbot Widget - Shopify Ultra Compatible Version
// This version uses iframe for complete isolation from Shopify CSS conflicts
(function() {
  'use strict';

  // Configuration from data attributes
  function getConfig() {
    const script = document.querySelector('script[data-chatbot-id]') || 
                   document.querySelector('script[data-ai-orchestrator-id]');
    
    if (script) {
      return {
        chatbotId: script.dataset.chatbotId || script.dataset.aiOrchestratorId,
        apiKey: script.dataset.apiKey || 'demo-key',
        position: script.dataset.position || 'bottom-right',
        theme: script.dataset.theme || 'teal',
        title: script.dataset.title || 'My AI',
        welcomeMessage: script.dataset.welcomeMessage || 'Hello! I\'m your AI assistant',
        placeholder: script.dataset.placeholder || 'Type your message...',
        showAvatar: script.dataset.showAvatar !== 'false',
        size: script.dataset.size || 'medium',
        primaryLanguage: script.dataset.primaryLanguage || 'en'
      };
    }
    
    // Legacy config support
    if (window.AIChatbotConfig) {
      return window.AIChatbotConfig;
    }
    
    return null;
  }

  // Wait for DOM to be ready
  function waitForDOM(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  // Initialize when DOM is ready
  waitForDOM(function() {
    const config = getConfig();
    
    if (!config) {
      console.error('AI Orchestrator: No valid configuration found');
      return;
    }

    console.log('AI Orchestrator: Initializing Shopify-compatible iframe widget with config:', config);
    initializeIframeWidget(config);
  });

  function initializeIframeWidget(config) {
    // Remove any existing widgets to prevent duplicates
    const existingWidgets = document.querySelectorAll('[id^="ai-orchestrator-"]');
    existingWidgets.forEach(widget => widget.remove());

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.id = `ai-orchestrator-container-${config.chatbotId}`;
    iframeContainer.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      width: auto !important;
      height: auto !important;
      z-index: 999999999 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = `ai-orchestrator-iframe-${config.chatbotId}`;
    iframe.style.cssText = `
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      display: block !important;
      visibility: visible !important;
    `;

    // Set iframe dimensions based on state
    function setIframeDimensions(isOpen = false) {
      if (isOpen) {
        iframe.style.width = '400px';
        iframe.style.height = '600px';
        iframe.style.borderRadius = '12px';
      } else {
        iframe.style.width = '80px';
        iframe.style.height = '80px';
        iframe.style.borderRadius = '50%';
      }
    }

    // Initial dimensions for closed state
    setIframeDimensions(false);

    // Generate iframe content
    const iframeContent = generateIframeContent(config);
    
    // Set up iframe communication
    iframe.onload = function() {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(iframeContent);
      iframeDoc.close();

      // Set up message communication
      window.addEventListener('message', function(event) {
        if (event.data.type === 'AI_ORCHESTRATOR_TOGGLE') {
          setIframeDimensions(event.data.isOpen);
        }
        
        if (event.data.type === 'AI_ORCHESTRATOR_CLOSE') {
          setIframeDimensions(false);
        }
      });
    };

    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);

    console.log('AI Orchestrator: Shopify-compatible iframe widget loaded successfully!');
  }

  function generateIframeContent(config) {
    // Theme configurations
    const themes = {
      blue: {
        primary: 'rgb(37 99 235)',
        primaryDark: 'rgb(29 78 216)',
        secondary: 'rgb(191 219 254)',
        secondaryLight: 'rgb(147 197 253)',
        text: 'rgb(30 64 175)',
        border: 'rgb(191 219 254)'
      },
      purple: {
        primary: 'rgb(147 51 234)',
        primaryDark: 'rgb(126 34 206)',
        secondary: 'rgb(233 213 255)',
        secondaryLight: 'rgb(216 180 254)',
        text: 'rgb(126 34 206)',
        border: 'rgb(233 213 255)'
      },
      green: {
        primary: 'rgb(22 163 74)',
        primaryDark: 'rgb(21 128 61)',
        secondary: 'rgb(220 252 231)',
        secondaryLight: 'rgb(187 247 208)',
        text: 'rgb(22 101 52)',
        border: 'rgb(220 252 231)'
      },
      red: {
        primary: 'rgb(220 38 38)',
        primaryDark: 'rgb(185 28 28)',
        secondary: 'rgb(254 226 226)',
        secondaryLight: 'rgb(254 202 202)',
        text: 'rgb(153 27 27)',
        border: 'rgb(254 226 226)'
      },
      orange: {
        primary: 'rgb(234 88 12)',
        primaryDark: 'rgb(194 65 12)',
        secondary: 'rgb(255 237 213)',
        secondaryLight: 'rgb(254 215 170)',
        text: 'rgb(154 52 18)',
        border: 'rgb(255 237 213)'
      },
      pink: {
        primary: 'rgb(219 39 119)',
        primaryDark: 'rgb(190 24 93)',
        secondary: 'rgb(252 231 243)',
        secondaryLight: 'rgb(251 207 232)',
        text: 'rgb(157 23 77)',
        border: 'rgb(252 231 243)'
      },
      indigo: {
        primary: 'rgb(79 70 229)',
        primaryDark: 'rgb(67 56 202)',
        secondary: 'rgb(224 231 255)',
        secondaryLight: 'rgb(199 210 254)',
        text: 'rgb(55 48 163)',
        border: 'rgb(224 231 255)'
      },
      teal: {
        primary: 'rgb(13 148 136)',
        primaryDark: 'rgb(15 118 110)',
        secondary: 'rgb(204 251 241)',
        secondaryLight: 'rgb(153 246 228)',
        text: 'rgb(19 78 74)',
        border: 'rgb(204 251 241)'
      }
    };

    const theme = themes[config.theme] || themes.teal;
    const size = config.size || 'medium';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Orchestrator Chat</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: transparent;
            overflow: hidden;
        }
        .chat-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .toggle-button {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark});
            border: none;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .toggle-button:hover {
            transform: scale(1.1);
        }
        .chat-widget {
            width: 400px;
            height: 600px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid #e5e7eb;
            display: none;
            flex-direction: column;
        }
        .chat-widget.open {
            display: flex;
        }
        .header {
            background: linear-gradient(135deg, ${theme.secondary}, ${theme.secondaryLight});
            border-bottom: 2px solid ${theme.border};
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .avatar {
            width: 2.5rem;
            height: 2.5rem;
            background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark});
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .title {
            font-weight: 700;
            color: ${theme.text};
            font-size: 1rem;
        }
        .status {
            font-size: 0.75rem;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        .status-dot {
            width: 0.5rem;
            height: 0.5rem;
            background: #22c55e;
            border-radius: 50%;
        }
        .header-right {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .header-button {
            color: #6b7280;
            background: none;
            border: none;
            padding: 0.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .header-button:hover {
            background: #f3f4f6;
        }
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            background: #f9fafb;
        }
        .message {
            margin-bottom: 1rem;
            display: flex;
        }
        .message.user {
            justify-content: flex-end;
        }
        .message.assistant {
            justify-content: flex-start;
        }
        .message-bubble {
            max-width: 80%;
            border-radius: 1rem;
            padding: 0.75rem 1rem;
        }
        .message.user .message-bubble {
            background: ${theme.primary};
            color: white;
        }
        .message.assistant .message-bubble {
            background: white;
            color: #1f2937;
            border: 1px solid #e5e7eb;
        }
        .message-time {
            font-size: 0.75rem;
            margin-top: 0.25rem;
            opacity: 0.7;
        }
        .input-area {
            padding: 1rem;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 0.5rem;
        }
        .message-input {
            flex: 1;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            outline: none;
        }
        .message-input:focus {
            border-color: ${theme.primary};
            box-shadow: 0 0 0 2px ${theme.primary}20;
        }
        .send-button {
            background: ${theme.primary};
            color: white;
            border: none;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: opacity 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 3rem;
        }
        .send-button:hover {
            opacity: 0.9;
        }
        .typing-indicator {
            display: flex;
            gap: 0.25rem;
            padding: 0.75rem 1rem;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            max-width: 80px;
        }
        .typing-dot {
            width: 0.5rem;
            height: 0.5rem;
            background: #9ca3af;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <!-- Toggle Button -->
        <button class="toggle-button" onclick="toggleChat()">
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: #22c55e; border-radius: 50%; border: 2px solid white;"></div>
        </button>

        <!-- Chat Widget -->
        <div class="chat-widget" id="chatWidget">
            <!-- Header -->
            <div class="header">
                <div class="header-left">
                    ${config.showAvatar ? `
                    <div class="avatar">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    ` : ''}
                    <div>
                        <div class="title">${config.title}</div>
                        <div class="status">
                            <div class="status-dot"></div>
                            Online 24/7
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    <button class="header-button" onclick="minimizeChat()">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                    </button>
                    <button class="header-button" onclick="closeChat()">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Messages -->
            <div class="messages" id="messages">
                <div class="message assistant">
                    <div class="message-bubble">
                        <div class="message-text">${config.welcomeMessage}</div>
                        <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>
            </div>
            
            <!-- Input -->
            <div class="input-area">
                <input 
                    type="text" 
                    class="message-input" 
                    id="messageInput"
                    placeholder="${config.placeholder}"
                    onkeypress="handleKeypress(event)"
                />
                <button class="send-button" onclick="sendMessage()">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <script>
        let isOpen = false;
        let conversationHistory = [];

        function toggleChat() {
            const chatWidget = document.getElementById('chatWidget');
            isOpen = !isOpen;
            
            if (isOpen) {
                chatWidget.classList.add('open');
                document.getElementById('messageInput').focus();
            } else {
                chatWidget.classList.remove('open');
            }
            
            // Notify parent window about state change
            window.parent.postMessage({
                type: 'AI_ORCHESTRATOR_TOGGLE',
                isOpen: isOpen
            }, '*');
        }

        function closeChat() {
            const chatWidget = document.getElementById('chatWidget');
            chatWidget.classList.remove('open');
            isOpen = false;
            
            window.parent.postMessage({
                type: 'AI_ORCHESTRATOR_CLOSE'
            }, '*');
        }

        function minimizeChat() {
            const messages = document.getElementById('messages');
            const inputArea = document.querySelector('.input-area');
            
            if (messages.style.display === 'none') {
                messages.style.display = 'block';
                inputArea.style.display = 'flex';
            } else {
                messages.style.display = 'none';
                inputArea.style.display = 'none';
            }
        }

        function handleKeypress(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        }

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            addMessage(message, true);
            input.value = '';
            showTypingIndicator();

            try {
                const response = await fetch('https://aiorchestrator-vtihz.ondigitalocean.app/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ${config.apiKey}'
                    },
                    body: JSON.stringify({
                        message: message,
                        chatbotId: '${config.chatbotId}',
                        conversationHistory: conversationHistory,
                        context: {
                            primaryLanguage: '${config.primaryLanguage}',
                            language: '${config.primaryLanguage}'
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    hideTypingIndicator();
                    addMessage(data.response || 'I understand your message. How can I help you further?', false);
                } else {
                    hideTypingIndicator();
                    addMessage('Sorry, I\\'m having trouble responding right now. Please try again.', false);
                }
            } catch (error) {
                console.error('Chat error:', error);
                hideTypingIndicator();
                addMessage('Sorry, I\\'m having trouble responding right now. Please try again.', false);
            }
        }

        function addMessage(content, isUser = false) {
            const messagesContainer = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${isUser ? 'user' : 'assistant'}\`;
            
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            messageDiv.innerHTML = \`
                <div class="message-bubble">
                    <div class="message-text">\${content}</div>
                    <div class="message-time">\${time}</div>
                </div>
            \`;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            conversationHistory.push({
                role: isUser ? 'user' : 'assistant',
                content: content,
                timestamp: new Date()
            });
        }

        function showTypingIndicator() {
            const messagesContainer = document.getElementById('messages');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = \`
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            \`;
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function hideTypingIndicator() {
            const typing = document.getElementById('typing-indicator');
            if (typing) {
                typing.remove();
            }
        }
    </script>
</body>
</html>
    `;
  }
})();