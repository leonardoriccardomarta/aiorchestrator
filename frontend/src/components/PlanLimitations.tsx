import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { Button } from './ui/Button';

interface PlanLimitationsProps {
  feature: string;
  children: React.ReactNode;
  requiredPlan?: 'professional' | 'enterprise';
  showUpgrade?: boolean;
}

const PlanLimitations: React.FC<PlanLimitationsProps> = ({
  feature,
  children,
  requiredPlan = 'professional',
  showUpgrade = true,
}) => {
  const planName = requiredPlan === 'enterprise' ? 'Enterprise' : 'Professional';

  return (
    <div className="relative group p-6 text-left bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
      <div className="relative">
        {/* Content */}
        <div className="p-6 max-w-sm">
          {children}
        </div>
        
        {/* Lock Overlay */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {planName} Feature
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This feature is available in the {planName} plan and above.
            </p>
            {showUpgrade && (
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.location.href = '/pricing'}
              >
                Upgrade to {planName}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanLimitations;