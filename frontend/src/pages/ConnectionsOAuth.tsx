import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';
import ShopifyOAuthButton from '../components/connections/ShopifyOAuthButton';
import WooCommerceConnectForm from '../components/connections/WooCommerceConnectForm';
import WidgetInstructions from '../components/connections/WidgetInstructions';
import { 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface Connection {
  id: string;
  platform: string;
  storeName: string;
  domain: string;
  status: string;
  productsCount: number;
  ordersCount: number;
  lastSync: string;
}

const ConnectionsOAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'shopify' | 'woocommerce' | null>(null);
  const [successConnectionId, setSuccessConnectionId] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
    
    // Check for OAuth callback success/error
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const connectionId = searchParams.get('connectionId');

    if (success === 'true' && connectionId) {
      setSuccessConnectionId(connectionId);
      fetchConnections(); // Refresh list
    }

    if (error) {
      alert(`Connection failed: ${error}`);
    }
  }, [searchParams]);

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/connections`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch connections');

      const data = await response.json();
      // Handle both data formats
      const connectionsData = data.data?.connections || data.connections || [];
      setConnections(connectionsData);
    } catch (error) {
      console.error('Failed to fetch connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect this store?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_URL}/api/connections/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      fetchConnections();
    } catch (error) {
      console.error('Failed to delete connection:', error);
      alert('Failed to disconnect store');
    }
  };

  const handleShopifySuccess = (connectionId: string) => {
    setSuccessConnectionId(connectionId);
    setShowAddConnection(false);
    fetchConnections();
  };

  const handleWooCommerceSuccess = (connectionId: string) => {
    setSuccessConnectionId(connectionId);
    setShowAddConnection(false);
    fetchConnections();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Connections</h1>
            <p className="text-gray-600 mt-2">Connect your eCommerce stores with 1-click OAuth</p>
          </div>

          {!showAddConnection && (
            <button
              onClick={() => setShowAddConnection(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Connection
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Add Connection Section */}
        {showAddConnection && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add New Connection</h2>
              <button
                onClick={() => {
                  setShowAddConnection(false);
                  setSelectedPlatform(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>

            {!selectedPlatform ? (
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedPlatform('shopify')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
                >
                  <ShoppingCart className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Shopify</h3>
                  <p className="text-sm text-gray-600">
                    Connect via 1-click OAuth - No API keys needed!
                  </p>
                </button>

                <button
                  onClick={() => setSelectedPlatform('woocommerce')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                >
                  <ShoppingCart className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">WooCommerce</h3>
                  <p className="text-sm text-gray-600">
                    Connect with Consumer Key & Secret
                  </p>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPlatform === 'shopify' && (
                  <ShopifyOAuthButton
                    onSuccess={handleShopifySuccess}
                    onError={(error) => alert(error)}
                  />
                )}

                {selectedPlatform === 'woocommerce' && (
                  <WooCommerceConnectForm
                    onSuccess={handleWooCommerceSuccess}
                    onError={(error) => alert(error)}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Success Widget Display */}
        {successConnectionId && (
          <WidgetInstructions connectionId={successConnectionId} />
        )}

        {/* Existing Connections */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Connected Stores</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading connections...</p>
            </div>
          ) : connections.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No stores connected yet</p>
              <button
                onClick={() => setShowAddConnection(true)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Connect Your First Store
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">{connection.storeName}</h3>
                        {connection.status === 'connected' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Connected
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{connection.domain}</p>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Products</p>
                          <p className="font-semibold">{connection.productsCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Orders</p>
                          <p className="font-semibold">{connection.ordersCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Sync</p>
                          <p className="font-semibold text-xs">
                            {new Date(connection.lastSync).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSuccessConnectionId(connection.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View widget code"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteConnection(connection.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Disconnect"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsOAuth;

