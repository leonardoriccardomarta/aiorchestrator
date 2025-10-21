import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import TourButton from '../components/TourButton';
import SettingsTour from '../components/SettingsTour';
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
  const [showTour, setShowTour] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-4">
              <SettingsIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            </div>
            <TourButton onClick={() => setShowTour(true)} />
          </div>
          <p className="text-gray-600">Manage your account, plan and preferences</p>
          </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trial Status Card */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg border-2 p-6 mb-6 ${getTrialStatusBg()}`} data-tour="plan-info">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Clock className={`w-6 h-6 ${getTrialStatusColor()}`} />
                  <h2 className="text-xl font-semibold text-gray-900">Trial Status</h2>
                </div>
                {user?.isTrialActive && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Active
                    </span>
                )}
              </div>

              {user?.isTrialActive ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {trialDaysLeft}
                  </div>
                    <div className="text-gray-600">
                      <div className="font-medium">days remaining</div>
                      <div className="text-sm">{trialHoursLeft} hours</div>
                </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        getTrialStatus() === 'success' ? 'bg-green-500' :
                        getTrialStatus() === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(0, (trialDaysLeft / 7) * 100)}%` }}
                    />
        </div>

                  {trialDaysLeft <= 3 && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Trial expiring soon! Upgrade now to continue.</span>
                    </div>
                  )}

                  <button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Crown className="w-5 h-5" />
                    <span>Upgrade Plan</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Active Plan</h3>
                  <p className="text-gray-600">Your plan is active and working</p>
          </div>
              )}
          </div>

            {/* Plan Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="font-semibold text-gray-900">
                    {user?.planId?.charAt(0).toUpperCase() + user?.planId?.slice(1) || 'Starter'}
                          </span>
                      </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Monthly Price</span>
                      <span className="font-semibold text-gray-900">
                    {user?.planId === 'starter' ? '$29' : 
                     user?.planId === 'professional' ? '$99' : 
                     user?.planId === 'enterprise' ? '$299' : '$29'}
                      </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Included Chatbots</span>
                      <span className="font-semibold text-gray-900">
                    {user?.planId === 'starter' ? '1' : 
                     user?.planId === 'professional' ? '5' : 
                     user?.planId === 'enterprise' ? 'Unlimited' : '1'}
                      </span>
          </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    user?.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.isPaid ? 'Paid' : 'Trial'}
              </span>
                </div>
            </div>
          </div>
        </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm p-6" data-tour="account-info">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
            <div>
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Member since</div>
                    <div className="font-medium text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
            </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
                    <div className="text-sm text-gray-500">Plan</div>
                    <div className="font-medium text-gray-900">
                      {user?.planId?.charAt(0).toUpperCase() + user?.planId?.slice(1) || 'Starter'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
            <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium text-gray-900">
                      {user?.isPaid ? 'Paid' : 'Trial Active'}
                    </div>
              </div>
                </div>
              </div>
                </div>

            {/* Subscription Management */}
            {user?.isPaid && subscription && (
              <div className="bg-white rounded-lg shadow-sm p-6" data-tour="subscription-management">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Management</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {subscription.currentPeriodEnd && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Next Billing</span>
                      <span className="font-medium text-gray-900">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {subscription.cancelAtPeriodEnd && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Cancellation</span>
                      <span className="font-medium text-red-600">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    {subscription.cancelAtPeriodEnd ? (
                      <button
                        onClick={handleReactivateSubscription}
                        disabled={subscriptionLoading}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {subscriptionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Reactivate Subscription</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={subscriptionLoading}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {subscriptionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4" />
                            <span>Cancel Subscription</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6" data-tour="quick-actions">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      {user?.isTrialActive ? 'Upgrade Plan' : 'Manage Payment'}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      

      {/* Tour Guide */}
      <SettingsTour run={showTour} onClose={() => setShowTour(false)} />
    </div>
  );
};

export default Settings; 