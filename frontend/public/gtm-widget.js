// AI Orchestrator GTM Widget - Isolated iframe approach
(function() {
  'use strict';
  
  console.log('AI Orchestrator: Loading GTM widget...');
  
  // Configuration from GTM dataLayer
  const config = window.AIOrchestratorConfig || {
    chatbotId: 'default',
    apiKey: 'demo-key',
    theme: 'teal',
    title: 'My AI',
    welcomeMessage: 'Hello! I\'m your ai',
    placeholder: 'Type your id',
    showAvatar: true,
    primaryLanguage: 'en'
  };
  
  console.log('AI Orchestrator: GTM Config:', config);
  
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
  
  // Create iframe container
  const iframeContainer = document.createElement('div');
  iframeContainer.id = 'ai-orchestrator-gtm-widget';
  iframeContainer.style.cssText = `
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
  `;
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'ai-orchestrator-iframe';
  iframe.style.cssText = `
    position: fixed !important;
    bottom: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    border: none !important;
    background: transparent !important;
    pointer-events: none !important;
    z-index: 999999999 !important;
    margin: 0 !important;
    padding: 0 !important;
    outline: none !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  `;
  
  // Create widget HTML for iframe
  const widgetHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Chatbot Widget</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: transparent;
                overflow: hidden;
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
            }
            
            .status {
                font-size: 0.75rem !important;
                color: rgb(75 85 99) !important;
                display: flex !important;
                align-items: center !important;
                gap: 0.25rem !important;
            }
            
            .status-dot {
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
        </style>
    </head>
    <body>
        <div id="widget-container">
            <button id="toggleButton">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: rgb(34 197 94); border-radius: 50%; border: 2px solid white;"></div>
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
                                <div class="status-dot"></div>
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

        <script>
            let isOpen = false;
            let conversationHistory = [];
            
            const toggleButton = document.getElementById('toggleButton');
            const chatWidget = document.getElementById('chatWidget');
            const closeButton = document.getElementById('closeButton');
            const minimizeButton = document.getElementById('minimizeButton');
            const messageInput = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            const messagesContainer = document.getElementById('messagesContainer');
            
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
            
            function closeWidget() {
                isOpen = false;
                chatWidget.classList.remove('show');
                toggleButton.style.display = 'flex';
                // Notify parent window
                if (window.parent) {
                    window.parent.postMessage({ action: 'closeWidget' }, '*');
                }
            }
            
            function minimizeWidget() {
                isOpen = false;
                chatWidget.classList.remove('show');
                toggleButton.style.display = 'flex';
                // Notify parent window
                if (window.parent) {
                    window.parent.postMessage({ action: 'minimizeWidget' }, '*');
                }
            }
            
            async function sendMessage() {
                const message = messageInput.value.trim();
                if (!message) return;
                
                // Add user message
                conversationHistory.push({ role: 'user', content: message });
                
                const userMessageDiv = document.createElement('div');
                userMessageDiv.style.cssText = \`
                    margin-bottom: 1rem !important;
                    display: flex !important;
                    justify-content: flex-end !important;
                \`;
                
                const userBubble = document.createElement('div');
                userBubble.style.cssText = \`
                    background: ${themeColors.primary} !important;
                    color: white !important;
                    padding: 0.75rem 1rem !important;
                    border-radius: 1rem 1rem 0.25rem 1rem !important;
                    max-width: 80% !important;
                    word-wrap: break-word !important;
                \`;
                userBubble.textContent = message;
                userMessageDiv.appendChild(userBubble);
                messagesContainer.appendChild(userMessageDiv);
                
                messageInput.value = '';
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Show typing indicator
                const typingDiv = document.createElement('div');
                typingDiv.style.cssText = \`
                    margin-bottom: 1rem !important;
                    display: flex !important;
                    justify-content: flex-start !important;
                \`;
                
                const typingBubble = document.createElement('div');
                typingBubble.style.cssText = \`
                    background: white !important;
                    color: rgb(75 85 99) !important;
                    padding: 0.75rem 1rem !important;
                    border-radius: 1rem 1rem 1rem 0.25rem !important;
                    max-width: 80% !important;
                    word-wrap: break-word !important;
                    border: 1px solid rgb(229 231 235) !important;
                \`;
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
                    botMessageDiv.style.cssText = \`
                        margin-bottom: 1rem !important;
                        display: flex !important;
                        justify-content: flex-start !important;
                    \`;
                    
                    const botBubble = document.createElement('div');
                    botBubble.style.cssText = \`
                        background: white !important;
                        color: rgb(17 24 39) !important;
                        padding: 0.75rem 1rem !important;
                        border-radius: 1rem 1rem 1rem 0.25rem !important;
                        max-width: 80% !important;
                        word-wrap: break-word !important;
                        border: 1px solid rgb(229 231 235) !important;
                    \`;
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
            
            console.log('AI Orchestrator: GTM iframe widget loaded successfully!');
        </script>
    </body>
    </html>
  `;
  
  // Set iframe content
  iframe.srcdoc = widgetHTML;
  
  // Add elements to container
  iframeContainer.appendChild(iframe);
  document.body.appendChild(iframeContainer);
  
  // Enable pointer events after load
  iframe.onload = function() {
    console.log('AI Orchestrator: GTM iframe loaded successfully');
    setTimeout(() => {
      iframe.style.pointerEvents = 'auto';
      iframeContainer.style.pointerEvents = 'auto';
    }, 1000);
  };
  
  // Listen for messages from iframe
  window.addEventListener('message', function(event) {
    // Check if message is from our iframe
    if (event.source !== iframe.contentWindow) return;
    
    const { action } = event.data;
    
    switch (action) {
      case 'closeWidget':
      case 'minimizeWidget':
        // Hide the iframe and show toggle button
        iframe.style.display = 'none';
        iframeContainer.style.pointerEvents = 'none';
        break;
    }
  });
  
  console.log('AI Orchestrator: GTM widget loaded successfully!');
})();
