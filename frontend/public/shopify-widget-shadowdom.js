// Apply custom font family if available
// Starter (no custom): use Open Sans to match live embed
// Professional+: use provided custom font
// customFontFamily is defined after getConfig() to avoid referencing config before initialization
(function() {
  'use strict';

console.log('🚀 AI Orchestrator Widget v4.0 - Shadow DOM Edition');

// Function to clean escape characters
const cleanEscapeChars = (text) => {
return text.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
};

// Function to detect language from user message using AI
const detectLanguage = async (message) => {
const lowerMessage = message.toLowerCase().trim();

// Skip very short messages that might be ambiguous
if (lowerMessage.length < 3) {
return null; // Don't change language for very short messages
}

// Quick detection for common languages (fallback)
const quickDetect = () => {
// German indicators
if (lowerMessage.includes('hallo') || lowerMessage.includes('guten tag') || 
  lowerMessage.includes('danke') || lowerMessage.includes('bitte') ||
  lowerMessage.includes('welche') || lowerMessage.includes('haben') ||
  lowerMessage.includes('produkte') || lowerMessage.includes('wie') ||
  lowerMessage.includes('was') || lowerMessage.includes('wo')) {
return 'de';
}

// Italian indicators
if (lowerMessage.includes('ciao') || lowerMessage.includes('buongiorno') ||
  lowerMessage.includes('grazie') || lowerMessage.includes('prego') ||
  lowerMessage.includes('quali') || lowerMessage.includes('avete') ||
  lowerMessage.includes('prodotti') || lowerMessage.includes('come') ||
  lowerMessage.includes('cosa') || lowerMessage.includes('dove')) {
return 'it';
}

// Spanish indicators
if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') ||
  lowerMessage.includes('gracias') || lowerMessage.includes('por favor') ||
  lowerMessage.includes('qué') || lowerMessage.includes('tienen') ||
  lowerMessage.includes('productos') || lowerMessage.includes('cómo') ||
  lowerMessage.includes('dónde')) {
return 'es';
}

// French indicators
if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') ||
  lowerMessage.includes('merci') || lowerMessage.includes('s\'il vous plaît') ||
  lowerMessage.includes('quels') || lowerMessage.includes('avez') ||
  lowerMessage.includes('produits') || lowerMessage.includes('comment') ||
  lowerMessage.includes('où')) {
return 'fr';
}

// English indicators
if (lowerMessage.includes('hello') || lowerMessage.includes('hi') ||
  lowerMessage.includes('thanks') || lowerMessage.includes('please') ||
  lowerMessage.includes('what') || lowerMessage.includes('have') ||
  lowerMessage.includes('products') || lowerMessage.includes('how') ||
  lowerMessage.includes('where')) {
return 'en';
}

return null;
};

// Try quick detection first
const quickResult = quickDetect();
if (quickResult) {
return quickResult;
}

// For other languages, use AI detection via backend
try {
const response = await fetch(`${config.apiKey}/api/detect-language`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ message })
});

if (response.ok) {
const data = await response.json();
if (data.success && data.language) {
  console.log(`🌍 AI detected language: ${data.language}`);
  return data.language;
}
}
} catch (error) {
console.log('🌍 AI language detection failed, using fallback');
}

// Fallback: return null to keep current language
return null;
};

// Get configuration from script tag or global config
function getConfig() {
// PRIORITY 1: Check window.AIOrchestratorConfig (for Shopify and manual configs)
if (window.AIOrchestratorConfig) {
console.log('✅ Config loaded from window.AIOrchestratorConfig');
return {
chatbotId: window.AIOrchestratorConfig.chatbotId,
apiKey: window.AIOrchestratorConfig.apiKey || 'https://aiorchestrator-vtihz.ondigitalocean.app',
theme: window.AIOrchestratorConfig.theme || 'teal',
title: window.AIOrchestratorConfig.title || 'AI Support',
welcomeMessage: window.AIOrchestratorConfig.welcomeMessage || "Hi! I'm your AI support assistant. How can I help you today? 👋",
placeholder: window.AIOrchestratorConfig.placeholder || 'Type your message...',
showAvatar: window.AIOrchestratorConfig.showAvatar !== false,
primaryLanguage: window.AIOrchestratorConfig.primaryLanguage || 'en',
autoOpen: window.AIOrchestratorConfig.autoOpen === true, // Default: false (chiuso)
// Custom branding attributes
primaryColor: window.AIOrchestratorConfig.primaryColor,
secondaryColor: window.AIOrchestratorConfig.secondaryColor,
fontFamily: window.AIOrchestratorConfig.fontFamily,
logo: window.AIOrchestratorConfig.logo
};
}

// PRIORITY 2: Try script tag data attributes
const script = document.querySelector('script[data-chatbot-id]') || 
         document.querySelector('script[data-ai-orchestrator-id]') ||
         document.querySelector('script[src*="shopify-widget-shadowdom"]');

if (script) {
const config = {
chatbotId: script.dataset.chatbotId || script.dataset.aiOrchestratorId,
apiKey: script.dataset.apiKey || 'https://aiorchestrator-vtihz.ondigitalocean.app',
theme: script.dataset.theme || 'teal',
title: script.dataset.title || 'AI Support',
welcomeMessage: script.dataset.welcomeMessage || "Hi! I'm your AI support assistant. How can I help you today? 👋",
placeholder: script.dataset.placeholder || 'Type your message...',
showAvatar: script.dataset.showAvatar !== 'false',
primaryLanguage: script.dataset.primaryLanguage || script.dataset['primary-language'] || 'en',
autoOpen: script.dataset.autoOpen === 'true', // Default: false (chiuso)
// Custom branding attributes
primaryColor: script.dataset.primaryColor,
secondaryColor: script.dataset.secondaryColor,
fontFamily: script.dataset.fontFamily,
logo: script.dataset.logo
};

console.log('✅ Config loaded from script tag:', config);
return config;
}

console.error('❌ No configuration found');
return null;
}


// Theme colors - hardcoded CSS values
const themeColors = {
blue: {
primary: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)',
secondary: 'linear-gradient(to bottom right, #eff6ff, #dbeafe)',
accent: '#2563eb',
text: '#1e3a8a', // Tailwind blue-900
border: '#bfdbfe',
userMessage: '#2563eb'
},
purple: {
  primary: 'linear-gradient(to bottom right, #7c3aed, #6d28d9)',
  secondary: 'linear-gradient(to bottom right, #faf5ff, #f3e8ff)',
  accent: '#7c3aed',
  text: '#581c87', // Tailwind purple-900
  border: '#d8b4fe',
  userMessage: '#7c3aed'
},
green: {
  primary: 'linear-gradient(to bottom right, #059669, #047857)',
  secondary: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)',
  accent: '#059669',
  text: '#064e3b', // Tailwind green-900
  border: '#bbf7d0',
  userMessage: '#059669'
},
red: {
  primary: 'linear-gradient(to bottom right, #dc2626, #b91c1c)',
  secondary: 'linear-gradient(to bottom right, #fef2f2, #fee2e2)',
  accent: '#dc2626',
  text: '#7f1d1d', // Tailwind red-900
  border: '#fecaca',
  userMessage: '#dc2626'
},
orange: {
  primary: 'linear-gradient(to bottom right, #ea580c, #c2410c)',
  secondary: 'linear-gradient(to bottom right, #fff7ed, #ffedd5)',
  accent: '#ea580c',
  text: '#7c2d12', // Tailwind orange-900
  border: '#fed7aa',
  userMessage: '#ea580c'
},
pink: {
  primary: 'linear-gradient(to bottom right, #db2777, #be185d)',
  secondary: 'linear-gradient(to bottom right, #fdf2f8, #fce7f3)',
  accent: '#db2777',
  text: '#831843', // Tailwind pink-900
  border: '#fbcfe8',
  userMessage: '#db2777'
},
indigo: {
  primary: 'linear-gradient(to bottom right, #4f46e5, #4338ca)',
  secondary: 'linear-gradient(to bottom right, #eef2ff, #e0e7ff)',
  accent: '#4f46e5',
  text: '#312e81', // Tailwind indigo-900 (not -700)
  border: '#c7d2fe',
  userMessage: '#4f46e5'
},
teal: {
  primary: 'linear-gradient(to bottom right, #0d9488, #0f766e)',
  secondary: 'linear-gradient(to bottom right, #f0fdfa, #ccfbf1)',
  accent: '#0d9488',
  text: '#134e4a', // Tailwind teal-900
  border: '#99f6e4',
  userMessage: '#0d9488'
}
};

// Show success message in chat
const showSuccessMessage = (message) => {
const messagesContainer = shadowRoot.querySelector('.chat-messages');
if (!messagesContainer) return;

const successDiv = document.createElement('div');
successDiv.style.cssText = 'margin: 8px 0; padding: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 8px; text-align: center; font-weight: 600; animation: slideIn 0.3s ease;';
successDiv.innerHTML = `✅ ${message}`;
messagesContainer.appendChild(successDiv);
messagesContainer.scrollTop = messagesContainer.scrollHeight;

// Remove after 3 seconds
setTimeout(() => successDiv.remove(), 3000);
};

// Global function for Add to Cart (called from product cards)
window.addToCartFromChat = async function(productId, variantId) {
try {
console.log('🛒 Adding to cart from chat - productId:', productId, 'variantId:', variantId);
console.log('🔍 variantId type:', typeof variantId, 'value:', variantId);

// Shopify Ajax API requires variant ID as number or string
// Try to parse as integer if it's a string number
const variantIdToUse = typeof variantId === 'string' && !isNaN(variantId) 
? parseInt(variantId, 10) 
: variantId;

console.log('🔍 Using variantId:', variantIdToUse, 'type:', typeof variantIdToUse);

const payload = {
id: variantIdToUse,
quantity: 1,
properties: {
'_chatbot_recommendation': 'true',
'_recommended_at': new Date().toISOString()
}
};

console.log('📦 Sending to Shopify:', JSON.stringify(payload));

// Use Shopify Ajax API to add to cart
const response = await fetch('/cart/add.js', {
method: 'POST',
headers: { 
'Content-Type': 'application/json',
'Accept': 'application/json'
},
body: JSON.stringify(payload)
});

console.log('📊 Response status:', response.status);

if (response.ok) {
const data = await response.json();
console.log('✅ Added to cart:', data);

// Update cart count in theme
fetch('/cart.js')
.then(r => r.json())
.then(cart => {
  console.log('🛒 Current cart:', cart);
  const cartCount = document.querySelector('.cart-count, [data-cart-count], .cart__count');
  if (cartCount) {
    cartCount.textContent = cart.item_count;
    console.log('✅ Cart count updated:', cart.item_count);
  }
  
  // Show elegant success message in chat (multilingual)
  const lang = config.primaryLanguage || 'en';
  const t = getTranslations(lang);
  showSuccessMessage(t.addedToCart);
  
  // Open cart drawer if available, or redirect to cart
  setTimeout(() => {
    // Try to trigger cart drawer (most themes)
    const cartDrawerTrigger = document.querySelector('[data-cart-drawer], .cart-drawer-trigger, #cart-icon, .js-drawer-open-cart');
    if (cartDrawerTrigger) {
      cartDrawerTrigger.click();
    } else {
      // Fallback: redirect to cart page
      window.location.href = '/cart';
    }
  }, 1500);
});
} else {
const errorData = await response.text();
console.error('❌ Failed to add to cart - Status:', response.status);
console.error('❌ Error response:', errorData);
// Don't show error - user sees it's not in cart
}
} catch (error) {
console.error('❌ Add to cart error:', error);
// Error logged, user can retry
}
};

