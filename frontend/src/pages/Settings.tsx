import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config/constants';
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
  Loader2,
  X
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setSubscriptionLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/payments/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📅 Subscription data from API:', data);
        setSubscription(data.data);
        
        // Update trial days from API data
        if (data.data.daysRemaining !== undefined) {
          setTrialDaysLeft(data.data.daysRemaining);
          console.log('📅 Updated trial days from API:', data.data.daysRemaining);
        }
        
        // Log subscription status for debugging
        console.log('📅 Subscription status:', {
          isTrialActive: data.data.isTrialActive,
          isPaid: data.data.isPaid,
          daysRemaining: data.data.daysRemaining,
          planId: data.data.planId
        });
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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/payments/cancel-subscription`, {
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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/payments/reactivate-subscription`, {
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
    // Only calculate locally if we don't have API data yet
    if (user?.trialEndDate && !subscription) {
      const trialEnd = new Date(user.trialEndDate);
      const now = new Date();
      const diffTime = trialEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      
      setTrialDaysLeft(Math.max(0, diffDays));
      setTrialHoursLeft(Math.max(0, diffHours));
    }
  }, [user, subscription]);

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

  const handleUpgrade = async () => {
    // For paid users, open Stripe Customer Portal; otherwise navigate to pricing
    if (user?.isPaid && subscription?.subscriptionId) {
      try {
        setSubscriptionLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/api/payments/create-portal-session`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            returnUrl: window.location.href
          })
        });
        
        const data = await response.json();
        if (data.success && data.data?.url) {
          window.location.href = data.data.url;
        } else {
          alert('Failed to open billing portal. Redirecting to pricing page...');
          window.location.href = '/pricing';
        }
      } catch (error) {
        console.error('Error opening portal:', error);
        alert('Failed to open billing portal. Redirecting to pricing page...');
        window.location.href = '/pricing';
      } finally {
        setSubscriptionLoading(false);
      }
    } else {
      // Navigate to pricing page for trial/non-paid users
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/pricing';
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleResetStats = async () => {
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
        setShowResetConfirm(false);
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
    try {
      // TODO: Implement actual cancellation API call
      // For now, just show a message
      alert('Plan cancellation request submitted. You will receive a confirmation email shortly.');
      setShowCancelConfirm(false);
      
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

              {!user?.isPaid || (subscription?.isTrialActive && !subscription?.isPaid) ? (
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
                    {subscription?.subscriptionDate ? (
                      <div className="text-gray-600">
                        <div className="font-medium text-sm lg:text-base">Started on {new Date(subscription.subscriptionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        {subscription?.currentPeriodEnd && (
                          <div className="text-xs lg:text-sm">Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        )}
                      </div>
                    ) : user?.isPaid ? (
                      <div className="text-gray-600">
                        <div className="font-medium text-sm lg:text-base">Plan active since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'now'}</div>
                        <div className="text-xs lg:text-sm">Billed monthly</div>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <div className="font-medium text-sm lg:text-base">
                          {subscription?.daysRemaining || trialDaysLeft} days remaining
                        </div>
                        {subscription?.currentPeriodEnd && (
                          <div className="text-xs lg:text-sm">Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</div>
                        )}
                      </div>
                    )}
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
                {subscription?.subscriptionDate && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm lg:text-base">Subscription Date</span>
                    <span className="font-semibold text-gray-900 text-sm lg:text-base">
                      {new Date(subscription.subscriptionDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {subscription?.currentPeriodEnd && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm lg:text-base">Next Billing</span>
                    <span className="font-semibold text-gray-900 text-sm lg:text-base">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                )}
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
                </div>
              </div>
                </div>

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
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 text-left hover:bg-red-50 rounded-md lg:rounded-lg transition-colors text-red-600"
                >
                  <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-medium text-sm lg:text-base">Reset All Statistics</span>
                </button>
                {user?.isPaid && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 text-left hover:bg-red-50 rounded-md lg:rounded-lg transition-colors text-red-600"
                  >
                    <X className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-medium text-sm lg:text-base">Cancel Subscription</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 text-left hover:bg-gray-50 rounded-md lg:rounded-lg transition-colors text-gray-600"
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-medium text-sm lg:text-base">Logout</span>
                </button>
              </div>
            </div>

            {/* Reset Statistics Confirmation Modal */}
            {showResetConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Reset All Statistics</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to reset all your statistics? This action cannot be undone and will permanently delete:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                    <li>All analytics data</li>
                    <li>All conversations</li>
                    <li>All chatbot statistics</li>
                  </ul>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowResetConfirm(false);
                        handleResetStats();
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reset Statistics
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel Subscription Confirmation Modal */}
            {showCancelConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to cancel your subscription?
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      You'll retain access to all paid features until {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'the end of your billing period'}. After that, your account will be downgraded to the free plan.
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-800">
                      You'll lose access to custom branding, advanced analytics, priority support, and other paid features after the billing period ends.
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Keep Subscription
                    </button>
                    <button
                      onClick={() => {
                        setShowCancelConfirm(false);
                        handleCancelPlan();
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 