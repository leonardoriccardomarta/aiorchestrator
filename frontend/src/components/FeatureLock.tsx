import React from 'react';
import { Lock } from 'lucide-react';

interface FeatureLockProps {
  featureName: string;
  requiredPlan: string;
  currentPlan: string;
  onUpgrade?: () => void;
  children?: React.ReactNode;
}

const FeatureLock: React.FC<FeatureLockProps> = ({
  featureName,
  requiredPlan,
  currentPlan,
  onUpgrade,
  children
}) => {
  const isPlanSufficient = (current: string, required: string) => {
    const planOrder = { starter: 0, pro: 1, enterprise: 2 };
    return planOrder[current.toLowerCase() as keyof typeof planOrder] >= planOrder[required.toLowerCase() as keyof typeof planOrder];
  };

  if (isPlanSufficient(currentPlan, requiredPlan)) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{featureName}</h3>
          <p className="text-gray-600 mb-4">
            This feature requires the <span className="font-semibold">{requiredPlan}</span> plan
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Your current plan: <span className="font-semibold">{currentPlan}</span>
          </p>
          <button
            onClick={onUpgrade}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Upgrade to {requiredPlan}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureLock;