// Get Shopify access token from connection
async function getShopifyAccessToken(chatbotId, apiUrl) {
try {
// Try to get from window (set by Shopify app)
if (window.ShopifyAccessToken) {
console.log('🔑 Using accessToken from window.ShopifyAccessToken');
return window.ShopifyAccessToken;
}

// Get shop domain from current URL
const shopDomain = window.location.hostname;

// Call PUBLIC endpoint - no authentication required
const url = `${apiUrl}/api/public/shopify/connection?chatbotId=${encodeURIComponent(chatbotId)}&shop=${encodeURIComponent(shopDomain)}`;
console.log('🔍 Fetching Shopify connection from:', url);

const response = await fetch(url);

if (response.ok) {
const data = await response.json();
if (data.success && data.data?.hasConnection && data.data?.accessToken) {
console.log('✅ Got Shopify accessToken for shop:', data.data.shop);
return data.data.accessToken;
} else {
console.log('⚠️ No Shopify connection found for this chatbot');
return null;
}
} else {
console.warn('⚠️ Failed to fetch Shopify connection:', response.status);
return null;
}
} catch (error) {
console.log('⚠️ Could not get Shopify access token:', error.message);
return null;
}
}

// Initialize widget
async function init() {
const config = getConfig();
if (!config) {
console.error('❌ Widget initialization failed: No config');
return;
}

// Load Google Font when requested or by default (Open Sans) for pixel-perfect parity
try {
  const requestedFont = (config.fontFamily || '').trim().toLowerCase();
  if (!requestedFont || requestedFont === 'open sans') {
    if (!document.querySelector('link[data-aiorch-font="open-sans"]')) {
      const pre1 = document.createElement('link');
      pre1.rel = 'preconnect';
      pre1.href = 'https://fonts.googleapis.com';
      pre1.setAttribute('data-aiorch-font', 'open-sans');
      document.head.appendChild(pre1);

      const pre2 = document.createElement('link');
      pre2.rel = 'preconnect';
      pre2.href = 'https://fonts.gstatic.com';
      pre2.crossOrigin = 'anonymous';
      pre2.setAttribute('data-aiorch-font', 'open-sans');
      document.head.appendChild(pre2);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap';
      link.setAttribute('data-aiorch-font', 'open-sans');
      document.head.appendChild(link);
    }
  }
} catch {}

const theme = themeColors[config.theme] || themeColors.teal;

// Determine if any branding is present (logo/font/colors)
const hasLogo = Boolean(config.logo && String(config.logo).trim() !== '');
const hasCustomBranding = Boolean(
  hasLogo ||
  (config.fontFamily && String(config.fontFamily).trim() !== '') ||
  (config.primaryColor && String(config.primaryColor).trim() !== '')
);

// Colors for Professional accents: do NOT override theme gradients
const hasBrandingColors = Boolean(config.primaryColor && String(config.primaryColor).trim() !== '');
let brandingPrimary = hasBrandingColors ? config.primaryColor : theme.accent;
let brandingSecondary = hasBrandingColors ? (config.secondaryColor || config.primaryColor) : theme.accent;

// Title color identical to preview rules:
// - Starter: themed text color
// - Professional+: primary branding color
// Align Starter title color with live embed: uses theme.text (Tailwind -900 variant)
const headerTitleColor = hasCustomBranding ? brandingPrimary : theme.text;
const headerStatusColor = hasCustomBranding ? brandingSecondary : '#6b7280';
const headerButtonHoverBg = hasCustomBranding ? `${brandingPrimary}20` : '#e5e7eb';
const headerButtonColor = hasCustomBranding ? brandingPrimary : '#6b7280';
const typingDotColor = hasCustomBranding ? brandingSecondary : '#9ca3af';

// Apply custom font family if available
// Starter (no custom): use Open Sans to match live embed
// Professional+: use provided custom font
const customFontFamily = config.fontFamily || "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const widgetId = `ai-orchestrator-widget-${config.chatbotId}`;

// ===== RUNTIME DEBUG: dump all inputs and computed styles =====
try {
  const scriptEl = document.querySelector('script[data-chatbot-id], script[data-ai-orchestrator-id], script[src*="shopify-widget-shadowdom"]');
  const scriptDataset = scriptEl ? { ...scriptEl.dataset } : null;
  
  // Check if Open Sans font is loaded
  const openSansLoaded = document.fonts ? document.fonts.check('1em "Open Sans"') : false;
  const fontLinks = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="Open+Sans"]'));
  const fontImports = Array.from(document.styleSheets).some(sheet => {
    try {
      return Array.from(sheet.cssRules || []).some(rule => rule.type === CSSRule.IMPORT_RULE && rule.href && rule.href.includes('Open+Sans'));
    } catch { return false; }
  });
  
  console.groupCollapsed('🧪 AI Orchestrator Shopify Widget Debug');
  console.log('Config (final):', JSON.parse(JSON.stringify(config)));
  console.log('Script dataset:', scriptDataset);
  console.log('Theme key:', config.theme, 'Theme colors:', JSON.parse(JSON.stringify(theme)));
  console.log('Branding present:', hasCustomBranding, {
    primaryColor: config.primaryColor || null,
    secondaryColor: config.secondaryColor || null,
    fontFamily: config.fontFamily || null,
    logo: config.logo ? 'present' : 'empty'
  });
  console.log('Computed colors:', {
    headerTitleColor,
    headerStatusColor,
    headerButtonHoverBg,
    headerButtonColor,
    typingDotColor,
    userMessage: theme.userMessage,
    accent: theme.accent,
    primaryGradient: theme.primary
  });
  console.log('🔤 Font Debug:', {
    customFontFamily,
    cssVarFont: customFontFamily,
    openSansInDocument: openSansLoaded,
    fontLinksInHead: fontLinks.length,
    fontLinks: fontLinks.map(l => l.href),
    fontImportsFound: fontImports,
    documentFonts: document.fonts ? Array.from(document.fonts).map(f => f.family).filter(f => f.includes('Open') || f.includes('Sans')) : 'Font API not available'
  });
  console.log('Widget ID:', widgetId);
  
  // After widget renders, check computed font in message bubbles
  setTimeout(() => {
    try {
      const shadowEl = document.getElementById(widgetId);
      if (shadowEl?.shadowRoot) {
        const testBubble = shadowEl.shadowRoot.querySelector('.message-bubble');
        if (testBubble) {
          const computed = window.getComputedStyle(testBubble);
          const headerTitle = shadowEl.shadowRoot.querySelector('.header-title');
          const headerComputed = headerTitle ? window.getComputedStyle(headerTitle) : null;
          
          console.log('📝 Message bubble computed font:', {
            fontFamily: computed.fontFamily,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            openSansApplied: computed.fontFamily.toLowerCase().includes('open sans')
          });
          
          if (headerComputed) {
            console.log('📝 Header title computed font:', {
              fontFamily: headerComputed.fontFamily,
              fontSize: headerComputed.fontSize,
              fontWeight: headerComputed.fontWeight,
              color: headerComputed.color
            });
          }
          
          // Check @font-face declarations
          const styleSheet = shadowEl.shadowRoot.querySelector('style')?.sheet;
          if (styleSheet) {
            const fontFaces = [];
            try {
              for (let rule of styleSheet.cssRules) {
                if (rule.type === CSSRule.FONT_FACE_RULE) {
                  fontFaces.push({
                    family: rule.style.fontFamily,
                    src: rule.style.src,
                    weight: rule.style.fontWeight
                  });
                }
              }
              console.log('🔤 @font-face rules in Shadow DOM:', fontFaces.length > 0 ? fontFaces : 'None found');
            } catch (e) {
              console.warn('⚠️ Could not read font-face rules (CSP?):', e.message);
            }
          }
        } else {
          console.warn('⚠️ Message bubble not found in shadow root for font check');
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not check computed font:', e);
    }
  }, 1000);
  
  console.groupEnd();
} catch (e) { console.warn('Debug dump failed:', e); }

// Get Shopify access token for enhanced features
const shopifyAccessToken = await getShopifyAccessToken(config.chatbotId, config.apiKey);
console.log('🔑 Shopify access token:', shopifyAccessToken ? 'found ✅' : 'not found (widget will work without Shopify features)');
console.log('🔍 Debug - shopifyAccessToken:', shopifyAccessToken);
console.log('🔍 Debug - shop domain:', window.location.hostname);
console.log('🔍 Debug - chatbotId:', config.chatbotId);

// Create container for shadow DOM
const shadowHost = document.createElement('div');
shadowHost.id = widgetId;
shadowHost.style.cssText = 'all: initial; position: fixed; bottom: 0; right: 0; z-index: 2147483647;';
document.body.appendChild(shadowHost);

// Attach shadow DOM
const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

// Complete widget HTML with ALL styles inline
// Load Open Sans font directly in Shadow DOM using @font-face since @import may be blocked by CSP
const widgetHTML = `
<style>
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.woff2') format('woff2');
}
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsgH1x4gaVc.woff2') format('woff2');
}
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVc.woff2') format('woff2');
}
/* Reset all styles */
:host {
  --ai-font: ${customFontFamily || "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--ai-font);
}
.widget-root { font-family: var(--ai-font); }

/* Toggle Button */
.toggle-button {
position: fixed;
bottom: 24px;
right: 24px;
width: 60px;
height: 60px;
background: ${theme.primary};
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
cursor: pointer;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
z-index: 2147483647;
border: none;
}

.toggle-button:hover {
transform: scale(1.05);
box-shadow: ${hasCustomBranding ? `0 12px 40px ${brandingPrimary}40` : '0 12px 40px rgba(0, 0, 0, 0.3)'};
}

.toggle-button svg {
width: 24px;
height: 24px;
color: white;
}

.online-dot {
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

/* Chat Widget */
.chat-widget {
position: fixed;
bottom: 100px;
right: 24px;
width: 384px;
height: 560px;
z-index: 2147483646;
max-height: calc(100vh - 148px);
  font-family: var(--ai-font) !important;
background: white;
border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
overflow: hidden;
border: 1px solid #e5e7eb;
display: flex;
flex-direction: column;
}

.chat-widget.hidden {
display: none !important;
}

.chat-widget.collapsed {
height: 64px !important;
overflow: hidden !important;
}

.chat-widget.collapsed .messages-container {
display: none !important;
}

.chat-widget.collapsed .input-container {
display: none !important;
}

/* Header */
.chat-header {
background: ${theme.secondary};
border-bottom: 2px solid ${theme.border};
padding: 16px;
display: flex;
align-items: center;
justify-content: space-between;
flex-shrink: 0;
  font-family: var(--ai-font) !important;
}

.chat-header-left {
display: flex;
align-items: center;
gap: 12px;
}

.avatar {
width: 40px;
height: 40px;
background: ${theme.primary};
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
}

.avatar svg {
width: 20px;
height: 20px;
color: white;
}

.header-info {
display: flex;
flex-direction: column;
}

.header-title {
  font-weight: 700;
  font-size: 16px;
  color: ${headerTitleColor} !important;
  font-family: var(--ai-font);
}

.header-status {
font-size: 12px;
color: ${headerStatusColor};
display: flex;
align-items: center;
gap: 8px;
 font-family: var(--ai-font);
}

.status-dot {
width: 8px;
height: 8px;
background: #10b981;
border-radius: 50%;
}

.language-badge {
padding: 2px 8px;
font-size: 10px;
border-radius: 4px;
background: #f3f4f6;
color: #374151;
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.chat-header-right {
display: flex;
align-items: center;
gap: 8px;
}

.header-button {
background: transparent;
border: none;
padding: 8px;
border-radius: 8px;
cursor: pointer;
transition: background 0.2s;
color: ${headerButtonColor};
}

.header-button:hover {
background: ${headerButtonHoverBg};
}

.header-button svg {
width: 16px;
height: 16px;
}

/* Messages Container */
.messages-container {
flex: 1;
overflow-y: auto;
padding: 16px;
background: #f9fafb;
 font-family: var(--ai-font) !important;
}

.message {
margin-bottom: 16px;
display: flex;
}

.message.user {
justify-content: flex-end;
}

.message.bot {
justify-content: flex-start;
}

.message-bubble {
max-width: 80%;
border-radius: 16px;
padding: 12px 16px;
font-size: 14px;
  /* Match quick embed: force Open Sans in message bubbles */
  font-family: var(--ai-font) !important;
}

.message.bot .message-bubble {
background: white;
color: #111827;
border: 1px solid #e5e7eb;
}

.message.user .message-bubble {
background: ${theme.userMessage};
color: white;
}

.message-time {
font-size: 11px;
margin-top: 4px;
opacity: 0.7;
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Typing Indicator */
.typing-indicator {
display: flex;
align-items: center;
gap: 4px;
padding: 12px 16px;
background: white;
border: 1px solid #e5e7eb;
border-radius: 16px;
max-width: 80px;
}

.typing-dot {
width: 8px;
height: 8px;
background: ${typingDotColor};
border-radius: 50%;
animation: bounce 1.4s infinite ease-in-out both;
}

.typing-dot:nth-child(1) {
animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
animation-delay: -0.16s;
}

@keyframes bounce {
0%, 80%, 100% {
  transform: scale(0);
}
40% {
  transform: scale(1);
}
}

/* Input Container */
.input-container {
  padding: 16px 16px 20px 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  font-family: var(--ai-font) !important;
}

.input-row {
  display: flex;
  gap: 8px;
}

.message-input {
flex: 1;
padding: 10px 16px;
border: 1px solid #d1d5db;
border-radius: 8px;
font-size: 14px;
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
outline: none;
transition: border-color 0.2s;
}

.message-input:focus {
border-color: ${hasCustomBranding ? brandingPrimary : theme.accent};
box-shadow: 0 0 0 3px ${hasCustomBranding ? `${brandingPrimary}22` : `${theme.accent}22`};
}
.message-input::placeholder { color: #9ca3af; }

.send-button {
background: ${hasCustomBranding ? brandingPrimary : theme.accent};
color: white;
border: none;
width: 44px;
height: 44px;
border-radius: 12px;
flex-shrink: 0;
display: grid;
place-items: center;
cursor: pointer;
}

.send-button:hover {
opacity: 0.9;
}

.send-button svg {
width: 20px;
height: 20px;
transform: rotate(45deg);
}

/* 📱 MOBILE RESPONSIVE - Migliora leggibilità ma mantiene floating design */
@media (max-width: 768px) {
/* Toggle button leggermente più grande */
.toggle-button {
  width: 58px;
  height: 58px;
  bottom: 20px;
  right: 20px;
}

/* Chat widget - mantiene floating ma ottimizzato */
.chat-widget {
  bottom: 90px;
  right: 12px;
  width: calc(100% - 24px);
  max-width: 380px;
  height: 450px;
  max-height: calc(100vh - 140px);
}

/* Font più leggibili su mobile */
.message {
  font-size: 15px !important;
  line-height: 1.5 !important;
}

.message-time {
  font-size: 11px !important;
}

input {
  font-size: 16px !important; /* Previene zoom su iOS */
  padding: 12px 16px !important;
}

button {
  min-height: 44px !important; /* iOS touch target size */
  font-size: 15px !important;
}

/* Header più leggibile */
.chat-header h3 {
  font-size: 16px !important;
}

.chat-header p {
  font-size: 13px !important;
}
}

/* 📱 MOBILE SMALL (iPhone SE, etc.) */
@media (max-width: 390px) {
.toggle-button {
  width: 54px;
  height: 54px;
  bottom: 16px;
  right: 16px;
}

.chat-widget {
  width: calc(100% - 16px);
  right: 8px;
  bottom: 80px;
  height: 420px;
  max-height: calc(100vh - 120px);
}
}
</style>

<div class="widget-root">
<!-- Toggle Button -->
<div class="toggle-button" id="toggle">
${config.logo ? `
  <img src="${config.logo}" alt="Logo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />
` : `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
  </svg>
`}
<div class="online-dot"></div>
</div>

<!-- Chat Widget -->
<div class="chat-widget ${config.autoOpen ? '' : 'hidden'}" id="chat">
<!-- Header -->
<div class="chat-header">
  <div class="chat-header-left">
    ${config.showAvatar ? `
      <div class="avatar">
        ${hasLogo ? `
          <img src="${config.logo}" alt="Logo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;" />
        ` : `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        `}
      </div>
    ` : ''}
    <div class="header-info">
      <div class="header-title" style="font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${config.title}</div>
      <div class="header-status">
        <div class="status-dot"></div>
        <span>Online 24/7</span>
        ${config.primaryLanguage && config.primaryLanguage !== 'auto' ? `<span class="language-badge">${config.primaryLanguage.toUpperCase()}</span>` : ''}
      </div>
    </div>
  </div>
  <div class="chat-header-right">
    <button class="header-button" id="minimize" title="Minimize">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
      </svg>
    </button>
    <button class="header-button" id="close" title="Close">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>
</div>

<!-- Messages -->
<div class="messages-container" id="messages">
  <div class="message bot">
    <div class="message-bubble" style="font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div>${cleanEscapeChars(config.welcomeMessage)}</div>
      <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
    </div>
  </div>
</div>

<!-- Input -->
<div class="input-container">
  <div class="input-row">
    <input
      type="text"
      class="message-input"
      id="input"
      placeholder="${config.placeholder}"
    />
    <button class="send-button" id="send">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
      </svg>
    </button>
  </div>
  ${hasLogo ? '' : `<p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 8px 0 0 0; padding: 0; font-family: var(--ai-font);">Powered by AI Orchestrator</p>`}
</div>
</div>
</div>
`;

shadowRoot.innerHTML = widgetHTML;

// Get elements from shadow DOM
const toggleBtn = shadowRoot.getElementById('toggle');
const chatWidget = shadowRoot.getElementById('chat');
const minimizeBtn = shadowRoot.getElementById('minimize');
const closeBtn = shadowRoot.getElementById('close');
const sendBtn = shadowRoot.getElementById('send');
const inputField = shadowRoot.getElementById('input');
const messagesContainer = shadowRoot.getElementById('messages');

let isOpen = config.autoOpen;

// Toggle button
if (toggleBtn) {
toggleBtn.addEventListener('click', () => {
if (isOpen) {
chatWidget.classList.add('hidden');
isOpen = false;
} else {
chatWidget.classList.remove('hidden');
isOpen = true;
}
});
}

// Minimize button
if (minimizeBtn) {
minimizeBtn.addEventListener('click', () => {
chatWidget.classList.toggle('collapsed');
});
}

// Close button
if (closeBtn) {
closeBtn.addEventListener('click', () => {
chatWidget.classList.add('hidden');
isOpen = false;
});
}

// Extract customer email from message
const extractCustomerEmail = (message) => {
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const match = message.match(emailRegex);
return match ? match[0] : null;
};

// Get translations for UI labels
const getTranslations = (lang) => {
const translations = {
en: { productRecs: 'Product Recommendations', inStock: 'In Stock', outOfStock: 'Out of Stock', viewProduct: 'View Product', addToCart: 'Add to Cart', forYou: 'For You', addedToCart: 'Added to cart!' },
it: { productRecs: 'Prodotti Consigliati', inStock: 'Disponibile', outOfStock: 'Non Disponibile', viewProduct: 'Vedi Prodotto', addToCart: 'Aggiungi al Carrello', forYou: 'Per Te', addedToCart: 'Aggiunto al carrello!' },
es: { productRecs: 'Productos Recomendados', inStock: 'En Stock', outOfStock: 'Agotado', viewProduct: 'Ver Producto', addToCart: 'Añadir', forYou: 'Para Ti', addedToCart: '¡Añadido al carrito!' },
fr: { productRecs: 'Recommandations', inStock: 'En Stock', outOfStock: 'Rupture', viewProduct: 'Voir', addToCart: 'Ajouter', forYou: 'Pour Vous', addedToCart: 'Ajouté au panier!' },
de: { productRecs: 'Empfehlungen', inStock: 'Verfügbar', outOfStock: 'Ausverkauft', viewProduct: 'Ansehen', addToCart: 'In Warenkorb', forYou: 'Für Dich', addedToCart: 'In Warenkorb gelegt!' },
pt: { productRecs: 'Recomendações', inStock: 'Disponível', outOfStock: 'Esgotado', viewProduct: 'Ver', addToCart: 'Adicionar', forYou: 'Para Você', addedToCart: 'Adicionado!' },
ru: { productRecs: 'Рекомендации', inStock: 'Есть', outOfStock: 'Нет', viewProduct: 'Смотреть', addToCart: 'В корзину', forYou: 'Для вас', addedToCart: 'Добавлено!' },
zh: { productRecs: '推荐', inStock: '有货', outOfStock: '缺货', viewProduct: '查看', addToCart: '加入', forYou: '推荐', addedToCart: '已加入!' },
ja: { productRecs: 'おすすめ', inStock: '在庫あり', outOfStock: '在庫なし', viewProduct: '見る', addToCart: '追加', forYou: 'おすすめ', addedToCart: '追加しました!' },
ko: { productRecs: '추천', inStock: '있음', outOfStock: '품절', viewProduct: '보기', addToCart: '추가', forYou: '추천', addedToCart: '추가됨!' },
ar: { productRecs: 'توصيات', inStock: 'متوفر', outOfStock: 'نفذ', viewProduct: 'عرض', addToCart: 'أضف', forYou: 'لك', addedToCart: 'تمت الإضافة!' },
hi: { productRecs: 'सिफारिशें', inStock: 'उपलब्ध', outOfStock: 'खत्म', viewProduct: 'देखें', addToCart: 'जोड़ें', forYou: 'आपके लिए', addedToCart: 'जोड़ा गया!' }
};
return translations[lang] || translations.en;
};

// Render Shopify Enhanced Features
const renderShopifyEnhancements = (enhancements, detectedLanguage = 'en', userPlan = null) => {
let html = '';
const t = getTranslations(detectedLanguage);

// Check if Add to Cart is available in user's plan
const canAddToCart = userPlan?.features?.addToCart === true;

// Product Recommendations
if (enhancements.recommendations && enhancements.recommendations.length > 0) {
html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">';

// Show personalization message if available
if (enhancements.personalized && enhancements.personalizationReason) {
html += `<div style="font-size: 11px; color: #0369a1; margin-bottom: 8px; font-weight: 500;">✨ ${enhancements.personalizationReason}</div>`;
}

html += `<h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">🛍️ ${t.productRecs}</h4>`;
enhancements.recommendations.forEach(product => {
html += `<div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border: 1px solid #e0f2fe; position: relative;">`;

// Personalized badge
if (product.personalizedScore) {
  html += `<div style="position: absolute; top: 4px; right: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">✨ ${t.forYou.toUpperCase()}</div>`;
}

html += `<div style="font-weight: 600; color: #0c4a6e; margin-top: ${product.personalizedScore ? '20px' : '0'};">${product.title}</div>`;
if (product.description) html += `<div style="font-size: 12px; color: #64748b; margin: 4px 0;">${product.description}</div>`;
if (product.reason) html += `<div style="font-size: 11px; color: #0369a1; margin: 4px 0; font-style: italic;">💡 ${product.reason}</div>`;
html += `<div style="font-weight: 600; color: #059669; margin: 4px 0;">$${product.price} ${product.inStock ? '✅ ' + t.inStock : '❌ ' + t.outOfStock}</div>`;

// Action buttons
html += `<div style="display: flex; gap: 8px; margin-top: 8px;">`;
if (product.url) html += `<a href="${product.url}" target="_blank" style="flex: 1; text-align: center; padding: 6px 12px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 600;">${t.viewProduct}</a>`;
// Only show Add to Cart button if feature is available in plan
if (canAddToCart) {
  html += `<button onclick="window.addToCartFromChat('${product.id}', '${product.variantId || product.id}')" style="flex: 1; padding: 6px 12px; background: #059669; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">🛒 ${t.addToCart}</button>`;
}
html += `</div>`;
html += `</div>`;
});
html += '</div>';
}

// Order Tracking
if (enhancements.order) {
html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">';
html += '<h4 style="margin: 0 0 8px 0; color: #166534; font-size: 14px; font-weight: 600;">📦 Order Status</h4>';
html += `<div style="font-weight: 600; color: #166534;">Order #${enhancements.order.name}</div>`;
html += `<div style="color: #16a34a; margin: 4px 0;">Status: ${enhancements.order.fulfillment_status || 'Processing'}</div>`;
html += `<div style="font-size: 12px; color: #64748b;">Total: $${enhancements.order.total_price}</div>`;
html += '</div>';
}

// Customer History
if (enhancements.customerHistory) {
html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #fefce8; border-radius: 8px; border-left: 4px solid #eab308;">';
html += '<h4 style="margin: 0 0 8px 0; color: #a16207; font-size: 14px; font-weight: 600;">👤 Customer History</h4>';
html += `<div style="color: #a16207;">Total Orders: ${enhancements.customerHistory.totalOrders || 0}</div>`;
html += `<div style="color: #a16207;">Total Spent: $${enhancements.customerHistory.totalSpent || 0}</div>`;
html += '</div>';
}

// 🛒 Cart Action (Add to Cart confirmation)
if (enhancements.cartAction) {
html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #d1fae5; border-radius: 8px; border-left: 4px solid #059669;">';
html += `<div style="color: #065f46; font-weight: 600;">${enhancements.cartAction.message || '✅ Added to cart!'}</div>`;
html += '</div>';
}

// 💳 Checkout Guidance
if (enhancements.checkoutGuidance) {
html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">';
html += '<h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">💳 Checkout Guide</h4>';
html += `<div style="color: #78350f; margin-bottom: 8px;">${enhancements.checkoutGuidance.message}</div>`;
enhancements.checkoutGuidance.steps.forEach((step, idx) => {
html += `<div style="margin: 4px 0; color: #78350f; font-size: 13px;">${step.step}. ${step.title}</div>`;
});
if (enhancements.checkoutGuidance.quickCheckout) {
html += enhancements.checkoutGuidance.quickCheckout;
}
html += '</div>';
}

// 🎯 Upsell / Cross-sell
if (enhancements.upsells && enhancements.upsells.length > 0) {
html += '<div class="shopify-enhancements" style="margin-top: 12px; padding: 12px; background: #fce7f3; border-radius: 8px; border-left: 4px solid #ec4899;">';
html += '<h4 style="margin: 0 0 8px 0; color: #9f1239; font-size: 14px; font-weight: 600;">✨ You might also love</h4>';
if (enhancements.upsellMessage) html += `<div style="color: #9f1239; margin-bottom: 8px; font-size: 13px;">${enhancements.upsellMessage}</div>`;
enhancements.upsells.forEach(upsell => {
html += `<div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border: 1px solid #fbcfe8;">`;
html += `<div style="display: flex; align-items: center; gap: 8px;">`;
html += `<div style="font-weight: 600; color: #9f1239; flex: 1;">${upsell.title}</div>`;
html += `<div style="background: #ec4899; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">${upsell.badge}</div>`;
html += `</div>`;
html += `<div style="font-weight: 600; color: #059669; margin: 4px 0;">$${upsell.price}</div>`;
if (upsell.reason) html += `<div style="font-size: 11px; color: #831843; margin: 4px 0;">${upsell.reason}</div>`;
if (upsell.url) html += `<a href="${upsell.url}" target="_blank" style="color: #ec4899; text-decoration: none; font-size: 12px; font-weight: 600;">View →</a>`;
html += `</div>`;
});
html += '</div>';
}

// 💰 Stripe Payment
if (enhancements.payment && enhancements.payment.button) {
html += '<div class="shopify-enhancements" style="margin-top: 12px;">';
html += enhancements.payment.button;
html += '</div>';
}

// No upgrade messages - end customers shouldn't see plan limitations

return html;
};

