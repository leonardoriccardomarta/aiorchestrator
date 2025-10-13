import React, { useState } from 'react';

const TestPricingCalculator: React.FC = () => {
  const [messages, setMessages] = useState(5000);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2"> Pricing Calculator</h2>
        <p className="text-gray-600">Calculate your monthly cost based on your usage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Usage</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Messages per month: {messages.toLocaleString()}
            </label>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={messages}
              onChange={(e) => setMessages(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Plan</h3>
          
          <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Pro Plan</h4>
                <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Recommended
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ${messages > 25000 ? 99 : 79}
                </div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">25,000 messages per month</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">15 AI chatbots</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Multi-channel integrations</span>
              </div>
            </div>

            <button className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPricingCalculator;


