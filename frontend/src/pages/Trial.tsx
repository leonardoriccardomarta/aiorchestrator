import React, { useState } from 'react';

type GTagFunction = (type: string, eventName: string, params: Record<string, unknown>) => void;

const Trial: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    website: '',
    plan: 'Pro',
    billingCycle: 'monthly',
    creditCard: {
      number: '',
      expiry: '',
      cvc: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Analytics tracking
    if ((window as unknown as Record<string, unknown>).gtag) {
      ((window as unknown as { gtag: GTagFunction }).gtag)('event', 'trial_signup_step', {
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
      // Redirect to dashboard with trial active
      window.location.href = '/dashboard?trial=active';
    }
    
    setIsLoading(false);
  };

  const updateFormData = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as unknown as Record<string, Record<string, string>>)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

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

        <div className="bg-white rounded-lg shadow-lg p-6">
          {step === 1 && (
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
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={(e) => updateFormData('company', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                      placeholder="https://yoursite.com"
                      value={formData.website}
                      onChange={(e) => updateFormData('website', e.target.value)}
                    />
                  </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Continue →'}
                </button>
              </form>

              <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>🛡️</span>
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span></span>
                  <span>No Commitment</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
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
                     Card Number
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1234 5678 9012 3456"
                    value={formData.creditCard.number}
                    onChange={(e) => updateFormData('creditCard.number', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="MM/YY"
                      value={formData.creditCard.expiry}
                      onChange={(e) => updateFormData('creditCard.expiry', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVC</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123"
                      value={formData.creditCard.cvc}
                      onChange={(e) => updateFormData('creditCard.cvc', e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 text-lg">🛡️</span>
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">Why we need this?</p>
                      <p className="text-blue-700">
                        To prevent abuse and provide seamless upgrade experience. 
                        Your trial starts immediately with full {formData.plan} access.
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Securing...' : 'Start My Free Trial →'}
                </button>
              </form>

              <p className="text-xs text-center text-gray-500">
                256-bit SSL encrypted • PCI DSS compliant • Cancel anytime
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl"></span>
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

              <button 
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={isLoading}
              >
                <span className="mr-2">⚡</span>
                {isLoading ? 'Setting up...' : 'Start Setup Wizard'}
              </button>

              <div className="text-sm text-gray-500">
                <p>Trial ends on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                <p>We'll remind you 2 days before it ends</p>
              </div>
            </div>
          )}
        </div>

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

export default Trial;