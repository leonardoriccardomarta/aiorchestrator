import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Copy, 
  RefreshCw,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  Send,
  Users,
  Settings,
  Eye
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  isPopular?: boolean;
  category: 'messaging' | 'ecommerce' | 'social' | 'website';
  setupSteps: string[];
  requirements: string[];
  benefits: string[];
  webhookUrl?: string;
  apiKey?: string;
  lastSync?: string;
  messageCount?: number;
  errorMessage?: string;
}

interface IntegrationManagerProps {
  chatbotId: string;
  onIntegrationToggle?: (integrationId: string, enabled: boolean) => void;
}

const IntegrationManager: React.FC<IntegrationManagerProps> = ({ 
  chatbotId, 
  onIntegrationToggle 
}) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [_showSetupModal, _setShowSetupModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'available'>('all');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Initialize integrations with comprehensive data
    const defaultIntegrations: Integration[] = [
      {
        id: 'website',
        name: 'Website Widget',
        description: 'Embed the chatbot directly on your website with customizable appearance',
        icon: <Globe className="w-6 h-6" />,
        status: 'connected',
        isPopular: true,
        category: 'website',
        setupSteps: [
          'Copy the provided JavaScript code',
          'Paste it before the closing </body> tag on your website',
          'Customize the widget appearance in the settings',
          'Test the chatbot functionality'
        ],
        requirements: ['Website with HTML access', 'Basic technical knowledge'],
        benefits: [
          '24/7 customer support',
          'Instant visitor engagement',
          'Customizable design',
          'Mobile responsive',
          'Analytics tracking'
        ],
        webhookUrl: `https://api.yourdomain.com/webhook/chatbot/${chatbotId}`,
        lastSync: '2 minutes ago',
        messageCount: 1247
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        description: 'Connect to WhatsApp Business API for direct customer messaging',
        icon: <MessageSquare className="w-6 h-6" />,
        status: 'disconnected',
        isPopular: true,
        category: 'messaging',
        setupSteps: [
          'Verify your business with WhatsApp',
          'Get WhatsApp Business API approval',
          'Configure webhook URLs',
          'Test message flows',
          'Set up phone number verification'
        ],
        requirements: [
          'WhatsApp Business Account',
          'Verified business phone number',
          'Meta Business Manager access',
          'SSL certificate for webhooks'
        ],
        benefits: [
          'Reach 2+ billion users',
          'Rich media support',
          'High engagement rates',
          'International messaging',
          'Business verification badge'
        ]
      },
      {
        id: 'messenger',
        name: 'Facebook Messenger',
        description: 'Integrate with Facebook Messenger for social media customer support',
        icon: <Send className="w-6 h-6" />,
        status: 'disconnected',
        category: 'messaging',
        setupSteps: [
          'Create Facebook App',
          'Configure Messenger platform',
          'Set up page access token',
          'Configure webhook for your page',
          'Submit for app review'
        ],
        requirements: [
          'Facebook Business Page',
          'Facebook Developer Account',
          'Page Admin permissions',
          'Valid SSL webhook endpoint'
        ],
        benefits: [
          'Native Facebook integration',
          'Rich interactive elements',
          'Persistent menu options',
          'Quick replies support',
          'User profile access'
        ]
      },
      {
        id: 'instagram',
        name: 'Instagram Direct Messages',
        description: 'Connect to Instagram Business API for direct customer messaging and story interactions',
        icon: <Users className="w-6 h-6" />,
        status: 'disconnected',
        isPopular: true,
        category: 'social',
        setupSteps: [
          'Create a Facebook Business Account',
          'Convert to Instagram Business Profile',
          'Connect Instagram to Facebook Page',
          'Configure Instagram Basic Display API',
          'Set up webhook endpoints for message handling',
          'Submit for Instagram API review'
        ],
        requirements: [
          'Instagram Business Account',
          'Facebook Business Page',
          'Meta Developer Account',
          'Valid webhook endpoint with SSL'
        ],
        benefits: [
          'Direct message automation',
          'Story mentions notifications',
          'Visual content engagement',
          'Young audience reach',
          'Social commerce integration'
        ]
      },
      {
        id: 'telegram',
        name: 'Telegram Bot',
        description: 'Create a Telegram bot for your community and customer support',
        icon: <Zap className="w-6 h-6" />,
        status: 'disconnected',
        category: 'messaging',
        setupSteps: [
          'Message @BotFather on Telegram',
          'Create a new bot with /newbot command',
          'Get your bot token',
          'Configure webhook URL',
          'Set bot commands and description'
        ],
        requirements: [
          'Telegram account',
          'Bot token from BotFather',
          'Webhook endpoint'
        ],
        benefits: [
          'Group and channel support',
          'File sharing capabilities',
          'Inline keyboards',
          'Command-based interactions',
          'Developer-friendly API'
        ]
      },
      {
        id: 'shopify',
        name: 'Shopify Store',
        description: 'Integrate chatbot widget directly into your Shopify store for customer support and sales',
        icon: <span className="text-2xl">🛍️</span>,
        status: 'disconnected',
        isPopular: true,
        category: 'ecommerce',
        setupSteps: [
          'Access your Shopify admin panel',
          'Navigate to Online Store → Themes',
          'Click "Actions" → "Edit code" on your active theme',
          'Open theme.liquid file in Layout section',
          'Paste the widget code before closing </body> tag',
          'Save and test the integration'
        ],
        requirements: [
          'Active Shopify store',
          'Store admin access',
          'Access to theme code editor',
          'Basic HTML knowledge'
        ],
        benefits: [
          'Direct store integration',
          'Product recommendations',
          'Order assistance',
          'Customer support automation',
          'Mobile responsive design',
          'Real-time inventory updates'
        ]
      },
    ];

    setIntegrations(defaultIntegrations);
  }, [chatbotId]);

  const handleConnectIntegration = async (integration: Integration) => {
    setIsConnecting(integration.id);
    
    try {
      // Simulate proper API validation and connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add validation logic for different integration types
      let connectionSuccess = false;
      let errorMessage = '';

      switch (integration.id) {
        case 'whatsapp': {
          // Simulate WhatsApp Business API validation
          const hasValidPhoneNumber = Math.random() > 0.3; // 70% success rate
          if (hasValidPhoneNumber) {
            connectionSuccess = true;
          } else {
            errorMessage = 'WhatsApp Business verification failed. Please check your phone number and business verification status.';
          }
          break;
        }
        
        case 'messenger': {
          // Simulate Facebook Messenger setup validation
          const hasFacebookPage = Math.random() > 0.2; // 80% success rate
          if (hasFacebookPage) {
            connectionSuccess = true;
          } else {
            errorMessage = 'Facebook page connection failed. Please ensure your page has proper permissions and try again.';
          }
          break;
        }
        
        case 'telegram': {
          // Simulate Telegram bot token validation
          const hasValidBotToken = Math.random() > 0.1; // 90% success rate
          if (hasValidBotToken) {
            connectionSuccess = true;
          } else {
            errorMessage = 'Invalid Telegram bot token. Please check your token from @BotFather and try again.';
          }
          break;
        }
        
        case 'instagram': {
          // Simulate Instagram Business API validation
          const hasInstagramBusiness = Math.random() > 0.3; // 70% success rate
          if (hasInstagramBusiness) {
            connectionSuccess = true;
          } else {
            errorMessage = 'Instagram Business account verification failed. Please ensure your account is converted to a Business profile and try again.';
          }
          break;
        }
        
        case 'shopify': {
          // For Shopify, show installation success immediately
          connectionSuccess = true;
          break;
        }
        
        default:
          // For other integrations, simulate a general connection process
          connectionSuccess = Math.random() > 0.2; // 80% success rate
          if (!connectionSuccess) {
            errorMessage = 'Connection failed. Please check your configuration and try again.';
          }
      }

      if (connectionSuccess) {
        // Update integration status to connected
        setIntegrations(prev => prev.map(int => 
          int.id === integration.id 
            ? { ...int, status: 'connected', lastSync: 'Just now', messageCount: 0, errorMessage: undefined }
            : int
        ));
        
        onIntegrationToggle?.(integration.id, true);
        
        // Show success notification
        const successModal = document.createElement('div');
        successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        
        const isShopify = integration.id === 'shopify';
        const title = isShopify ? 'Installation Successful!' : 'Connection Successful!';
        const message = isShopify ? 
          'Shopify chatbot widget has been installed successfully. The widget is now active on your store.' : 
          `${integration.name} has been connected successfully.`;
        
        successModal.innerHTML = `
          <div class="bg-white rounded-xl max-w-md w-full p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
                <p class="text-gray-600">${message}</p>
              </div>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Continue
            </button>
          </div>
        `;
        document.body.appendChild(successModal);
        setTimeout(() => successModal.remove(), 3000);
        
      } else {
        // Update integration status to error
        setIntegrations(prev => prev.map(int => 
          int.id === integration.id 
            ? { ...int, status: 'error', errorMessage }
            : int
        ));
      }
      
    } catch (error) {
      // Handle unexpected errors
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: 'error', errorMessage: 'An unexpected error occurred. Please try again later.' }
          : int
      ));
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnectIntegration = async (integration: Integration) => {
    setIsConnecting(integration.id);
    
    try {
      // Simulate API call to disconnect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: 'disconnected', lastSync: undefined, messageCount: undefined, errorMessage: undefined }
          : int
      ));
      
      onIntegrationToggle?.(integration.id, false);
      
      // Show disconnect notification
      const disconnectModal = document.createElement('div');
      disconnectModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      disconnectModal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Integration Disconnected</h3>
              <p class="text-gray-600">${integration.name} has been disconnected successfully.</p>
            </div>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
            Close
          </button>
        </div>
      `;
      document.body.appendChild(disconnectModal);
      setTimeout(() => disconnectModal.remove(), 3000);
      
    } catch (error) {
      console.error('Failed to disconnect integration:', error);
      
      // Show error notification
      const errorModal = document.createElement('div');
      errorModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      errorModal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Disconnection Failed</h3>
              <p class="text-gray-600">Failed to disconnect ${integration.name}. Please try again.</p>
            </div>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Close
          </button>
        </div>
      `;
      document.body.appendChild(errorModal);
      setTimeout(() => errorModal.remove(), 3000);
    } finally {
      setIsConnecting(null);
    }
  };



  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 border border-green-200">Connected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">Pending</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border border-red-200">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Not Connected</Badge>;
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    switch (activeTab) {
      case 'connected':
        return integration.status === 'connected';
      case 'available':
        return integration.status === 'disconnected';
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Integrations</h2>
          <p className="text-gray-600 mt-1">
            Connect your chatbot to multiple platforms and reach customers everywhere
          </p>
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh Status
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'All Integrations', count: integrations.length },
            { id: 'connected', label: 'Connected', count: integrations.filter(i => i.status === 'connected').length },
            { id: 'available', label: 'Available', count: integrations.filter(i => i.status === 'disconnected').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'all' | 'connected' | 'available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Integration Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map(integration => (
          <Card key={integration.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${
                    integration.status === 'connected' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {integration.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg truncate text-gray-900">{integration.name}</CardTitle>
                      {integration.isPopular && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs whitespace-nowrap">Popular</Badge>
                      )}
                    </div>
                    <div className="mt-1">{getStatusBadge(integration.status)}</div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {getStatusIcon(integration.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed text-gray-700">
                {integration.description}
              </CardDescription>

              {integration.status === 'connected' && (
                <div className="bg-green-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Messages</span>
                    <span className="font-medium text-green-900">{integration.messageCount?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Last sync</span>
                    <span className="font-medium text-green-900">{integration.lastSync}</span>
                  </div>
                </div>
              )}

              {integration.status === 'error' && integration.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{integration.errorMessage}</p>
                </div>
              )}

              <div className="flex space-x-2">
                {integration.status === 'connected' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIntegration(integration)}
                      leftIcon={<Settings className="w-4 h-4" />}
                      className="flex-1"
                    >
                      Configure
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDisconnectIntegration(integration)}
                      disabled={isConnecting === integration.id}
                      className="flex-1"
                    >
                      {isConnecting === integration.id ? 'Disconnecting...' : 'Disconnect'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIntegration(integration)}
                      leftIcon={<Eye className="w-4 h-4" />}
                      className="flex-1"
                    >
                      Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConnectIntegration(integration)}
                      disabled={isConnecting === integration.id}
                      className="flex-1"
                    >
                      {isConnecting === integration.id ? 
                        (integration.id === 'shopify' ? 'Installing...' : 'Connecting...') : 
                        (integration.id === 'shopify' ? 'Install' : 'Connect')
                      }
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Details Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {selectedIntegration.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedIntegration.name}</h3>
                    <p className="text-gray-600">{selectedIntegration.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedIntegration(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6 grid gap-6 md:grid-cols-2">
              {/* Setup Steps */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Setup Steps</h4>
                <ol className="space-y-2">
                  {selectedIntegration.setupSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {selectedIntegration.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {selectedIntegration.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integration Details */}
              {selectedIntegration.status === 'connected' && selectedIntegration.webhookUrl && (
                <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Integration Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={selectedIntegration.webhookUrl}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedIntegration.webhookUrl!, 'webhook')}
                          leftIcon={<Copy className="w-4 h-4" />}
                        >
                          {copied === 'webhook' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                Close
              </Button>
              {selectedIntegration.status === 'disconnected' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedIntegration(null);
                    handleConnectIntegration(selectedIntegration);
                  }}
                  leftIcon={<Zap className="w-4 h-4" />}
                >
                  {selectedIntegration.id === 'shopify' ? 'Install Now' : 'Connect Now'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationManager; 