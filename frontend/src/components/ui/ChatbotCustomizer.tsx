import React, { useState } from 'react';
import { ColorConfig } from './ColorPicker';
import ColorPicker from './ColorPicker';
import { Input } from './Input';

interface ChatbotCustomizerProps {
  config: {
    name: string;
    welcomeMessage: string;
    theme: 'light' | 'dark';
    colors: ColorConfig;
    position: 'bottom-right' | 'bottom-left' | 'center';
    deviceSize: 'mobile' | 'tablet' | 'desktop';
    font: {
      family: string;
      size: string;
      weight: number;
    };
    bubbleShape: 'rounded' | 'square' | 'sharp' | 'bubble';
    botAvatar: string;
    chatIcon: string;
    openingAnimation: 'fade' | 'slide' | 'bounce' | 'scale';
    messageAnimation: 'fade' | 'slide' | 'bounce' | 'typing';
    animationSpeed: number;
    language: string;
    integrations: {
      website: boolean;
      mobileApp: boolean;
      facebook: boolean;
      twitter: boolean;
      whatsapp: boolean;
      telegram: boolean;
    };
  };
  onChange: (config: ChatbotCustomizerProps['config']) => void;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

const positions = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'center', label: 'Center' }
];

const deviceSizes = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'desktop', label: 'Desktop' }
];

const bubbleShapes = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'square', label: 'Square' },
  { value: 'sharp', label: 'Sharp' },
  { value: 'bubble', label: 'Bubble' }
];

const ChatbotCustomizer: React.FC<ChatbotCustomizerProps> = ({ config: initialConfig, onChange }) => {
  const defaultWelcomeMessage = "Hi! How can I help you today?";
  const DEFAULT_BOT_AVATAR = '/assets/default-bot-avatar.png';
  const DEFAULT_CHAT_ICON = `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
  </svg>`;
  
  const [config, setConfig] = useState({
    ...initialConfig,
    welcomeMessage: defaultWelcomeMessage,
    botAvatar: initialConfig.botAvatar || DEFAULT_BOT_AVATAR,
    chatIcon: initialConfig.chatIcon || DEFAULT_CHAT_ICON
  });

  const [history, setHistory] = useState<ChatbotCustomizerProps['config'][]>([config]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewMessage, setPreviewMessage] = useState(defaultWelcomeMessage);

  const handleChange = (field: string, value: unknown) => {
    const newConfig = {
      ...config,
      [field]: value
    };
    
    // Aggiorna il preview message quando cambia il welcome message
    if (field === 'welcomeMessage') {
      setPreviewMessage((value as string) || defaultWelcomeMessage);
    }
    
    setConfig(newConfig);
    onChange(newConfig);
    setHistory(prev => [...prev.slice(0, currentIndex + 1), newConfig]);
    setCurrentIndex(prev => prev + 1);
  };

  const handleColorsChange = (colors: ColorConfig) => {
    const newConfig = {
      ...config,
      colors
    };
    onChange(newConfig);
    setHistory(prev => [...prev.slice(0, currentIndex + 1), newConfig]);
    setCurrentIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      onChange(history[currentIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      onChange(history[currentIndex + 1]);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('chatbot-draft', JSON.stringify(config));
  };

  const handleSave = () => {
    localStorage.setItem('chatbot-config', JSON.stringify(config));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('botAvatar', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('chatIcon', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-gray-50">
      {/* Left Panel - Basic Settings & Customization */}
      <div className="w-1/2 space-y-6">
        {/* Basic Settings */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Basic Settings</h3>
            <p className="text-sm text-gray-500">Configure your chatbot's basic information.</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chatbot Name</label>
              <Input
                type="text"
                value={config.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter chatbot name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
              <div className="space-y-2">
                <textarea
                  value={config.welcomeMessage}
                  onChange={(e) => handleChange('welcomeMessage', e.target.value || defaultWelcomeMessage)}
                  placeholder={defaultWelcomeMessage}
                  className="w-full min-h-[80px] rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {config.welcomeMessage !== defaultWelcomeMessage && (
                  <button
                    onClick={() => handleChange('welcomeMessage', defaultWelcomeMessage)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset to default message
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bot Avatar</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {config.botAvatar ? (
                    <img
                      src={config.botAvatar}
                      alt="Bot Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-gray-400">{config.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  {config.botAvatar && config.botAvatar !== DEFAULT_BOT_AVATAR && (
                    <button
                      onClick={() => handleChange('botAvatar', DEFAULT_BOT_AVATAR)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset to default
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Recommended: 256×256px PNG or JPG</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chat Icon</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {config.chatIcon.startsWith('<svg') ? (
                    <div dangerouslySetInnerHTML={{ __html: config.chatIcon }} className="w-8 h-8 text-blue-600" />
                  ) : (
                    <img
                      src={config.chatIcon}
                      alt="Chat Icon"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex space-x-2">
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      className="hidden"
                    />
                  </label>
                  {config.chatIcon && config.chatIcon !== DEFAULT_CHAT_ICON && (
                    <button
                      onClick={() => handleChange('chatIcon', DEFAULT_CHAT_ICON)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset to default
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Recommended: 128×128px PNG or SVG</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={config.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
            <p className="text-sm text-gray-500">Customize how your chatbot looks.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                value={config.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bubble Shape</label>
              <select
                value={config.bubbleShape}
                onChange={(e) => handleChange('bubbleShape', e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {bubbleShapes.map((shape) => (
                  <option key={shape.value} value={shape.value}>{shape.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Colors</h3>
            <p className="text-sm text-gray-500">Choose your chatbot's color scheme.</p>
          </div>
          <ColorPicker colors={config.colors} onChange={handleColorsChange} />
        </section>
      </div>

      {/* Right Panel - Preview & Settings */}
      <div className="w-1/2 space-y-6">
        {/* Top Controls */}
        <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
          <div className="flex space-x-2">
            <button
              onClick={handleUndo}
              disabled={currentIndex === 0}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button
              onClick={handleRedo}
              disabled={currentIndex === history.length - 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Save Draft
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>

        {/* Preview Settings */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Preview Settings</h3>
            <p className="text-sm text-gray-500">Adjust how you view the preview</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device Size</label>
              <select
                value={config.deviceSize}
                onChange={(e) => handleChange('deviceSize', e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {deviceSizes.map((size) => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                value={config.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {positions.map((pos) => (
                  <option key={pos.value} value={pos.value}>{pos.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Live Preview */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-500">See how your chatbot will appear to users</p>
          </div>
          <div className="relative h-[500px] bg-gray-50 rounded-lg border border-gray-200">
            {/* Chat Preview Component */}
            <div className="absolute bottom-4 right-4 w-[300px]">
              <div className="bg-blue-600 text-white rounded-t-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium">{config.name}</div>
                    <div className="text-xs text-blue-200">● Online</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-b-lg shadow-lg p-4 space-y-4">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">{previewMessage}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 justify-end">
                  <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Hi! I need help with my order.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatbotCustomizer; 