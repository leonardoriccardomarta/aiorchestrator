import React, { useState } from 'react';
import { API_URL } from '../../config/constants';
import { X, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

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
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!billingDetails.name || !billingDetails.email) {
      setError('Please fill in all required fields');
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
          email: billingDetails.email,
          address: {
            line1: billingDetails.address,
            city: billingDetails.city,
            country: billingDetails.country,
            postal_code: billingDetails.postalCode
          }
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
        onSuccess();
        onClose();
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
      {/* Billing Details */}
      <div className="space-y-3">
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
            title="Please enter a valid email address"
            onInvalid={(e) => {
              e.target.setCustomValidity('Please enter a valid email address');
            }}
            onInput={(e) => {
              e.target.setCustomValidity('');
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={billingDetails.address}
            onChange={(e) => setBillingDetails({...billingDetails, address: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={billingDetails.city}
              onChange={(e) => setBillingDetails({...billingDetails, city: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              value={billingDetails.postalCode}
              onChange={(e) => setBillingDetails({...billingDetails, postalCode: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="10001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            value={billingDetails.country}
            onChange={(e) => setBillingDetails({...billingDetails, country: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="IT">Italy</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="ES">Spain</option>
            <option value="NL">Netherlands</option>
            <option value="BE">Belgium</option>
            <option value="CH">Switzerland</option>
            <option value="AT">Austria</option>
            <option value="SE">Sweden</option>
            <option value="NO">Norway</option>
            <option value="DK">Denmark</option>
            <option value="FI">Finland</option>
            <option value="PT">Portugal</option>
            <option value="IE">Ireland</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="NZ">New Zealand</option>
            <option value="JP">Japan</option>
            <option value="SG">Singapore</option>
            <option value="HK">Hong Kong</option>
            <option value="IN">India</option>
            <option value="BR">Brazil</option>
            <option value="MX">Mexico</option>
            <option value="AR">Argentina</option>
            <option value="CL">Chile</option>
            <option value="CO">Colombia</option>
            <option value="PE">Peru</option>
            <option value="ZA">South Africa</option>
            <option value="AE">United Arab Emirates</option>
            <option value="SA">Saudi Arabia</option>
            <option value="IL">Israel</option>
            <option value="TR">Turkey</option>
            <option value="RU">Russia</option>
            <option value="PL">Poland</option>
            <option value="CZ">Czech Republic</option>
            <option value="HU">Hungary</option>
            <option value="RO">Romania</option>
            <option value="BG">Bulgaria</option>
            <option value="HR">Croatia</option>
            <option value="SI">Slovenia</option>
            <option value="SK">Slovakia</option>
            <option value="LT">Lithuania</option>
            <option value="LV">Latvia</option>
            <option value="EE">Estonia</option>
            <option value="LU">Luxembourg</option>
            <option value="MT">Malta</option>
            <option value="CY">Cyprus</option>
            <option value="GR">Greece</option>
            <option value="IS">Iceland</option>
            <option value="LI">Liechtenstein</option>
            <option value="MC">Monaco</option>
            <option value="SM">San Marino</option>
            <option value="VA">Vatican City</option>
            <option value="AD">Andorra</option>
          </select>
        </div>
      </div>

      {/* Card Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details *
        </label>
        <div className="border border-gray-300 rounded-lg p-3">
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
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
              Processing...
            </>
          ) : (
            `Pay €${plan.price}/month`
          )}
        </button>
      </div>

      <p className="text-xs text-center text-gray-500">
        Invoices will be sent to your email after each payment
      </p>
    </form>
  );
};

const PayPalPaymentButton: React.FC<{ plan: PaymentModalProps['plan']; onSuccess: () => void; onError: (err: string) => void }> = ({ 
  plan,
  onSuccess,
  onError
}) => {
  return (
    <PayPalButtons
      style={{ layout: 'vertical', label: 'subscribe' }}
      createSubscription={async (data, actions) => {
        try {
          const response = await fetch(`${API_URL}/api/payments/paypal/create-subscription`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
              planId: plan.id
            })
          });

          const result = await response.json();
          
          if (result.subscriptionId) {
            return result.subscriptionId;
          } else {
            throw new Error('Failed to create subscription');
          }
        } catch (err) {
          onError('Failed to create PayPal subscription');
          throw err;
        }
      }}
      onApprove={async (data, actions) => {
        try {
          const response = await fetch(`${API_URL}/api/payments/paypal/confirm-subscription`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
              subscriptionId: data.subscriptionID,
              planId: plan.id
            })
          });

          const result = await response.json();
          
          if (result.success) {
            onSuccess();
          } else {
            onError('Failed to confirm subscription');
          }
        } catch (err) {
          onError('Payment verification failed');
        }
      }}
      onError={(err) => {
        onError('PayPal payment failed');
      }}
    />
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, plan }) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [paypalError, setPaypalError] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Subscribe to {plan.name}
          </h2>
          <p className="text-gray-600 mt-2">
            €{plan.price}/month - Billed monthly
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Included features:</h3>
          <ul className="space-y-2">
            {plan.features && Array.isArray(plan.features) ? plan.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            )) : (
              <li className="text-sm text-gray-500">No features listed</li>
            )}
          </ul>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Payment Method
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('stripe')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                paymentMethod === 'stripe'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-semibold">Credit Card</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                paymentMethod === 'paypal'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">💳</div>
              <div className="text-sm font-semibold">PayPal</div>
            </button>
          </div>
        </div>

        {paymentMethod === 'stripe' ? (
      <Elements stripe={stripePromise} options={{
        locale: 'en',
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#dc2626',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          },
          rules: {
            '.Input': {
              color: '#1f2937',
              fontSize: '16px'
            },
            '.Label': {
              color: '#374151',
              fontSize: '14px'
            }
          }
        }
      }}>
          <StripePaymentForm plan={plan} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
        ) : (
          <div>
            <PayPalScriptProvider options={{ 
              clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
              vault: true,
              intent: 'subscription',
              locale: 'en_US',
              currency: 'EUR'
            }}>
              <PayPalPaymentButton 
                plan={plan} 
                onSuccess={onSuccess} 
                onError={setPaypalError}
              />
            </PayPalScriptProvider>
            
            {paypalError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mt-3">
                {paypalError}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

        <p className="text-xs text-center text-gray-500 mt-4">
              Invoices will be sent to your email after each payment
        </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;






















