import React from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface ChatbotTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotTour: React.FC<ChatbotTourProps> = ({ isOpen, onClose }) => {
  const steps: Step[] = [
    {
      target: '[data-tour="chatbot-header"]',
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">🎉 Welcome to Your AI Chatbot!</h3>
          <p className="text-gray-600 mb-4">
            Your AI-powered assistant is ready! Let's explore the key features together.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <p className="text-blue-900 font-semibold text-sm mb-2">✨ What you can do:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Test in real-time</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Customize design</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Get embed code</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Connect Shopify</span>
              </div>
            </div>
          </div>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="chat-interface"]',
      content: (
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">💬 Live Chat Preview</h3>
          <p className="text-gray-600 mb-3">
            Test your chatbot here before deploying it. This is exactly how your customers will see it!
          </p>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <p className="text-green-900 font-semibold text-sm mb-2">🚀 Try these features:</p>
            <div className="space-y-1 text-xs text-green-800">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span><strong>Multi-language:</strong> Type in any of 50+ languages</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>Real-time:</strong> Instant AI responses</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span><strong>Smart:</strong> Context-aware conversations</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">💡 Tip: Try asking in different languages to see auto-detection!</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="chat-settings"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">⚙️ Customize Your Chatbot</h3>
          <p className="text-gray-600 mb-3">
            Make it yours! Here you can change:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li><strong>Name & Welcome Message:</strong> First impression matters</li>
            <li><strong>Colors & Theme:</strong> Match your brand</li>
            <li><strong>Language:</strong> Set default or use auto-detect</li>
            <li><strong>Personality:</strong> Professional, friendly, or casual</li>
          </ul>
          <p className="text-xs text-blue-600 mt-2">💡 Tip: Changes apply instantly to the preview!</p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="embed-code"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Deploy to Your Website</h3>
          <p className="text-gray-600 mb-3">
            Ready to go live? Here's how:
          </p>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Click the "Embed" tab above</li>
            <li>Copy the code snippet</li>
            <li>Paste before <code className="bg-gray-100 px-1 rounded text-xs">&lt;/body&gt;</code> in your HTML</li>
            <li>Save and publish!</li>
          </ol>
          <p className="text-xs text-green-600 mt-2">✅ Works with WordPress, Wix, Shopify, and any website</p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="chatbot-management"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Quick Integration</h3>
          <p className="text-gray-600 mb-3">
            Get your chatbot working in minutes:
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">📝 For Regular Websites:</p>
              <p className="text-xs text-gray-600">Use the "Embedding Code" card → Copy & paste into your HTML</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">🛍️ For Shopify:</p>
              <p className="text-xs text-gray-600">Use "Shopify Integration" card → One-click OAuth connection</p>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">💡 Tip: Check Dashboard for analytics after deployment!</p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: 'body',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🎓 You're All Set!</h3>
          <p className="text-gray-600 mb-3">
            Here's a quick recap:
          </p>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside mb-3">
            <li><strong>Test:</strong> Try your chatbot in the preview</li>
            <li><strong>Customize:</strong> Settings tab for personalization</li>
            <li><strong>Deploy:</strong> Embed tab for website code</li>
            <li><strong>Connect:</strong> Shopify integration for e-commerce</li>
            <li><strong>Monitor:</strong> Dashboard for analytics</li>
          </ol>
          <p className="text-sm text-green-600 font-medium">🚀 Ready to deploy? Let's go!</p>
        </div>
      ),
      placement: 'center',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Joyride
      steps={steps}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: '#3b82f6',
          textColor: '#374151',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          arrowColor: '#ffffff',
          width: 400,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          padding: '8px 16px',
          color: '#ffffff',
        },
        buttonBack: {
          marginRight: 10,
          color: '#6b7280',
        },
        buttonSkip: {
          color: '#6b7280',
        },
      }}
    />
  );
};

export default ChatbotTour;




