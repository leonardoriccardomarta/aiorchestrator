import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Bot,
  Settings,
  MessageSquare,
  Globe,
  Save,
  Play,
  Pause,
  Trash2,
  Plus,
  Zap,
  CheckCircle,
  ArrowRight,
  Eye,
  Edit,
  Copy,
  Share2,
  BarChart3,
  Users,
  Clock,
  Star,
  TrendingUp,
  Palette,
  Type,
  Smile,
  Languages,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { ChatbotLimit, ConnectionLimit } from '../components/PlanLimits';
import { useAuth } from '../contexts/AuthContext';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  language: string;
  messageCount: number;
  lastActive: string;
  satisfaction: number;
  personality: string;
  responseTime: number;
  conversionRate: number;
  // Estetica
  theme: 'modern' | 'classic' | 'minimal' | 'colorful';
  primaryColor: string;
  secondaryColor: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  fontSize: 'small' | 'medium' | 'large';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  // Comportamento
  welcomeMessage: string;
  responseStyle: 'concise' | 'detailed' | 'conversational';
  autoResponse: boolean;
  typingIndicator: boolean;
  // Integrazione
  shopifyConnected: boolean;
  productKnowledge: boolean;
  orderTracking: boolean;
  multilingual: boolean;
}

interface ChatbotWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (chatbot: Chatbot) => void;
}

