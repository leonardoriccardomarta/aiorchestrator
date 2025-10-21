import React, { useState } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Bot, 
  ShoppingCart, 
  BarChart3, 
  Globe,
  Zap,
  Shield,
  Users,
  Settings,
  Database,
  MessageSquare,
  Activity,
  DollarSign,
  Package,
  ExternalLink
} from 'lucide-react';
import { completeOnboarding } from '../services/onboarding';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  content: React.ReactNode;
}

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AI Orchestrator',
      description: 'Let\'s get your AI chatbot up and running in just 5 minutes',
      icon: Bot,
      color: 'bg-blue-500',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">🎉 Welcome to AI Orchestrator!</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your AI-powered assistant is ready to transform your customer experience. Let's set it up together in just <span className="font-semibold text-blue-600">3 simple steps</span>.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <p className="text-blue-900 font-semibold text-lg mb-4">✨ What makes us special:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-blue-900 font-medium">Auto-detect 50+ Languages</p>
                  <p className="text-blue-700 text-sm">No setup needed</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-purple-900 font-medium">One-Click Shopify</p>
                  <p className="text-purple-700 text-sm">OAuth integration</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-green-900 font-medium">Real-Time Analytics</p>
                  <p className="text-green-700 text-sm">Track performance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-orange-900 font-medium">5-Minute Setup</p>
                  <p className="text-orange-700 text-sm">No coding required</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-sm">💡 You can always come back to this guide from the Dashboard</p>
        </div>
      )
    },
    {
      id: 'store-connection',
      title: 'Connect Your Store',
      description: 'Choose your e-commerce platform for seamless integration',
      icon: ShoppingCart,
      color: 'bg-green-500',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">🛍️ Connect Your Shopify Store</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              One-click OAuth integration. We'll automatically sync products, orders, and customer data in real-time.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-green-800 font-medium text-sm">✨ What you get:</p>
              <ul className="text-green-700 text-sm mt-2 space-y-1 text-left">
                <li>• Real Shopify product recommendations</li>
                <li>• Order tracking & status updates</li>
                <li>• Inventory management</li>
                <li>• Customer purchase history</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center">
            <a 
              href="/connections"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Connect Shopify Store
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 font-medium text-sm mb-2">💡 Don't have Shopify?</p>
            <p className="text-gray-600 text-sm">
              No problem! You can still use our chatbot on any website. Click "Next" to proceed with the universal embed code.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">🔐 Secure Integration</h4>
            <p className="text-green-800 text-sm">
              All connections use industry-standard OAuth 2.0 and API keys. Your data is encrypted and secure.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'multilingual',
      title: 'Enable Multilingual Support',
      description: 'Reach customers worldwide with AI that speaks their language',
      icon: Globe,
      color: 'bg-indigo-500',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Universal Language Support</h3>
            <p className="text-gray-600">
              Your AI speaks any language your customers use - automatically detecting and responding in their native tongue.
            </p>
          </div>
          
          <div className="text-center space-y-6">
            <div className="grid grid-cols-4 gap-3">
              {[
                { flag: '🇺🇸', name: 'English' },
                { flag: '🇮🇹', name: 'Italiano' },
                { flag: '🇪🇸', name: 'Español' },
                { flag: '🇫🇷', name: 'Français' },
                { flag: '🇩🇪', name: 'Deutsch' },
                { flag: '🇵🇹', name: 'Português' },
                { flag: '🇨🇳', name: '中文' },
                { flag: '🇯🇵', name: '日本語' },
                { flag: '🇰🇷', name: '한국어' },
                { flag: '🇷🇺', name: 'Русский' },
                { flag: '🇸🇦', name: 'العربية' },
                { flag: '🇳🇱', name: 'Nederlands' }
              ].map((lang, index) => (
                <div key={index} className="p-3 rounded-lg border-2 border-green-200 bg-green-50">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-xs font-medium text-gray-900">{lang.name}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">+ 100+ Languages</p>
              <p className="text-gray-600">And counting...</p>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">✨ Universal Language Intelligence</h4>
            <p className="text-indigo-800 text-sm">
              Your AI understands and responds in ANY language - from English to Chinese, Arabic to Japanese, 
              and everything in between. No setup required, just pure intelligence!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'chatbot-setup',
      title: 'Create Your AI Chatbot',
      description: 'Set up your intelligent customer support assistant',
      icon: Bot,
      color: 'bg-purple-500',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your AI Assistant</h3>
            <p className="text-gray-600">
              Your chatbot will automatically use your store data and multilingual settings.
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h4 className="font-semibold text-purple-900 mb-3">🤖 AI Configuration</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-purple-800 text-sm">Connected to your store</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-purple-800 text-sm">Multilingual support enabled</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-purple-800 text-sm">Product knowledge synced</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-purple-800 text-sm">Order tracking ready</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Your chatbot will:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Answer product questions using real inventory data</li>
                <li>• Help customers track orders in real-time</li>
                <li>• Respond in the customer's language automatically</li>
                <li>• Provide 24/7 support with your store's knowledge</li>
                <li>• Handle returns, exchanges, and support tickets</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'embed-chatbot',
      title: 'Embed Your Chatbot',
      description: 'Add your AI assistant to your website in minutes',
      icon: ExternalLink,
      color: 'bg-orange-500',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Embed Your Chatbot</h3>
            <p className="text-gray-600">
              Add your AI assistant to your website with a simple code snippet.
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-6">
            <h4 className="font-semibold text-orange-900 mb-3">📱 Easy Integration</h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h5 className="font-medium text-gray-900 mb-2">1. Copy the embed code</h5>
                <div className="bg-gray-100 rounded p-3 font-mono text-sm">
                  {`<script src="https://your-domain.com/chatbot.js"></script>`}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h5 className="font-medium text-gray-900 mb-2">2. Paste in your website</h5>
                <p className="text-sm text-gray-600">Add the code before the closing &lt;/body&gt; tag</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h5 className="font-medium text-gray-900 mb-2">3. Customize appearance</h5>
                <p className="text-sm text-gray-600">Choose colors, position, and behavior to match your brand</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🎨 Customization Options</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-blue-800">Brand colors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-blue-800">Position control</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-blue-800">Animation effects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-blue-800">Size options</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Track Your Success',
      description: 'Monitor performance and optimize your chatbot',
      icon: BarChart3,
      color: 'bg-teal-500',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Analytics</h3>
            <p className="text-gray-600">
              Track conversations, satisfaction, and conversion rates in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-900">Conversations</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600">+23% this week</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-gray-900">Response Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1.2s</p>
              <p className="text-sm text-green-600">-15% faster</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-gray-900">Satisfaction</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">4.8/5</p>
              <p className="text-sm text-green-600">+0.3 this month</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-gray-900">Conversions</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">12.5%</p>
              <p className="text-sm text-green-600">+3.2% this month</p>
            </div>
          </div>

          <div className="bg-teal-50 rounded-lg p-4">
            <h4 className="font-semibold text-teal-900 mb-2">📊 Advanced Analytics</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span className="text-teal-800">Real-time monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span className="text-teal-800">User behavior</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-teal-600" />
                <span className="text-teal-800">Product insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-teal-600" />
                <span className="text-teal-800">Revenue tracking</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Your AI chatbot is ready to start helping customers',
      icon: CheckCircle,
      color: 'bg-green-500',
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Congratulations!</h3>
            <p className="text-gray-600 text-lg">
              Your AI chatbot is now live and ready to help your customers 24/7.
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-3">What happens next?</h4>
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-800 text-sm">Your chatbot is live on your website</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-800 text-sm">Real-time analytics are tracking performance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-800 text-sm">Multilingual support is active</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-800 text-sm">Store integration is syncing data</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-800 text-sm">You'll receive weekly performance reports</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h4>
            <ul className="text-blue-800 text-sm space-y-1 text-left">
              <li>• Check your analytics dashboard daily for insights</li>
              <li>• Update your chatbot's knowledge base regularly</li>
              <li>• Monitor customer satisfaction scores</li>
              <li>• Use A/B testing to optimize responses</li>
              <li>• Connect multiple stores for better insights</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, steps[currentStep].id]);
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding and save data
      try {
        await completeOnboarding({
          storeConnected: true, // Assume store is connected if they reach the end
          platform: 'shopify', // Default to Shopify for now
          completedAt: new Date()
        });
        onComplete();
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        // Still call onComplete even if saving fails
        onComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Getting Started</h2>
              <p className="text-blue-100 text-sm">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <button
              onClick={handleSkip}
              className="text-blue-100 hover:text-white text-sm font-medium"
            >
              Skip Tour
            </button>
          </div>
          <div className="mt-3">
            <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-12 h-12 ${currentStepData.color} rounded-lg flex items-center justify-center`}>
              <currentStepData.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentStepData.title}</h3>
              <p className="text-gray-600">{currentStepData.description}</p>
            </div>
          </div>
          
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;












