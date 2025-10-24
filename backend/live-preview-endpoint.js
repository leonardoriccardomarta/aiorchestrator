// Live Preview Endpoint with Custom Branding Support
// This should replace the existing /public/embed/:chatbotId endpoint

app.get('/public/embed/:chatbotId', async (req, res) => {
  try {
    const { chatbotId } = req.params;
    const { 
      theme, 
      title, 
      placeholder, 
      message, 
      showAvatar, 
      primaryColor, 
      secondaryColor, 
      fontFamily, 
      logo 
    } = req.query;
    const primaryLanguage = typeof req.query.primaryLanguage === 'string' ? req.query.primaryLanguage : 'auto';
    
    // Get chatbot from database
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId }
    });
    
    if (!chatbot) {
      return res.status(404).send('Chatbot not found');
    }

    // Use custom branding from query params if available, otherwise use defaults
    const customPrimaryColor = primaryColor || '#3B82F6';
    const customSecondaryColor = secondaryColor || '#8B5CF6';
    const customFontFamily = fontFamily || 'Inter';
    const customLogo = logo || '';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: ${customFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f3f4f6;
            height: 100vh;
            overflow: hidden;
        }
        .toggle-button {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, ${customPrimaryColor}, ${customSecondaryColor});
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            border: none;
        }
        .toggle-button:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
        }
        .toggle-button .notification-dot {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 12px;
            height: 12px;
            background: #10B981;
            border-radius: 50%;
            border: 2px solid white;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        ${customLogo ? `
        .toggle-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 32px;
            height: 32px;
            background-image: url('${customLogo}');
            background-size: cover;
            background-position: center;
            border-radius: 50%;
        }
        .toggle-button svg {
            display: none;
        }
        ` : ''}
    </style>
</head>
<body>
    <div class="toggle-button">
        ${customLogo ? '' : `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
        </svg>
        `}
        <div class="notification-dot"></div>
    </div>
    
    <!-- Include the actual chatbot widget with custom branding -->
    <script src="${process.env.API_URL || 'https://aiorchestrator-vtihz.ondigitalocean.app'}/chatbot-widget.js" 
            data-ai-orchestrator-id="${chatbotId}"
            data-api-key="support-widget"
            data-theme="${theme || 'blue'}"
            data-title="${title || chatbot.name || 'AI Support'}"
            data-placeholder="${placeholder || 'Type your message...'}"
            data-welcome-message="${message || chatbot.welcomeMessage || 'Hi! I\\'m your AI support assistant. How can I help you today? 👋'}"
            data-primary-language="${primaryLanguage}"
            data-primary-color="${customPrimaryColor}"
            data-secondary-color="${customSecondaryColor}"
            data-font-family="${customFontFamily}"
            data-logo="${customLogo}"
            defer>
    </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', "frame-ancestors *;");
    res.send(html);
  } catch (error) {
    console.error('Live preview error:', error);
    res.status(500).send('Error loading preview');
  }
});
