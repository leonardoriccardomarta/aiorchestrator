import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatbotIntegrationService } from '../../services/ChatbotIntegrationService';

interface IntegrationWizardProps {
  chatbotId: string;
  integrationType: 'whatsapp' | 'messenger' | 'telegram' | 'shopify';
  onComplete: () => void;
  onCancel: () => void;
}

const IntegrationWizard: React.FC<IntegrationWizardProps> = ({
  chatbotId,
  integrationType,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = {
    whatsapp: [
      { id: 'info', title: 'WhatsApp Business Setup', description: 'Get your WhatsApp Business API credentials' },
      { id: 'credentials', title: 'Enter Credentials', description: 'Add your phone number and webhook URL' },
      { id: 'test', title: 'Test Connection', description: 'Verify your integration works' },
      { id: 'complete', title: 'Complete', description: 'Integration is ready to use' }
    ],
    messenger: [
      { id: 'info', title: 'Facebook Messenger Setup', description: 'Create a Facebook App and Page' },
      { id: 'credentials', title: 'Enter Credentials', description: 'Add your Page ID and Access Token' },
      { id: 'test', title: 'Test Connection', description: 'Verify your integration works' },
      { id: 'complete', title: 'Complete', description: 'Integration is ready to use' }
    ],
    telegram: [
      { id: 'info', title: 'Telegram Bot Setup', description: 'Create a bot with BotFather' },
      { id: 'credentials', title: 'Enter Credentials', description: 'Add your bot token and username' },
      { id: 'test', title: 'Test Connection', description: 'Verify your integration works' },
      { id: 'complete', title: 'Complete', description: 'Integration is ready to use' }
    ],
    shopify: [
      { id: 'info', title: 'Shopify Store Setup', description: 'Prepare your Shopify store for integration' },
      { id: 'credentials', title: 'Enter Credentials', description: 'Add your store URL and API credentials' },
      { id: 'test', title: 'Test Connection', description: 'Verify your integration works' },
      { id: 'complete', title: 'Complete', description: 'Integration is ready to use' }
    ]
  };

  const currentSteps = steps[integrationType];
  const currentStepData = currentSteps[currentStep];

  const handleNext = async () => {
    if (currentStep === currentSteps.length - 1) {
      // Final step - complete integration
      await completeIntegration();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeIntegration = async () => {
    setIsLoading(true);
    try {
      await chatbotIntegrationService[`connect${integrationType.charAt(0).toUpperCase() + integrationType.slice(1)}` as keyof typeof chatbotIntegrationService](
        { id: chatbotId } as any,
        config
      );
      onComplete();
    } catch (error) {
      console.error('Failed to complete integration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStepData.id) {
      case 'info':
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {integrationType.charAt(0).toUpperCase() + integrationType.slice(1)} Setup Instructions
              </h3>
              {integrationType === 'whatsapp' && (
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <div className="font-medium">Get WhatsApp Business API</div>
                      <div className="text-slate-600">Apply for WhatsApp Business API access through Meta or a provider like Twilio</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <div className="font-medium">Get Phone Number</div>
                      <div className="text-slate-600">Obtain a WhatsApp Business phone number</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <div className="font-medium">Set Webhook URL</div>
                      <div className="text-slate-600">Configure webhook to receive messages</div>
                    </div>
                  </div>
                </div>
              )}
              {integrationType === 'messenger' && (
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <div className="font-medium">Create Facebook App</div>
                      <div className="text-slate-600">Go to developers.facebook.com and create a new app</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <div className="font-medium">Add Messenger Product</div>
                      <div className="text-slate-600">Add Messenger to your app and configure webhooks</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <div className="font-medium">Get Page Access Token</div>
                      <div className="text-slate-600">Generate a Page Access Token for your Facebook Page</div>
                    </div>
                  </div>
                </div>
              )}
              {integrationType === 'telegram' && (
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <div className="font-medium">Message BotFather</div>
                      <div className="text-slate-600">Start a chat with @BotFather on Telegram</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <div className="font-medium">Create New Bot</div>
                      <div className="text-slate-600">Use /newbot command and follow the instructions</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <div className="font-medium">Get Bot Token</div>
                      <div className="text-slate-600">Save the bot token provided by BotFather</div>
                    </div>
                  </div>
                </div>
              )}
              {integrationType === 'shopify' && (
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <div className="font-medium">Create Shopify App</div>
                      <div className="text-slate-600">Go to your Shopify admin and create a private app</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <div className="font-medium">Enable Admin API</div>
                      <div className="text-slate-600">Enable Admin API access for your app</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <div className="font-medium">Get API Credentials</div>
                      <div className="text-slate-600">Copy your API key and secret from the app settings</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-yellow-600"></div>
                <div className="text-sm text-yellow-800">
                  <div className="font-medium">Important:</div>
                  <div>Make sure you have all the required credentials ready before proceeding.</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'credentials':
        return (
          <div className="space-y-6">
            {integrationType === 'whatsapp' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={config.phoneNumber || ''}
                    onChange={(e) => updateConfig('phoneNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={config.webhookUrl || ''}
                    onChange={(e) => updateConfig('webhookUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>
              </>
            )}
            {integrationType === 'messenger' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Page ID *
                  </label>
                  <input
                    type="text"
                    value={config.pageId || ''}
                    onChange={(e) => updateConfig('pageId', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="123456789012345"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Access Token *
                  </label>
                  <input
                    type="password"
                    value={config.accessToken || ''}
                    onChange={(e) => updateConfig('accessToken', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your Page Access Token"
                    required
                  />
                </div>
              </>
            )}
            {integrationType === 'telegram' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bot Token *
                  </label>
                  <input
                    type="password"
                    value={config.botToken || ''}
                    onChange={(e) => updateConfig('botToken', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bot Username *
                  </label>
                  <input
                    type="text"
                    value={config.username || ''}
                    onChange={(e) => updateConfig('username', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="@your_bot_username"
                    required
                  />
                </div>
              </>
            )}
            {integrationType === 'shopify' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Store URL *
                  </label>
                  <input
                    type="url"
                    value={config.storeUrl || ''}
                    onChange={(e) => updateConfig('storeUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://your-store.myshopify.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    API Key *
                  </label>
                  <input
                    type="password"
                    value={config.apiKey || ''}
                    onChange={(e) => updateConfig('apiKey', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your Shopify API key"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    API Secret *
                  </label>
                  <input
                    type="password"
                    value={config.apiSecret || ''}
                    onChange={(e) => updateConfig('apiSecret', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your Shopify API secret"
                    required
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'test':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Testing Your Connection</h3>
              <p className="text-slate-600 mb-6">
                We're verifying your {integrationType} integration. This may take a few moments.
              </p>
              <div className="bg-slate-100 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  <span className="text-sm text-slate-600">Connecting to {integrationType}...</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Integration Complete!</h3>
              <p className="text-slate-600">
                Your {integrationType} integration is now active and ready to use.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="text-sm text-green-800">
                <div className="font-medium"> Connection Successful</div>
                <div>Your chatbot can now receive and send messages through {integrationType}.</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStepData.id === 'credentials') {
      if (integrationType === 'whatsapp') return config.phoneNumber;
      if (integrationType === 'messenger') return config.pageId && config.accessToken;
      if (integrationType === 'telegram') return config.botToken && config.username;
      if (integrationType === 'shopify') return config.storeUrl && config.apiKey && config.apiSecret;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {currentStepData.title}
              </h2>
              <p className="text-slate-600">{currentStepData.description}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            {currentSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {index + 1}
                </div>
                {index < currentSteps.length - 1 && (
                  <div className={`w-8 h-1 mx-2 ${
                    index < currentStep ? 'bg-indigo-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4">
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Connecting...' : currentStep === currentSteps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationWizard;

