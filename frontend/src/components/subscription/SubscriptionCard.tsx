import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAnimation } from '../../contexts/AnimationContextHooks';

interface Feature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: Feature[];
  limits: {
    apiCalls: number;
    storage: number;
    users: number;
  };
  isCurrent?: boolean;
  isPopular?: boolean;
}

interface SubscriptionCardProps {
  plan: Plan;
  currentPlan?: Plan;
  onUpgrade: (planId: string) => void;
  onDowngrade?: (planId: string) => void;
  className?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  onUpgrade,
  onDowngrade: _onDowngrade,
  className = '',
}) => {
  const { getAnimationVariant } = useAnimation();

  const formatLimit = (value: number): string => {
    if (value >= 1000000) {
      return `${value / 1000000}M`;
    }
    if (value >= 1000) {
      return `${value / 1000}K`;
    }
    return value.toString();
  };

  return (
    <motion.div
      variants={getAnimationVariant('pop')}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Card className={`relative h-full ${plan.isPopular ? 'border-primary-500 border-2' : ''}`}>
        {plan.isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{plan.name}</span>
            <span className="text-2xl font-bold">
              ${plan.price}
              <span className="text-sm font-normal text-gray-500">
                /{plan.billingPeriod === 'monthly' ? 'mo' : 'yr'}
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Usage Limits</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Calls</span>
                  <span className="font-medium">{formatLimit(plan.limits.apiCalls)}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage</span>
                  <span className="font-medium">{formatLimit(plan.limits.storage)} GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team Members</span>
                  <span className="font-medium">{formatLimit(plan.limits.users)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Features</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <span className={`text-sm ${feature.included ? '' : 'text-gray-500 line-through'}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              {plan.isCurrent ? (
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => onUpgrade(plan.id)}
                >
                  {typeof onUpgrade === 'function' ? 'Upgrade' : 'Downgrade'} to {plan.name}
                </Button>
              )}
              {_onDowngrade && (
                <Button
                  variant="outline"
                  onClick={() => _onDowngrade(plan.id)}
                  className="w-full"
                >
                  Downgrade
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 