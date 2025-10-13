import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Channel {
  id: string;
  name: string;
  type: 'website' | 'whatsapp' | 'messenger' | 'telegram' | 'instagram' | 'shopify' | 'email' | 'sms';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  isEnabled: boolean;
  config: ChannelConfig;
  metrics: ChannelMetrics;
  lastSync?: Date;
  errorMessage?: string;
}

interface ChannelConfig {
  apiKey?: string;
  accessToken?: string;
  phoneNumber?: string;
  webhookUrl?: string;
  settings: Record<string, unknown>;
}

interface ChannelMetrics {
  totalMessages: number;
  responseRate: number;
  averageResponseTime: number;
  activeUsers: number;
  conversionRate: number;
  lastMessage?: Date;
}

interface AdvancedChannelManagerProps {
  chatbotId: string;
  onChannelUpdate?: (channel: Channel) => void;
  onChannelTest?: (channelId: string) => Promise<boolean>;
}

const CHANNEL_TEMPLATES = {
  website: {
    name: 'Website Widget',
    description: 'Embed chatbot directly on your website',
    icon: '',
    color: 'blue',
    setupSteps: [
      'Copy the integration code',
      'Paste it before closing </body> tag',
      'Customize appearance in settings',
      'Test the widget functionality'
    ],
    features: ['Custom styling', 'Mobile responsive', 'Real-time messaging', 'Analytics tracking'],
    integrationCode: `
<!-- AI Orchestrator Chatbot Widget -->
<script>
  window.aiOrchestratorConfig = {
    chatbotId: '{{CHATBOT_ID}}',
    primaryColor: '{{PRIMARY_COLOR}}',
    position: 'bottom-right',
    autoOpen: false,
    showBranding: true
  };
</script>
<script src="https://cdn.aiorchestrator.com/widget.js" async></script>
<!-- End AI Orchestrator Widget -->`
  },
  whatsapp: {
    name: 'WhatsApp Business',
    description: 'Connect with customers via WhatsApp Business API',
    icon: '💬',
    color: 'green',
    setupSteps: [
      'Verify your WhatsApp Business account',
      'Generate API credentials',
      'Configure webhook endpoints',
      'Test message delivery'
    ],
    features: ['Rich media support', 'Template messages', 'Group messaging', 'Status tracking'],
    requirements: ['WhatsApp Business Account', 'Verified phone number', 'Facebook Business Manager']
  },
  messenger: {
    name: 'Facebook Messenger',
    description: 'Integrate with Facebook Messenger platform',
    icon: '',
    color: 'blue',
    setupSteps: [
      'Create Facebook App',
      'Set up Messenger webhook',
      'Generate page access token',
      'Configure app permissions'
    ],
    features: ['Rich cards', 'Quick replies', 'Persistent menu', 'User profiles'],
    requirements: ['Facebook Page', 'Facebook Developer Account', 'SSL Certificate']
  },
  telegram: {
    name: 'Telegram Bot',
    description: 'Deploy bot on Telegram messaging platform',
    icon: '📬',
    color: 'cyan',
    setupSteps: [
      'Create bot with @BotFather',
      'Get bot token',
      'Set webhook URL',
      'Configure bot commands'
    ],
    features: ['Inline keyboards', 'File sharing', 'Group chats', 'Custom commands'],
    requirements: ['Telegram account', 'Bot token from @BotFather']
  },
  instagram: {
    name: 'Instagram Direct',
    description: 'Respond to Instagram direct messages',
    icon: '📸',
    color: 'pink',
    setupSteps: [
      'Connect Instagram Business account',
      'Enable messaging access',
      'Configure auto-responses',
      'Set up story mentions'
    ],
    features: ['Story replies', 'Image recognition', 'Auto-responses', 'User insights'],
    requirements: ['Instagram Business Account', 'Facebook Page connection']
  },
  shopify: {
    name: 'Shopify Store',
    description: 'Integrate with your Shopify e-commerce store',
    icon: '🛍️',
    color: 'green',
    setupSteps: [
      'Install Shopify app',
      'Authorize store access',
      'Configure product catalog',
      'Set up order tracking'
    ],
    features: ['Product recommendations', 'Order tracking', 'Inventory queries', 'Cart recovery'],
    requirements: ['Active Shopify store', 'Admin permissions']
  },
  email: {
    name: 'Email Support',
    description: 'Handle customer support via email',
    icon: '📧',
    color: 'yellow',
    setupSteps: [
      'Configure SMTP settings',
      'Set up email templates',
      'Configure auto-responders',
      'Test email delivery'
    ],
    features: ['Auto-responses', 'Email templates', 'Ticket creation', 'Follow-up sequences'],
    requirements: ['Email server access', 'SMTP credentials']
  },
  sms: {
    name: 'SMS Messaging',
    description: 'Send and receive SMS messages',
    icon: '',
    color: 'purple',
    setupSteps: [
      'Choose SMS provider',
      'Configure phone numbers',
      'Set up message routing',
      'Test SMS delivery'
    ],
    features: ['Two-way messaging', 'Bulk messaging', 'Delivery reports', 'Short codes'],
    requirements: ['SMS provider account', 'Phone number verification']
  }
};

