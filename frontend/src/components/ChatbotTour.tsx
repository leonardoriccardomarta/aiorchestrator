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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to AI Chatbot!</h3>
          <p className="text-gray-600">
            Here you can create, customize, and manage your AI chatbots. Test them directly and get embed codes for your website.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="chat-interface"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Interface</h3>
          <p className="text-gray-600">
            Test your chatbot here by typing messages. The AI will respond in multiple languages automatically.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="chat-settings"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chatbot Settings</h3>
          <p className="text-gray-600">
            Customize your chatbot's name, welcome message, language, and personality to match your brand.
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="embed-code"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Embed Code</h3>
          <p className="text-gray-600">
            Get the HTML code to embed your chatbot on your website. Just copy and paste!
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="chatbot-management"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chatbot Management</h3>
          <p className="text-gray-600">
            Create multiple chatbots, manage them, and view analytics for each one.
          </p>
        </div>
      ),
      placement: 'left',
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




