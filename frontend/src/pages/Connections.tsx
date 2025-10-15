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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
    
    // Check for OAuth callback success/error
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const connectionId = searchParams.get('connectionId');
    const platform = searchParams.get('platform');

    console.log('🔍 OAuth callback params:', { success, error, connectionId, platform });

    if (success === 'true' && connectionId) {
      console.log('✅ OAuth success detected, connectionId:', connectionId);
      setSuccessConnectionId(connectionId);
      setShowWidgetModal(true);
      setShowSuccessMessage(true);
      
      // Refresh connections list immediately
      fetchConnections();
      
      // Clean URL parameters after a delay
      setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        setShowSuccessMessage(false);
      }, 5000);
    }

    if (error) {
      console.error('❌ OAuth error:', error);
      alert(`Connection failed: ${error}`);
      
      // Clean URL parameters
      setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }, 2000);
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

      if (!response.ok) {
        console.error('❌ Failed to fetch connections:', response.status, response.statusText);
        throw new Error('Failed to fetch connections');
      }

      const data = await response.json();
      console.log('📊 Raw API response:', data);
      
      const connectionsData = data.data?.connections || data.connections || [];
      console.log('✅ Connections fetched:', connectionsData.length, 'connections');
      console.log('📋 Connection details:', connectionsData);
      setConnections(connectionsData);
    } catch (error) {
      console.error('❌ Failed to fetch connections:', error);
      setConnections([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConnection = (connectionId: string) => {
    setConnectionToDelete(connectionId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteConnection = async () => {
    if (!connectionToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/connections/${connectionToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete connection');
      }

      await fetchConnections();
      setShowDeleteConfirm(false);
      setConnectionToDelete(null);
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
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Store Connected Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your store has been connected. You can now view the widget code and installation instructions.</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
              {connections && connections.length > 0 ? connections.map((connection) => (
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
              )) : (
                <div className="text-center py-8 text-gray-500">
                  No connections found
                </div>
              )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Disconnect Store</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to disconnect this store? You'll need to reconnect it to use the chatbot widget.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConnectionToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteConnection}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsNew;