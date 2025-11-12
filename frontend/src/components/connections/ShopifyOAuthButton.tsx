import React, { useState } from 'react';
import { API_URL } from '../../config/constants';
import { ShoppingCart, Loader2, ExternalLink } from 'lucide-react';

interface ShopifyOAuthButtonProps {
  onSuccess?: (connectionId: string) => void;
  onError?: (error: string) => void;
  chatbotId?: string;
}

const ShopifyOAuthButton: React.FC<ShopifyOAuthButtonProps> = ({ onSuccess, onError, chatbotId }) => {
  const [shop, setShop] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleConnect = async () => {
    if (!shop) {
      onError?.('Please enter your shop URL');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/shopify/oauth/install`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ shop, chatbotId })
      });

      const data = await response.json();

      if (response.status === 403) {
        // Plan limit reached
        throw new Error(data.error || 'Connection limit reached. Please upgrade your plan.');
      }

      if (data.success && data.data.installUrl) {
        // Redirect to Shopify OAuth page
        window.location.href = data.data.installUrl;
      } else {
        throw new Error(data.error || 'Failed to get install URL');
      }
    } catch (error: any) {
      console.error('Shopify OAuth error:', error);
      onError?.(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">Connect with Shopify (1-Click OAuth)</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      ) : (
        <div className="bg-white rounded-xl border-2 border-green-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Shopify Store URL
            </label>
            <input
              type="text"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              placeholder="my-store.myshopify.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={loading}
            />
            <p className="mt-2 text-xs text-slate-500">
              Enter your Shopify store URL (e.g., my-store.myshopify.com)
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConnect}
              disabled={loading || !shop}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Connect Shopify</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowInput(false)}
              disabled={loading}
              className="px-4 py-3 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <p className="text-sm text-indigo-800">
              <strong>🔒 Secure OAuth:</strong> You'll be redirected to Shopify to authorize the connection. 
              We'll only request access to read your products and orders.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopifyOAuthButton;

