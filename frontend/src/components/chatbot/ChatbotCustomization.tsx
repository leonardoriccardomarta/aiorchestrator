import React, { useState } from 'react';
import IntegrationManager from './IntegrationManager';
import ChatbotTester from './ChatbotTester';
import IntegrationDocs from './IntegrationDocs';
import { Minimize2, Eye } from 'lucide-react';

interface ChatbotCustomizationProps {
  // onSave?: () => void; // Removed as per edit hint
}

const FONT_OPTIONS = [
  { name: 'Inter', value: 'font-inter' },
  { name: 'Roboto', value: 'font-roboto' },
  { name: 'Open Sans', value: 'font-opensans' },
  { name: 'Poppins', value: 'font-poppins' },
  { name: 'Montserrat', value: 'font-montserrat' }
];

const BUBBLE_SHAPES = [
  { name: 'Round', value: 'rounded-full' },
  { name: 'Soft', value: 'rounded-xl' },
  { name: 'Sharp', value: 'rounded-md' },
  { name: 'Square', value: 'rounded-none' }
];

const FONT_SIZES = [
  { name: 'Small', value: 'sm' },
  { name: 'Medium', value: 'md' },
  { name: 'Large', value: 'lg' }
];

const COLOR_GRADIENTS = [
  { from: '#4F46E5', to: '#2563EB', name: 'Blue' },
  { from: '#DC2626', to: '#B91C1C', name: 'Red' },
  { from: '#059669', to: '#047857', name: 'Green' },
  { from: '#D97706', to: '#B45309', name: 'Orange' },
  { from: '#7C3AED', to: '#5B21B6', name: 'Purple' },
  { from: '#F59E0B', to: '#D97706', name: 'Amber' },
  { from: '#EC4899', to: '#BE185D', name: 'Pink' },
  { from: '#10B981', to: '#059669', name: 'Emerald' }
];

