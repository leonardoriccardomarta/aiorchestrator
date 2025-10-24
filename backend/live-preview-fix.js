// Fix for live preview custom branding
// This code should be added to the first /public/embed/:chatbotId endpoint

// Parse chatbot settings to get custom branding
let customBranding = {};
if (chatbot.settings) {
  try {
    const settings = typeof chatbot.settings === 'string' 
      ? JSON.parse(chatbot.settings) 
      : chatbot.settings;
    customBranding = settings.branding || {};
  } catch (error) {
    console.error('Error parsing chatbot settings:', error);
  }
}

// Use custom branding if available, otherwise use theme colors
const primaryColor = customBranding.primaryColor || '#3B82F6';
const secondaryColor = customBranding.secondaryColor || '#8B5CF6';
const fontFamily = customBranding.fontFamily || 'Inter';
const logo = customBranding.logo || '';

// Update the widget script to include custom branding
const widgetScript = `
<script src="${process.env.API_URL || 'https://aiorchestrator-vtihz.ondigitalocean.app'}/chatbot-widget.js" 
        data-ai-orchestrator-id="${chatbotId}"
        data-api-key="support-widget"
        data-theme="${theme}"
        data-title="${title || 'AI Support'}"
        data-placeholder="${placeholder || 'Type your message...'}"
        data-welcome-message="${message || 'Hi! I\\'m your AI support assistant. How can I help you today? 👋'}"
        data-primary-language="${primaryLanguage}"
        data-primary-color="${primaryColor}"
        data-secondary-color="${secondaryColor}"
        data-font-family="${fontFamily}"
        data-logo="${logo}"
        defer>
</script>`;

// Update the CSS to use custom colors
const customCSS = `
<style>
    .toggle-button {
        background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}) !important;
        font-family: ${fontFamily} !important;
    }
    .toggle-button:hover {
        background: linear-gradient(135deg, ${secondaryColor}, ${primaryColor}) !important;
    }
    ${logo ? `
    .toggle-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 32px;
        height: 32px;
        background-image: url('${logo}');
        background-size: cover;
        background-position: center;
        border-radius: 50%;
    }
    .toggle-button svg {
        display: none;
    }
    ` : ''}
</style>`;
