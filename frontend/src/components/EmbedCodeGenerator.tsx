import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Code, 
  Globe, 
  Settings, 
  Palette,
  MessageCircle,
  Download,
  Eye,
  Zap,
  X
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useChatbot } from '../contexts/ChatbotContext';

interface EmbedCodeGeneratorProps {
  chatbotId: string;
  apiKey: string;
  onClose: () => void;
}

const EmbedCodeGenerator: React.FC<EmbedCodeGeneratorProps> = ({
  chatbotId,
  apiKey,
  onClose
}) => {
  const { user } = useUser();
  const { selectedChatbot } = useChatbot();
  
  const [config, setConfig] = useState({
    position: 'bottom-right',
    theme: 'blue',
    language: 'auto',
    welcomeMessage: 'Hello! How can I help you today?',
    placeholder: 'Type your message...',
    showAvatar: true,
    showPoweredBy: true,
    borderRadius: '12px',
    fontSize: '14px',
    width: '320px',
    height: '400px',
    animation: 'slide-up',
    shadow: 'medium',
    opacity: '100'
  });

  // Load branding settings for Professional+ plans
  useEffect(() => {
    if (user?.isPaid && selectedChatbot?.settings) {
      const settings = typeof selectedChatbot.settings === 'string' 
        ? JSON.parse(selectedChatbot.settings) 
        : selectedChatbot.settings;
      
      if (settings.branding) {
        setConfig(prev => ({
          ...prev,
          fontFamily: settings.branding.fontFamily || 'Inter'
        }));
      }
    }
  }, [user?.isPaid, selectedChatbot]);

  // Listen for branding updates from BrandingSettings
  useEffect(() => {
    const handleBrandingUpdate = (event: CustomEvent) => {
      const branding = event.detail;
      setConfig(prev => ({
        ...prev,
        fontFamily: branding.fontFamily || prev.fontFamily
      }));
      
      // Show live update indicator
      setIsLiveUpdate(true);
      setTimeout(() => setIsLiveUpdate(false), 2000);
    };

    window.addEventListener('brandingUpdated', handleBrandingUpdate as EventListener);
    return () => window.removeEventListener('brandingUpdated', handleBrandingUpdate as EventListener);
  }, []);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'preview' | 'shopify'>('basic');
  const [isLiveUpdate, setIsLiveUpdate] = useState(false);

  const generateEmbedCode = () => {
    const { position, theme, language, welcomeMessage, placeholder, showAvatar, showPoweredBy, borderRadius, fontSize, width, height } = config;
    const isBusinessPlan = user?.planId === 'business';
    const shouldShowPoweredBy = isBusinessPlan ? false : showPoweredBy;
    
    // Starter plan - basic widget without custom branding
    if (!user?.isPaid) {
      return `<!-- AI Orchestrator Chatbot Widget -->
<script 
  src="https://www.aiorchestrator.dev/chatbot-widget.js"
  data-ai-orchestrator-id="${chatbotId}"
  data-api-key="${apiKey}"
  data-theme="${theme}"
  data-title="AI Support"
  data-placeholder="${placeholder}"
  data-show-avatar="${showAvatar}"
  data-welcome-message="${welcomeMessage}"
  data-primary-language="${language}"
  data-auto-open="false"
  defer>
</script>
<!-- End AI Orchestrator Chatbot Widget -->`;
    }
    
    // Professional+ plan - advanced widget with custom branding
    // Business plan includes white-label
    let whiteLabelAttrs = '';
    if (isBusinessPlan && selectedChatbot?.settings) {
      const settings = typeof selectedChatbot.settings === 'string' 
        ? JSON.parse(selectedChatbot.settings) 
        : selectedChatbot.settings;
      if (settings.whiteLabel?.removeBranding) {
        whiteLabelAttrs = `data-show-powered-by="false"`;
        if (settings.whiteLabel?.customText) {
          whiteLabelAttrs += `\n  data-powered-by-text="${settings.whiteLabel.customText.replace(/"/g, '&quot;')}"`;
        }
      }
    }
    
    return `<!-- AI Orchestrator Chatbot Widget -->
<script 
  src="https://www.aiorchestrator.dev/chatbot-widget.js"
  data-ai-orchestrator-id="${chatbotId}"
  data-api-key="${apiKey}"
  data-theme="${theme}"
  data-title="AI Support"
  data-placeholder="${placeholder}"
  data-show-avatar="${showAvatar}"
  data-welcome-message="${welcomeMessage}"
  data-primary-language="${language}"
  ${whiteLabelAttrs}
  ${config.fontFamily ? `data-font-family="${config.fontFamily}"` : ''}
  ${selectedChatbot?.settings ? (() => {
    const settings = typeof selectedChatbot.settings === 'string' 
      ? JSON.parse(selectedChatbot.settings) 
      : selectedChatbot.settings;
    return settings.branding?.logo ? `data-logo="${settings.branding.logo}"` : '';
  })() : ''}
  defer>
</script>
<!-- End AI Orchestrator Chatbot Widget -->`;
  };

  const generateReactCode = () => {
    const { position, theme, language, welcomeMessage, placeholder, showAvatar, showPoweredBy, borderRadius, fontSize, width, height } = config;
    
    // Starter plan - basic React component
    if (!user?.isPaid) {
      return `import React from 'react';
import ChatbotWidget from '@aiorchestrator/react-widget';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      <ChatbotWidget
        chatbotId="${chatbotId}"
        apiKey="${apiKey}"
        theme="${theme}"
        language="${language}"
        welcomeMessage="${welcomeMessage}"
        placeholder="${placeholder}"
        showAvatar={${showAvatar}}
        showPoweredBy={${showPoweredBy}}
      />
    </div>
  );
}

export default App;`;
    }
    
    // Professional+ plan - advanced React component with custom branding
    return `import React from 'react';
import ChatbotWidget from '@aiorchestrator/react-widget';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      <ChatbotWidget
        chatbotId="${chatbotId}"
        apiKey="${apiKey}"
        position="${position}"
        theme="${theme}"
        language="${language}"
        welcomeMessage="${welcomeMessage}"
        placeholder="${placeholder}"
        showAvatar={${showAvatar}}
        showPoweredBy={${showPoweredBy}}
        customStyles={{
          primaryColor: '${primaryColor}',
          borderRadius: '${borderRadius}',
          fontSize: '${fontSize}',
          width: '${width}',
          height: '${height}',
          fontFamily: '${config.fontFamily || 'Inter'}'
        }}
        customCSS={\`${config.customCSS || ''}\`}
      />
    </div>
  );
}

export default App;`;
  };

  const generateVueCode = () => {
    const { position, theme, language, welcomeMessage, placeholder, showAvatar, showPoweredBy, borderRadius, fontSize, width, height } = config;
    
    // Starter plan - basic Vue component
    if (!user?.isPaid) {
      return `<template>
  <div>
    <!-- Your app content -->
    
    <ChatbotWidget
      :chatbot-id="${chatbotId}"
      :api-key="${apiKey}"
      :theme="${theme}"
      :language="${language}"
      :welcome-message="${welcomeMessage}"
      :placeholder="${placeholder}"
      :show-avatar="${showAvatar}"
      :show-powered-by="${showPoweredBy}"
    />
  </div>
</template>

<script>
import ChatbotWidget from '@aiorchestrator/vue-widget';

export default {
  components: {
    ChatbotWidget
  }
};
</script>`;
    }
    
    // Professional+ plan - advanced Vue component with custom branding
    return `<template>
  <div>
    <!-- Your app content -->
    
    <ChatbotWidget
      :chatbot-id="${chatbotId}"
      :api-key="${apiKey}"
      :position="${position}"
      :theme="${theme}"
      :language="${language}"
      :welcome-message="${welcomeMessage}"
      :placeholder="${placeholder}"
      :show-avatar="${showAvatar}"
      :show-powered-by="${showPoweredBy}"
      :custom-styles="customStyles"
      :custom-css="customCSS"
    />
  </div>
</template>

<script>
import ChatbotWidget from '@aiorchestrator/vue-widget';

export default {
  components: {
    ChatbotWidget
  },
  data() {
    return {
      customStyles: {
        primaryColor: '${primaryColor}',
        borderRadius: '${borderRadius}',
        fontSize: '${fontSize}',
        width: '${width}',
        height: '${height}',
        fontFamily: '${config.fontFamily || 'Inter'}'
      },
    };
  }
};
</script>`;
  };

  const generateShopifyCode = () => {
    const { theme, language, welcomeMessage, placeholder, showAvatar } = config;
    const isBusinessPlan = user?.planId === 'business';
    
    // Get branding settings from chatbot
    let logo = '';
    let fontFamily = '';
    let whiteLabelAttrs = '';
    if (selectedChatbot?.settings) {
      const settings = typeof selectedChatbot.settings === 'string' 
        ? JSON.parse(selectedChatbot.settings) 
        : selectedChatbot.settings;
      if (settings.branding) {
        logo = settings.branding.logo || '';
        fontFamily = settings.branding.fontFamily || '';
      }
      if (isBusinessPlan && settings.whiteLabel?.removeBranding) {
        whiteLabelAttrs = `data-show-powered-by="false"`;
        if (settings.whiteLabel?.customText) {
          whiteLabelAttrs += `\n  data-powered-by-text="${settings.whiteLabel.customText.replace(/"/g, '&quot;')}"`;
        }
      }
    }
    
    // Starter plan - basic Shopify code
    if (!user?.isPaid) {
      return `<!-- Add this to your theme.liquid file before </body> -->
<script 
  src="https://www.aiorchestrator.dev/shopify-widget-shadowdom.js"
  data-ai-orchestrator-id="${chatbotId}"
  data-api-key="${apiKey}"
  data-theme="${theme}"
  data-title="AI Support"
  data-placeholder="${placeholder}"
  data-show-avatar="${showAvatar}"
  data-welcome-message="${welcomeMessage}"
  data-primary-language="${language}"
  defer>
</script>`;
    }
    
    // Professional+ plan - advanced Shopify code with custom branding
    return `<!-- Add this to your theme.liquid file before </body> -->
<script 
  src="https://www.aiorchestrator.dev/shopify-widget-shadowdom.js"
  data-ai-orchestrator-id="${chatbotId}"
  data-api-key="${apiKey}"
  data-theme="${theme}"
  data-title="AI Support"
  data-placeholder="${placeholder}"
  data-show-avatar="${showAvatar}"
  data-welcome-message="${welcomeMessage}"
  data-primary-language="${language}"
  ${fontFamily ? `data-font-family="${fontFamily}"` : ''}
  ${logo ? `data-logo="${logo}"` : ''}
  ${whiteLabelAttrs}
  defer>
</script>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Embed Code Generator</h3>
                <p className="text-sm text-gray-600">Generate code to embed your chatbot</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Configuration Panel */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'basic' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'advanced' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Advanced
                </button>
                <button
                  onClick={() => setActiveTab('shopify')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'shopify' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Shopify
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'preview' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Preview
                </button>
              </div>

              {/* Basic Configuration */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <select
                      value={config.position}
                      onChange={(e) => setConfig({ ...config, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={config.theme}
                      onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={config.language}
                      onChange={(e) => setConfig({ ...config, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="auto">Auto Detect</option>
                      <option value="en">English</option>
                      <option value="it">Italiano</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                    <textarea
                      value={config.welcomeMessage}
                      onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder Text</label>
                    <input
                      type="text"
                      value={config.placeholder}
                      onChange={(e) => setConfig({ ...config, placeholder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.showAvatar}
                        onChange={(e) => setConfig({ ...config, showAvatar: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show Avatar</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.showPoweredBy}
                        onChange={(e) => setConfig({ ...config, showPoweredBy: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show "Powered by"</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Advanced Configuration */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                    <input
                      type="text"
                      value={config.borderRadius}
                      onChange={(e) => setConfig({ ...config, borderRadius: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                    <input
                      type="text"
                      value={config.fontSize}
                      onChange={(e) => setConfig({ ...config, fontSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                      <input
                        type="text"
                        value={config.width}
                        onChange={(e) => setConfig({ ...config, width: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                      <input
                        type="text"
                        value={config.height}
                        onChange={(e) => setConfig({ ...config, height: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shopify Configuration */}
              {activeTab === 'shopify' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Shopify Integration</h4>
                    <p className="text-sm text-gray-600">
                      {!user?.isPaid 
                        ? 'Basic widget for Starter plan - no custom branding'
                        : 'Advanced widget with custom branding for Professional+ plans'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Installation Steps</h5>
                    <ol className="text-sm text-gray-600 space-y-2">
                      <li>1. Go to your Shopify Admin → Online Store → Themes</li>
                      <li>2. Click "Actions" → "Edit code" on your active theme</li>
                      <li>3. Open the "theme.liquid" file</li>
                      <li>4. Find the &lt;/body&gt; tag</li>
                      <li>5. Paste the code above the &lt;/body&gt; tag</li>
                      <li>6. Save the file</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Preview */}
              {activeTab === 'preview' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h4>
                    <p className="text-sm text-gray-600">Preview your chatbot widget configuration</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-500 mb-2">Preview will appear here</div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Output */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {activeTab === 'basic' && 'HTML Embed Code'}
                    {activeTab === 'advanced' && 'Advanced HTML Code'}
                    {activeTab === 'shopify' && 'Shopify Integration Code'}
                    {activeTab === 'preview' && 'Live Preview'}
                  </h4>
                  {isLiveUpdate && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live Update</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const code = activeTab === 'shopify' ? generateShopifyCode() : 
                                  activeTab === 'advanced' ? generateEmbedCode() : 
                                  generateEmbedCode();
                      copyToClipboard(code);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button
                    onClick={() => {
                      const code = activeTab === 'shopify' ? generateShopifyCode() : 
                                  activeTab === 'advanced' ? generateEmbedCode() : 
                                  generateEmbedCode();
                      const filename = activeTab === 'shopify' ? 'shopify-integration.html' : 
                                     activeTab === 'advanced' ? 'chatbot-advanced.html' : 
                                     'chatbot-embed.html';
                      downloadCode(code, filename);
                    }}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {activeTab === 'preview' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h4>
                    <p className="text-sm text-gray-600 mb-4">Preview your chatbot widget configuration</p>
                    <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                      <div className="text-sm text-gray-600">
                        Preview feature coming soon! You'll be able to see how your chatbot looks with these settings.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>
                        {activeTab === 'shopify' ? generateShopifyCode() : 
                         activeTab === 'advanced' ? generateEmbedCode() : 
                         generateEmbedCode()}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedCodeGenerator;