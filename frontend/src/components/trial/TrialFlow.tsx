import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CheckCircle, CreditCard, Shield, Zap } from 'lucide-react';

interface TrialFlowProps {
  onTrialStart?: (data: TrialSignupData) => void;
}

interface TrialSignupData {
  email: string;
  company: string;
  website: string;
  plan: string;
  billingCycle: 'monthly' | 'yearly';
  creditCard: {
    number: string;
    expiry: string;
    cvc: string;
  };
}

const TrialFlow: React.FC<TrialFlowProps> = ({ onTrialStart }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<TrialSignupData>>({
    plan: 'Pro',
    billingCycle: 'monthly',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get plan from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    const billingParam = urlParams.get('billing');
    
    if (planParam) {
      setFormData(prev => ({
        ...prev,
        plan: planParam.charAt(0).toUpperCase() + planParam.slice(1),
      }));
    }
    
    if (billingParam) {
      setFormData(prev => ({
        ...prev,
        billingCycle: billingParam as 'monthly' | 'yearly',
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'trial_signup_step', {
        step_number: step,
        plan_name: formData.plan,
        billing_cycle: formData.billingCycle,
      });
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final submission
      if (onTrialStart && formData as TrialSignupData) {
        onTrialStart(formData as TrialSignupData);
      }
      
      // Redirect to dashboard with trial active
      window.location.href = '/dashboard?trial=active';
    }
    
    setIsLoading(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Start Your 7-Day Free Trial</h2>
        <p className="text-gray-600 mb-6">
          Get complete access to {formData.plan} plan features
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Work Email</label>
          <Input
            type="email"
            required
            placeholder="you@company.com"
            value={formData.email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <Input
            type="text"
            required
            placeholder="Your Company"
            value={formData.company || ''}
            onChange={(e) => updateFormData('company', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <Input
            type="url"
            placeholder="https://yoursite.com"
            value={formData.website || ''}
            onChange={(e) => updateFormData('website', e.target.value)}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Continue →'}
        </Button>
      </form>

      <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4" />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4" />
          <span>No Commitment</span>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Secure Your Trial</h2>
        <p className="text-gray-600 mb-6">
          €1 authorization (refunded immediately)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <CreditCard className="inline w-4 h-4 mr-1" />
            Card Number
          </label>
          <Input
            type="text"
            required
            placeholder="1234 5678 9012 3456"
            value={formData.creditCard?.number || ''}
            onChange={(e) => updateFormData('creditCard.number', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Expiry</label>
            <Input
              type="text"
              required
              placeholder="MM/YY"
              value={formData.creditCard?.expiry || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('creditCard.expiry', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CVC</label>
            <Input
              type="text"
              required
              placeholder="123"
              value={formData.creditCard?.cvc || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('creditCard.cvc', e.target.value)}
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Why we need this?</p>
              <p className="text-blue-700">
                To prevent abuse and provide seamless upgrade experience. 
                Your trial starts immediately with full {formData.plan} access.
              </p>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Securing...' : 'Start My Free Trial →'}
        </Button>
      </form>

      <p className="text-xs text-center text-gray-500">
        256-bit SSL encrypted • PCI DSS compliant • Cancel anytime
      </p>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Your AI Journey!</h2>
        <p className="text-gray-600 mb-6">
          Your {formData.plan} trial is now active. Let's set up your first chatbot!
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">What happens next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <span>Guided setup wizard (15 minutes)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <span>Deploy your first AI chatbot</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <span>Watch your conversations convert</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSubmit}
        className="w-full"
        disabled={isLoading}
      >
        <Zap className="w-4 h-4 mr-2" />
        {isLoading ? 'Setting up...' : 'Start Setup Wizard'}
      </Button>

      <div className="text-sm text-gray-500">
        <p>Trial ends on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
        <p>We'll remind you 2 days before it ends</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </CardContent>
        </Card>

        {/* Trust Signals */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span> GDPR Compliant</span>
            <span>⚡ Setup in minutes</span>
            <span>💬 24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialFlow;