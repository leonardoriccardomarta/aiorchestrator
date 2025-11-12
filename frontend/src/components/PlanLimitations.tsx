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
    <div className="relative group p-2 text-left bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300">
      <div className="relative">
        {/* Content */}
        {children}
        
        {/* Lock Overlay - Smaller */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-3">
          <div className="text-center">
            <div className="relative mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              {planName} Feature
            </h3>
            <p className="text-[10px] text-slate-600">
              Available in {planName} plan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanLimitations;