const AdvancedChannelManager: React.FC<AdvancedChannelManagerProps> = ({
  chatbotId,
  onChannelUpdate,
  onChannelTest
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isTestingChannel, setIsTestingChannel] = useState<string | null>(null);
  const [_showIntegrationCode, _setShowIntegrationCode] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'setup' | 'test' | 'analytics'>('overview');

  const initializeChannels = useCallback(() => {
    const initialChannels: Channel[] = Object.entries(CHANNEL_TEMPLATES).map(([type, template]) => ({
      id: `${type}_${chatbotId}`,
      name: template.name,
      type: type as Channel['type'],
      status: type === 'website' ? 'connected' : 'disconnected',
      isEnabled: type === 'website',
      config: {
        settings: {}
      },
      metrics: {
        totalMessages: Math.floor(Math.random() * 1000),
        responseRate: 85 + Math.random() * 15,
        averageResponseTime: 1 + Math.random() * 3,
        activeUsers: Math.floor(Math.random() * 500),
        conversionRate: 5 + Math.random() * 20,
        lastMessage: new Date(Date.now() - Math.random() * 86400000)
      }
    }));
    setChannels(initialChannels);
  }, [chatbotId]);

  useEffect(() => {
    initializeChannels();
  }, [chatbotId, initializeChannels]);

  const handleChannelConnect = async (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;

    setChannels(prev => prev.map(c => 
      c.id === channelId 
        ? { ...c, status: 'pending' }
        : c
    ));

    // Simulate connection process
    setTimeout(() => {
      setChannels(prev => prev.map(c => 
        c.id === channelId 
          ? { ...c, status: 'connected', isEnabled: true, lastSync: new Date() }
          : c
      ));
      onChannelUpdate?.(channel);
    }, 2000);
  };

  const handleChannelTest = async (channelId: string) => {
    setIsTestingChannel(channelId);
    
    try {
      const success = await onChannelTest?.(channelId) ?? Math.random() > 0.2;
      setTestResults(prev => ({ ...prev, [channelId]: success }));
      
      if (!success) {
        setChannels(prev => prev.map(c => 
          c.id === channelId 
            ? { ...c, status: 'error', errorMessage: 'Connection test failed' }
            : c
        ));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [channelId]: false }));
    } finally {
      setIsTestingChannel(null);
    }
  };

  const getChannelTemplate = (type: string) => {
    return CHANNEL_TEMPLATES[type as keyof typeof CHANNEL_TEMPLATES];
  };

  const getStatusColor = (status: Channel['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const generateIntegrationCode = (channel: Channel) => {
    const template = getChannelTemplate(channel.type);
    if (!template || !('integrationCode' in template)) return '';

    return (template.integrationCode as string)
      .replace('{{CHATBOT_ID}}', chatbotId)
      .replace('{{PRIMARY_COLOR}}', '#3B82F6');
  };

  // Add a type guard for requirements
  function hasRequirements(template: unknown): template is { requirements: string[] } {
    return (
      typeof template === 'object' &&
      template !== null &&
      Array.isArray((template as { requirements?: unknown }).requirements)
    );
  }


  const connectedChannels = channels.filter(c => c.status === 'connected');
  const totalMessages = connectedChannels.reduce((sum, c) => sum + c.metrics.totalMessages, 0);
  const avgResponseRate = connectedChannels.length > 0 
    ? connectedChannels.reduce((sum, c) => sum + c.metrics.responseRate, 0) / connectedChannels.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Connected Channels</div>
          <div className="text-2xl font-bold text-gray-900">{connectedChannels.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Total Messages</div>
          <div className="text-2xl font-bold text-gray-900">{totalMessages.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Avg Response Rate</div>
          <div className="text-2xl font-bold text-gray-900">{avgResponseRate.toFixed(1)}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Active Users</div>
          <div className="text-2xl font-bold text-gray-900">
            {connectedChannels.reduce((sum, c) => sum + c.metrics.activeUsers, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Channel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => {
          const template = getChannelTemplate(channel.type);
          const isConnected = channel.status === 'connected';
          const isPending = channel.status === 'pending';
          const hasError = channel.status === 'error';
          const testResult = testResults[channel.id];

          return (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{template?.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                      <p className="text-sm text-gray-500">{template?.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(channel.status)}`}>
                    {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {isConnected && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Messages</span>
                      <span className="text-sm font-medium">{channel.metrics.totalMessages.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Response Rate</span>
                      <span className="text-sm font-medium">{channel.metrics.responseRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Active Users</span>
                      <span className="text-sm font-medium">{channel.metrics.activeUsers.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {hasError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{channel.errorMessage}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!isConnected && !isPending && (
                    <button
                      onClick={() => handleChannelConnect(channel.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Connect Channel
                    </button>
                  )}

                  {isPending && (
                    <div className="w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
                        <span>Connecting...</span>
                      </div>
                    </div>
                  )}

                  {isConnected && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleChannelTest(channel.id)}
                        disabled={isTestingChannel === channel.id}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {isTestingChannel === channel.id ? (
                          <div className="flex items-center justify-center space-x-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-600 border-t-transparent"></div>
                            <span className="text-xs">Testing</span>
                          </div>
                        ) : (
                          <span className="text-xs">Test</span>
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedChannel(channel)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xs">Configure</span>
                      </button>
                    </div>
                  )}

                  {testResult !== undefined && (
                    <div className={`w-full px-3 py-2 rounded-lg text-center text-xs ${
                      testResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Test {testResult ? 'Passed' : 'Failed'}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="px-6 pb-6">
                <div className="text-xs font-medium text-gray-500 mb-2">Features</div>
                <div className="flex flex-wrap gap-1">
                  {template?.features?.slice(0, 3).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                  {(template?.features?.length || 0) > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{(template.features.length - 3)} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Integration Modal */}
      <AnimatePresence>
        {selectedChannel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedChannel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getChannelTemplate(selectedChannel.type)?.icon}</div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedChannel.name}</h2>
                      <p className="text-gray-500">{getChannelTemplate(selectedChannel.type)?.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedChannel(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                {['overview', 'setup', 'test', 'analytics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getChannelTemplate(selectedChannel.type)?.features?.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {(() => {
                      const template = getChannelTemplate(selectedChannel.type);
                      if (hasRequirements(template) && template.requirements) {
                        return (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {template.requirements.map((req, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                {activeTab === 'setup' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Setup Steps</h3>
                      <div className="space-y-3">
                        {getChannelTemplate(selectedChannel.type)?.setupSteps?.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-700 mt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedChannel.type === 'website' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Integration Code</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
                          <pre className="text-sm">
                            <code>{generateIntegrationCode(selectedChannel)}</code>
                          </pre>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generateIntegrationCode(selectedChannel));
                          }}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Copy Code
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'test' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Channel Testing</h3>
                      <p className="text-gray-600 mb-4">
                        Test your channel integration to ensure everything is working correctly.
                      </p>
                      
                      <button
                        onClick={() => handleChannelTest(selectedChannel.id)}
                        disabled={isTestingChannel === selectedChannel.id}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isTestingChannel === selectedChannel.id ? 'Testing...' : 'Run Test'}
                      </button>

                      {testResults[selectedChannel.id] !== undefined && (
                        <div className={`mt-4 p-4 rounded-lg ${
                          testResults[selectedChannel.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {testResults[selectedChannel.id] 
                            ? '✓ Test passed! Your channel is working correctly.'
                            : '✗ Test failed. Please check your configuration and try again.'
                          }
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && selectedChannel.status === 'connected' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Total Messages</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedChannel.metrics.totalMessages.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Response Rate</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedChannel.metrics.responseRate.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedChannel.metrics.conversionRate.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                      <p className="text-gray-600">
                        Last message: {selectedChannel.metrics.lastMessage?.toLocaleString() || 'No recent activity'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedChannelManager;