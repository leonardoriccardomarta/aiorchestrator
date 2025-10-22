import React, { useMemo } from 'react';
import { Lock, Crown } from 'lucide-react';
import { Button } from './ui/Button';
import { useUser } from '../contexts/UserContext';

interface PlanLimitationsProps {
  feature: string;
  children: React.ReactNode;
  requiredPlan?: 'professional' | 'business';
  showUpgrade?: boolean;
}

const PlanLimitations: React.FC<PlanLimitationsProps> = ({
  feature,
  children,
  requiredPlan = 'professional',
  showUpgrade = true,
}) => {
  const { user } = useUser();
  
  // Check if user has the required plan - memoized to prevent infinite loops
  const hasRequiredPlan = useMemo(() => {
    if (!user?.isPaid) {
      return false;
    }
    
    const planHierarchy = { starter: 1, professional: 2, business: 3 };
    const userLevel = planHierarchy[user.planId as keyof typeof planHierarchy] || 0;
    const requiredLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 2;
    
    return userLevel >= requiredLevel;
  }, [user?.isPaid, user?.planId, requiredPlan]);

  const planName = requiredPlan === 'business' ? 'Business' : 'Professional';
  
  // If user has the required plan, show the content without lock
  if (hasRequiredPlan) {
    return <>{children}</>;
  }

  return (
    <div className="relative group p-4 text-left bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
      <div className="relative">
        {/* Content */}
        <div className="max-w-sm">
          {children}
        </div>
        
        {/* Lock Overlay */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <div className="relative mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {planName} Feature
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              This feature is available in the {planName} plan and above.
            </p>
            {showUpgrade && (
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-sm px-4 py-2"
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