// Render Universal Embed Features
const renderEmbedEnhancements = (enhancements) => {
let html = '';

if (enhancements.websiteData) {
html += '<div class="embed-enhancements" style="margin-top: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1;">';
html += '<h4 style="margin: 0 0 8px 0; color: #4338ca; font-size: 14px; font-weight: 600;">🌐 Website Information</h4>';
if (enhancements.websiteData.title) html += `<div style="font-weight: 600; color: #4338ca;">${enhancements.websiteData.title}</div>`;
if (enhancements.websiteData.description) html += `<div style="font-size: 12px; color: #64748b; margin: 4px 0;">${enhancements.websiteData.description}</div>`;
html += '</div>';
}

return html;
};

// Render ML Analysis
const renderMLAnalysis = (analysis) => {
let html = '';

if (analysis.sentiment) {
const sentimentEmoji = analysis.sentiment === 'positive' ? '😊' : analysis.sentiment === 'negative' ? '😔' : '😐';
html += '<div class="ml-analysis" style="margin-top: 12px; padding: 8px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #475569;">';
html += `${sentimentEmoji} Sentiment: ${analysis.sentiment}`;
if (analysis.confidence) html += ` (${Math.round(analysis.confidence * 100)}% confidence)`;
html += '</div>';
}

return html;
};

