import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle, Bot, Settings, Code, MessageSquare } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TourGuide: React.FC<TourGuideProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AI Orchestrator! 🚀',
      content: 'This is your chatbot management dashboard. Let me show you around and explain how to get the most out of your AI assistant.',
      target: 'tour-welcome',
      position: 'bottom'
    },
    {
      id: 'test-chat',
      title: 'Test Your Chatbot 💬',
      content: 'Click here to test your chatbot in real-time. Try different languages and see how it responds to various questions.',
      target: 'tour-test-chat',
      position: 'bottom'
    },
    {
      id: 'settings',
      title: 'Customize Your Bot ⚙️',
      content: 'Configure your chatbot\'s personality, welcome message, language preferences, and behavior settings.',
      target: 'tour-settings',
      position: 'bottom'
    },
    {
      id: 'embed',
      title: 'Get Embed Code 📝',
      content: 'Generate the code to embed your chatbot on your website. Choose from different customization options.',
      target: 'tour-embed',
      position: 'bottom'
    },
    {
      id: 'manage',
      title: 'Manage Your Chatbots 🤖',
      content: 'View all your chatbots, see usage stats, and manage your plan limits. Create new chatbots if your plan allows.',
      target: 'tour-manage',
      position: 'bottom'
    },
    {
      id: 'integration',
      title: 'Integration Methods 🔗',
      content: 'Choose between embedding code for any website or one-click integration with Shopify/WooCommerce stores.',
      target: 'tour-integration',
      position: 'top'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Scroll to first step
      setTimeout(() => {
        const element = document.querySelector(`[data-tour="${tourSteps[0].target}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to next step
      setTimeout(() => {
        const element = document.querySelector(`[data-tour="${tourSteps[currentStep + 1].target}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to previous step
      setTimeout(() => {
        const element = document.querySelector(`[data-tour="${tourSteps[currentStep - 1].target}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const skipTour = () => {
    onComplete();
  };

  if (!isVisible) return null;

  const currentStepData = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Tour Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tour Guide</h3>
                <p className="text-sm text-gray-600">Step {currentStep + 1} of {tourSteps.length}</p>
              </div>
            </div>
            <button
              onClick={skipTour}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              {currentStepData.title}
            </h4>
            <p className="text-gray-600 mb-6">
              {currentStepData.content}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={skipTour}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Skip Tour
                </button>
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <span>{currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuide;












