import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { getStripeKey } from '../config/stripe';

const stripePromise = loadStripe(getStripeKey());

interface PaymentFormProps {
  planId: string;
  amount: number;
  onSuccess: (subscriptionId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ planId, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  // Show loading state while Stripe loads
  if (!stripe) {
    return (
      <div className="p-4 border border-blue-300 rounded-lg bg-blue-50">
        <p className="text-blue-800">Loading payment system...</p>
      </div>
    );
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setLoading(false);
      return;
    }

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError) {
        setError(pmError.message || 'Payment method creation failed');
        setLoading(false);
        return;
      }

      // Create subscription
      const response = await fetch(`${API_URL}/api/payments/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          planId: planId
        })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Subscription creation failed');
        setLoading(false);
        return;
      }

      // Confirm payment intent if needed
      if (data.data.clientSecret) {
        const { error: confirmError } = await stripe.confirmCardPayment(data.data.clientSecret);
        
        if (confirmError) {
          setError(confirmError.message || 'Payment confirmation failed');
          setLoading(false);
          return;
        }
      }

      onSuccess(data.data.subscriptionId);
    } catch (err) {
      setError('An unexpected error occurred');
      onError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Information
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="p-3 border border-gray-300 rounded-md bg-white">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>7-Day Free Trial</strong> - Your card will be charged ${amount} after the trial period ends.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Processing...' : `Start Free Trial - $${amount}/month`}
        </button>
      </div>
    </form>
  );
};

interface PaymentIntegrationProps {
  planId: string;
  amount: number;
  onSuccess: (subscriptionId: string) => void;
  onError: (error: string) => void;
}

const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({ 
  planId, 
  amount, 
  onSuccess, 
  onError 
}) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        planId={planId} 
        amount={amount} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
};

export default PaymentIntegration;










