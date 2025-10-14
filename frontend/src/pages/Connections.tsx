import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from '../config/constants';
import ShopifyOAuthButton from '../components/connections/ShopifyOAuthButton';
import WooCommerceConnectForm from '../components/connections/WooCommerceConnectForm';
import WidgetInstructions from '../components/connections/WidgetInstructions';
import { 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Settings,
  Globe,
  Database,
  X
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useChatbot } from '../contexts/ChatbotContext';
import ChatbotSelector from '../components/ChatbotSelector';

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

const ConnectionsNew: React.FC = () => {
  const { user } = useUser();
  const { selectedChatbotId, chatbots } = useChatbot();
  const [searchParams] = useSearchParams();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'shopify' | 'woocommerce' | null>(null);
  const [successConnectionId, setSuccessConnectionId] = useState<string | null>(null);
  const [showWidgetModal, setShowWidgetModal] = useState(false);

  useEffect(() => {
    fetchConnections();
    
    // Check for OAuth callback success/error
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const connectionId = searchParams.get('connectionId');

    console.log('🔍 OAuth callback params:', { success, error, connectionId });

    if (success === 'true' && connectionId) {
      console.log('✅ OAuth success detected, connectionId:', connectionId);
      setSuccessConnectionId(connectionId);
      setShowWidgetModal(true);
      fetchConnections(); // Refresh list
    }

    if (error) {
      console.error('❌ OAuth error:', error);
      alert(`Connection failed: ${error}`);
    }
  }, [searchParams, selectedChatbotId]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      console.log('🔄 Fetching connections...');
      
      const response = await fetch(`${API_URL}/api/connections`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch connections');

      const data = await response.json();
      const connectionsData = data.data?.connections || data.connections || [];
      console.log('✅ Connections fetched:', connectionsData);
      setConnections(connectionsData);
    } catch (error) {
      console.error('❌ Failed to fetch connections:', error);
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
    setShowWidgetModal(true);
    fetchConnections();
  };

  const handleWooCommerceSuccess = (connectionId: string) => {
    setSuccessConnectionId(connectionId);
    setShowAddConnection(false);
    setShowWidgetModal(true);
    fetchConnections();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'shopify': return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'woocommerce': return <Globe className="w-5 h-5 text-blue-600" />;
      default: return <Database className="w-5 h-5 text-purple-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-700';
      case 'disconnected': return 'bg-red-100 text-red-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-xl font-medium">Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Connections</h1>
            <p className="text-gray-600 mt-2">Connect your eCommerce stores with 1-click OAuth</p>
          </div>

          <div className="flex items-center gap-4">
            <ChatbotSelector />
            <button
              onClick={fetchConnections}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
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
                <X className="w-5 h-5" />
              </button>
            </div>

            {!selectedPlatform ? (
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => setSelectedPlatform('shopify')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <ShoppingCart className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Shopify</h3>
                      <p className="text-sm text-gray-600">1-click OAuth connection</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect via OAuth - No API keys needed! Just enter your store URL and authorize.
                  </p>
                </button>

                <button
                  onClick={() => setSelectedPlatform('woocommerce')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Globe className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">WooCommerce</h3>
                      <p className="text-sm text-gray-600">API credentials connection</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect with Consumer Key & Secret from your WooCommerce REST API settings.
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

        {/* Existing Connections */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Connected Stores</h2>

          {connections.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No stores connected yet</p>
              <p className="text-gray-500 mb-6">Connect your first store to get started</p>
              <button
                onClick={() => setShowAddConnection(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                        {getPlatformIcon(connection.platform)}
                        <h3 className="font-semibold text-lg">{connection.storeName}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(connection.status)}`}>
                          <CheckCircle className="w-3 h-3" />
                          {connection.status}
                        </span>
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
                        onClick={() => {
                          setSuccessConnectionId(connection.id);
                          setShowWidgetModal(true);
                        }}
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

      {/* Widget Instructions Modal */}
      {showWidgetModal && successConnectionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Widget Installation</h2>
                <button
                  onClick={() => {
                    setShowWidgetModal(false);
                    setSuccessConnectionId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <WidgetInstructions connectionId={successConnectionId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsNew;