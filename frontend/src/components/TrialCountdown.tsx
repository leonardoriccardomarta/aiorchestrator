import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CreditCard, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface TrialCountdownProps {
  onUpgrade?: () => void;
  onDismiss?: () => void;
}

const TrialCountdown: React.FC<TrialCountdownProps> = ({ onUpgrade, onDismiss }) => {
  const { user, isTrialExpired, isTrialExpiringSoon } = useUser();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!user?.trialEndDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endDate = new Date(user.trialEndDate).getTime();
      const difference = endDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [user?.trialEndDate]);

  if (!user) return null;
  if (user.isPaid) return null;

  if (isTrialExpired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Trial Expired</h3>
              <p className="text-red-700">Your free trial has ended. Upgrade to continue using AI Orchestrator.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onUpgrade}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <CreditCard className="w-4 h-4 mr-2 inline" />
              Upgrade Now
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-red-400 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isTrialExpiringSoon) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">Trial Expiring Soon</h3>
              <p className="text-yellow-700">
                Your free trial ends in {timeLeft.days} days, {timeLeft.hours}h {timeLeft.minutes}m
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onUpgrade}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              <CreditCard className="w-4 h-4 mr-2 inline" />
              Upgrade Now
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-yellow-400 hover:text-yellow-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900">Free Trial Active</h3>
            <p className="text-indigo-700">
              {timeLeft.days} days, {timeLeft.hours}h {timeLeft.minutes}m remaining
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onUpgrade}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <CreditCard className="w-4 h-4 mr-2 inline" />
            Upgrade Now
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-indigo-400 hover:text-indigo-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialCountdown;

















































