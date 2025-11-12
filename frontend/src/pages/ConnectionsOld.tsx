import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { useSearchParams } from 'react-router-dom';
import ShopifyOAuthButton from '../components/connections/ShopifyOAuthButton';
import WooCommerceConnectForm from '../components/connections/WooCommerceConnectForm';
import WidgetInstructions from '../components/connections/WidgetInstructions';
import { 
  ShoppingCart, 
  Globe, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Plus,
  RefreshCw,
  Database,
  Zap,
  Shield,
  Activity,
  BarChart3,
  Users,
  Package,
  DollarSign,
  ArrowRight,
  Copy,
  Trash2,
  Edit,
  Eye,
  X,
  HelpCircle
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useChatbot } from '../contexts/ChatbotContext';
import ChatbotSelector from '../components/ChatbotSelector';
import StoreConnectionsTour from '../components/StoreConnectionsTour';
import PlanLimitations from '../components/PlanLimitations';
import TourButton from '../components/TourButton';

interface Connection {
  id: string;
  name: string;
  type: 'shopify' | 'woocommerce' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  url: string;
  lastSync: string;
  productsCount: number;
  ordersCount: number;
  revenue: number;
  settings: {
    autoSync: boolean;
    syncInterval: string;
    webhookUrl: string;
    apiKey: string;
    secretKey: string;
  };
  stats: {
    totalProducts: number;
    syncedProducts: number;
    totalOrders: number;
    syncedOrders: number;
    lastError?: string;
  };
}

