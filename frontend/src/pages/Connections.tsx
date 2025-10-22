import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from '../config/constants';

// Dichiarazione TypeScript per window.AIOrchestratorConfig
declare global {
  interface Window {
    AIOrchestratorConfig?: {
      chatbotId: string;
      apiKey: string;
      theme: string;
      title: string;
      placeholder: string;
      showAvatar: boolean;
      welcomeMessage: string;
      primaryLanguage: string;
      primaryColor: string;
      primaryDarkColor: string;
      headerLightColor: string;
      headerDarkColor: string;
      textColor: string;
      accentColor: string;
    };
  }
}
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
      // Show error notification instead of alert
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      // Clean URL parameters
      setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }, 2000);
    }
  }, [searchParams, selectedChatbotId]);

  // Reload connections when chatbot changes
  useEffect(() => {
    fetchConnections();
  }, [selectedChatbotId]);

  const fetchConnections = async () => {
    try {
      setConnectionsLoading(true);
      const token = localStorage.getItem('authToken');
      console.log('🔄 Fetching connections for chatbot:', selectedChatbotId);
      
      // Build URL with chatbot filter if a chatbot is selected
      const url = selectedChatbotId 
        ? `${API_URL}/api/connections?chatbotId=${selectedChatbotId}`
        : `${API_URL}/api/connections`;
      
      const response = await fetch(url, {
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

      const result = await response.json();
      
      await fetchConnections();
      setShowDeleteConfirm(false);
      setConnectionToDelete(null);
      
      // Show success message with auto-uninstall info
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error) {
      console.error('Failed to delete connection:', error);
      // Show error notification instead of alert
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
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
      // Show error notification instead of alert
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
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

      // 🔥 LEGGI LA CONFIGURAZIONE DAL LIVE EMBED (coordinamento in tempo reale)
      let liveConfig = null;
      try {
        // Prova a leggere la configurazione dal live embed
        console.log('🔍 Controllo window.AIOrchestratorConfig:', window.AIOrchestratorConfig);
        if (window.AIOrchestratorConfig) {
          liveConfig = window.AIOrchestratorConfig;
          console.log('🎯 Configurazione live embed trovata:', liveConfig);
        } else {
          console.log('⚠️ Configurazione live embed non trovata, uso default');
        }
      } catch (error) {
        console.log('⚠️ Errore lettura configurazione live embed:', error);
      }

      // Crea la configurazione per il widget (usa live config se disponibile)
      const widgetConfig = liveConfig ? {
        theme: liveConfig.theme || 'teal',
        title: liveConfig.title || chatbot.name || 'AI Support',
        placeholder: liveConfig.placeholder || 'Type your message...',
        showAvatar: liveConfig.showAvatar !== false,
        welcomeMessage: liveConfig.welcomeMessage || chatbot.welcomeMessage || 'Hello! How can I help you today?',
        primaryLanguage: liveConfig.primaryLanguage || chatbot.language || 'en',
        primaryColor: liveConfig.primaryColor || '#14b8a6',
        primaryDarkColor: liveConfig.primaryDarkColor || '#0d9488',
        headerLightColor: liveConfig.headerLightColor || '#14b8a6',
        headerDarkColor: liveConfig.headerDarkColor || '#0d9488',
        textColor: liveConfig.textColor || '#1f2937',
        accentColor: liveConfig.accentColor || '#14b8a6',
        autoOpen: liveConfig.autoOpen === true
      } : {
        // Fallback se non c'è configurazione live
        theme: 'teal',
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
        accentColor: '#14b8a6',
        autoOpen: false
      };

      console.log('🚀 Configurazione widget finale:', widgetConfig);

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
        if (result.data?.autoInstalled) {
          // Show success notification instead of alert
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 5000);
        } else if (result.data?.alreadyInstalled) {
          // Show info notification
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 5000);
        } else if (result.data?.requiresManualInstallation) {
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
          // Show success notification
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 5000);
        }
      } else {
        // Show error notification instead of alert
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
    } catch (error) {
      console.error('❌ Errore installazione widget:', error);
      // Show error notification instead of alert
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-4 lg:mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Shopify Integration</h1>
            <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base hidden sm:block">Connect your Shopify store for seamless AI-powered customer support</p>
            </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-4 w-full lg:w-auto">
              <div className="w-full sm:w-auto">
                <ChatbotSelector />
              </div>
              <button
                onClick={fetchConnections}
              className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md lg:rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
              >
              <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>Refresh</span>
              </button>
            {!showAddConnection && (
              <button
                onClick={() => setShowAddConnection(true)}
                className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-md lg:rounded-lg hover:bg-green-700 transition-colors shadow-lg text-sm lg:text-base"
              >
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Connect </span>Shopify Store
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
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add New Connection</h2>
                <button
                onClick={() => setShowAddConnection(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
            </div>

            {/* Shopify Connection - Direct Integration */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Shopify Store</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Connect your Shopify store in seconds with our 1-click OAuth integration. 
                  No API keys needed - just authorize and you're ready to go!
                </p>
              </div>

              <ShopifyOAuthButton
                chatbotId={selectedChatbotId}
                onSuccess={handleShopifySuccess}
                onError={(error) => {
                  // Show error notification instead of alert
                  setShowSuccessMessage(true);
                  setTimeout(() => setShowSuccessMessage(false), 5000);
                }}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Other platforms?</p>
                    <p>For WooCommerce, WordPress, or any other website, use our <strong>Universal Embed Code</strong> from the Chatbot page.</p>
                  </div>
                </div>
              </div>
            </div>
                  </div>
        )}

        {/* Existing Connections */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Connected Shopify Stores</h2>

          {connections.length === 0 ? (
            <div className="text-center py-6 lg:py-12">
              <ShoppingCart className="w-10 h-10 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-3 lg:mb-4" />
              <p className="text-gray-600 text-sm lg:text-lg mb-2">No Shopify stores connected yet</p>
              <p className="text-gray-500 mb-4 lg:mb-6 text-xs lg:text-base">Connect your first Shopify store to get started</p>
                  <button
                onClick={() => setShowAddConnection(true)}
                className="px-4 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-md lg:rounded-lg hover:bg-green-700 transition-colors text-sm lg:text-base"
              >
                Connect Your First Shopify Store
                  </button>
          </div>
        ) : (
            <div className="grid gap-4">
              {connectionsLoading ? (
                <div className="text-center py-6 lg:py-8">
                  <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2 text-sm lg:text-base">Loading connections...</p>
                </div>
              ) : connections && Array.isArray(connections) && connections.length > 0 ? connections.map((connection) => {
                if (!connection) return null;
                return (
                <div
                  key={connection.id}
                  className="border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-3 lg:space-y-0">
                    <div className="flex-1 w-full lg:w-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {getPlatformIcon(connection.platform)}
                          <h3 className="font-semibold text-base lg:text-lg">{connection.storeName}</h3>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${getStatusColor(connection.status)}`}>
                          <CheckCircle className="w-3 h-3" />
                          {connection.status}
                        </span>
                      </div>
                      
                      <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">{connection.domain}</p>

                      <div className="grid grid-cols-3 gap-2 lg:gap-4 text-xs lg:text-sm">
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
                          <p className="font-semibold text-[10px] lg:text-xs">
                            {new Date(connection.lastSync).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full lg:w-auto">
                        <button
                        onClick={() => handleInstallWidget(connection)}
                        disabled={installingWidget === connection.id}
                        className="flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-green-600 text-white text-xs lg:text-sm rounded-md lg:rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 lg:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Install widget automatically"
                      >
                        {installingWidget === connection.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-b-2 border-white"></div>
                            <span className="hidden sm:inline">Installing...</span>
                            <span className="sm:hidden">Installing</span>
                          </>
                        ) : (
                          <>
                            <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span className="hidden sm:inline">Install Widget</span>
                            <span className="sm:hidden">Install</span>
                          </>
                        )}
                      </button>
                      
                      
                        <button
                        onClick={() => handleDeleteConnection(connection.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md lg:rounded-lg"
                          title="Disconnect"
                        >
                        <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 lg:p-6">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Widget Installation</h2>
                <button
                  onClick={() => {
                    setShowWidgetModal(false);
                    setSuccessConnectionId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
              <WidgetInstructions connectionId={successConnectionId} />
                    </div>
                    </div>
                    </div>
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                    </div>
                    <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900">Disconnect Store</h3>
                  <p className="text-xs lg:text-sm text-gray-600">This action cannot be undone</p>
                    </div>
                    </div>
              
              <p className="text-gray-700 mb-4 lg:mb-6 text-sm lg:text-base">
                Are you sure you want to disconnect this store? You'll need to reconnect it to use the chatbot widget.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                  <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConnectionToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md lg:rounded-lg transition-colors text-sm lg:text-base"
                  >
                    Cancel
                  </button>
                  <button
                  onClick={confirmDeleteConnection}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md lg:rounded-lg transition-colors text-sm lg:text-base"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-4 lg:px-8 py-4 lg:py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 lg:gap-4">
                    <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Settings className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-3xl font-bold text-white">Widget Installation</h2>
                      <p className="text-teal-100 text-sm lg:text-base">Copy the code below to your Shopify theme</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInstallInstructions(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 lg:p-3 transition-colors"
                  >
                    <X className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 lg:p-8 overflow-y-auto max-h-[calc(95vh-180px)]">
                {/* Success Message */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg lg:rounded-xl p-4 lg:p-6 mb-6 lg:mb-8">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm lg:text-lg font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-800 mb-2 text-base lg:text-lg">Widget Code Generated Successfully!</h3>
                      <p className="text-emerald-700 text-sm lg:text-base">
                        This code matches your Quick Embed configuration and is ready to install.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="mb-6 lg:mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 lg:mb-6 flex items-center gap-3 lg:gap-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm lg:text-lg font-bold">1</div>
                    <span className="text-lg lg:text-xl">Installation Steps</span>
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {installInstructions.instructions.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 lg:gap-4 p-4 lg:p-6 bg-gray-50 rounded-lg lg:rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs lg:text-sm font-bold flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm lg:text-base leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Section */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 lg:mb-6 flex items-center gap-3 lg:gap-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm lg:text-lg font-bold">2</div>
                    <span className="text-lg lg:text-xl">Copy This Code</span>
                  </h3>
                  <div className="relative">
                    <div className="bg-gray-900 rounded-lg lg:rounded-xl p-4 lg:p-6 overflow-x-auto border-2 border-gray-300">
                      <pre className="text-emerald-400 text-xs lg:text-sm font-mono whitespace-pre-wrap leading-relaxed">
                        {installInstructions.embedCode}
                      </pre>
                    </div>
                    <div className="absolute top-2 right-2 lg:top-4 lg:right-4">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(installInstructions.embedCode);
                          // Show success feedback
                          const btn = event.target as HTMLButtonElement;
                          const originalText = btn.textContent;
                          btn.textContent = 'Copied!';
                          btn.className = 'bg-emerald-600 hover:bg-emerald-700 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-md lg:rounded-lg text-xs lg:text-sm font-medium transition-colors';
                          setTimeout(() => {
                            btn.textContent = originalText;
                            btn.className = 'bg-gray-700 hover:bg-gray-600 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-md lg:rounded-lg text-xs lg:text-sm font-medium transition-colors';
                          }, 2000);
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-md lg:rounded-lg text-xs lg:text-sm font-medium transition-colors"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm lg:text-base mt-3 lg:mt-4 flex items-center gap-2">
                    <span className="text-emerald-500 text-base lg:text-lg">✓</span>
                    Code automatically copied to your clipboard!
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 lg:px-8 py-4 lg:py-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 space-y-3 sm:space-y-0">
                <div className="text-sm lg:text-base text-gray-500">
                  💡 This code matches your Quick Embed configuration
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setShowInstallInstructions(false)}
                    className="px-4 lg:px-8 py-2 lg:py-3 text-gray-600 hover:bg-gray-200 rounded-md lg:rounded-lg transition-colors font-medium text-sm lg:text-base w-full sm:w-auto"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(installInstructions.embedCode);
                      setShowInstallInstructions(false);
                    }}
                    className="px-4 lg:px-8 py-2 lg:py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-md lg:rounded-lg transition-colors flex items-center justify-center gap-2 lg:gap-3 font-medium text-sm lg:text-base w-full sm:w-auto"
                  >
                    <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                    Copy & Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Connections;