import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from '../config/constants';
import ShopifyOAuthButton from '../components/connections/ShopifyOAuthButton';
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
  accessToken?: string;
}

const Connections: React.FC = () => {
  const { user } = useUser();
  const { selectedChatbotId, chatbots } = useChatbot();
  const [searchParams] = useSearchParams();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'shopify' | null>(null);
  const [successConnectionId, setSuccessConnectionId] = useState<string | null>(null);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState<string | null>(null);
  const [installingWidget, setInstallingWidget] = useState<string | null>(null);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [installInstructions, setInstallInstructions] = useState<any>(null);

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
      setConnectionsLoading(true);
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
      
      if (Array.isArray(connectionsData)) {
        setConnections(connectionsData);
      } else {
        console.error('❌ Connections data is not an array:', connectionsData);
        setConnections([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch connections:', error);
      setConnections([]); // Set empty array on error
    } finally {
      setConnectionsLoading(false);
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

  const handleInstallWidget = async (connection: Connection) => {
    if (!selectedChatbotId) {
      alert('Please select a chatbot first');
      return;
    }

    setInstallingWidget(connection.id);
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Ottieni la configurazione del chatbot selezionato
      const chatbot = chatbots.find(c => c.id === selectedChatbotId);
      if (!chatbot) {
        throw new Error('Chatbot not found');
      }

      // Crea la configurazione per il widget
      const widgetConfig = {
        theme: 'teal', // Default theme, puoi estenderlo
        title: chatbot.name || 'AI Support',
        placeholder: 'Type your message...',
        showAvatar: true,
        welcomeMessage: chatbot.welcomeMessage || 'Hello! How can I help you today?',
        primaryLanguage: chatbot.language || 'en',
        primaryColor: '#14b8a6',
        primaryDarkColor: '#0d9488',
        headerLightColor: '#14b8a6',
        headerDarkColor: '#0d9488',
        textColor: '#1f2937',
        accentColor: '#14b8a6'
      };

      const response = await fetch(`${API_URL}/api/connections/install-widget`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          connectionId: connection.id,
          chatbotId: selectedChatbotId,
          widgetConfig: widgetConfig
        })
      });

      const result = await response.json();
      
      if (result.success) {
        if (result.data?.requiresManualInstallation) {
          // Show professional modal with instructions and embed code
          setInstallInstructions(result.data);
          setShowInstallInstructions(true);
          
          // Copy to clipboard
          navigator.clipboard.writeText(result.data.embedCode).then(() => {
            console.log('✅ Code copied to clipboard!');
          }).catch(err => {
            console.error('Failed to copy:', err);
          });
        } else {
          alert('✅ Widget installato con successo! Vai sul tuo store per vederlo.');
        }
      } else {
        alert('❌ Errore: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Errore installazione widget:', error);
      alert('❌ Errore durante l\'installazione: ' + error.message);
    } finally {
      setInstallingWidget(null);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopify Integration</h1>
            <p className="text-gray-600 mt-2">Connect your Shopify store for seamless AI-powered customer support</p>
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
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Connect Shopify Store
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
                onClick={() => setShowAddConnection(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
                </button>
            </div>

            {/* Shopify Connection - Direct Integration */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <ShoppingCart className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Shopify Store</h3>
                <p className="text-gray-600 mb-6">
                  Connect your Shopify store in seconds with our 1-click OAuth integration. 
                  No API keys needed - just authorize and you're ready to go!
                </p>
              </div>

              <ShopifyOAuthButton
                onSuccess={handleShopifySuccess}
                onError={(error) => alert(error)}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Other platforms?</p>
                    <p>For WooCommerce, WordPress, or any other website, use our <strong>Universal Embed Code</strong> from the Chatbot page.</p>
                  </div>
                </div>
              </div>
            </div>
                  </div>
        )}

        {/* Existing Connections */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Connected Shopify Stores</h2>

          {connections.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No Shopify stores connected yet</p>
              <p className="text-gray-500 mb-6">Connect your first Shopify store to get started</p>
                  <button
                onClick={() => setShowAddConnection(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Connect Your First Shopify Store
                  </button>
          </div>
        ) : (
            <div className="grid gap-4">
              {connectionsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading connections...</p>
                </div>
              ) : connections && Array.isArray(connections) && connections.length > 0 ? connections.map((connection) => {
                if (!connection) return null;
                return (
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
                        onClick={() => handleInstallWidget(connection)}
                        disabled={installingWidget === connection.id}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Install widget automatically"
                      >
                        {installingWidget === connection.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Installing...
                          </>
                        ) : (
                          <>
                            <Settings className="w-4 h-4" />
                            Install Widget
                          </>
                        )}
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
                );
              }) : (
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

        {/* Install Instructions Modal */}
        {showInstallInstructions && installInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Widget Ready!</h2>
                      <p className="text-green-100 text-sm">Follow these steps to install</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInstallInstructions(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-1">Manual Installation Required</h3>
                      <p className="text-amber-700 text-sm">
                        Shopify blocks automatic theme modification for security. 
                        Don't worry, it's just a few clicks!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    Installation Steps
                  </h3>
                  <div className="space-y-3">
                    {installInstructions.instructions.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Section */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    Copy This Code
                  </h3>
                  <div className="relative">
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                        {installInstructions.embedCode}
                      </pre>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(installInstructions.embedCode);
                          // You could add a toast notification here
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    💡 Code is already copied to your clipboard!
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowInstallInstructions(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(installInstructions.embedCode);
                    setShowInstallInstructions(false);
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Copy & Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Connections;