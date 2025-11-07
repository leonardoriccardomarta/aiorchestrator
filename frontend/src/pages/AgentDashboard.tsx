import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { UserCheck, Clock, MessageCircle, Star, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: string;
  priority: string;
  startedAt: Date;
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    createdAt: Date;
  }>;
}

interface AgentStats {
  activeChats: number;
  totalResolved: number;
  avgRating: number;
}

const AgentDashboard: React.FC = () => {
  const [activeConversations, setActiveConversations] = useState<Conversation[]>([]);
  const [queueConversations, setQueueConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<AgentStats>({ activeChats: 0, totalResolved: 0, avgRating: 5.0 });
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline' | 'busy' | 'away'>('offline');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  
  // API_URL imported from constants

  useEffect(() => {
    fetchAgentData();
    const interval = setInterval(fetchAgentData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgentData = async () => {
    try {
      // Fetch active conversations
      const conversationsRes = await axios.get(`${API_URL}/api/agents/conversations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (conversationsRes.data.success) {
        setActiveConversations(conversationsRes.data.conversations);
      }

      // Fetch queue
      const queueRes = await axios.get(`${API_URL}/api/agents/queue`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (queueRes.data.success) {
        setQueueConversations(queueRes.data.conversations);
      }

      // Fetch stats
      const statsRes = await axios.get(`${API_URL}/api/agents/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
    }
  };

  const updateAgentStatus = async (newStatus: 'online' | 'offline' | 'busy' | 'away') => {
    try {
      const response = await axios.put(
        `${API_URL}/api/agents/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setAgentStatus(newStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const acceptConversation = async (conversationId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/agents/handoff/accept`,
        { conversationId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        fetchAgentData();
        // Open conversation
        const conversation = queueConversations.find(c => c.id === conversationId);
        if (conversation) {
          setSelectedConversation(conversation);
        }
      }
    } catch (error) {
      console.error('Error accepting conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !messageInput.trim()) return;

    try {
      await axios.post(
        `${API_URL}/api/agents/conversations/${selectedConversation.id}/messages`,
        {
          sender: 'agent',
          senderName: 'Agent',
          message: messageInput
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessageInput('');
      fetchAgentData();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const resolveConversation = async (conversationId: string, rating?: number) => {
    try {
      await axios.post(
        `${API_URL}/api/agents/handoff/resolve`,
        { conversationId, rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSelectedConversation(null);
      fetchAgentData();
    } catch (error) {
      console.error('Error resolving conversation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-blue-600" />
                Live Agent Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage customer conversations in real-time</p>
            </div>
            
            {/* Status Toggle */}
            <div className="flex gap-2">
              {['online', 'busy', 'away', 'offline'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateAgentStatus(status as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    agentStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'online' && '● Online'}
                  {status === 'busy' && '● Busy'}
                  {status === 'away' && '● Away'}
                  {status === 'offline' && '● Offline'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Active Chats</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.activeChats}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-900">{stats.totalResolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.avgRating.toFixed(1)} ⭐</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">In Queue</p>
                  <p className="text-2xl font-bold text-purple-900">{queueConversations.length}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Queue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Waiting Queue ({queueConversations.length})
            </h2>
            
            <div className="space-y-3">
              {queueConversations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No conversations waiting</p>
              ) : (
                queueConversations.map((conv) => (
                  <div key={conv.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{conv.visitorName}</p>
                        <p className="text-sm text-gray-600">{conv.visitorEmail}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Priority: <span className={`font-medium ${
                            conv.priority === 'urgent' ? 'text-red-600' :
                            conv.priority === 'high' ? 'text-orange-600' :
                            'text-gray-600'
                          }`}>{conv.priority}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => acceptConversation(conv.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Conversations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Active Chats ({activeConversations.length})
            </h2>
            
            <div className="space-y-3">
              {activeConversations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No active conversations</p>
              ) : (
                activeConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedConversation?.id === conv.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{conv.visitorName}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.messages[conv.messages.length - 1]?.message || 'No messages yet'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resolveConversation(conv.id);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        {selectedConversation && (
          <div className="fixed bottom-0 right-0 w-96 h-[500px] bg-white rounded-t-lg shadow-2xl flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
              <h3 className="font-semibold">{selectedConversation.visitorName}</h3>
              <p className="text-xs opacity-90">{selectedConversation.visitorEmail}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {selectedConversation.messages.map((msg) => (
                <div key={msg.id} className={`mb-3 ${msg.sender === 'agent' ? 'text-right' : ''}`}>
                  <p className="text-xs text-gray-500 mb-1">{msg.sender}</p>
                  <div className={`inline-block px-4 py-2 rounded-lg ${
                    msg.sender === 'agent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;