const ChatbotWizard: React.FC<ChatbotWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [chatbot, setChatbot] = useState<Partial<Chatbot>>({
    name: '',
    description: '',
    language: 'en',
    personality: 'friendly',
    theme: 'modern',
    primaryColor: '#3B82F6',
    secondaryColor: '#F3F4F6',
    borderRadius: 'medium',
    fontSize: 'medium',
    position: 'bottom-right',
    welcomeMessage: 'Hello! How can I help you today?',
    responseStyle: 'conversational',
    autoResponse: true,
    typingIndicator: true,
    shopifyConnected: true,
    productKnowledge: true,
    orderTracking: true,
    multilingual: true
  });

  const steps = [
    {
      title: 'Basic Information',
      description: 'Tell us about your chatbot',
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chatbot Name</label>
            <input
              type="text"
              value={chatbot.name || ''}
              onChange={(e) => setChatbot(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Customer Support Bot"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={chatbot.description || ''}
              onChange={(e) => setChatbot(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What will this chatbot help customers with?"
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Language & Personality',
      description: 'Configure how your chatbot communicates',
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
            <select
              value={chatbot.language || 'en'}
              onChange={(e) => setChatbot(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">🇺🇸 English (Default)</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="pt">🇵🇹 Português</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="ko">🇰🇷 한국어</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="ar">🇸🇦 العربية</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              This sets the default language, but your AI will automatically detect and respond in ANY language your customers use.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Personality</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'friendly', label: 'Friendly & Helpful', desc: 'Warm and approachable tone' },
                { value: 'professional', label: 'Professional', desc: 'Formal and business-like' },
                { value: 'casual', label: 'Casual & Fun', desc: 'Relaxed and conversational' }
              ].map((personality) => (
                <label key={personality.value} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="personality"
                    value={personality.value}
                    checked={chatbot.personality === personality.value}
                    onChange={(e) => setChatbot(prev => ({ ...prev, personality: e.target.value }))}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{personality.label}</p>
                    <p className="text-sm text-gray-600">{personality.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Visual Design',
      description: 'Customize the appearance of your chatbot',
      fields: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'modern', label: 'Modern', desc: 'Clean and contemporary' },
                { value: 'classic', label: 'Classic', desc: 'Traditional and elegant' },
                { value: 'minimal', label: 'Minimal', desc: 'Simple and clean' },
                { value: 'colorful', label: 'Colorful', desc: 'Vibrant and playful' }
              ].map((theme) => (
                <label key={theme.value} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={chatbot.theme === theme.value}
                    onChange={(e) => setChatbot(prev => ({ ...prev, theme: e.target.value as any }))}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{theme.label}</p>
                    <p className="text-sm text-gray-600">{theme.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={chatbot.primaryColor || '#3B82F6'}
                  onChange={(e) => setChatbot(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={chatbot.primaryColor || '#3B82F6'}
                  onChange={(e) => setChatbot(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={chatbot.secondaryColor || '#F3F4F6'}
                  onChange={(e) => setChatbot(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={chatbot.secondaryColor || '#F3F4F6'}
                  onChange={(e) => setChatbot(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
              <select
                value={chatbot.borderRadius || 'medium'}
                onChange={(e) => setChatbot(prev => ({ ...prev, borderRadius: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="none">None</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <select
                value={chatbot.fontSize || 'medium'}
                onChange={(e) => setChatbot(prev => ({ ...prev, fontSize: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'bottom-right', label: 'Bottom Right', icon: '↗️' },
                { value: 'bottom-left', label: 'Bottom Left', icon: '↖️' },
                { value: 'top-right', label: 'Top Right', icon: '↘️' },
                { value: 'top-left', label: 'Top Left', icon: '↙️' }
              ].map((position) => (
                <label key={position.value} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="position"
                    value={position.value}
                    checked={chatbot.position === position.value}
                    onChange={(e) => setChatbot(prev => ({ ...prev, position: e.target.value as any }))}
                    className="mr-3"
                  />
                  <span className="mr-2">{position.icon}</span>
                  <span className="font-medium text-gray-900">{position.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Behavior Settings',
      description: 'Configure how your chatbot behaves',
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
            <textarea
              value={chatbot.welcomeMessage || ''}
              onChange={(e) => setChatbot(prev => ({ ...prev, welcomeMessage: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Hello! How can I help you today?"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Response Style</label>
            <select
              value={chatbot.responseStyle || 'conversational'}
              onChange={(e) => setChatbot(prev => ({ ...prev, responseStyle: e.target.value as any }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="concise">Concise - Short and direct</option>
              <option value="detailed">Detailed - Comprehensive answers</option>
              <option value="conversational">Conversational - Natural and friendly</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={chatbot.autoResponse || false}
                onChange={(e) => setChatbot(prev => ({ ...prev, autoResponse: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Auto-response to common questions</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={chatbot.typingIndicator || false}
                onChange={(e) => setChatbot(prev => ({ ...prev, typingIndicator: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Show typing indicator</span>
            </label>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Create the chatbot
      const newChatbot: Chatbot = {
        id: Date.now().toString(),
        name: chatbot.name || 'New Chatbot',
        description: chatbot.description || 'AI-powered assistant',
        status: 'active',
        language: chatbot.language || 'en',
        personality: chatbot.personality || 'friendly',
        messageCount: 0,
        lastActive: new Date().toISOString(),
        satisfaction: 0,
        responseTime: 1.2,
        conversionRate: 0,
        theme: chatbot.theme || 'modern',
        primaryColor: chatbot.primaryColor || '#3B82F6',
        secondaryColor: chatbot.secondaryColor || '#F3F4F6',
        borderRadius: chatbot.borderRadius || 'medium',
        fontSize: chatbot.fontSize || 'medium',
        position: chatbot.position || 'bottom-right',
        welcomeMessage: chatbot.welcomeMessage || 'Hello! How can I help you today?',
        responseStyle: chatbot.responseStyle || 'conversational',
        autoResponse: chatbot.autoResponse || true,
        typingIndicator: chatbot.typingIndicator || true,
        shopifyConnected: chatbot.shopifyConnected || true,
        productKnowledge: chatbot.productKnowledge || true,
        orderTracking: chatbot.orderTracking || true,
        multilingual: chatbot.multilingual || true
      };
      onComplete(newChatbot);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Create New Chatbot</h2>
              <p className="text-blue-100 text-sm">Step {step + 1} of {steps.length}</p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white text-sm font-medium"
            >
              ✕
            </button>
          </div>
          <div className="mt-3">
            <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{steps[step].title}</h3>
            <p className="text-gray-600">{steps[step].description}</p>
          </div>
          
          {steps[step].fields}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={step === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              step === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <span>{step === steps.length - 1 ? 'Create Chatbot' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatbotPreview: React.FC<{ chatbot: Partial<Chatbot> }> = ({ chatbot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, type: 'user' | 'bot', content: string, timestamp: Date}>>([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot' as const,
        content: `This is a preview response from your ${chatbot.name || 'chatbot'}. In the real version, this would be powered by AI and connected to your Shopify store.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBorderRadius = () => {
    switch (chatbot.borderRadius) {
      case 'none': return 'rounded-none';
      case 'small': return 'rounded-sm';
      case 'medium': return 'rounded-lg';
      case 'large': return 'rounded-2xl';
      default: return 'rounded-lg';
    }
  };

  const getFontSize = () => {
    switch (chatbot.fontSize) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-base';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getPosition = () => {
    switch (chatbot.position) {
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      default: return 'bottom-4 right-4';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Live Preview</h4>
        <div className="flex items-center space-x-2">
          <Monitor className="w-4 h-4 text-gray-400" />
          <Tablet className="w-4 h-4 text-gray-400" />
          <Smartphone className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      <div className="relative bg-gray-100 rounded-lg p-4 h-96 overflow-hidden">
        {/* Simulated website background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
        
        {/* Chatbot Widget */}
        <div className={`absolute ${getPosition()} w-80 h-96 bg-white shadow-2xl ${getBorderRadius()} overflow-hidden`}>
          {/* Header */}
          <div 
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: chatbot.primaryColor || '#3B82F6' }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-semibold">{chatbot.name || 'Chatbot'}</h5>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
            >
              {isOpen ? '−' : '+'}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto h-64">
            {!isOpen ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm">Click to start chatting</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className={`text-gray-800 ${getFontSize()}`}>
                      {chatbot.welcomeMessage || 'Hello! How can I help you today?'}
                    </p>
                  </div>
                </div>
                
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start space-x-2 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      msg.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      {msg.type === 'user' ? (
                        <Users className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-gray-600" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 max-w-xs ${
                      msg.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className={getFontSize()}>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          {isOpen && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getFontSize()}`}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 text-white rounded-lg"
                  style={{ backgroundColor: chatbot.primaryColor || '#3B82F6' }}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatbotProfessional: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [editingChatbot, setEditingChatbot] = useState<Chatbot | null>(null);
  const [previewChatbot, setPreviewChatbot] = useState<Partial<Chatbot> | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchChatbots();
  }, []);

  // Check if user can create more chatbots
  const canCreateChatbot = () => {
    if (!user) return false;
    
    const limits = {
      starter: 1,
      professional: 5,
      enterprise: -1 // unlimited
    };
    
    const limit = limits[user.planId as keyof typeof limits] || 1;
    return limit === -1 || chatbots.length < limit;
  };

  // Handle chatbot creation with limit check
  const handleCreateChatbot = () => {
    if (!canCreateChatbot()) {
      setShowUpgrade(true);
      return;
    }
    setShowWizard(true);
  };

  const fetchChatbots = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChatbots([
        {
          id: '1',
          name: 'Customer Support Bot',
          description: 'AI-powered customer support assistant',
          status: 'active',
          language: 'en',
          personality: 'friendly',
          messageCount: 1247,
          lastActive: '2024-01-26T10:30:00Z',
          satisfaction: 4.9,
          responseTime: 1.2,
          conversionRate: 12.5,
          theme: 'modern',
          primaryColor: '#3B82F6',
          secondaryColor: '#F3F4F6',
          borderRadius: 'medium',
          fontSize: 'medium',
          position: 'bottom-right',
          welcomeMessage: 'Hello! How can I help you today?',
          responseStyle: 'conversational',
          autoResponse: true,
          typingIndicator: true,
          shopifyConnected: true,
          productKnowledge: true,
          orderTracking: true,
          multilingual: true
        }
      ]);
    } catch (error) {
      console.error('Error fetching chatbots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatbotCreated = (newChatbot: Chatbot) => {
    setChatbots(prev => [...prev, newChatbot]);
    setShowWizard(false);
  };

  const handleUpdateChatbot = async (id: string, updates: Partial<Chatbot>) => {
    try {
      setChatbots(prev => prev.map(chatbot => 
        chatbot.id === id ? { ...chatbot, ...updates } : chatbot
      ));
      setEditingChatbot(null);
    } catch (error) {
      console.error('Error updating chatbot:', error);
    }
  };

  const handleDeleteChatbot = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this chatbot?')) {
      try {
        setChatbots(prev => prev.filter(chatbot => chatbot.id !== id));
      } catch (error) {
        console.error('Error deleting chatbot:', error);
      }
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      setChatbots(prev => prev.map(chatbot => 
        chatbot.id === id 
          ? { ...chatbot, status: chatbot.status === 'active' ? 'inactive' : 'active' }
          : chatbot
      ));
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'auto', name: 'Auto-detect', flag: '🌍' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading chatbots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Chatbots</h1>
                <p className="text-gray-600 text-lg">Create and manage your intelligent assistants</p>
              </div>
            </div>
            <button
              onClick={handleCreateChatbot}
              className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors shadow-lg ${
                !canCreateChatbot()
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={!canCreateChatbot()}
              title={!canCreateChatbot() ? 'Upgrade to create more chatbots' : 'Create New Chatbot'}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Chatbot
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan Limits */}
        {user && !canCreateChatbot() && (
          <div className="mb-6">
            <ChatbotLimit
              currentPlan={user.planId}
              chatbotCount={chatbots.length}
              onUpgrade={() => window.open('/?pricing=true', '_blank')}
            />
          </div>
        )}
        
        {/* Chatbots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <div key={chatbot.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: chatbot.primaryColor }}
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{chatbot.name}</h3>
                    <p className="text-sm text-gray-600">{chatbot.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setPreviewChatbot(chatbot)}
                    className={`p-2 rounded-lg transition-colors ${
                      !canCreateChatbot() && chatbots.length >= (user?.planId === 'starter' ? 1 : user?.planId === 'professional' ? 5 : Infinity)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title={!canCreateChatbot() ? 'Upgrade to preview' : 'Preview'}
                    disabled={!canCreateChatbot() && chatbots.length >= (user?.planId === 'starter' ? 1 : user?.planId === 'professional' ? 5 : Infinity)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingChatbot(chatbot)}
                    className={`p-2 rounded-lg transition-colors ${
                      !canCreateChatbot() && chatbots.length >= (user?.planId === 'starter' ? 1 : user?.planId === 'professional' ? 5 : Infinity)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title={!canCreateChatbot() ? 'Upgrade to edit' : 'Edit'}
                    disabled={!canCreateChatbot() && chatbots.length >= (user?.planId === 'starter' ? 1 : user?.planId === 'professional' ? 5 : Infinity)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleStatus(chatbot.id)}
                    className={`p-2 rounded-lg ${
                      !canCreateChatbot() && chatbots.length >= (user?.planId === 'starter' ? 1 : user?.planId === 'professional' ? 5 : Infinity)
                        ? 'text-gray-300 cursor-not-allowed'
                        : chatbot.status === 'active' 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={!canCreateChatbot() ? 'Upgrade to manage' : (chatbot.status === 'active' ? 'Deactivate' : 'Activate')}
                    disabled={!canCreateChatbot() && chatbots.length >= (user?.planId === 'starter' ? 1 : user?.planId === 'professional' ? 5 : Infinity)}
                  >
                    {chatbot.status === 'active' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteChatbot(chatbot.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      !canCreateChatbot() && chatbots.length >= (user?.planId === 'starter' ? 1 : user?.planId === 'professional' ? 5 : Infinity)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-red-400 hover:text-red-600 hover:bg-red-100'
                    }`}
                    title={!canCreateChatbot() ? 'Upgrade to delete' : 'Delete'}
                    disabled={!canCreateChatbot() && chatbots.length >= (user?.planId === 'starter' ? 1 : user?.planId === 'professional' ? 5 : Infinity)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Language</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {languages.find(l => l.code === chatbot.language)?.flag}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {languages.find(l => l.code === chatbot.language)?.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">{chatbot.messageCount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-600">Messages</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">{chatbot.responseTime}s</span>
                    </div>
                    <p className="text-xs text-gray-600">Response</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900">{chatbot.satisfaction}/5</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-900">{chatbot.conversionRate}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    chatbot.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {chatbot.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Integration Status */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Integrations</span>
                    <div className="flex items-center space-x-2">
                      {chatbot.shopifyConnected && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Shopify</span>
                      )}
                      {chatbot.multilingual && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Multilingual</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {chatbots.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No chatbots yet</h3>
            <p className="text-gray-600 mb-6">Create your first AI chatbot to start helping customers</p>
            <button
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Chatbot
            </button>
          </div>
        )}
      </div>

      {/* Chatbot Wizard */}
      <ChatbotWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleChatbotCreated}
      />

      {/* Preview Modal */}
      {previewChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Chatbot Preview</h3>
              <button
                onClick={() => setPreviewChatbot(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ChatbotPreview chatbot={previewChatbot} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotProfessional;

