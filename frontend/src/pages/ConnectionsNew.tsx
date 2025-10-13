import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  Zap,
  Shield,
  BarChart3,
  Users,
  Package,
  CreditCard,
  Globe,
  Clock,
  Star,
  ArrowRight,
  Loader2,
  XCircle,
  AlertTriangle,
  Plus,
  Monitor,
  Database
} from 'lucide-react';
import { ConnectionLimit } from '../components/PlanLimits';
import { useAuth } from '../contexts/AuthContext';

interface EcommerceConnection {
  id: string;
  platform: 'shopify' | 'woocommerce';
  storeName: string;
  domain: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending' | 'syncing';
  lastSync: string;
  productsCount: number;
  ordersCount: number;
  customersCount: number;
  revenue: number;
  plan?: string;
  region?: string;
  currency: string;
  accessToken?: string;
  shopId?: string;
  webhookUrl?: string;
  // WooCommerce specific
  consumerKey?: string;
  consumerSecret?: string;
  version?: string;
  timezone?: string;
}

interface IntegrationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending' | 'error';
  details?: string;
}

interface Chatbot {
  id: string;
  name: string;
  description: string;
  language: string;
  isActive: boolean;
}

const Connections: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [connections, setConnections] = useState<EcommerceConnection[]>([]);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showIntegrationSteps, setShowIntegrationSteps] = useState(false);
  const [integrationSteps, setIntegrationSteps] = useState<IntegrationStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'shopify' | 'woocommerce' | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchConnections();
    fetchChatbots();
  }, []);

  // Check if user can create more connections
  const canCreateConnection = () => {
    if (!user) return false;
    
    const limits = {
      starter: 1,
      professional: 5,
      enterprise: -1 // unlimited
    };
    
    const limit = limits[user.planId as keyof typeof limits] || 1;
    return limit === -1 || connections.length < limit;
  };

  // Handle connection creation with limit check
  const handleConnectWithLimit = (platform: 'shopify' | 'woocommerce') => {
    if (!canCreateConnection()) {
      setShowUpgrade(true);
      return;
    }
    handleConnect(platform);
  };

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch connections from backend API
      const response = await fetch(`${API_URL}/api/connections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.connections) {
          setConnections(data.data.connections);
        } else {
          // Fallback to localStorage if API fails
          const storedConnections = localStorage.getItem('ecommerce_connections');
          if (storedConnections) {
            setConnections(JSON.parse(storedConnections));
          }
        }
      } else {
        // Fallback to localStorage if API fails
        const storedConnections = localStorage.getItem('ecommerce_connections');
        if (storedConnections) {
          setConnections(JSON.parse(storedConnections));
        }
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      // Fallback to localStorage on error
      const storedConnections = localStorage.getItem('ecommerce_connections');
      if (storedConnections) {
        setConnections(JSON.parse(storedConnections));
      }
      setError('Failed to fetch connection status');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatbots = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/chatbots', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setChatbots(data.data || []);
          // Auto-select first chatbot if available
          if (data.data && data.data.length > 0) {
            setSelectedChatbot(data.data[0]);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching chatbots:', err);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'shopify': return ShoppingCart;
      case 'woocommerce': return Monitor;
      default: return ShoppingCart;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'shopify': return 'bg-green-100 text-green-600';
      case 'woocommerce': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'shopify': return 'Shopify';
      case 'woocommerce': return 'WooCommerce';
      default: return 'E-commerce';
    }
  };

  const handleConnect = async (platform: 'shopify' | 'woocommerce') => {
    try {
      setError(null);
      setSelectedPlatform(platform);
      setShowIntegrationSteps(true);
      
      // Initialize integration steps based on platform
      const steps: IntegrationStep[] = platform === 'shopify' ? [
        {
          id: 'auth',
          title: 'Authenticate with Shopify',
          description: 'Secure OAuth connection to your store',
          icon: Shield,
          status: 'current',
          details: 'Redirecting to Shopify...'
        },
        {
          id: 'permissions',
          title: 'Grant Permissions',
          description: 'Allow access to products, orders, and customers',
          icon: Settings,
          status: 'pending'
        },
        {
          id: 'sync',
          title: 'Initial Data Sync',
          description: 'Importing your store data',
          icon: RefreshCw,
          status: 'pending'
        },
        {
          id: 'webhooks',
          title: 'Setup Webhooks',
          description: 'Real-time data synchronization',
          icon: Zap,
          status: 'pending'
        },
        {
          id: 'complete',
          title: 'Integration Complete',
          description: 'Your store is now connected',
          icon: CheckCircle,
          status: 'pending'
        }
      ] : [
        {
          id: 'auth',
          title: 'Connect to WooCommerce',
          description: 'Enter your store credentials',
          icon: Shield,
          status: 'current',
          details: 'Testing connection...'
        },
        {
          id: 'permissions',
          title: 'Verify API Access',
          description: 'Confirm access to products, orders, and customers',
          icon: Settings,
          status: 'pending'
        },
        {
          id: 'sync',
          title: 'Initial Data Sync',
          description: 'Importing your store data',
          icon: RefreshCw,
          status: 'pending'
        },
        {
          id: 'webhooks',
          title: 'Setup Webhooks',
          description: 'Real-time data synchronization',
          icon: Zap,
          status: 'pending'
        },
        {
          id: 'complete',
          title: 'Integration Complete',
          description: 'Your store is now connected',
          icon: CheckCircle,
          status: 'pending'
        }
      ];
      
      setIntegrationSteps(steps);

      // Real OAuth flow with API call
      if (platform === 'shopify') {
        await realShopifyOAuthFlow();
      } else {
        await realWooCommerceOAuthFlow();
      }
      
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      setError(`Failed to connect to ${platform}. Please try again.`);
      setShowIntegrationSteps(false);
    }
  };

  const realWooCommerceOAuthFlow = async () => {
    try {
      // Step 1: Authentication
      await updateStepStatus('auth', 'current', 'Testing WooCommerce connection...');
      
      // For demo purposes, we'll simulate the WooCommerce connection
      const storeUrl = 'https://demo-store.woocommerce.com';
      const consumerKey = 'ck_demo_key_1234567890abcdef';
      const consumerSecret = 'cs_demo_secret_1234567890abcdef';
      
      await delay(2000);
      await updateStepStatus('auth', 'completed', 'Connection successful');
      
      // Step 2: Permissions
      await updateStepStatus('permissions', 'current', 'Verifying API access...');
      await delay(2000);
      await updateStepStatus('permissions', 'completed', 'API access confirmed');
      
      // Step 3: Data Sync
      await updateStepStatus('sync', 'current', 'Syncing products, orders, and customers...');
      
      // Make real API call to connect
      const response = await fetch(`${API_URL}/api/woocommerce/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeUrl: storeUrl,
          consumerKey: consumerKey,
          consumerSecret: consumerSecret
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to WooCommerce');
      }
      
      const data = await response.json();
      
      await updateStepStatus('sync', 'completed', 'Data sync completed');
      
      // Step 4: Webhooks
      await updateStepStatus('webhooks', 'current', 'Setting up webhooks...');
      await delay(2000);
      await updateStepStatus('webhooks', 'completed', 'Webhooks configured');
      
      // Step 5: Complete
      await updateStepStatus('complete', 'current', 'Integration complete!');
      await delay(1000);
      await updateStepStatus('complete', 'completed', 'Your store is now connected');
      
      // Create connection object from API response
      const newConnection: EcommerceConnection = {
        id: data.connection.id,
        platform: 'woocommerce',
        storeName: data.connection.storeName,
        domain: data.connection.storeUrl,
        status: 'connected',
        lastSync: data.connection.lastSync,
        productsCount: 0, // Will be updated by sync
        ordersCount: 0,
        customersCount: 0,
        revenue: 0,
        currency: data.connection.currency,
        consumerKey: data.connection.consumerKey,
        consumerSecret: data.connection.consumerSecret,
        version: data.connection.version,
        timezone: data.connection.timezone
      };
      
      // Add to connections array
      const updatedConnections = [...connections, newConnection];
      setConnections(updatedConnections);
      localStorage.setItem('ecommerce_connections', JSON.stringify(updatedConnections));
      
      // Fetch real data
      await fetchWooCommerceData(data.connection.id);
      
      await delay(1000);
      setShowIntegrationSteps(false);
      
      // Refresh connections to show the new one
      await fetchConnections();
      
    } catch (error) {
      console.error('WooCommerce OAuth flow error:', error);
      await updateStepStatus('auth', 'error', 'Connection failed');
      throw error;
    }
  };

  const realShopifyOAuthFlow = async () => {
    try {
      // Check if chatbot is selected
      if (!selectedChatbot) {
        throw new Error('Please select a chatbot before connecting');
      }
      
      // Step 1: Authentication
      await updateStepStatus('auth', 'current', 'Redirecting to Shopify...');
      
      // For demo purposes, we'll simulate the OAuth flow
      // In production, this would redirect to Shopify OAuth
      const shop = 'fashionforward.myshopify.com';
      const accessToken = 'shpat_demo_token_1234567890abcdef';
      
      await delay(2000);
      await updateStepStatus('auth', 'completed', 'Authentication successful');
      
      // Step 2: Permissions
      await updateStepStatus('permissions', 'current', 'Requesting permissions...');
      await delay(2000);
      await updateStepStatus('permissions', 'completed', 'Permissions granted');
      
      // Step 3: Data Sync
      await updateStepStatus('sync', 'current', 'Syncing products, orders, and customers...');
      
      // Make real API call to connect
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/shopify/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shop: shop,
          accessToken: accessToken,
          chatbotId: selectedChatbot?.id || null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to Shopify');
      }
      
      const data = await response.json();
      
      await updateStepStatus('sync', 'completed', 'Data sync completed');
      
      // Step 4: Webhooks
      await updateStepStatus('webhooks', 'current', 'Setting up webhooks...');
      await delay(2000);
      await updateStepStatus('webhooks', 'completed', 'Webhooks configured');
      
      // Step 5: Complete
      await updateStepStatus('complete', 'current', 'Integration complete!');
      await delay(1000);
      await updateStepStatus('complete', 'completed', 'Your store is now connected');
      
      // Create connection object from API response
      const newConnection: ShopifyConnection = {
        id: data.connection.id,
        storeName: data.connection.shopName,
        domain: data.connection.domain,
        status: 'connected',
        lastSync: data.connection.lastSync,
        productsCount: 0, // Will be updated by sync
        ordersCount: 0,
        customersCount: 0,
        revenue: 0,
        plan: data.connection.plan,
        region: data.connection.region,
        currency: data.connection.currency,
        accessToken: data.connection.accessToken,
        shopId: data.connection.shop,
        webhookUrl: 'https://api.aiorchestrator.com/webhooks/shopify'
      };
      
      setConnection(newConnection);
      localStorage.setItem('shopify_connection', JSON.stringify(newConnection));
      
      // Fetch real data
      await fetchShopifyData(data.connection.id);
      
      await delay(1000);
      setShowIntegrationSteps(false);
      
      // Refresh connections to show the new one
      await fetchConnections();
      
    } catch (error) {
      console.error('OAuth flow error:', error);
      await updateStepStatus('auth', 'error', 'Authentication failed');
      throw error;
    }
  };

  const fetchShopifyData = async (connectionId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/shopify/data/${connectionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && connection) {
          const updatedConnection = {
            ...connection,
            productsCount: data.data.productsCount,
            ordersCount: data.data.ordersCount,
            customersCount: data.data.customersCount,
            revenue: data.data.revenue,
            lastSync: data.data.lastSync
          };
          setConnection(updatedConnection);
          localStorage.setItem('shopify_connection', JSON.stringify(updatedConnection));
        }
      }
    } catch (error) {
      console.error('Error fetching Shopify data:', error);
    }
  };

  const simulateOAuthFlow = async () => {
    // Step 1: Authentication
    await updateStepStatus('auth', 'completed', 'Authentication successful');
    await delay(1000);
    
    // Step 2: Permissions
    await updateStepStatus('permissions', 'current', 'Requesting permissions...');
    await delay(2000);
    await updateStepStatus('permissions', 'completed', 'Permissions granted');
    
    // Step 3: Data Sync
    await updateStepStatus('sync', 'current', 'Syncing products, orders, and customers...');
    await delay(3000);
    await updateStepStatus('sync', 'completed', 'Data sync completed');
    
    // Step 4: Webhooks
    await updateStepStatus('webhooks', 'current', 'Setting up webhooks...');
    await delay(2000);
    await updateStepStatus('webhooks', 'completed', 'Webhooks configured');
    
    // Step 5: Complete
    await updateStepStatus('complete', 'current', 'Integration complete!');
    await delay(1000);
    await updateStepStatus('complete', 'completed', 'Your store is now connected');
    
    // Create connection object
    const newConnection: ShopifyConnection = {
      id: '1',
      storeName: 'Fashion Forward',
      domain: 'fashionforward.myshopify.com',
      status: 'connected',
      lastSync: new Date().toISOString(),
      productsCount: 156,
      ordersCount: 89,
      customersCount: 234,
      revenue: 12450.75,
      plan: 'Shopify Plus',
      region: 'Europe',
      currency: 'EUR',
      accessToken: 'shpat_1234567890abcdef',
      shopId: '123456789',
      webhookUrl: 'https://api.aiorchestrator.com/webhooks/shopify'
    };
    
    setConnection(newConnection);
    localStorage.setItem('shopify_connection', JSON.stringify(newConnection));
    
    await delay(1000);
    setShowIntegrationSteps(false);
  };

  const updateStepStatus = async (stepId: string, status: IntegrationStep['status'], details?: string) => {
    setIntegrationSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, details }
        : step
    ));
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


  const handleSync = async (connectionId: string) => {
    try {
      setSyncing(true);
      setError(null);
      
      const connection = connections.find(c => c.id === connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }
      
      // Make real API call to sync based on platform
      const apiUrl = connection.platform === 'shopify' 
        ? `http://localhost:4000/api/shopify/sync/${connectionId}`
        : `http://localhost:4000/api/woocommerce/sync/${connectionId}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update connection with real data
        const updatedConnections = connections.map(c => 
          c.id === connectionId 
            ? {
                ...c,
                lastSync: data.data.lastSync || data.data.connection.lastSync,
                productsCount: data.data.productsCount || data.data.connection.productsCount,
                ordersCount: data.data.ordersCount || data.data.connection.ordersCount,
                customersCount: data.data.customersCount || data.data.connection.customersCount,
                revenue: data.data.revenue || data.data.connection.revenue
              }
            : c
        );
        
        setConnections(updatedConnections);
        localStorage.setItem('ecommerce_connections', JSON.stringify(updatedConnections));
      }
    } catch (error) {
      console.error('Error syncing:', error);
      setError('Failed to sync data. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = (connectionId: string) => {
    if (window.confirm('Are you sure you want to disconnect this store? This will stop all data synchronization.')) {
      const updatedConnections = connections.filter(c => c.id !== connectionId);
      setConnections(updatedConnections);
      localStorage.setItem('ecommerce_connections', JSON.stringify(updatedConnections));
    }
  };

  const fetchWooCommerceData = async (connectionId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/woocommerce/connection/${connectionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedConnections = connections.map(c => 
            c.id === connectionId 
              ? {
                  ...c,
                  productsCount: data.data.connection.productsCount,
                  ordersCount: data.data.connection.ordersCount,
                  customersCount: data.data.connection.customersCount,
                  revenue: data.data.connection.revenue,
                  lastSync: data.data.connection.lastSync
                }
              : c
          );
          setConnections(updatedConnections);
          localStorage.setItem('ecommerce_connections', JSON.stringify(updatedConnections));
        }
      }
    } catch (error) {
      console.error('Error fetching WooCommerce data:', error);
    }
  };

  const getStatusColor = (status: EcommerceConnection['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'disconnected': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'syncing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: EcommerceConnection['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'syncing': return <Loader2 className="w-4 h-4 animate-spin" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading connections...</p>
        </div>
                </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
                  <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                <ArrowLeft className="w-5 h-5" />
                  </button>
                    <div>
                <h1 className="text-3xl font-bold text-gray-900">E-commerce Connections</h1>
                <p className="text-gray-600 text-lg">Connect your e-commerce stores for seamless AI integration</p>
                    </div>
                  </div>
                </div>
                    </div>
                  </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan Limits */}
        {user && !canCreateConnection() && (
          <div className="mb-6">
            <ConnectionLimit
              currentPlan={user.planId}
              connectionCount={connections.length}
              onUpgrade={() => window.open('/?pricing=true', '_blank')}
            />
                </div>
        )}
        
        {connections.length === 0 ? (
          /* No Connections State */
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-blue-600" />
                    </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Manage Your Store Connections</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Add additional e-commerce store connections or modify existing ones. 
                Each connection syncs products, orders, and customer data for your AI chatbots.
              </p>
                  </div>

            {/* Platform Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Shopify */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Shopify</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your Shopify store with secure OAuth integration. 
                    Perfect for online stores using Shopify's platform.
                  </p>
                  <button
                    onClick={() => handleConnectWithLimit('shopify')}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                      !canCreateConnection()
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    disabled={!canCreateConnection()}
                    title={!canCreateConnection() ? 'Upgrade to connect more stores' : 'Connect Shopify Store'}
                  >
                    Connect Shopify Store
                  </button>
                    </div>
                  </div>

              {/* WooCommerce */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-8 h-8 text-blue-600" />
                </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">WooCommerce</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your WooCommerce store with API credentials. 
                    Perfect for WordPress-based e-commerce stores.
                </p>
                <button
                    onClick={() => handleConnectWithLimit('woocommerce')}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                      !canCreateConnection()
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={!canCreateConnection()}
                    title={!canCreateConnection() ? 'Upgrade to connect more stores' : 'Connect WooCommerce Store'}
                >
                    Connect WooCommerce Store
                </button>
              </div>
          </div>
        </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">One-Click Setup</h3>
                <p className="text-gray-600">Connect your store in under 2 minutes with our secure OAuth integration.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Sync</h3>
                <p className="text-gray-600">Your AI always has the latest product info, orders, and customer data.</p>
            </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Bank-level security with read-only access to your store data.</p>
              </div>
            </div>

            {/* Connection Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Connect?</h3>
                <p className="text-gray-600">Click the button below to start the secure connection process</p>
                </div>

              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Your Store</span>
              </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">AI Orchestrator</span>
          </div>
        </div>

              {/* Chatbot Selection */}
              {chatbots.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Chatbot to Connect
                  </label>
                  <div className="space-y-3">
                    {chatbots.map((chatbot) => (
                      <div
                        key={chatbot.id}
                        onClick={() => setSelectedChatbot(chatbot)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedChatbot?.id === chatbot.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              chatbot.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                <div>
                              <h4 className="font-medium text-gray-900">{chatbot.name}</h4>
                              <p className="text-sm text-gray-600">{chatbot.description}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-500">Language: {chatbot.language}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  chatbot.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {chatbot.isActive ? 'Active' : 'Inactive'}
                                </span>
                </div>
              </div>
                </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedChatbot?.id === chatbot.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedChatbot?.id === chatbot.id && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                            )}
                </div>
              </div>
                </div>
                    ))}
                </div>
              </div>
              )}

              {chatbots.length === 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">No Chatbots Available</span>
            </div>
                  <p className="text-yellow-700 mt-1">
                    You need to create a chatbot before connecting to a store. 
                    <button
                      onClick={() => navigate('/chatbot')}
                      className="text-yellow-800 underline hover:text-yellow-900 ml-1"
                    >
                      Create your first chatbot
                    </button>
                  </p>
          </div>
        )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">Error</span>
                </div>
                  <p className="text-red-700 mt-1">{error}</p>
              </div>
        )}

              <button
                onClick={handleConnect}
                disabled={!selectedChatbot}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors shadow-lg ${
                  selectedChatbot
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {selectedChatbot 
                  ? `Connect "${selectedChatbot.name}" to Shopify Store`
                  : 'Select a Chatbot to Continue'
                }
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  By connecting, you agree to our <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                </p>
            </div>
                </div>
              </div>
        ) : (
          /* Connected State */
          <div className="space-y-8">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                <h2 className="text-2xl font-bold text-gray-900">Connected Stores</h2>
                <p className="text-gray-600">Manage your e-commerce integrations</p>
            </div>
              <button
                onClick={() => setConnections([])}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Store</span>
              </button>
          </div>

            {/* Connections List */}
            <div className="space-y-6">
              {connections.map((connection) => {
                const PlatformIcon = getPlatformIcon(connection.platform);
                return (
                  <div key={connection.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getPlatformColor(connection.platform)}`}>
                          <PlatformIcon className="w-8 h-8" />
        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{connection.storeName}</h3>
                          <p className="text-gray-600">{connection.domain}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                              {getStatusIcon(connection.status)}
                              <span className="capitalize">{connection.status}</span>
      </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">{getPlatformName(connection.platform)}</span>
    </div>
                            {connection.region && (
                              <div className="flex items-center space-x-1">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-blue-600">{connection.region}</span>
        </div>
                            )}
                            {connection.plan && (
                              <div className="flex items-center space-x-1">
                                <CreditCard className="w-4 h-4 text-purple-500" />
                                <span className="text-sm text-purple-600">{connection.plan}</span>
                </div>
                            )}
        </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                  <button
                          onClick={() => handleSync(connection.id)}
                          disabled={syncing}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                          <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                  <button
                          onClick={() => handleDisconnect(connection.id)}
                          className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                          Disconnect
                  </button>
              </div>
            </div>
                    </div>
                );
              })}
                  </div>

            {/* Sync Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sync Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Auto-sync enabled</span>
                </div>
                    </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Last Sync</p>
                  <p className="font-semibold text-gray-900">{new Date(connection.lastSync).toLocaleString()}</p>
                  </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Next Sync</p>
                  <p className="font-semibold text-gray-900">In 15 minutes</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Zap className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Sync Frequency</p>
                  <p className="font-semibold text-gray-900">Every 15 min</p>
                    </div>
                  </div>
                </div>

            {/* Data Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-3xl font-bold text-gray-900">{connection.productsCount}</p>
                    <p className="text-sm text-green-600">+5 this week</p>
                    </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
          </div>
        </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{connection.ordersCount}</p>
                    <p className="text-sm text-green-600">+12 this week</p>
                </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
                </div>
            </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customers</p>
                    <p className="text-3xl font-bold text-gray-900">{connection.customersCount}</p>
                    <p className="text-sm text-green-600">+8 this week</p>
                </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
              </div>
          </div>
            </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">{connection.currency} {connection.revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+23% this month</p>
                </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

            {/* Integration Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Integration Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Auto-sync Products</p>
                    <p className="text-sm text-gray-600">Automatically sync new products from Shopify</p>
                </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
              </div>

                <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Auto-sync Orders</p>
                    <p className="text-sm text-gray-600">Automatically sync new orders from Shopify</p>
                </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
              </div>

                <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Auto-sync Customers</p>
                    <p className="text-sm text-gray-600">Automatically sync customer data from Shopify</p>
                </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Steps Modal */}
        {showIntegrationSteps && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connecting to Shopify</h3>
              
              <div className="space-y-4">
                {integrationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-500' : 
                      step.status === 'current' ? 'bg-blue-500' : 
                      step.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : step.status === 'current' ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : step.status === 'error' ? (
                        <XCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {step.details && (
                        <p className="text-xs text-blue-600 mt-1">{step.details}</p>
                      )}
              </div>
            </div>
                ))}
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Connections;



