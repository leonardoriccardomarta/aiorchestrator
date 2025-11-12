import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react';

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: { monthly: number; yearly: number };
    features: string[];
  };
  onSuccess: (paymentData: any) => void;
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would call Stripe API
      const paymentData = {
        plan: plan.name,
        amount: plan.price.monthly,
        paymentMethod: paymentMethod,
        transactionId: `txn_${Date.now()}`,
        status: 'succeeded'
      };
      
      onSuccess(paymentData);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header - Compact */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Plan Summary - Compact */}
        <div className="p-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{plan.name} Plan</h3>
            <div className="text-right">
              <div className="text-xl font-bold text-slate-900">${plan.price.monthly}</div>
              <div className="text-xs text-slate-600">per month</div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-4">
          {/* Payment Method Selection - Simplified */}
          <div className="mb-4">
            <div className="flex space-x-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="font-medium text-sm">Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'paypal'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-4 h-4 bg-indigo-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  P
                </div>
                <span className="font-medium text-sm">PayPal</span>
              </button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({
                    ...prev,
                    number: formatCardNumber(e.target.value)
                  }))}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  maxLength={19}
                />
              </div>

              {/* Card Details Row - Compact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      expiry: formatExpiry(e.target.value)
                    }))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                    }))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="text-white text-lg font-bold">P</div>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                You'll be redirected to PayPal to complete your payment
              </p>
            </div>
          )}

          {/* Security Notice - Compact */}
          <div className="flex items-center space-x-2 mt-4 p-2 bg-green-50 rounded-lg">
            <Lock className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-800">
              Secure payment powered by Stripe
            </span>
          </div>

          {/* Payment Button - Simplified */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc))}
            className="w-full mt-4 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ${plan.price.monthly}/month</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
