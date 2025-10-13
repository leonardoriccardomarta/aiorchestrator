import React from 'react';
import { ChartBarIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import FeatureLock from './FeatureLock';

interface AnalyticsLimitsProps {
  currentPlan: string;
  onUpgrade: () => void;
  children: React.ReactNode;
}

const AnalyticsLimits: React.FC<AnalyticsLimitsProps> = ({
  currentPlan,
  onUpgrade,
  children
}) => {
  const getAnalyticsLevel = (plan: string) => {
    switch (plan) {
      case 'starter':
        return {
          level: 'basic',
          features: [
            'Basic metrics (messages, response rate)',
            'Last 30 days data',
            'Simple charts'
          ],
          locked: [
            'Advanced analytics',
            'Custom date ranges',
            'Export data',
            'Real-time metrics',
            'Detailed insights',
            'Performance trends'
          ]
        };
      case 'professional':
        return {
          level: 'advanced',
          features: [
            'All basic analytics',
            'Advanced metrics',
            'Custom date ranges',
            'Export data (CSV)',
            'Last 90 days data',
            'Performance trends'
          ],
          locked: [
            'Real-time analytics',
            'Custom dashboards',
            'Advanced reporting',
            'API access to analytics'
          ]
        };
      case 'enterprise':
        return {
          level: 'premium',
          features: [
            'All analytics features',
            'Real-time metrics',
            'Custom dashboards',
            'Advanced reporting',
            'Unlimited data retention',
            'API access',
            'White-label analytics'
          ],
          locked: []
        };
      default:
        return {
          level: 'basic',
          features: ['Basic metrics only'],
          locked: ['All advanced features']
        };
    }
  };

  const analytics = getAnalyticsLevel(currentPlan);

  if (currentPlan === 'enterprise') {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      {/* Analytics Header with Plan Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
              <p className="text-gray-600">
                {analytics.level === 'basic' && 'Basic analytics for your chatbots'}
                {analytics.level === 'advanced' && 'Advanced analytics and insights'}
                {analytics.level === 'premium' && 'Full analytics suite with real-time data'}
              </p>
            </div>
          </div>
          
          {currentPlan !== 'enterprise' && (
            <button
              onClick={onUpgrade}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Upgrade Plan
            </button>
          )}
        </div>

        {/* Available Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <EyeIcon className="w-5 h-5 text-green-500 mr-2" />
              Available Features
            </h3>
            <ul className="space-y-2">
              {analytics.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <EyeSlashIcon className="w-5 h-5 text-gray-400 mr-2" />
              Locked Features
            </h3>
            <ul className="space-y-2">
              {analytics.locked.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-500">
                  <LockClosedIcon className="w-4 h-4 text-gray-400 mr-3" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Analytics Content with Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Metrics - Always Available */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Metrics</h3>
          {children}
        </div>

        {/* Advanced Analytics - Locked for Starter */}
        <FeatureLock
          featureName="Advanced Analytics"
          currentPlan={currentPlan}
          requiredPlan="professional"
          onUpgrade={onUpgrade}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Insights</h3>
            <div className="space-y-4">
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Advanced Charts</span>
              </div>
              <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Custom Reports</span>
              </div>
            </div>
          </div>
        </FeatureLock>

        {/* Real-time Analytics - Locked for Professional */}
        <FeatureLock
          featureName="Real-time Analytics"
          currentPlan={currentPlan}
          requiredPlan="enterprise"
          onUpgrade={onUpgrade}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Metrics</h3>
            <div className="space-y-4">
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Live Dashboard</span>
              </div>
              <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Real-time Updates</span>
              </div>
            </div>
          </div>
        </FeatureLock>

        {/* Custom Dashboards - Locked for Professional */}
        <FeatureLock
          featureName="Custom Dashboards"
          currentPlan={currentPlan}
          requiredPlan="enterprise"
          onUpgrade={onUpgrade}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Dashboards</h3>
            <div className="space-y-4">
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Dashboard Builder</span>
              </div>
              <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Widget Library</span>
              </div>
            </div>
          </div>
        </FeatureLock>
      </div>

      {/* Upgrade Prompt */}
      {currentPlan !== 'enterprise' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unlock Full Analytics Power
              </h3>
              <p className="text-gray-600">
                {currentPlan === 'starter' 
                  ? 'Upgrade to Professional to access advanced analytics and custom reports.'
                  : 'Upgrade to Enterprise for real-time analytics and custom dashboards.'
                }
              </p>
            </div>
            <button
              onClick={onUpgrade}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsLimits;