const Connections: React.FC = () => {
  const { user } = useUser();
  const { selectedChatbotId, chatbots } = useChatbot();
  const [searchParams] = useSearchParams();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'shopify' | 'woocommerce' | 'custom'>('shopify');
  const [showTour, setShowTour] = useState(false);
  const [selectedConnectionForWidget, setSelectedConnectionForWidget] = useState<string | null>(null);
  const [useOAuth, setUseOAuth] = useState(true);

  useEffect(() => {
    fetchConnections();
    
    // Check for OAuth callback success/error
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const connectionId = searchParams.get('connectionId');

    if (success === 'true' && connectionId) {
      setSelectedConnectionForWidget(connectionId);
      fetchConnections(); // Refresh list
    }

    if (error) {
      alert(`Connection failed: ${error}`);
    }
  }, [selectedChatbotId, searchParams]); // Reload when chatbot changes

  const fetchConnections = async () => {
    try {
      setLoading(true);
      // Filter by selected chatbot
      const url = selectedChatbotId 
        ? `${API_URL}/api/connections?chatbotId=${selectedChatbotId}`
        : `${API_URL}/api/connections`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || []);
      } else {
        // Fallback to empty state for new users
        setConnections([]);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const connectStore = async (type: string, credentials: any) => {
    try {
      const response = await fetch(`${API_URL}/api/connections/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          type,
          ...credentials
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConnections(prev => [...prev, data.connection]);
        setShowConnectModal(false);
      }
    } catch (error) {
      console.error('Error connecting store:', error);
    }
  };

  const syncConnection = async (connectionId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/connections/${connectionId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        fetchConnections(); // Refresh data
      }
    } catch (error) {
      console.error('Error syncing connection:', error);
    }
  };

  const disconnectStore = async (connectionId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/connections/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      }
    } catch (error) {
      console.error('Error disconnecting store:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-slate-100 text-slate-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shopify': return <ShoppingCart className="w-6 h-6" />;
      case 'woocommerce': return <Globe className="w-6 h-6" />;
      case 'custom': return <Database className="w-6 h-6" />;
      default: return <Database className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'shopify': return 'bg-green-500';
      case 'woocommerce': return 'bg-indigo-500';
      case 'custom': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Database className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-600 text-xl font-medium">Loading connections...</p>
          <p className="mt-2 text-slate-500">Checking your store integrations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div data-tour="connections-header">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Store Connections</h1>
              <p className="text-slate-600 text-lg">Connect your e-commerce stores for seamless integration</p>
            </div>
            <div className="flex items-center space-x-4">
              <ChatbotSelector />
              <TourButton onClick={() => setShowTour(true)} />
              <button
                onClick={fetchConnections}
                data-tour="refresh-btn"
                className="flex items-center px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowConnectModal(true)}
                data-tour="connect-store-btn"
                className="flex items-center px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Connect Store
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {connections.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">No store connections yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Connect your Shopify, WooCommerce, or custom store to start syncing products and orders with your AI chatbots.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto" data-tour="store-types">
              {/* Shopify */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">Shopify</h4>
                <p className="text-slate-600 mb-6">Connect your Shopify store for automatic product and order sync.</p>
                <button
                  onClick={() => {
                    setSelectedType('shopify');
                    setShowConnectModal(true);
                  }}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  Connect Shopify
                </button>
              </div>

              {/* WooCommerce */}
              <PlanLimitations feature="WooCommerce Connection" requiredPlan="professional">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-2">WooCommerce</h4>
                  <p className="text-slate-600 mb-6">Integrate with your WooCommerce store for seamless data sync.</p>
                  <button
                    onClick={() => {
                      setSelectedType('woocommerce');
                      setShowConnectModal(true);
                    }}
                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Connect WooCommerce
                  </button>
                </div>
              </PlanLimitations>

              {/* Custom */}
              <PlanLimitations feature="Custom Store Connection" requiredPlan="enterprise">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-2">Custom Store</h4>
                  <p className="text-slate-600 mb-6">Connect any custom e-commerce solution via API.</p>
                  <button
                    onClick={() => {
                      setSelectedType('custom');
                      setShowConnectModal(true);
                    }}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                  >
                    Connect Custom
                  </button>
                </div>
              </PlanLimitations>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Connections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {connections.map((connection) => (
                <div key={connection.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${getTypeColor(connection.type)} rounded-xl flex items-center justify-center`}>
                          {getTypeIcon(connection.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{connection.name}</h4>
                          <p className="text-sm text-slate-600 capitalize">{connection.type} Store</p>
                          <p className="text-xs text-slate-500">{connection.url}</p>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(connection.status)}`}>
                        {getStatusIcon(connection.status)}
                        <span className="capitalize">{connection.status}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900">{connection.stats.syncedProducts.toLocaleString()}</div>
                        <div className="text-xs text-slate-600">Products Synced</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{connection.stats.syncedOrders.toLocaleString()}</div>
                        <div className="text-xs text-slate-600">Orders Synced</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">${connection.revenue.toLocaleString()}</div>
                        <div className="text-xs text-slate-600">Revenue</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => syncConnection(connection.id)}
                          className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Sync Now
                        </button>
                        <button className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => window.open(connection.url, '_blank')}
                          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                          title="View store"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => disconnectStore(connection.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          title="Disconnect"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Last Sync */}
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Last sync: {connection.lastSync}</span>
                      </div>
                      {connection.stats.lastError && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>Sync error</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sync Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6" data-tour="sync-status">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Sync Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {connections.reduce((sum, conn) => sum + conn.stats.syncedProducts, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">Total Products Synced</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {connections.reduce((sum, conn) => sum + conn.stats.syncedOrders, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">Total Orders Synced</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    ${connections.reduce((sum, conn) => sum + conn.revenue, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connect Store Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Connect {selectedType === 'shopify' ? 'Shopify' : selectedType === 'woocommerce' ? 'WooCommerce' : 'Custom'} Store
                </h3>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6" data-tour="api-keys-info">
                {selectedType === 'shopify' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Store URL</label>
                      <input
                        type="url"
                        placeholder="https://your-store.myshopify.com"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                      <input
                        type="password"
                        placeholder="Your Shopify API key"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">API Secret</label>
                      <input
                        type="password"
                        placeholder="Your Shopify API secret"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {selectedType === 'woocommerce' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Store URL</label>
                      <input
                        type="url"
                        placeholder="https://your-store.com"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Consumer Key</label>
                      <input
                        type="password"
                        placeholder="Your WooCommerce consumer key"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Consumer Secret</label>
                      <input
                        type="password"
                        placeholder="Your WooCommerce consumer secret"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {selectedType === 'custom' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">API Endpoint</label>
                      <input
                        type="url"
                        placeholder="https://api.your-store.com"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                      <input
                        type="password"
                        placeholder="Your API key"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL</label>
                      <input
                        type="url"
                        placeholder="https://your-webhook-endpoint.com"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
                
                <div className="flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setShowConnectModal(false)}
                    className="px-6 py-3 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle store connection
                      setShowConnectModal(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Connect Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Store Connections Tour */}
      <StoreConnectionsTour 
        isOpen={showTour} 
        onClose={() => setShowTour(false)} 
      />
    </div>
  );
};

export default Connections;
