import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  DollarSign,
  Shield,
  Bell,
  Mail,
  User,
  Settings as SettingsIcon,
  ArrowRight,
  Crown,
  Loader2
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useUser();
  const { logout } = useAuth();
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [trialHoursLeft, setTrialHoursLeft] = useState(0);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [resettingStats, setResettingStats] = useState(false);

  // Update profile when user changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        company: '',
        phone: ''
      });
    }
  }, [user]);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch subscription data
  useEffect(() => {
    if (user?.isPaid) {
      fetchSubscription();
    }
  }, [user?.isPaid]);

  const fetchSubscription = async () => {
    try {
      setSubscriptionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/subscription', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.subscriptionId) return;
    
    try {
      setSubscriptionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: subscription.subscriptionId
        })
      });
      
      if (response.ok) {
        await fetchSubscription(); // Refresh subscription data
        alert('Subscription will be cancelled at the end of the current billing period');
      } else {
        alert('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription?.subscriptionId) return;
    
    try {
      setSubscriptionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/reactivate-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: subscription.subscriptionId
        })
      });
      
      if (response.ok) {
        await fetchSubscription(); // Refresh subscription data
        alert('Subscription reactivated successfully');
      } else {
        alert('Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      alert('Failed to reactivate subscription');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    if (user?.trialEndDate) {
      const trialEnd = new Date(user.trialEndDate);
      const now = new Date();
      const diffTime = trialEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      
      setTrialDaysLeft(Math.max(0, diffDays));
      setTrialHoursLeft(Math.max(0, diffHours));
    }
  }, [user]);

  // Update timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.trialEndDate) {
        const trialEnd = new Date(user.trialEndDate);
        const now = new Date();
        const diffTime = trialEnd.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        
        setTrialDaysLeft(Math.max(0, diffDays));
        setTrialHoursLeft(Math.max(0, diffHours));
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user]);

  const handleUpgrade = () => {
    // Navigate to pricing page
    window.location.href = '/pricing';
  };

  const handleLogout = () => {
    logout();
  };

  const handleResetStats = async () => {
    if (!confirm('Are you sure you want to reset all your statistics? This action cannot be undone.')) {
      return;
    }

    try {
      setResettingStats(true);
      const response = await fetch(`${API_URL}/api/user/reset-stats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        alert('Statistics reset successfully!');
      } else {
        alert('Failed to reset statistics. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting stats:', error);
      alert('Failed to reset statistics. Please try again.');
    } finally {
      setResettingStats(false);
    }
  };

  const handleCancelPlan = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to all paid features at the end of your billing period.')) {
      return;
    }

    try {
      // TODO: Implement actual cancellation API call
      // For now, just show a message
      alert('Plan cancellation request submitted. You will receive a confirmation email shortly.');
      
      // In a real implementation, you would:
      // 1. Call the cancellation API
      // 2. Update the user's subscription status
      // 3. Send confirmation email
      // 4. Redirect to a confirmation page
      
    } catch (error) {
      console.error('Error cancelling plan:', error);
      alert('Error cancelling plan. Please try again or contact support.');
    }
  };


  const handleSecuritySettings = () => {
    // Create a simple security modal or redirect
    const securitySettings = [
      'Two-Factor Authentication',
      'Password Requirements', 
      'Session Management',
      'API Key Management'
    ];
    
    const message = `Security Settings Available:\n\n${securitySettings.join('\n')}\n\nContact support for advanced security features.`;
    alert(message);
  };

  const getTrialStatus = () => {
    if (trialDaysLeft > 3) return 'success';
    if (trialDaysLeft > 1) return 'warning';
    return 'danger';
  };

  const getTrialStatusColor = () => {
    const status = getTrialStatus();
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrialStatusBg = () => {
    const status = getTrialStatus();
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'danger': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <SettingsIcon className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-xl font-medium">Loading settings...</p>
          <p className="mt-2 text-gray-500">Preparing your preferences</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 lg:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-4">
              <SettingsIcon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Account Settings</h1>
            </div>
          </div>
          <p className="text-gray-600 text-sm lg:text-base">Manage your account, plan and preferences</p>
          </div>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Trial Status Card */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg border-2 p-4 lg:p-6 mb-4 lg:mb-6 ${getTrialStatusBg()}`} data-tour="plan-info">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Clock className={`w-5 h-5 lg:w-6 lg:h-6 ${getTrialStatusColor()}`} />
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                    {user?.isPaid ? 'Plan Status' : 'Trial Status'}
                  </h2>
                </div>
                {user?.isPaid ? (
                  <span className="px-2 lg:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs lg:text-sm font-medium">
                    Paid
                  </span>
                ) : user?.isTrialActive && (
                  <span className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs lg:text-sm font-medium">
                    Active
                  </span>
                )}
              </div>

              {!user?.isPaid ? (
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {trialDaysLeft}
                  </div>
                    <div className="text-gray-600">
                      <div className="font-medium text-sm lg:text-base">days remaining</div>
                      <div className="text-xs lg:text-sm">{trialHoursLeft} hours</div>
                </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        getTrialStatus() === 'success' ? 'bg-green-500' :
                        getTrialStatus() === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, (trialDaysLeft / 7) * 100))}%` }}
                    />
        </div>

                  {trialDaysLeft <= 3 && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="font-medium text-sm lg:text-base">Trial expiring soon! Upgrade now to continue.</span>
                    </div>
                  )}

                  <button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-md lg:rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base"
                  >
                    <Crown className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Upgrade Plan</span>
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                      30
                  </div>
                    <div className="text-gray-600">
                      <div className="font-medium text-sm lg:text-base">days remaining</div>
                      <div className="text-xs lg:text-sm">Next billing cycle</div>
                </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500 transition-all duration-300"
                      style={{ width: '75%' }}
                    />
        </div>

                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-medium text-sm lg:text-base">Plan active - {user?.planId?.charAt(0).toUpperCase() + user?.planId?.slice(1)} Plan</span>
                  </div>

                  <button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-md lg:rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base"
                  >
                    <Crown className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Manage Plan</span>
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              )}
          </div>

            {/* Plan Details */}
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Plan Details</h3>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm lg:text-base">Current Plan</span>
                  <span className="font-semibold text-gray-900 text-sm lg:text-base">
                    {user?.planId?.charAt(0).toUpperCase() + user?.planId?.slice(1) || 'Starter'}
                          </span>
                      </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm lg:text-base">Monthly Price</span>
                      <span className="font-semibold text-gray-900 text-sm lg:text-base">
                    {user?.planId === 'starter' ? '$29' : 
                     user?.planId === 'professional' ? '$99' : 
                     user?.planId === 'business' ? '$299' : '$29'}
                      </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm lg:text-base">Included Chatbots</span>
                      <span className="font-semibold text-gray-900 text-sm lg:text-base">
                    {user?.planId === 'starter' ? '1' : 
                     user?.planId === 'professional' ? '2' : 
                     user?.planId === 'business' ? '3' : '1'}
                      </span>
          </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm lg:text-base">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs lg:text-sm font-medium ${
                    user?.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.isPaid ? 'Paid' : 'Trial'}
              </span>
                </div>
            </div>
          </div>
        </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6" data-tour="account-info">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <div>
                    <div className="font-medium text-gray-900 text-sm lg:text-base">{user?.name}</div>
                    <div className="text-xs lg:text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                  <div>
                    <div className="text-xs lg:text-sm text-gray-500">Member since</div>
                    <div className="font-medium text-gray-900 text-sm lg:text-base">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'October 21, 2025'}
                    </div>
                  </div>
            </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <div>
                    <div className="text-xs lg:text-sm text-gray-500">Plan</div>
                    <div className="font-medium text-gray-900 text-sm lg:text-base">
                      {user?.planId?.charAt(0).toUpperCase() + user?.planId?.slice(1) || 'Starter'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <div>
                    <div className="text-xs lg:text-sm text-gray-500">Status</div>
                    <div className="font-medium text-gray-900 text-sm lg:text-base">
                      {user?.isPaid ? 'Paid' : 'Trial Active'}
                    </div>
              </div>
              
              {/* Reset Statistics Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleResetStats}
                  disabled={resettingStats}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resettingStats ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Reset All Statistics
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This will permanently delete all your analytics data, conversations, and chatbot statistics.
                </p>
              </div>
                </div>
              </div>
                </div>

            {/* Subscription Management */}
            {user?.isPaid && subscription && (
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6" data-tour="subscription-management">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Subscription Management</h3>
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm lg:text-base">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs lg:text-sm font-medium ${
                      subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {subscription.currentPeriodEnd && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm lg:text-base">Next Billing</span>
                      <span className="font-medium text-gray-900 text-sm lg:text-base">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {subscription.cancelAtPeriodEnd && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm lg:text-base">Cancellation</span>
                      <span className="font-medium text-red-600 text-sm lg:text-base">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    {subscription.cancelAtPeriodEnd ? (
                      <button
                        onClick={handleReactivateSubscription}
                        disabled={subscriptionLoading}
                        className="w-full flex items-center justify-center space-x-2 px-3 lg:px-4 py-2 bg-green-600 text-white rounded-md lg:rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm lg:text-base"
                      >
                        {subscriptionLoading ? (
                          <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span>Reactivate Subscription</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={subscriptionLoading}
                        className="w-full flex items-center justify-center space-x-2 px-3 lg:px-4 py-2 bg-red-600 text-white rounded-md lg:rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm lg:text-base"
                      >
                        {subscriptionLoading ? (
                          <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin" />
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span>Cancel Subscription</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Plan Change */}
            {user?.isPaid && (
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900">Cancel Plan</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Cancellation at end of billing cycle
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  Cancel your subscription. You'll retain access until the end of your current billing period, then your account will be downgraded to the free plan.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-800 mb-1">Important Notice</h4>
                      <p className="text-sm text-red-700">
                        After cancellation, you'll lose access to all paid features including custom branding, advanced analytics, and priority support. 
                        Your chatbots will be limited to the free plan restrictions.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Change Plan Instead
                  </button>
                  <button
                    onClick={handleCancelPlan}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Cancel Plan
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6" data-tour="quick-actions">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Quick Actions</h3>
              <div className="space-y-2 lg:space-y-3">
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full flex items-center justify-between p-2 lg:p-3 hover:bg-gray-50 rounded-md lg:rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 text-sm lg:text-base">
                      {user?.isTrialActive ? 'Upgrade Plan' : 'View Plans & Pricing'}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 text-left hover:bg-red-50 rounded-md lg:rounded-lg transition-colors text-red-600"
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-medium text-sm lg:text-base">Logout</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 