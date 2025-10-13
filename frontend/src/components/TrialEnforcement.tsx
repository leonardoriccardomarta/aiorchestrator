import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface TrialEnforcementProps {
  isTrialExpired?: boolean;
  onUpgrade?: () => void;
}

const TrialEnforcement: React.FC<TrialEnforcementProps> = ({ 
  isTrialExpired = false, 
  onUpgrade 
}) => {
  if (!isTrialExpired) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900">Trial Expired</h3>
          <p className="text-sm text-yellow-700">
            Your free trial has ended. Upgrade to continue using all features.
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default TrialEnforcement;






















