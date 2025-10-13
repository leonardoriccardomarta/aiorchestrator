import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CreditCard, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAnimation } from '../../contexts/AnimationContextHooks';
import { Toast } from '../ui/Toast';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

interface PaymentMethodManagerProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: () => void;
  onRemovePaymentMethod: (id: string) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
}

export const PaymentMethodManager: React.FC<PaymentMethodManagerProps> = ({
  paymentMethods,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onSetDefaultPaymentMethod,
}) => {
  const [_showDeleteModal, setShowDeleteModal] = useState(false);
  const [_selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [_showToast, setShowToast] = useState(false);
  const [_toastMessage, setToastMessage] = useState('');
  const { getAnimationVariant } = useAnimation();

  const handleDelete = (id: string) => {
    setSelectedMethodId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (_selectedMethodId) {
      onRemovePaymentMethod(_selectedMethodId);
      setShowToast(true);
      setToastMessage('Payment method removed successfully');
    }
    setShowDeleteModal(false);
    setSelectedMethodId(null);
  };

  const handleSetDefault = (id: string) => {
    onSetDefaultPaymentMethod(id);
    setShowToast(true);
    setToastMessage('Default payment method updated');
  };

  const getCardIcon = () => {
    // In a real app, you would import and use actual card brand SVGs
    return <CreditCard className="h-6 w-6" />;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
            <Button onClick={onAddPaymentMethod}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  variants={getAnimationVariant('listItem')}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getCardIcon()}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium capitalize">{method.type}</span>
                        <span className="text-sm text-gray-500">•••• {method.last4}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Expires {method.expMonth}/{method.expYear}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    {method.isDefault && (
                      <span className="flex items-center text-sm text-primary-600 dark:text-primary-400">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Default
                      </span>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                      disabled={method.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {paymentMethods.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No payment methods added yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={_showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Payment Method"
        description="Are you sure you want to remove this payment method? This action cannot be undone."
      >
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Remove
          </Button>
        </div>
      </Modal>

      {_showToast && (
        <Toast
          id="payment-method-toast"
          title="Success"
          message={_toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}; 