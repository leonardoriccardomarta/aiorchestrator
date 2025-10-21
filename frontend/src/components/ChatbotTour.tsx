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
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🎉 Welcome to Your AI Chatbot!</h3>
          <p className="text-gray-600 mb-3">
            This is your chatbot control center. Here you can:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Test your chatbot in real-time</li>
            <li>Customize appearance and behavior</li>
            <li>Get embed code for your website</li>
            <li>Connect to your Shopify store</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="chat-interface"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">💬 Live Chat Preview</h3>
          <p className="text-gray-600 mb-3">
            Test your chatbot here before deploying it. Try these features:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li><strong>Multi-language:</strong> Type in any of 50+ languages</li>
            <li><strong>Real-time:</strong> Instant AI responses</li>
            <li><strong>Smart:</strong> Context-aware conversations</li>
          </ul>
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