const ChatbotCustomization: React.FC<ChatbotCustomizationProps> = () => {
  const [name, setName] = useState('AI Assistant');
  const [language, setLanguage] = useState('English');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you today?');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [chatIcon, setChatIcon] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#4F46E5');
  const [gradient, setGradient] = useState<{ from: string; to: string }>(COLOR_GRADIENTS[0]);
  const [_opacity, _setOpacity] = useState(100);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [fontSize, setFontSize] = useState(FONT_SIZES[1]);
  const [bubbleShape, setBubbleShape] = useState(BUBBLE_SHAPES[1]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [_showIntegrationsModal, _setShowIntegrationsModal] = useState(false);
  const [_customGradient, _setCustomGradient] = useState({ from: '#4F46E5', to: '#2563EB' });
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<'customization' | 'integrations' | 'test' | 'docs'>('customization');
  const [chatbotId] = useState('chatbot_' + Math.random().toString(36).substr(2, 9));
  const [shopifyIntegration, setShopifyIntegration] = useState({
    isConnected: false,
    storeUrl: '',
    accessToken: '',
    isInstalling: false
  });

  const handleSaveAndPublish = async () => {
    try {
      // Show loading state
      const button = document.querySelector('[data-save-publish-btn]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = 'Saving...';
      }

      // Simulate API call to save configuration
      // const configData = {
      //   id: chatbotId,
      //   name,
      //   language,
      //   primaryColor,
      //   gradient,
      //   theme,
      //   welcomeMessage,
      //   avatar: avatar ? await convertFileToBase64(avatar) : undefined,
      //   chatIcon: chatIcon ? await convertFileToBase64(chatIcon) : undefined,
      //   fontFamily: selectedFont.name,
      //   fontSize: fontSize.value,
      //   bubbleShape: bubbleShape.value
      // };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success feedback with detailed information
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Configuration Saved!</h3>
              <p class="text-gray-600">Chatbot published successfully</p>
            </div>
          </div>
          <div class="space-y-3 mb-4">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-700">Name:</span>
              <span class="text-sm text-gray-900">${name}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-700">Language:</span>
              <span class="text-sm text-gray-900">${language}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-700">Font:</span>
              <span class="text-sm text-gray-900">${selectedFont.name}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-700">Theme:</span>
              <span class="text-sm text-gray-900">${theme}</span>
            </div>
          </div>
          <div class="bg-green-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-green-800">Your chatbot is now live and ready to use!</p>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      setTimeout(() => modal.remove(), 5000);
      
      // Reset button
      if (button) {
        button.disabled = false;
        button.textContent = 'Save & Publish';
      }

      // Redirect to integrations tab after successful save
      setCurrentTab('integrations');
      
    } catch (error) {
      // Show error feedback
      // Show error modal
      const errorModal = document.createElement('div');
      errorModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
            <div style="font-size: 48px; margin-bottom: 16px;"></div>
            <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Save Failed</h3>
            <p style="color: #6b7280; margin-bottom: 24px;">Failed to save configuration. Please try again.</p>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(errorModal);
      console.error('Save error:', error);
      
      // Reset button
      const button = document.querySelector('[data-save-publish-btn]') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.textContent = 'Save & Publish';
      }
    }
  };

  // Remove unused convertFileToBase64 function
  // const convertFileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = error => reject(error);
  //   });
  // };

  const handleIntegrationComplete = (integration: unknown) => {
    console.log('Integration completed:', integration);
    // Here you can add logic to save the integration
  };

  const handleShopifyOneClickInstall = async () => {
    setShopifyIntegration(prev => ({ ...prev, isInstalling: true }));
    
    try {
      // Simulate installation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success notification using the same system as other integrations
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      successModal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Installation Successful!</h3>
              <p class="text-gray-600">Shopify chatbot widget has been installed successfully. The widget is now active on your store.</p>
            </div>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(successModal);
      setTimeout(() => successModal.remove(), 3000);
      
      // Set as connected
      setShopifyIntegration(prev => ({ 
        ...prev, 
        isInstalling: false,
        isConnected: true 
      }));
      
    } catch (error) {
      console.error('Shopify installation failed:', error);
      // Show error modal
      const errorModal = document.createElement('div');
      errorModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
            <div style="font-size: 48px; margin-bottom: 16px;"></div>
            <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Installation Failed</h3>
            <p style="color: #6b7280; margin-bottom: 24px;">Installation failed. Please try again or contact support.</p>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">OK</button>
        </div>
      </div>
    `;
      document.body.appendChild(errorModal);
      setShopifyIntegration(prev => ({ ...prev, isInstalling: false }));
    }
  };


  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '320px';
      case 'tablet': return '400px';
      default: return '480px'; // Reduced from 600px to fit better
    }
  };

  const getPreviewHeight = () => {
    switch (previewDevice) {
      case 'mobile': return '280px'; // Minimal height - bar at bottom
      case 'tablet': return '320px'; // Minimal height - bar at bottom
      default: return '340px'; // Minimal height - bar at bottom
    }
  };

  const getWelcomeMessageByLanguage = (lang?: string) => {
    const l = lang || language;
    const messages = {
      'English': 'Hi! How can I help you today?',
      'Spanish': '¡Hola! ¿Cómo puedo ayudarte hoy?',
      'French': 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
      'Italian': 'Ciao! Come posso aiutarti oggi?',
      'German': 'Hallo! Wie kann ich Ihnen heute helfen?'
    };
    return messages[l as keyof typeof messages] || messages.English;
  };

  const getPlaceholderByLanguage = (lang?: string) => {
    const l = lang || language;
    const placeholders = {
      'English': 'Type your message...',
      'Spanish': 'Escribe tu mensaje...',
      'French': 'Tapez votre message...',
      'Italian': 'Scrivi il tuo messaggio...',
      'German': 'Geben Sie Ihre Nachricht ein...'
    };
    return placeholders[l as keyof typeof placeholders] || placeholders.English;
  };

  const getOnlineStatusByLanguage = (lang?: string) => {
    const l = lang || language;
    const statuses = {
      'English': '🟢 Online · Typically replies instantly',
      'Spanish': '🟢 En línea · Responde típicamente al instante',
      'French': '🟢 En ligne · Répond généralement instantanément',
      'Italian': '🟢 Online · Risponde tipicamente all\'istante',
      'German': '🟢 Online · Antwortet normalerweise sofort'
    };
    return statuses[l as keyof typeof statuses] || statuses.English;
  };

  const chatbotConfig = {
    id: chatbotId,
    name,
    primaryColor,
    gradient,
    theme,
    welcomeMessage,
    language,
    avatar: avatar ? URL.createObjectURL(avatar) : undefined,
    chatIcon: chatIcon ? URL.createObjectURL(chatIcon) : undefined,
    fontFamily: selectedFont.value,
    fontSize: fontSize.value,
    bubbleShape: bubbleShape.value
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-16">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Chatbot Customization</h1>
            <p className="mt-1 text-sm text-gray-500">Customize your chatbot's appearance and behavior</p>
          </div>
          <button
            onClick={handleSaveAndPublish}
            data-save-publish-btn
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
            Save & Publish
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setCurrentTab('customization')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  currentTab === 'customization'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Customization
              </button>
              <button
                onClick={() => setCurrentTab('integrations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  currentTab === 'integrations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                              >
                  Integrations
                </button>
                <button
                  onClick={() => setCurrentTab('test')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  currentTab === 'test'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Test
              </button>
              <button
                onClick={() => setCurrentTab('docs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  currentTab === 'docs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documentation
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {currentTab === 'customization' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Column - Settings */}
              <div className="space-y-6">
                {/* Basic Settings Section */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6">
                    <h2 className="text-base font-medium text-gray-900 mb-4">Basic Settings</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Chatbot Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter chatbot name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Language</label>
                        <select
                          value={language}
                          onChange={(e) => {
                            setLanguage(e.target.value);
                            setWelcomeMessage(getWelcomeMessageByLanguage(e.target.value));
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="Italian">Italian</option>
                          <option value="German">German</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Welcome Message</label>
                        <textarea
                          value={welcomeMessage}
                          onChange={(e) => setWelcomeMessage(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter welcome message"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Chatbot Avatar</label>
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                              {avatar ? (
                                <img src={URL.createObjectURL(avatar)} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-gray-400 text-lg font-bold">{name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setAvatar(file);
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                              {avatar && (
                                <button
                                  onClick={() => setAvatar(null)}
                                  className="mt-1 text-xs text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Chat Icon</label>
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                              {chatIcon ? (
                                <img src={URL.createObjectURL(chatIcon)} alt="Chat Icon" className="w-full h-full object-cover" />
                              ) : (
                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setChatIcon(file);
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                              {chatIcon && (
                                <button
                                  onClick={() => setChatIcon(null)}
                                  className="mt-1 text-xs text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appearance Settings */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6">
                    <h2 className="text-base font-medium text-gray-900 mb-4">Appearance</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                        <div className="mt-1 flex items-center space-x-2">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="h-10 w-20 rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gradient</label>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {COLOR_GRADIENTS.map((grad, index) => (
                            <button
                              key={index}
                              onClick={() => setGradient(grad)}
                              className={`h-12 rounded-lg border-2 ${
                                gradient.from === grad.from && gradient.to === grad.to
                                  ? 'border-blue-500'
                                  : 'border-gray-200'
                              }`}
                              style={{
                                background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`
                              }}
                              title={grad.name}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            theme === 'light' 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}>
                            <input
                              type="radio"
                              value="light"
                              checked={theme === 'light'}
                              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                              className="sr-only"
                            />
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-white border border-gray-300 rounded-md flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-100 rounded-sm"></div>
                              </div>
                              <span className="font-medium">Light Theme</span>
                            </div>
                            {theme === 'light' && (
                              <div className="absolute top-2 right-2">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </label>
                          <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            theme === 'dark' 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}>
                            <input
                              type="radio"
                              value="dark"
                              checked={theme === 'dark'}
                              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                              className="sr-only"
                            />
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-800 border border-gray-600 rounded-md flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
                              </div>
                              <span className="font-medium">Dark Theme</span>
                            </div>
                            {theme === 'dark' && (
                              <div className="absolute top-2 right-2">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography Settings */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6">
                    <h2 className="text-base font-medium text-gray-900 mb-4">Typography</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Font Family</label>
                        <select
                          value={selectedFont.value}
                          onChange={(e) => setSelectedFont(FONT_OPTIONS.find(f => f.value === e.target.value) || FONT_OPTIONS[0])}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
                        >
                          {FONT_OPTIONS.map(font => (
                            <option key={font.value} value={font.value}>
                              {font.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Font Size</label>
                        <select
                          value={fontSize.value}
                          onChange={(e) => setFontSize(FONT_SIZES.find(f => f.value === e.target.value) || FONT_SIZES[1])}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
                        >
                          {FONT_SIZES.map(size => (
                            <option key={size.value} value={size.value}>
                              {size.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Message Bubble Shape</label>
                        <select
                          value={bubbleShape.value}
                          onChange={(e) => setBubbleShape(BUBBLE_SHAPES.find(b => b.value === e.target.value) || BUBBLE_SHAPES[1])}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
                        >
                          {BUBBLE_SHAPES.map(shape => (
                            <option key={shape.value} value={shape.value}>
                              {shape.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Enhanced Real-Time Preview */}
              <div className="space-y-6">
                {/* Preview Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-medium text-gray-900">Live Preview</h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {isPreviewOpen ? <Minimize2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <select
                        value={previewDevice}
                        onChange={(e) => setPreviewDevice(e.target.value as 'desktop' | 'tablet' | 'mobile')}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1"
                      >
                        <option value="desktop">Desktop</option>
                        <option value="tablet">Tablet</option>
                        <option value="mobile">Mobile</option>
                      </select>
                    </div>
                  </div>
                  
                  {isPreviewOpen && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Device Frame */}
                      <div className="bg-gray-100 p-2 flex justify-center">
                        <div 
                          className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                          style={{
                            width: getPreviewWidth(),
                            height: getPreviewHeight(),
                            minWidth: getPreviewWidth(),
                            minHeight: getPreviewHeight()
                          }}
                        >
                          {/* Chatbot Widget Preview */}
                          <div className="relative h-full">
                            {/* Header */}
                            <div className={`p-4 border-b flex items-center justify-between ${
                              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold overflow-hidden"
                                  style={{
                                    background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                                  }}
                                >
                                  {avatar ? (
                                    <img 
                                      src={URL.createObjectURL(avatar)} 
                                      alt="Avatar" 
                                      className="w-full h-full object-cover rounded-full" 
                                    />
                                  ) : (
                                    <span className="text-xs">
                                      {name.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className={`font-medium ${
                                    fontSize.value === 'sm' ? 'text-sm' :
                                    fontSize.value === 'md' ? 'text-base' : 'text-lg'
                                  } ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`} style={{ fontFamily: selectedFont.name }}>
                                    {name}
                                  </div>
                                  <div className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                  }`}>
                                    {getOnlineStatusByLanguage()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Messages */}
                            <div className={`flex-1 p-4 space-y-3 overflow-y-auto ${
                              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                            }`}>
                              {/* Welcome Message */}
                              <div className="flex items-start space-x-2">
                                <div 
                                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold overflow-hidden"
                                  style={{
                                    background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                                  }}
                                >
                                  {avatar ? (
                                    <img 
                                      src={URL.createObjectURL(avatar)} 
                                      alt="Avatar" 
                                      className="w-full h-full object-cover rounded-full" 
                                    />
                                  ) : (
                                    <span className="text-xs">
                                      {name.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div 
                                  className={`max-w-xs p-3 ${bubbleShape.value} ${
                                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                                  } shadow-sm break-words`}
                                  style={{
                                    fontSize: fontSize.value === 'sm' ? '14px' : 
                                            fontSize.value === 'md' ? '16px' : '18px',
                                    fontFamily: selectedFont.name
                                  }}
                                >
                                  {welcomeMessage}
                                </div>
                              </div>

                              {/* Typing Indicator */}
                              <div className="flex items-start space-x-2">
                                <div 
                                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold overflow-hidden"
                                  style={{
                                    background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                                  }}
                                >
                                  {avatar ? (
                                    <img 
                                      src={URL.createObjectURL(avatar)} 
                                      alt="Avatar" 
                                      className="w-full h-full object-cover rounded-full" 
                                    />
                                  ) : (
                                    <span className="text-xs">
                                      {name.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div className={`p-3 ${bubbleShape.value} ${
                                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                                } shadow-sm`}>
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Input Area */}
                            <div className={`p-4 border-t flex-shrink-0 ${
                              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                              <div className="flex space-x-3">
                                <input
                                  type="text"
                                  placeholder={getPlaceholderByLanguage()}
                                  className={`flex-1 px-4 py-2 border rounded-lg min-w-0 ${
                                    theme === 'dark' 
                                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                                  style={{
                                    fontSize: fontSize.value === 'sm' ? '14px' : 
                                            fontSize.value === 'md' ? '16px' : '18px',
                                    fontFamily: selectedFont.name,
                                  }}
                                />
                                <button
                                  className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg transform hover:scale-105 flex-shrink-0"
                                  style={{
                                    background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                                  }}
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Preview Controls */}
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">✨ Live preview updates as you type</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-600 font-medium">Real-time</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'integrations' && (
            <div className="space-y-6">
              {/* Shopify One-Click Integration */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🛍️</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Shopify Widget Integration</h3>
                      <p className="text-sm text-gray-500">
                        Generate and install a customized chatbot widget directly in your Shopify theme
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                  <button
                    onClick={handleShopifyOneClickInstall}
                    disabled={shopifyIntegration.isInstalling}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
                      shopifyIntegration.isConnected
                        ? 'bg-green-600 text-white cursor-default'
                        : shopifyIntegration.isInstalling
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {shopifyIntegration.isInstalling ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Installing...
                      </>
                    ) : shopifyIntegration.isConnected ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Connected
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Install Widget
                      </>
                    )}
                  </button>
                      <button
                        onClick={() => window.open(`${window.location.origin}/test-widget.html?chatbot=${chatbotId}`, '_blank')}
                        className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </button>
                    </div>
                    
                    {/* Widget Code Display */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Widget Code:</h4>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64">
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all">
{`<!-- AI Orchestrator Chatbot Widget -->
<script>
  window.aiOrchestratorConfig = {
    chatbotId: '${chatbotId}',
    name: '${name}',
    primaryColor: '${primaryColor}',
    gradient: ${JSON.stringify(gradient)},
    theme: '${theme}',
    welcomeMessage: '${welcomeMessage}',
    language: '${language}',
    fontFamily: '${selectedFont.name}',
    fontSize: '${fontSize.value}',
    bubbleShape: '${bubbleShape.value}'
  };
</script>
<script src="https://cdn.ai-orchestrator.com/widget/v1/chatbot.js" async></script>
<!-- End AI Orchestrator Chatbot Widget -->`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
                
                {shopifyIntegration.isConnected && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Successfully Connected!</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Your chatbot widget has been installed and is now active on your Shopify store. Customers can start chatting immediately.</p>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => setShopifyIntegration(prev => ({ ...prev, isConnected: false }))}
                            className="text-sm text-green-800 hover:text-green-900 underline"
                          >
                            Disconnect Widget
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Other Integrations */}
              <IntegrationManager 
                chatbotId={chatbotId}
                onIntegrationToggle={handleIntegrationComplete}
              />
            </div>
          )}

          {currentTab === 'test' && (
            <ChatbotTester chatbotConfig={chatbotConfig} />
          )}

          {currentTab === 'docs' && (
            <IntegrationDocs chatbotId={chatbotId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotCustomization; 

