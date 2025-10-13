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
    cvc: '',
    name: ''
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
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Secure payment powered by Stripe</p>
        </div>

        {/* Plan Summary */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{plan.name} Plan</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${plan.price.monthly}</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>
          <div className="space-y-2">
            {plan.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-6">
          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  P
                </div>
                <span className="font-medium">PayPal</span>
              </button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={19}
                />
              </div>

              {/* Card Details Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      expiry: formatExpiry(e.target.value)
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-white text-2xl font-bold">P</div>
              </div>
              <p className="text-gray-600 mb-4">
                You'll be redirected to PayPal to complete your payment
              </p>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Continue with PayPal
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center space-x-2 mt-6 p-3 bg-green-50 rounded-lg">
            <Lock className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">
              Your payment information is encrypted and secure
            </span>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name))}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
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
