import React, { useState } from 'react';
import { API_URL } from '../../config/constants';
import { ShoppingBag, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface WooCommerceConnectFormProps {
  onSuccess?: (connectionId: string) => void;
  onError?: (error: string) => void;
}

const WooCommerceConnectForm: React.FC<WooCommerceConnectFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    storeUrl: '',
    consumerKey: '',
    consumerSecret: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleConnect = async () => {
    if (!formData.storeUrl || !formData.consumerKey || !formData.consumerSecret) {
      onError?.('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/woocommerce/oauth/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess?.(data.data.connection.id);
      } else {
        throw new Error(data.error || 'Connection failed');
      }
    } catch (error: any) {
      console.error('WooCommerce connect error:', error);
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openWooCommerceGuide = () => {
    window.open('https://woocommerce.com/document/woocommerce-rest-api/', '_blank');
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-semibold">Connect WooCommerce Store</span>
        </button>
      ) : (
        <div className="bg-white rounded-xl border-2 border-purple-200 p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store URL
              </label>
              <input
                type="url"
                value={formData.storeUrl}
                onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                placeholder="https://your-store.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumer Key
              </label>
              <input
                type="text"
                value={formData.consumerKey}
                onChange={(e) => setFormData({ ...formData, consumerKey: e.target.value })}
                placeholder="ck_..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumer Secret
              </label>
              <input
                type="password"
                value={formData.consumerSecret}
                onChange={(e) => setFormData({ ...formData, consumerSecret: e.target.value })}
                placeholder="cs_..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Help */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 mb-2">
              <strong>📚 How to get credentials:</strong>
            </p>
            <ol className="text-xs text-amber-700 space-y-1 ml-4 list-decimal">
              <li>Go to WooCommerce → Settings → Advanced → REST API</li>
              <li>Click "Add key"</li>
              <li>Description: "AI Orchestrator"</li>
              <li>Permissions: Read</li>
              <li>Generate API key</li>
              <li>Copy Consumer Key and Consumer Secret</li>
            </ol>
            <button
              onClick={openWooCommerceGuide}
              className="mt-3 text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Official WooCommerce Guide
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConnect}
              disabled={loading || !formData.storeUrl || !formData.consumerKey || !formData.consumerSecret}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Connect Store</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowForm(false)}
              disabled={loading}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WooCommerceConnectForm;

