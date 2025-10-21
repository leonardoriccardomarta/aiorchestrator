import React, { useState } from 'react';
import { API_URL } from '../../config/constants';
import { X, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder', {
  locale: 'en'
});

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
}

const StripePaymentForm: React.FC<{ plan: PaymentModalProps['plan']; onSuccess: () => void; onClose: () => void }> = ({ 
  plan, 
  onSuccess,
  onClose 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!billingDetails.name || !billingDetails.email) {
      setError('Please fill in name and email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment method with Stripe
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email
        }
      });

      if (pmError) {
        setError(pmError.message || 'Payment method creation failed');
        setLoading(false);
        return;
      }

      // Subscribe to plan
      const response = await fetch(`${API_URL}/api/payments/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          planId: plan.id,
          paymentMethodId: paymentMethod.id,
          customerEmail: billingDetails.email
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Payment successful:', data);
        // Show success message
        setError(null);
        setLoading(false);
        
        // Show success state
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        successDiv.innerHTML = `
          <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p class="text-gray-600 mb-6">Your plan has been updated successfully.</p>
            <button 
              onclick="this.closest('.fixed').remove()" 
              class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Continue
            </button>
          </div>
        `;
        document.body.appendChild(successDiv);
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          if (successDiv.parentNode) {
            successDiv.remove();
          }
          onSuccess();
          onClose();
        }, 3000);
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Billing Details - Simplified */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={billingDetails.name}
            onChange={(e) => setBillingDetails({...billingDetails, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={billingDetails.email}
            onChange={(e) => setBillingDetails({...billingDetails, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Details *
        </label>
        <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
              hidePostalCode: false,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">All fields in English</p>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>Pay ${plan.price}/month</span>
          </>
        )}
      </button>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, plan }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Plan Summary */}
        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{plan.name} Plan</h3>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">${plan.price}</div>
              <div className="text-xs text-gray-600">per month</div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-lg border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Credit Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`p-3 rounded-lg border-2 transition-all ${
                paymentMethod === 'paypal'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="w-5 h-5 mx-auto mb-1 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">P</div>
              <span className="text-xs font-medium">PayPal</span>
            </button>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-4">
          {paymentMethod === 'card' ? (
            <Elements stripe={stripePromise}>
              <StripePaymentForm plan={plan} onSuccess={onSuccess} onClose={onClose} />
            </Elements>
          ) : (
            <PayPalScriptProvider options={{ 
              clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb',
              currency: 'USD'
            }}>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Click below to complete payment with PayPal
                </p>
                <PayPalButtons
                  style={{ layout: 'vertical' }}
                  createSubscription={(data, actions) => {
                    return actions.subscription.create({
                      plan_id: plan.id
                    });
                  }}
                  onApprove={async (data, actions) => {
                    console.log('PayPal subscription approved:', data);
                    onSuccess();
                    onClose();
                  }}
                  onError={(err) => {
                    console.error('PayPal error:', err);
                    alert('PayPal payment failed. Please try again.');
                  }}
                />
              </div>
            </PayPalScriptProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
