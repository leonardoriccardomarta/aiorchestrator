import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, ArrowRight, Zap, Shield, Globe, Bot, BarChart3, Loader2, DollarSign, Crown, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import TrialCountdown from '../components/TrialCountdown';
import PaymentModal from '../components/payment/PaymentModalSimple';

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
    
    // If trial is expired, allow selection of any plan (including current one)
    if (isTrialExpired) {
      if (isCurrentPlan) {
        return `Subscribe to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`;
      }
      return `Subscribe to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`;
    }
    
    if (isCurrentPlan) {
      return 'Current Plan';
    }

    // Check if user is upgrading or downgrading
    const planHierarchy = { free: 0, starter: 1, professional: 2, business: 3 };
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
    
    // If trial is expired, allow selection of any plan (including current one)
    if (isTrialExpired) {
      return 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700';
    }
    
    if (isCurrentPlan) {
      return 'w-full bg-gray-100 text-gray-600 cursor-not-allowed';
    }

    return 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700';
  };

  // Check if button should be disabled
  const isButtonDisabled = (planId: string) => {
    if (!user) return false;
    
    // If trial is expired, allow selection of any plan (including current one)
    if (isTrialExpired) {
      return false;
    }
    
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
    <div className="p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Pricing Plans
        </h1>
        <p className="text-sm lg:text-base text-gray-600">
          Choose the plan that's right for your business
        </p>
      </div>

      {/* Content */}
        <div className="text-center mb-8">
          <div className="max-w-3xl mx-auto">
          {/* Trial Expired Warning */}
          {authUser && !authUser.isTrialActive && !authUser.isPaid && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 lg:p-6 mb-6 lg:mb-8 shadow-lg">
              <div className="flex items-center justify-center gap-2 lg:gap-3 mb-3">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                <span className="font-bold text-lg lg:text-xl text-red-600">Your Free Trial Has Expired</span>
              </div>
              <p className="text-gray-700 text-center mb-3 lg:mb-4 text-sm lg:text-lg">
                To continue using AI Orchestrator and access your chatbots, please select a plan below.
              </p>
              <p className="text-gray-600 text-center text-xs lg:text-sm">
                <strong>Choose from Starter ($29/mo), Professional ($99/mo), or Business ($299/mo)</strong>
              </p>
            </div>
          )}
          
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-3 lg:space-x-4 mb-6 lg:mb-8">
              <span className={`text-xs lg:text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-5 w-9 lg:h-6 lg:w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-3 w-3 lg:h-4 lg:w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-5 lg:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-xs lg:text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge className="bg-green-100 text-green-800 text-xs">Save 17%</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-12 lg:mb-16">
          {/* Starter Plan */}
          <Card className="relative">
            {user?.planId === 'starter' && !isTrialExpired && (
              <div className="absolute -top-2 lg:-top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-3 lg:px-4 py-1 text-xs">Current Plan</Badge>
              </div>
            )}
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900">Starter</CardTitle>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                  ${billingCycle === 'yearly' ? '24' : '29'}
                </span>
                <span className="text-sm lg:text-base text-gray-600">/month</span>
              </div>
              <p className="text-sm lg:text-base text-gray-600 mt-2">Perfect for small businesses getting started</p>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <ul className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">1 AI Chatbot</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">50+ Languages Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Basic Analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Email Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">7-day Free Trial</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">5,000 messages/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Basic Store Connections</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleSelectPlan({ id: 'starter', name: 'Starter', price: billingCycle === 'yearly' ? 24 : 29 })}
                className={`${getButtonStyle('starter')} text-sm lg:text-base py-2 lg:py-3`}
                disabled={isButtonDisabled('starter')}
              >
                {getButtonText('starter')}
              </Button>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="relative border-blue-500">
            {user?.planId !== 'professional' && (
              <div className="absolute -top-2 lg:-top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-3 lg:px-4 py-1 text-xs">Most Popular</Badge>
                  </div>
              )}
              {user?.planId === 'professional' && !isTrialExpired && (
              <div className="absolute -top-2 lg:-top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-3 lg:px-4 py-1 text-xs">Current Plan</Badge>
                  </div>
            )}
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900">Professional</CardTitle>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                  ${billingCycle === 'yearly' ? '82' : '99'}
                </span>
                <span className="text-sm lg:text-base text-gray-600">/month</span>
                  </div>
              <p className="text-sm lg:text-base text-gray-600 mt-2">For growing businesses that need more power</p>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <ul className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">2 AI Chatbots</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">50+ Languages Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Advanced Analytics & ML Insights</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Priority Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Custom Branding</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">API Access</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">25,000 messages/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Add to Cart & Checkout Assistance</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">ML Personalization (5 segments)</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Advanced Store Connections</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleSelectPlan({ id: 'professional', name: 'Professional', price: billingCycle === 'yearly' ? 82 : 99 })}
                className={`${getButtonStyle('professional')} text-sm lg:text-base py-2 lg:py-3`}
                disabled={isButtonDisabled('professional')}
              >
                {getButtonText('professional')}
              </Button>
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card className="relative border-purple-500">
            {user?.planId === 'business' && !isTrialExpired && (
              <div className="absolute -top-2 lg:-top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-3 lg:px-4 py-1 text-xs">Current Plan</Badge>
        </div>
      )}
            {user?.planId !== 'business' && (
              <div className="absolute -top-2 lg:-top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white px-3 lg:px-4 py-1 text-xs flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </Badge>
              </div>
            )}
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900">Business</CardTitle>
              <div className="flex items-baseline space-x-1">
                  <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                  ${billingCycle === 'yearly' ? '249' : '299'}
                  </span>
                <span className="text-sm lg:text-base text-gray-600">/month</span>
                </div>
              <p className="text-sm lg:text-base text-gray-600 mt-2">Full e-commerce automation for serious businesses</p>
              </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <ul className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">3 AI Chatbots</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">50+ Languages Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Enterprise Analytics & ML</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">24/7 Dedicated Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">White-label Solution</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Stripe In-Chat Payments</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">AI Upselling & Cross-selling</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Abandoned Cart Recovery</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Full ML Personalization Suite</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">100,000 messages/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Full API Access</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">Dedicated Account Manager</span>
                </li>
              </ul>
                <Button 
                onClick={() => handleSelectPlan({ id: 'business', name: 'Business', price: billingCycle === 'yearly' ? 249 : 299 })}
                className={`${getButtonStyle('business')} text-sm lg:text-base py-2 lg:py-3`}
                disabled={isButtonDisabled('business')}
              >
                {getButtonText('business')}
                </Button>
              </CardContent>
            </Card>
      </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-8 mb-12 lg:mb-16">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
              Compare All Features
            </h2>
            <p className="text-sm lg:text-xl text-gray-600">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-900">Features</th>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-semibold text-gray-900">Starter</th>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-semibold text-gray-900">Professional</th>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-semibold text-gray-900">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">AI Chatbots</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">1</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">2</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">3</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">Messages per Month</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">5,000</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">25,000</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">100,000</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">Languages Support</td>
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
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">Analytics</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">Basic</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">Advanced</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">Enterprise</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">API Access</td>
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
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">Custom Branding</td>
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
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">White-label Solution</td>
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
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">Store Connections</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">Basic</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">Advanced</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">Full</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">Add to Cart & Checkout</td>
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
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">ML Personalization</td>
                  <td className="px-6 py-4 text-center">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">5 segments</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">Full Suite</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">Stripe Payments</td>
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
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">Dedicated Support</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">Email</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">Priority</td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm text-gray-600">24/7 Dedicated</td>
                </tr>
              </tbody>
            </table>
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
