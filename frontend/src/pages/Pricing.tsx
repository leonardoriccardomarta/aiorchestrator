import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, ArrowRight, Zap, Shield, Globe, Bot, BarChart3, Loader2, DollarSign, Crown, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import TrialCountdown from '../components/TrialCountdown';
import PaymentModal from '../components/payment/PaymentModal';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();
  const { user, isTrialExpired } = useUser();

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectPlan = (plan: any) => {
        setSelectedPlan(plan);
        setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    // Refresh user data or redirect
    window.location.reload();
  };

  const handleContactSales = () => {
    navigate('/contact');
  };

  // Get button text based on user status
  const getButtonText = (planId: string) => {
    if (!user) {
      return planId === 'starter' ? 'Start 7-Day Free Trial' : 'Get Started';
    }

    const userPlan = user.planId;
    const isCurrentPlan = userPlan === planId;
    
    if (isCurrentPlan) {
      return 'Current Plan';
    }

    // Check if user is upgrading or downgrading
    const planHierarchy = { free: 0, starter: 1, professional: 2, enterprise: 3 };
    const userLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
    const targetLevel = planHierarchy[planId as keyof typeof planHierarchy] || 1;

    if (targetLevel > userLevel) {
      return `Upgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`;
      } else {
      return `Downgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`;
    }
  };

  // Get button style based on user status
  const getButtonStyle = (planId: string) => {
    if (!user) {
      return 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700';
    }

    const userPlan = user.planId;
    const isCurrentPlan = userPlan === planId;
    
    if (isCurrentPlan) {
      return 'w-full bg-gray-100 text-gray-600 cursor-not-allowed';
    }

    return 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700';
  };

  // Check if button should be disabled
  const isButtonDisabled = (planId: string) => {
    if (!user) return false;
    return user.planId === planId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-xl font-medium">Loading pricing...</p>
          <p className="mt-2 text-gray-500">Preparing your plans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Pricing Plans
              </h1>
              <p className="text-gray-600 text-lg">
                Choose the plan that's right for your business
              </p>
            </div>
            {authUser && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180 inline" />
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="max-w-3xl mx-auto">
          {/* Trial Expired Warning */}
          {authUser && !authUser.isTrialActive && !authUser.isPaid && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <span className="font-bold text-xl text-red-600">Your Free Trial Has Expired</span>
              </div>
              <p className="text-gray-700 text-center mb-4 text-lg">
                To continue using AI Orchestrator and access your chatbots, please select a plan below.
              </p>
              <p className="text-gray-600 text-center text-sm">
                <strong>Choose from Starter ($29/mo), Professional ($99/mo), or Enterprise ($299/mo)</strong>
              </p>
            </div>
          )}
          
          {/* Trial Countdown */}
          {user?.isTrialActive && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-semibold text-blue-700 text-lg">Free Trial Active</span>
              </div>
              <p className="text-sm text-gray-700 mb-3 font-medium">
                You have {user.trialDaysLeft} days left in your free trial
              </p>
              <TrialCountdown />
            </div>
          )}
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge className="bg-green-100 text-green-800">Save 17%</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Starter Plan */}
          <Card className="relative">
            {user?.planId === 'starter' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-4 py-1">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === 'yearly' ? '24' : '29'}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mt-2">Perfect for small businesses getting started</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>1 AI Chatbot</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>50+ Languages Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Basic Analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Email Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>7-day Free Trial</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>5,000 messages/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Basic Store Connections</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleSelectPlan({ id: 'starter', name: 'Starter', price: billingCycle === 'yearly' ? 24 : 29 })}
                className={getButtonStyle('starter')}
                disabled={isButtonDisabled('starter')}
              >
                {getButtonText('starter')}
              </Button>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="relative border-blue-500">
            {user?.planId !== 'professional' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
              )}
              {user?.planId === 'professional' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-4 py-1">Current Plan</Badge>
                  </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === 'yearly' ? '82' : '99'}
                </span>
                <span className="text-gray-600">/month</span>
                  </div>
              <p className="text-gray-600 mt-2">For growing businesses that need more power</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>2 AI Chatbots</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>50+ Languages Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Advanced Analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Custom Branding</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>API Access</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>25,000 messages/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Advanced Store Connections</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleSelectPlan({ id: 'professional', name: 'Professional', price: billingCycle === 'yearly' ? 82 : 99 })}
                className={getButtonStyle('professional')}
                disabled={isButtonDisabled('professional')}
              >
                {getButtonText('professional')}
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative">
            {user?.planId === 'enterprise' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-4 py-1">Current Plan</Badge>
        </div>
      )}
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
              <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === 'yearly' ? '166' : '199'}
                  </span>
                <span className="text-gray-600">/month</span>
                </div>
              <p className="text-gray-600 mt-2">For large organizations with complex needs</p>
              </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>3 AI Chatbots</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>50+ Languages Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Enterprise Analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>24/7 Dedicated Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>White-label Solution</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>All Store Connections</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>100,000 messages/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Full API Access</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Dedicated Account Manager</span>
                </li>
              </ul>
                <Button 
                onClick={handleContactSales}
                className={getButtonStyle('enterprise')}
                disabled={isButtonDisabled('enterprise')}
              >
                {getButtonText('enterprise')}
                </Button>
              </CardContent>
            </Card>
      </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Starter</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Professional</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">AI Chatbots</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">1</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">2</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">3</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Messages per Month</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">1,000</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">5,000</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">25,000</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Languages Support</td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Analytics</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Basic</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Advanced</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Enterprise</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">API Access</td>
                  <td className="px-6 py-4 text-center">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Custom Branding</td>
                  <td className="px-6 py-4 text-center">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">White-label Solution</td>
                  <td className="px-6 py-4 text-center">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Dedicated Support</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Email</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Priority</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">24/7 Dedicated</td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>

      {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses using AI Orchestrator to scale their customer support.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Pricing;
