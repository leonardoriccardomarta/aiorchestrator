import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { useChatbot } from '../contexts/ChatbotContext';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  Copy, 
  ExternalLink, 
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Globe,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  Code,
  X
} from 'lucide-react';
import EmbedCodeGenerator from './EmbedCodeGenerator';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  language: string;
  messagesCount: number;
  conversionRate: number;
  lastActive: string;
  websiteUrl?: string;
  embedCode: string;
  settings: {
    welcomeMessage: string;
    fallbackMessage: string;
    workingHours: string;
    languages: string[];
    aiModel: string;
  };
}

const ChatbotManagement: React.FC = () => {
  const { chatbots, loading } = useChatbot();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedChatbot, setEmbedChatbot] = useState<Chatbot | null>(null);

  const toggleChatbotStatus = async (chatbotId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`${API_URL}/api/chatbots/${chatbotId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Note: The context will handle the state update
        console.log('Chatbot status updated successfully');
      }
    } catch (error) {
      console.error('Error updating chatbot status:', error);
    }
  };

  const copyEmbedCode = (embedCode: string) => {
    navigator.clipboard.writeText(embedCode);
    // You could add a toast notification here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Pause className="w-4 h-4" />;
      case 'draft': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your chatbots...</p>
        </div>
      </div>
    );
  }

  if (chatbots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bot className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No chatbots yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Create your first AI chatbot to start engaging with customers in 50+ languages.
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Chatbot
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your Chatbots</h3>
          <p className="text-sm text-gray-600">{chatbots.length} chatbot{chatbots.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chatbot
        </button>
      </div>

      {/* Chatbots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatbots.map((chatbot) => (
          <div key={chatbot.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{chatbot.name}</h4>
                    <p className="text-sm text-gray-600">{chatbot.description}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chatbot.status)}`}>
                  {getStatusIcon(chatbot.status)}
                  <span className="capitalize">{chatbot.status}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{(chatbot.messagesCount ?? 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Messages</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{chatbot.conversionRate ?? 0}%</div>
                  <div className="text-xs text-gray-600">Conversion</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleChatbotStatus(chatbot.id, chatbot.status)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      chatbot.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {chatbot.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedChatbot(chatbot)}
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Settings
                  </button>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setEmbedChatbot(chatbot);
                      setShowEmbedModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Generate embed code"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyEmbedCode(chatbot.embedCode)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy embed code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(chatbot.websiteUrl, '_blank')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="View on website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Embed Code */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Embed Code</span>
                  <button
                    onClick={() => copyEmbedCode(chatbot.embedCode)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Copy
                  </button>
                </div>
                <code className="text-xs text-gray-700 bg-white p-2 rounded border block overflow-x-auto">
                  {chatbot.embedCode.substring(0, 60)}...
                </code>
              </div>

              {/* Last Active */}
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                <span>Last active: {chatbot.lastActive}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Chatbot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Create New Chatbot</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chatbot Name</label>
                <input
                  type="text"
                  placeholder="e.g., Customer Support Bot"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe what this chatbot will help with..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Language</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="en">English</option>
                  <option value="it">Italiano</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle chatbot creation
                    setShowCreateModal(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Create Chatbot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Generator Modal */}
      {showEmbedModal && embedChatbot && (
        <EmbedCodeGenerator
          chatbotId={embedChatbot.id}
          apiKey={localStorage.getItem('authToken') || ''}
          onClose={() => {
            setShowEmbedModal(false);
            setEmbedChatbot(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatbotManagement;