// Send message
const sendMessage = async () => {
const message = inputField.value.trim();
if (!message) return;

// Detect language from user message and update config if needed
const detectedLang = await detectLanguage(message);
if (detectedLang && detectedLang !== config.primaryLanguage) {
console.log(`🌍 Language detected: ${detectedLang}, updating config from ${config.primaryLanguage}`);
config.primaryLanguage = detectedLang;
} else if (detectedLang === null) {
console.log(`🌍 No clear language detected, keeping current: ${config.primaryLanguage}`);
}

// Add user message
const userMessageDiv = document.createElement('div');
userMessageDiv.className = 'message user';
userMessageDiv.innerHTML = `
<div class="message-bubble" style="font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
<div>${message}</div>
<div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
</div>
`;
messagesContainer.appendChild(userMessageDiv);
inputField.value = '';

// Add typing indicator
const typingDiv = document.createElement('div');
typingDiv.className = 'message bot';
typingDiv.id = 'typing';
typingDiv.innerHTML = `
<div class="typing-indicator">
<div class="typing-dot"></div>
<div class="typing-dot"></div>
<div class="typing-dot"></div>
</div>
`;
messagesContainer.appendChild(typingDiv);
messagesContainer.scrollTop = messagesContainer.scrollHeight;

// Send to API
try {
const response = await fetch(`${config.apiKey}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message,
    context: {
      chatbotId: config.chatbotId,
      primaryLanguage: config.primaryLanguage, // Use detected language
      connectionType: 'shopify',
      shopifyConnection: shopifyAccessToken ? {
        shop: window.location.hostname,
        accessToken: shopifyAccessToken
      } : null,
      websiteUrl: window.location.origin,
      customerEmail: extractCustomerEmail(message)
    }
  })
});

const data = await response.json();

// Remove typing indicator
const typingElement = shadowRoot.getElementById('typing');
if (typingElement) typingElement.remove();

// Check for trial expired or upgrade required
if (response.status === 403 && (data.trialExpired || data.upgradeRequired)) {
// Show trial expired message
const trialExpiredDiv = document.createElement('div');
trialExpiredDiv.className = 'message bot trial-expired';
trialExpiredDiv.innerHTML = `
  <div style="text-align: center; padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; margin: 10px 0;">
    <div style="font-size: 18px; font-weight: 600; color: #dc2626; margin-bottom: 10px;">
      ⏰ Trial Expired
    </div>
    <div style="color: #7f1d1d; margin-bottom: 15px;">
      ${data.error}
    </div>
    <a href="${data.upgradeUrl}" target="_blank" style="
      display: inline-block;
      background: #dc2626;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s;
    " onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">
      Upgrade Now
    </a>
  </div>
`;
messagesContainer.appendChild(trialExpiredDiv);
messagesContainer.scrollTop = messagesContainer.scrollHeight;
return;
}

// Check for message limit reached
if (response.status === 429 && data.limitReached) {
// Show message limit reached
const limitReachedDiv = document.createElement('div');
limitReachedDiv.className = 'message bot limit-reached';
limitReachedDiv.innerHTML = `
  <div style="text-align: center; padding: 20px; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; margin: 10px 0;">
    <div style="font-size: 18px; font-weight: 600; color: #d97706; margin-bottom: 10px;">
      📊 Monthly Limit Reached
    </div>
    <div style="color: #92400e; margin-bottom: 15px;">
      ${data.error}
    </div>
    <div style="color: #92400e; font-size: 14px; margin-bottom: 15px;">
      Used: ${data.currentUsage}/${data.limit} messages this month
    </div>
    <a href="/pricing" target="_blank" style="
      display: inline-block;
      background: #d97706;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s;
    " onmouseover="this.style.background='#b45309'" onmouseout="this.style.background='#d97706'">
      Upgrade Plan
    </a>
  </div>
`;
messagesContainer.appendChild(limitReachedDiv);
messagesContainer.scrollTop = messagesContainer.scrollHeight;
inputField.disabled = true;
inputField.placeholder = 'Monthly limit reached - upgrade required';
return;
}

// Add AI response with enhanced features
const aiMessageDiv = document.createElement('div');
aiMessageDiv.className = 'message bot';

let responseContent = data.response || 'Sorry, I couldn\'t process that.';

// Add Personalized Greeting (if first message)
if (data.personalization?.greeting) {
responseContent = data.personalization.greeting.greeting + '<br><br>' + responseContent;
}

// Add Shopify Enhanced Features if available
if (data.shopifyEnhancements) {
// Detect language from AI response or use config
const detectedLang = data.detectedLanguage || config.primaryLanguage || 'en';
responseContent += renderShopifyEnhancements(data.shopifyEnhancements, detectedLang, data.userPlan);
}

// Add Universal Embed Features if available
if (data.embedEnhancements) {
responseContent += renderEmbedEnhancements(data.embedEnhancements);
}

// Add Personalized Discount if available
if (data.personalization?.discount) {
const discount = data.personalization.discount;
responseContent += `<div style="margin-top: 12px; padding: 12px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 8px; color: white; text-align: center;">
  <div style="font-weight: 600; margin-bottom: 4px;">🎁 Special Offer</div>
  <div style="font-size: 13px;">${discount.message}</div>
</div>`;
}

// Add ML Analysis if available
if (data.mlAnalysis) {
responseContent += renderMLAnalysis(data.mlAnalysis);
}

aiMessageDiv.innerHTML = `
<div class="message-bubble" style="font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div>${responseContent}</div>
  <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
</div>
`;
messagesContainer.appendChild(aiMessageDiv);
messagesContainer.scrollTop = messagesContainer.scrollHeight;
} catch (error) {
console.error('❌ Message send error:', error);
const typingElement = shadowRoot.getElementById('typing');
if (typingElement) typingElement.remove();

const errorDiv = document.createElement('div');
errorDiv.className = 'message bot';
errorDiv.innerHTML = `
<div class="message-bubble" style="background: #fef2f2; color: #7f1d1d; border-color: #fecaca;">
  <div>Sorry, there was an error. Please try again.</div>
  <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
</div>
`;
messagesContainer.appendChild(errorDiv);
messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
};

if (sendBtn) {
sendBtn.addEventListener('click', sendMessage);
}

if (inputField) {
inputField.addEventListener('keypress', (e) => {
if (e.key === 'Enter') {
sendMessage();
}
});
}

console.log('✅ Widget initialized with Shadow DOM');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();

