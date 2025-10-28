import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { API_URL } from '../config/constants';
import { useChatbot } from '../contexts/ChatbotContext';

interface PlanStatusNotificationProps {
  className?: string;
}

interface WidgetStatus {
  status: 'active' | 'cancelled' | 'trial_expired' | 'upgrade_required' | 'limit_reached';
  message: string;
  requiresAction: boolean;
  actionUrl: string;
  user: {
    id: string;
    planId: string;
    isActive: boolean;
    isPaid: boolean;
    isTrialActive: boolean;
    trialEndDate: string;
  };
  chatbot: {
    id: string;
    name: string;
  };
}

const PlanStatusNotification: React.FC<PlanStatusNotificationProps> = ({ className = '' }) => {
  const { selectedChatbot } = useChatbot();
  const [status, setStatus] = useState<WidgetStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkWidgetStatus = async () => {
      if (!selectedChatbot?.id) return;

      try {
        const response = await fetch(`${API_URL}/api/widget/status/${selectedChatbot.id}`);
        const result = await response.json();

        if (result.success && result.data.requiresAction) {
          setStatus(result.data);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error checking widget status:', error);
      }
    };

    checkWidgetStatus();
    
    // Check every 5 minutes
    const interval = setInterval(checkWidgetStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedChatbot?.id]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'trial_expired':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'upgrade_required':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'limit_reached':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cancelled':
        return '🚫';
      case 'trial_expired':
        return '⏰';
      case 'upgrade_required':
        return '⚠️';
      case 'limit_reached':
        return '📊';
      default:
        return 'ℹ️';
    }
  };

  if (!isVisible || isDismissed || !status) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md ${className}`}>
      <div className={`border rounded-lg p-4 shadow-lg ${getStatusColor(status.status)}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{getStatusIcon(status.status)}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                {status.status === 'cancelled' && 'Subscription Cancelled'}
                {status.status === 'trial_expired' && 'Trial Expired'}
                {status.status === 'upgrade_required' && 'Upgrade Required'}
                {status.status === 'limit_reached' && 'Message Limit Reached'}
              </h3>
              <p className="text-sm mb-3">{status.message}</p>
              {status.requiresAction && (
                <div className="flex space-x-2">
                  <a
                    href={status.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-white border border-current rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Upgrade Plan
                  </a>
                  <button
                    onClick={() => window.location.href = '/connections'}
                    className="inline-flex items-center px-3 py-1.5 bg-white border border-current rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
                  >
                    Update Widget
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 text-current hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanStatusNotification;
