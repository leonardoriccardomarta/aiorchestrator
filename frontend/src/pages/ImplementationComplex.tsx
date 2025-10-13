import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { Icons } from '../components/ui/Icon';
import { PageLoading } from '../components/ui/Loading';
import { useAuth } from '../contexts/AuthContextHooks';
import { Copy, Check, ExternalLink, Code, Smartphone, Tablet, Monitor, Zap, Shield, Globe, MessageSquare, Settings, Eye } from 'lucide-react';

const Implementation: React.FC = () => {
  const [selectedChatbot, setSelectedChatbot] = useState<any>(null);
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [implementationCode, setImplementationCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [activeTab, setActiveTab] = useState<'embed' | 'api' | 'integrations' | 'customize'>('embed');
  const { user } = useAuth();

  useEffect(() => {
    loadChatbots();
  }, []);

  const loadChatbots = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chatbots`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatbots(data.data || []);
        
        // Set first chatbot as selected by default
        if (data.data && data.data.length > 0) {
          setSelectedChatbot(data.data[0]);
        }
      }
      
      // Get API key (in real app, this would come from user settings)
      setApiKey(`ak_live_${user?.id || 'demo'}_${Date.now()}`);
      setLoading(false);
    } catch (error) {
      console.error('Error loading chatbots:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChatbot && apiKey) {
      const code = `<!-- AI Orchestrator Chatbot Widget -->
<script src="https://your-domain.com/widget/chatbot-widget.js" 
        data-chatbot-id="${selectedChatbot.id}"
        data-api-key="${apiKey}">
</script>

<!-- Optional: Custom styling -->
<style>
  #ai-orchestrator-widget {
    /* Customize widget position */
    bottom: 30px;
    right: 30px;
  }
  
  .ai-widget-button {
    /* Customize button color */
    background: ${selectedChatbot.primaryColor || '#3B82F6'};
  }
  
  .ai-widget-header {
    background: ${selectedChatbot.primaryColor || '#3B82F6'};
  }
</style>`;
      setImplementationCode(code);
      
      // Load preview data for the selected chatbot
      loadPreviewData(selectedChatbot.id);
    }
  }, [selectedChatbot, apiKey]);

  const loadPreviewData = async (chatbotId: string) => {
    try {
      // Load chatbot-specific data
      const [faqsResponse, analyticsResponse] = await Promise.all([
        fetch(`http://localhost:4000/api/faqs?chatbotId=${chatbotId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }),
        fetch(`http://localhost:4000/api/analytics?chatbotId=${chatbotId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
      ]);

      const faqsData = faqsResponse.ok ? await faqsResponse.json() : { data: [] };
      const analyticsData = analyticsResponse.ok ? await analyticsResponse.json() : { data: { totalMessages: 0, satisfactionScore: 0 } };

      setPreviewData({
        faqs: faqsData.data || [],
        analytics: analyticsData.data || { totalMessages: 0, satisfactionScore: 0 },
        chatbot: selectedChatbot
      });
    } catch (error) {
      console.error('Error loading preview data:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '320px';
      case 'tablet': return '400px';
      default: return '480px';
    }
  };

  const getPreviewHeight = () => {
    switch (previewDevice) {
      case 'mobile': return '280px';
      case 'tablet': return '320px';
      default: return '340px';
    }
  };

  if (loading) {
    return <PageLoading text="Loading implementation guide..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Implementation Guide</h1>
          <p className="text-gray-600">
            Get your AI chatbot up and running on your website in minutes with our comprehensive implementation tools
          </p>
        </div>

        {selectedChatbot ? (
          <div className="space-y-8">
            {/* Chatbot Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Icons.Chatbot className="w-5 h-5 mr-2 text-blue-600" />
                Select Your Chatbot
              </h2>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedChatbot?.id || ''}
                  onChange={(e) => {
                    const chatbot = chatbots.find(c => c.id === e.target.value);
                    setSelectedChatbot(chatbot || null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a chatbot...</option>
                  {chatbots.map((chatbot) => (
                    <option key={chatbot.id} value={chatbot.id}>
                      {chatbot.name} - {chatbot.description}
                    </option>
                  ))}
                </select>
                
                {selectedChatbot && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedChatbot.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedChatbot.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{selectedChatbot.model || 'gpt-3.5-turbo'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'embed', label: 'Embed Code', icon: Code },
                    { id: 'api', label: 'API Reference', icon: Settings },
                    { id: 'integrations', label: 'Integrations', icon: Globe },
                    { id: 'customize', label: 'Customize', icon: Eye }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Embed Code Tab */}
                {activeTab === 'embed' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Embed</h3>
                      <p className="text-gray-600 mb-4">
                        Copy and paste this code into your website's HTML to add the chatbot widget.
                      </p>
                      
                      <div className="bg-gray-900 rounded-lg p-4 relative">
                        <pre className="text-green-400 text-sm overflow-x-auto">
                          <code>{implementationCode}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(implementationCode)}
                          className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setPreviewDevice('mobile')}
                            className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                          >
                            <Smartphone className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPreviewDevice('tablet')}
                            className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                          >
                            <Tablet className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPreviewDevice('desktop')}
                            className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                          >
                            <Monitor className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex justify-center">
                        <div 
                          className="bg-white rounded-lg shadow-lg border"
                          style={{ 
                            width: getPreviewWidth(), 
                            height: getPreviewHeight(),
                            maxWidth: '100%'
                          }}
                        >
                          {previewData ? (
                            <div className="p-4 h-full flex flex-col">
                              {/* Chatbot Header */}
                              <div className="flex items-center space-x-3 mb-4">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                                  style={{ backgroundColor: selectedChatbot.primaryColor || '#3B82F6' }}
                                >
                                  
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm">{selectedChatbot.name}</div>
                                  <div className="text-xs text-gray-500">🟢 Online</div>
                                </div>
                              </div>
                              
                              {/* Chat Messages */}
                              <div className="flex-1 space-y-2 mb-4">
                                <div className="bg-gray-100 rounded-lg p-2 text-sm">
                                  <div className="font-medium text-gray-700 mb-1">Bot</div>
                                  <div className="text-gray-600">Hello! I'm {selectedChatbot.name}. How can I help you today?</div>
                                </div>
                                <div className="bg-blue-500 text-white rounded-lg p-2 text-sm ml-8">
                                  <div className="font-medium mb-1">You</div>
                                  <div>What can you help me with?</div>
                                </div>
                              </div>
                              
                              {/* Input */}
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  placeholder="Type your message..."
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                                  Send
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                  💬
                                </div>
                                <div className="text-sm">Select a chatbot to preview</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Reference Tab */}
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">API Reference</h3>
                      <p className="text-gray-600 mb-6">
                        Use our REST API to integrate the chatbot into your custom applications.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Send Message</h4>
                          <div className="bg-gray-900 rounded p-3 mb-2">
                            <code className="text-green-400 text-sm">
                              POST /api/chatbot/message
                            </code>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Headers:</strong> Authorization: Bearer {apiKey}
                          </div>
                           <div className="text-sm text-gray-600">
                             <strong>Body:</strong> {`{ "message": "Hello", "chatbotId": "${selectedChatbot?.id || 'chatbot-id'}" }`}
                           </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Get Chatbot Config</h4>
                          <div className="bg-gray-900 rounded p-3 mb-2">
                            <code className="text-green-400 text-sm">
                              GET /api/widget/config/{selectedChatbot?.id}
                            </code>
                          </div>
                          <div className="text-sm text-gray-600">
                            Returns chatbot configuration for widget integration
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Integrations Tab */}
                {activeTab === 'integrations' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Integrations</h3>
                      <p className="text-gray-600 mb-6">
                        Connect your chatbot to popular platforms and services.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { name: 'WordPress', icon: '', status: 'Available', description: 'Plugin available' },
                          { name: 'Shopify', icon: '🛒', status: 'Available', description: 'App store ready' },
                          { name: 'Wix', icon: '', status: 'Available', description: 'Widget integration' },
                          { name: 'Squarespace', icon: '⬜', status: 'Available', description: 'Code injection' },
                          { name: 'Webflow', icon: '🌊', status: 'Available', description: 'Custom code' },
                          { name: 'React', icon: '⚛️', status: 'Available', description: 'Component library' }
                        ].map((platform) => (
                          <div key={platform.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">{platform.icon}</span>
                              <div>
                                <h4 className="font-medium text-gray-900">{platform.name}</h4>
                                <span className="text-sm text-green-600">{platform.status}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{platform.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Customize Tab */}
                {activeTab === 'customize' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Appearance</h3>
                      <p className="text-gray-600 mb-6">
                        Customize the look and feel of your chatbot widget.
                      </p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Primary Color
                            </label>
                            <input
                              type="color"
                              value={selectedChatbot?.primaryColor || '#3B82F6'}
                              className="w-full h-10 border border-gray-300 rounded-lg"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Widget Position
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                              <option>Bottom Right</option>
                              <option>Bottom Left</option>
                              <option>Top Right</option>
                              <option>Top Left</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Welcome Message
                            </label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              rows={3}
                              placeholder="Enter your welcome message..."
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="bg-white rounded-lg shadow-sm p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <div 
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                                  style={{ backgroundColor: selectedChatbot?.primaryColor || '#3B82F6' }}
                                >
                                  
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{selectedChatbot?.name}</div>
                                  <div className="text-xs text-gray-500">🟢 Online</div>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600">
                                Hi! How can I help you today?
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {previewData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Messages</p>
                      <p className="text-2xl font-bold text-gray-900">{previewData.analytics.totalMessages || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                      <p className="text-2xl font-bold text-gray-900">{previewData.analytics.satisfactionScore || 0}/5</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">FAQ Knowledge</p>
                      <p className="text-2xl font-bold text-gray-900">{previewData.faqs?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icons.Chatbot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Chatbot Selected</h3>
            <p className="text-gray-500">Please select a chatbot to view implementation options</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Implementation;
