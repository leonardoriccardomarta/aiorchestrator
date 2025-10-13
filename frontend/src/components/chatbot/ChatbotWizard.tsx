import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/api';
// import { chatbotIntegrationService } from '../../services/ChatbotIntegrationService';

interface ChatbotData {
  name: string;
  description: string;
  model: string;
  personality: string;
  responseStyle: string;
  temperature: number;
  maxTokens: number;
  initialPrompt: string;
  integrations: string[];
  brandColor: string;
  avatar: string;
}

const steps = [
  { id: 'basic', title: 'Basic Info', description: 'Name and description' },
  { id: 'personality', title: 'Personality', description: 'AI behavior and style' },
  { id: 'integrations', title: 'Integrations', description: 'Connect channels' },
  { id: 'branding', title: 'Branding', description: 'Visual identity' },
  { id: 'review', title: 'Review', description: 'Final check' }
];

const ChatbotWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [chatbotData, setChatbotData] = useState<ChatbotData>({
    name: '',
    description: '',
    model: 'gpt-3.5-turbo',
    personality: 'helpful',
    responseStyle: 'professional',
    temperature: 0.7,
    maxTokens: 1000,
    initialPrompt: '',
    integrations: [],
    brandColor: '#3B82F6',
    avatar: ''
  });
  const navigate = useNavigate();

  const { mutate: createChatbot, isPending } = useMutation({
    mutationFn: apiService.createChatbot,
    onSuccess: (response) => {
      // Redirect to chatbot settings
      navigate(`/chatbots/${response.data.id}/settings`);
    },
    onError: (error) => {
      console.error('Failed to create chatbot:', error);
    }
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create the chatbot
      createChatbot({
        ...chatbotData,
        whatsappEnabled: chatbotData.integrations.includes('whatsapp'),
        messengerEnabled: chatbotData.integrations.includes('messenger'),
        telegramEnabled: chatbotData.integrations.includes('telegram'),
        shopifyEnabled: chatbotData.integrations.includes('shopify'),
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: keyof ChatbotData, value: any) => {
    setChatbotData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chatbot Name *
              </label>
              <input
                type="text"
                value={chatbotData.name}
                onChange={(e) => updateData('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Customer Support Bot"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={chatbotData.description}
                onChange={(e) => updateData('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what your chatbot will help with..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select
                value={chatbotData.model}
                onChange={(e) => updateData('model', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Cost-effective)</option>
                <option value="gpt-4">GPT-4 (Most Advanced)</option>
              </select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'helpful', label: 'Helpful', icon: '🤝' },
                  { value: 'friendly', label: 'Friendly', icon: '😊' },
                  { value: 'professional', label: 'Professional', icon: '💼' },
                  { value: 'casual', label: 'Casual', icon: '😎' }
                ].map((personality) => (
                  <button
                    key={personality.value}
                    type="button"
                    onClick={() => updateData('personality', personality.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      chatbotData.personality === personality.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{personality.icon}</div>
                    <div className="font-medium">{personality.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Style
              </label>
              <select
                value={chatbotData.responseStyle}
                onChange={(e) => updateData('responseStyle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="professional">Professional & Formal</option>
                <option value="casual">Casual & Conversational</option>
                <option value="technical">Technical & Detailed</option>
                <option value="concise">Concise & Direct</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Prompt (Optional)
              </label>
              <textarea
                value={chatbotData.initialPrompt}
                onChange={(e) => updateData('initialPrompt', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="You are a helpful customer support assistant for [Company Name]. Always be polite and helpful..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Integration Channels
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'whatsapp', name: 'WhatsApp Business', icon: '', description: 'Direct messaging' },
                  { id: 'messenger', name: 'Facebook Messenger', icon: '💬', description: 'Social messaging' },
                  { id: 'telegram', name: 'Telegram Bot', icon: '✈️', description: 'Group messaging' },
                  { id: 'shopify', name: 'Shopify Store', icon: '🛒', description: 'E-commerce support' }
                ].map((integration) => (
                  <button
                    key={integration.id}
                    type="button"
                    onClick={() => {
                      const newIntegrations = chatbotData.integrations.includes(integration.id)
                        ? chatbotData.integrations.filter(i => i !== integration.id)
                        : [...chatbotData.integrations, integration.id];
                      updateData('integrations', newIntegrations);
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      chatbotData.integrations.includes(integration.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{integration.icon}</div>
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-sm text-gray-600">{integration.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={chatbotData.brandColor}
                  onChange={(e) => updateData('brandColor', e.target.value)}
                  className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <div className="flex space-x-2">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateData('brandColor', color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        chatbotData.brandColor === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar
              </label>
              <div className="flex space-x-2">
                {['', '👨‍💼', '👩‍💼', '🤝', '💬', ''].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => updateData('avatar', emoji)}
                    className={`text-3xl p-3 border-2 rounded-lg ${
                      chatbotData.avatar === emoji
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Chatbot Preview</h3>
              <div className="bg-white border rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{chatbotData.avatar}</div>
                  <div>
                    <div className="font-semibold" style={{ color: chatbotData.brandColor }}>
                      {chatbotData.name}
                    </div>
                    <div className="text-sm text-gray-600">{chatbotData.description}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">
                    Hi! I'm your {chatbotData.name.toLowerCase()}. How can I help you today?
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Model:</div>
                <div className="text-gray-600">{chatbotData.model}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Personality:</div>
                <div className="text-gray-600 capitalize">{chatbotData.personality}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Integrations:</div>
                <div className="text-gray-600">
                  {chatbotData.integrations.length > 0 
                    ? chatbotData.integrations.join(', ')
                    : 'None selected'
                  }
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Style:</div>
                <div className="text-gray-600 capitalize">{chatbotData.responseStyle}</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return chatbotData.name && chatbotData.description;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your AI Chatbot</h1>
          <p className="text-gray-600">Build a powerful AI assistant in minutes</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600">{steps[currentStep].description}</p>
              </div>
              
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || isPending}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Creating...' : currentStep === steps.length - 1 ? 'Create Chatbot' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWizard;