import { 
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  Zap,
  Shield,
  BarChart3,
  Users,
  Package,
  CreditCard,
  Globe,
  Clock,
  Star,
  ArrowRight,
  Loader2,
  XCircle,
  AlertTriangle,
  Plus,
  Monitor,
  Database
} from 'lucide-react';
import { ConnectionLimit } from '../components/PlanLimits';
import { useAuth } from '../contexts/AuthContext';

interface EcommerceConnection {
  id: string;
  platform: 'shopify' | 'woocommerce';
  storeName: string;
  domain: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending' | 'syncing';
  lastSync: string;
  productsCount: number;
  ordersCount: number;
  customersCount: number;
  revenue: number;
  plan?: string;
  region?: string;
  currency: string;
  accessToken?: string;
  shopId?: string;
  webhookUrl?: string;
  // WooCommerce specific
  consumerKey?: string;
  consumerSecret?: string;
  version?: string;
  timezone?: string;
}

interface IntegrationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending' | 'error';
  details?: string;
}

interface Chatbot {
  id: string;
  name: string;
  description: string;
  language: string;
  isActive: boolean;
}

const Connections: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [connections, setConnections] = useState<EcommerceConnection[]>([]);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showIntegrationSteps, setShowIntegrationSteps] = useState(false);
  const [integrationSteps, setIntegrationSteps] = useState<IntegrationStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'shopify' | 'woocommerce' | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchConnections();
    fetchChatbots();
  }, []);

  // Check if user can create more connections
  const canCreateConnection = () => {
    if (!user) return false;
    
    const limits = {
      starter: 1,
      professional: 5,
      enterprise: -1 // unlimited
    };
    
    const limit = limits[user.planId as keyof typeof limits] || 1;
    return limit === -1 || connections.length < limit;
  };

  // Handle connection creation with limit check
  const handleConnectWithLimit = (platform: 'shopify' | 'woocommerce') => {
    if (!canCreateConnection()) {
      setShowUpgrade(true);
      return;
    }
    handleConnect(platform);
  };

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch connections from backend API
      const response = await fetch(`${API_URL}/api/connections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.connections) {
          setConnections(data.data.connections);
        } else {
          // Fallback to localStorage if API fails
          const storedConnections = localStorage.getItem('ecommerce_connections');
          if (storedConnections) {
            setConnections(JSON.parse(storedConnections));
          }
        }
      } else {
        // Fallback to localStorage if API fails
        const storedConnections = localStorage.getItem('ecommerce_connections');
        if (storedConnections) {
          setConnections(JSON.parse(storedConnections));
        }
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      // Fallback to localStorage on error
      const storedConnections = localStorage.getItem('ecommerce_connections');
      if (storedConnections) {
        setConnections(JSON.parse(storedConnections));
      }
      setError('Failed to fetch connection status');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatbots = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/chatbots', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setChatbots(data.data || []);
          // Auto-select first chatbot if available
          if (data.data && data.data.length > 0) {
            setSelectedChatbot(data.data[0]);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching chatbots:', err);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'shopify': return ShoppingCart;
      case 'woocommerce': return Monitor;
      default: return ShoppingCart;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'shopify': return 'bg-green-100 text-green-600';
      case 'woocommerce': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'shopify': return 'Shopify';
      case 'woocommerce': return 'WooCommerce';
      default: return 'E-commerce';
    }
  };

  const handleConnect = async (platform: 'shopify' | 'woocommerce') => {
    try {
      setError(null);
      setSelectedPlatform(platform);
      setShowIntegrationSteps(true);
      
      // Initialize integration steps based on platform
      const steps: IntegrationStep[] = platform === 'shopify' ? [
        {
          id: 'auth',
          title: 'Authenticate with Shopify',
          description: 'Secure OAuth connection to your store',
          icon: Shield,
          status: 'current',
          details: 'Redirecting to Shopify...'
        },
        {
          id: 'permissions',
          title: 'Grant Permissions',
          description: 'Allow access to products, orders, and customers',
          icon: Settings,
          status: 'pending'
        },
        {
          id: 'sync',
          title: 'Initial Data Sync',
          description: 'Importing your store data',
          icon: RefreshCw,
          status: 'pending'
        },
        {
          id: 'webhooks',
          title: 'Setup Webhooks',
          description: 'Real-time data synchronization',
          icon: Zap,
          status: 'pending'
        },
        {
          id: 'complete',
          title: 'Integration Complete',
          description: 'Your store is now connected',
          icon: CheckCircle,
          status: 'pending'
        }
      ] : [
        {
          id: 'auth',
          title: 'Connect to WooCommerce',
          description: 'Enter your store credentials',
          icon: Shield,
          status: 'current',
          details: 'Testing connection...'
        },
        {
          id: 'permissions',
          title: 'Verify API Access',
          description: 'Confirm access to products, orders, and customers',
          icon: Settings,
          status: 'pending'
        },
        {
          id: 'sync',
          title: 'Initial Data Sync',
          description: 'Importing your store data',
          icon: RefreshCw,
          status: 'pending'
        },
        {
          id: 'webhooks',
          title: 'Setup Webhooks',
          description: 'Real-time data synchronization',
          icon: Zap,
          status: 'pending'
        },
        {
          id: 'complete',
          title: 'Integration Complete',
          description: 'Your store is now connected',
          icon: CheckCircle,
          status: 'pending'
        }
      ];
      
      setIntegrationSteps(steps);

      // Real OAuth flow with API call
      if (platform === 'shopify') {
        await realShopifyOAuthFlow();
      } else {
        await realWooCommerceOAuthFlow();
      }
      
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      setError(`Failed to connect to ${platform}. Please try again.`);
      setShowIntegrationSteps(false);
    }
  };

  const realWooCommerceOAuthFlow = async () => {
    try {
      // Step 1: Authentication
      await updateStepStatus('auth', 'current', 'Testing WooCommerce connection...');
      
      // For demo purposes, we'll simulate the WooCommerce connection
      const storeUrl = 'https://demo-store.woocommerce.com';
      const consumerKey = 'ck_demo_key_1234567890abcdef';
      const consumerSecret = 'cs_demo_secret_1234567890abcdef';
      
      await delay(2000);
      await updateStepStatus('auth', 'completed', 'Connection successful');
      
      // Step 2: Permissions
      await updateStepStatus('permissions', 'current', 'Verifying API access...');
      await delay(2000);
      await updateStepStatus('permissions', 'completed', 'API access confirmed');
      
      // Step 3: Data Sync
      await updateStepStatus('sync', 'current', 'Syncing products, orders, and customers...');
      
      // Make real API call to connect
      const response = await fetch(`${API_URL}/api/woocommerce/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeUrl: storeUrl,
          consumerKey: consumerKey,
          consumerSecret: consumerSecret
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to WooCommerce');
      }
      
      const data = await response.json();
      
      await updateStepStatus('sync', 'completed', 'Data sync completed');
      
      // Step 4: Webhooks
      await updateStepStatus('webhooks', 'current', 'Setting up webhooks...');
      await delay(2000);
      await updateStepStatus('webhooks', 'completed', 'Webhooks configured');
      
      // Step 5: Complete
      await updateStepStatus('complete', 'current', 'Integration complete!');
      await delay(1000);
      await updateStepStatus('complete', 'completed', 'Your store is now connected');
      
      // Create connection object from API response
      const newConnection: EcommerceConnection = {
        id: data.connection.id,
        platform: 'woocommerce',
        storeName: data.connection.storeName,
        domain: data.connection.storeUrl,
        status: 'connected',
        lastSync: data.connection.lastSync,
        productsCount: 0, // Will be updated by sync
        ordersCount: 0,
        customersCount: 0,
        revenue: 0,
        currency: data.connection.currency,
        consumerKey: data.connection.consumerKey,
        consumerSecret: data.connection.consumerSecret,
        version: data.connection.version,
        timezone: data.connection.timezone
      };
      
      // Add to connections array
      const updatedConnections = [...connections, newConnection];
      setConnections(updatedConnections);
      localStorage.setItem('ecommerce_connections', JSON.stringify(updatedConnections));
      
      // Fetch real data
      await fetchWooCommerceData(data.connection.id);
      
      await delay(1000);
      setShowIntegrationSteps(false);
      
      // Refresh connections to show the new one
      await fetchConnections();
      
    } catch (error) {
      console.error('WooCommerce OAuth flow error:', error);
      await updateStepStatus('auth', 'error', 'Connection failed');
      throw error;
    }
  };

  const realShopifyOAuthFlow = async () => {
    try {
      // Check if chatbot is selected
      if (!selectedChatbot) {
        throw new Error('Please select a chatbot before connecting');
      }
      
      // Step 1: Authentication
      await updateStepStatus('auth', 'current', 'Redirecting to Shopify...');
      
      // For demo purposes, we'll simulate the OAuth flow
      // In production, this would redirect to Shopify OAuth
      const shop = 'fashionforward.myshopify.com';
      const accessToken = 'shpat_demo_token_1234567890abcdef';
      
      await delay(2000);
      await updateStepStatus('auth', 'completed', 'Authentication successful');
      
      // Step 2: Permissions
      await updateStepStatus('permissions', 'current', 'Requesting permissions...');
      await delay(2000);
      await updateStepStatus('permissions', 'completed', 'Permissions granted');
      
      // Step 3: Data Sync
      await updateStepStatus('sync', 'current', 'Syncing products, orders, and customers...');
      
      // Make real API call to connect
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/shopify/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shop: shop,
          accessToken: accessToken,
          chatbotId: selectedChatbot?.id || null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to Shopify');
      }
      
      const data = await response.json();
      
      await updateStepStatus('sync', 'completed', 'Data sync completed');
      
      // Step 4: Webhooks
      await updateStepStatus('webhooks', 'current', 'Setting up webhooks...');
      await delay(2000);
      await updateStepStatus('webhooks', 'completed', 'Webhooks configured');
      
      // Step 5: Complete
      await updateStepStatus('complete', 'current', 'Integration complete!');
      await delay(1000);
      await updateStepStatus('complete', 'completed', 'Your store is now connected');
      
      // Create connection object from API response
      const newConnection: ShopifyConnection = {
        id: data.connection.id,
        storeName: data.connection.shopName,
        domain: data.connection.domain,
        status: 'connected',
        lastSync: data.connection.lastSync,
        productsCount: 0, // Will be updated by sync
        ordersCount: 0,
        customersCount: 0,
        revenue: 0,
        plan: data.connection.plan,
        region: data.connection.region,
        currency: data.connection.currency,
        accessToken: data.connection.accessToken,
        shopId: data.connection.shop,
        webhookUrl: 'https://api.aiorchestrator.com/webhooks/shopify'
      };
      
      setConnection(newConnection);
      localStorage.setItem('shopify_connection', JSON.stringify(newConnection));
      
      // Fetch real data
      await fetchShopifyData(data.connection.id);
      
      await delay(1000);
      setShowIntegrationSteps(false);
      
      // Refresh connections to show the new one
      await fetchConnections();
      
    } catch (error) {
      console.error('OAuth flow error:', error);
      await updateStepStatus('auth', 'error', 'Authentication failed');
      throw error;
    }
  };

  const fetchShopifyData = async (connectionId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/shopify/data/${connectionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && connection) {
          const updatedConnection = {
            ...connection,
            productsCount: data.data.productsCount,
            ordersCount: data.data.ordersCount,
            customersCount: data.data.customersCount,
            revenue: data.data.revenue,
            lastSync: data.data.lastSync
          };
          setConnection(updatedConnection);
          localStorage.setItem('shopify_connection', JSON.stringify(updatedConnection));
        }
      }
    } catch (error) {
      console.error('Error fetching Shopify data:', error);
    }
  };

  const simulateOAuthFlow = async () => {
    // Step 1: Authentication
    await updateStepStatus('auth', 'completed', 'Authentication successful');
    await delay(1000);
    
    // Step 2: Permissions
    await updateStepStatus('permissions', 'current', 'Requesting permissions...');
    await delay(2000);
    await updateStepStatus('permissions', 'completed', 'Permissions granted');
    
    // Step 3: Data Sync
    await updateStepStatus('sync', 'current', 'Syncing products, orders, and customers...');
    await delay(3000);
    await updateStepStatus('sync', 'completed', 'Data sync completed');
    
    // Step 4: Webhooks
    await updateStepStatus('webhooks', 'current', 'Setting up webhooks...');
    await delay(2000);
    await updateStepStatus('webhooks', 'completed', 'Webhooks configured');
    
    // Step 5: Complete
    await updateStepStatus('complete', 'current', 'Integration complete!');
    await delay(1000);
    await updateStepStatus('complete', 'completed', 'Your store is now connected');
    
    // Create connection object
    const newConnection: ShopifyConnection = {
      id: '1',
      storeName: 'Fashion Forward',
      domain: 'fashionforward.myshopify.com',
      status: 'connected',
      lastSync: new Date().toISOString(),
      productsCount: 156,
      ordersCount: 89,
      customersCount: 234,
      revenue: 12450.75,
      plan: 'Shopify Plus',
      region: 'Europe',
      currency: 'EUR',
      accessToken: 'shpat_1234567890abcdef',
      shopId: '123456789',
      webhookUrl: 'https://api.aiorchestrator.com/webhooks/shopify'
    };
    
    setConnection(newConnection);
    localStorage.setItem('shopify_connection', JSON.stringify(newConnection));
    
    await delay(1000);
    setShowIntegrationSteps(false);
  };

  const updateStepStatus = async (stepId: string, status: IntegrationStep['status'], details?: string) => {
    setIntegrationSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, details }
        : step
    ));
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


  const handleSync = async (connectionId: string) => {
    try {
      setSyncing(true);
      setError(null);
      
      const connection = connections.find(c => c.id === connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }
      
      // Make real API call to sync based on platform
      const apiUrl = connection.platform === 'shopify' 
        ? `http://localhost:4000/api/shopify/sync/${connectionId}`
        : `http://localhost:4000/api/woocommerce/sync/${connectionId}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update connection with real data
        const updatedConnections = connections.map(c => 
          c.id === connectionId 
            ? {
                ...c,
                lastSync: data.data.lastSync || data.data.connection.lastSync,
                productsCount: data.data.productsCount || data.data.connection.productsCount,
                ordersCount: data.data.ordersCount || data.data.connection.ordersCount,
                customersCount: data.data.customersCount || data.data.connection.customersCount,
                revenue: data.data.revenue || data.data.connection.revenue
              }
            : c
        );
        
        setConnections(updatedConnections);
        localStorage.setItem('ecommerce_connections', JSON.stringify(updatedConnections));
      }
    } catch (error) {
      console.error('Error syncing:', error);
      setError('Failed to sync data. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = (connectionId: string) => {
    if (window.confirm('Are you sure you want to disconnect this store? This will stop all data synchronization.')) {
      const updatedConnections = connections.filter(c => c.id !== connectionId);
      setConnections(updatedConnections);
      localStorage.setItem('ecommerce_connections', JSON.stringify(updatedConnections));
    }
  };

  const fetchWooCommerceData = async (connectionId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/woocommerce/connection/${connectionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedConnections = connections.map(c => 
            c.id === connectionId 
              ? {
                  ...c,
                  productsCount: data.data.connection.productsCount,
                  ordersCount: data.data.connection.ordersCount,
                  customersCount: data.data.connection.customersCount,
                  revenue: data.data.connection.revenue,
                  lastSync: data.data.connection.lastSync
                }
              : c
          );
          setConnections(updatedConnections);
          localStorage.setItem('ecommerce_connections', JSON.stringify(updatedConnections));
        }
      }
    } catch (error) {
      console.error('Error fetching WooCommerce data:', error);
    }
  };

  const getStatusColor = (status: EcommerceConnection['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'disconnected': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'syncing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: EcommerceConnection['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'syncing': return <Loader2 className="w-4 h-4 animate-spin" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading connections...</p>
        </div>
                </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
                  <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                <ArrowLeft className="w-5 h-5" />
                  </button>
                    <div>
                <h1 className="text-3xl font-bold text-gray-900">E-commerce Connections</h1>
                <p className="text-gray-600 text-lg">Connect your e-commerce stores for seamless AI integration</p>
                    </div>
                  </div>
                </div>
                    </div>
        </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan Limits */}
        {user && !canCreateConnection() && (
          <div className="mb-6">
            <ConnectionLimit
              currentPlan={user.planId}
              connectionCount={connections.length}
              onUpgrade={() => window.open('/?pricing=true', '_blank')}
            />
                </div>
        )}
        
        {connections.length === 0 ? (
          /* No Connections State */
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-blue-600" />
                </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Manage Your Store Connections</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Add additional e-commerce store connections or modify existing ones. 
                Each connection syncs products, orders, and customer data for your AI chatbots.
              </p>
              </div>

            {/* Platform Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Shopify */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Shopify</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your Shopify store with secure OAuth integration. 
                    Perfect for online stores using Shopify's platform.
                  </p>
                  <button
                    onClick={() => handleConnectWithLimit('shopify')}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                      !canCreateConnection()
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    disabled={!canCreateConnection()}
                    title={!canCreateConnection() ? 'Upgrade to connect more stores' : 'Connect Shopify Store'}
                  >
                    Connect Shopify Store
                  </button>
                    </div>
                  </div>

              {/* WooCommerce */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-8 h-8 text-blue-600" />
                </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">WooCommerce</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your WooCommerce store with API credentials. 
                    Perfect for WordPress-based e-commerce stores.
                </p>
                  <button
                    onClick={() => handleConnectWithLimit('woocommerce')}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                      !canCreateConnection()
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={!canCreateConnection()}
                    title={!canCreateConnection() ? 'Upgrade to connect more stores' : 'Connect WooCommerce Store'}
                >
                    Connect WooCommerce Store
                  </button>
              </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">One-Click Setup</h3>
                <p className="text-gray-600">Connect your store in under 2 minutes with our secure OAuth integration.</p>
                  </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Sync</h3>
                <p className="text-gray-600">Your AI always has the latest product info, orders, and customer data.</p>
                    </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Bank-level security with read-only access to your store data.</p>
                </div>
                    </div>

            {/* Connection Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Connect?</h3>
                <p className="text-gray-600">Click the button below to start the secure connection process</p>
                  </div>

              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Your Store</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">AI Orchestrator</span>
          </div>
        </div>

              {/* Chatbot Selection */}
              {chatbots.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Chatbot to Connect
                  </label>
                  <div className="space-y-3">
                    {chatbots.map((chatbot) => (
                      <div
                        key={chatbot.id}
                        onClick={() => setSelectedChatbot(chatbot)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedChatbot?.id === chatbot.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              chatbot.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                    <div>
                              <h4 className="font-medium text-gray-900">{chatbot.name}</h4>
                              <p className="text-sm text-gray-600">{chatbot.description}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-500">Language: {chatbot.language}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  chatbot.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {chatbot.isActive ? 'Active' : 'Inactive'}
                                </span>
                    </div>
                  </div>
                </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedChatbot?.id === chatbot.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedChatbot?.id === chatbot.id && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                            )}
              </div>
              </div>
                </div>
                    ))}
                </div>
              </div>
              )}

              {chatbots.length === 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">No Chatbots Available</span>
            </div>
                  <p className="text-yellow-700 mt-1">
                    You need to create a chatbot before connecting to a store. 
                <button
                      onClick={() => navigate('/chatbot')}
                      className="text-yellow-800 underline hover:text-yellow-900 ml-1"
                >
                      Create your first chatbot
                </button>
                  </p>
              </div>
            )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">Error</span>
          </div>
                  <p className="text-red-700 mt-1">{error}</p>
        </div>
        )}

              <button
                onClick={handleConnect}
                disabled={!selectedChatbot}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors shadow-lg ${
                  selectedChatbot
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {selectedChatbot 
                  ? `Connect "${selectedChatbot.name}" to Shopify Store`
                  : 'Select a Chatbot to Continue'
                }
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  By connecting, you agree to our <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                </p>
                </div>
              </div>
              </div>
        ) : (
          /* Connected State */
          <div className="space-y-8">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                <h2 className="text-2xl font-bold text-gray-900">Connected Stores</h2>
                <p className="text-gray-600">Manage your e-commerce integrations</p>
            </div>
              <button
                onClick={() => setConnections([])}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Store</span>
              </button>
            </div>

            {/* Connections List */}
            <div className="space-y-6">
              {connections.map((connection) => {
                const PlatformIcon = getPlatformIcon(connection.platform);
                return (
                  <div key={connection.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getPlatformColor(connection.platform)}`}>
                          <PlatformIcon className="w-8 h-8" />
                </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{connection.storeName}</h3>
                          <p className="text-gray-600">{connection.domain}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                              {getStatusIcon(connection.status)}
                              <span className="capitalize">{connection.status}</span>
              </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">{getPlatformName(connection.platform)}</span>
    </div>
                            {connection.region && (
                              <div className="flex items-center space-x-1">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-blue-600">{connection.region}</span>
        </div>
                            )}
                            {connection.plan && (
                              <div className="flex items-center space-x-1">
                                <CreditCard className="w-4 h-4 text-purple-500" />
                                <span className="text-sm text-purple-600">{connection.plan}</span>
                </div>
                            )}
        </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                  <button
                          onClick={() => handleSync(connection.id)}
                          disabled={syncing}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                          <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                  <button
                          onClick={() => handleDisconnect(connection.id)}
                          className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                          Disconnect
                  </button>
              </div>
            </div>
                    </div>
                );
              })}
            </div>

            {/* Sync Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sync Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Auto-sync enabled</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Last Sync</p>
                  <p className="font-semibold text-gray-900">{new Date(connection.lastSync).toLocaleString()}</p>
            </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Next Sync</p>
                  <p className="font-semibold text-gray-900">In 15 minutes</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Zap className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Sync Frequency</p>
                  <p className="font-semibold text-gray-900">Every 15 min</p>
                    </div>
          </div>
        </div>

            {/* Data Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-3xl font-bold text-gray-900">{connection.productsCount}</p>
                    <p className="text-sm text-green-600">+5 this week</p>
                </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
          </div>
        </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                      <p className="text-sm font-medium text-gray-600">Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{connection.ordersCount}</p>
                    <p className="text-sm text-green-600">+12 this week</p>
                </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
                </div>
            </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                      <p className="text-sm font-medium text-gray-600">Customers</p>
                    <p className="text-3xl font-bold text-gray-900">{connection.customersCount}</p>
                    <p className="text-sm text-green-600">+8 this week</p>
                </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
              </div>
                </div>
            </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">{connection.currency} {connection.revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+23% this month</p>
                </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

            {/* Integration Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Integration Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Auto-sync Products</p>
                    <p className="text-sm text-gray-600">Automatically sync new products from Shopify</p>
                </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
              </div>

                <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Auto-sync Orders</p>
                    <p className="text-sm text-gray-600">Automatically sync new orders from Shopify</p>
            </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
              </div>

                <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Auto-sync Customers</p>
                    <p className="text-sm text-gray-600">Automatically sync customer data from Shopify</p>
                </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Integration Steps Modal */}
        {showIntegrationSteps && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connecting to Shopify</h3>
              
              <div className="space-y-4">
                {integrationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-500' : 
                      step.status === 'current' ? 'bg-blue-500' : 
                      step.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : step.status === 'current' ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : step.status === 'error' ? (
                        <XCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {step.details && (
                        <p className="text-xs text-blue-600 mt-1">{step.details}</p>
                      )}
              </div>
            </div>
                ))}
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Connections;


