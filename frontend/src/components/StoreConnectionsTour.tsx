import React from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface StoreConnectionsTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoreConnectionsTour: React.FC<StoreConnectionsTourProps> = ({ isOpen, onClose }) => {
  const steps: Step[] = [
    {
      target: '[data-tour="connections-header"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Store Connections!</h3>
          <p className="text-gray-600">
            Here you can connect your e-commerce stores (Shopify, WooCommerce, or custom) to sync products and orders with your AI chatbots.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="connect-store-btn"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Store</h3>
          <p className="text-gray-600">
            Click here to connect your first store. We support Shopify, WooCommerce, and custom e-commerce solutions.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="store-types"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Store Type</h3>
          <p className="text-gray-600">
            Select the type of store you want to connect. Each platform has different requirements for API keys and credentials.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="api-keys-info"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">API Keys Explained</h3>
          <div className="text-gray-600 space-y-2">
            <p><strong>Shopify:</strong> You need your Store URL, API Key, and API Secret from your Shopify admin panel.</p>
            <p><strong>WooCommerce:</strong> You need your Store URL, Consumer Key, and Consumer Secret from WooCommerce settings.</p>
            <p><strong>Custom:</strong> You need your API endpoint, API key, and webhook URL for your custom store.</p>
          </div>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="sync-status"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sync Status</h3>
          <p className="text-gray-600">
            Once connected, you can see real-time sync status, product counts, order counts, and revenue data from your stores.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="refresh-btn"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Refresh Data</h3>
          <p className="text-gray-600">
            Use the refresh button to manually sync your store data and update the latest products and orders.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onClose();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={isOpen}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: '#3B82F6',
          textColor: '#374151',
          backgroundColor: '#FFFFFF',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          arrowColor: '#FFFFFF',
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#3B82F6',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        buttonBack: {
          color: '#6B7280',
          marginRight: 8,
        },
        buttonSkip: {
          color: '#6B7280',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
};

export default StoreConnectionsTour;












