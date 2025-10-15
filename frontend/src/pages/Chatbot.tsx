import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Copy, 
  ExternalLink, 
  Plus,
  Play,
  Pause,
  Globe,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  Code,
  X,
  Send,
  Loader2,
  Download,
  HelpCircle
} from 'lucide-react';
import ChatbotManagement from '../components/ChatbotManagement';
import EmbedCodeGenerator from '../components/EmbedCodeGenerator';
import ChatbotTour from '../components/ChatbotTour';
import BrandingSettings from '../components/advanced/BrandingSettings';
import WhiteLabelSettings from '../components/advanced/WhiteLabelSettings';
import PlanLimitations from '../components/PlanLimitations';
import TourButton from '../components/TourButton';
import { useUser } from '../contexts/UserContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'button' | 'card';
}

const Chatbot: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'chat' | 'settings' | 'embed' | 'manage'>('chat');
  const [currentChatbotId, setCurrentChatbotId] = useState<string>('');
  const [chatbotName, setChatbotName] = useState<string>('My AI Assistant');
  const [welcomeMessage, setWelcomeMessage] = useState<string>("Hello! I'm your AI assistant. How can I help you today?");
  const [primaryLanguage, setPrimaryLanguage] = useState<string>('auto');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [chatbotDeleted, setChatbotDeleted] = useState(false);
  
  // Widget customization state
  const [widgetTheme, setWidgetTheme] = useState<'blue' | 'purple' | 'green' | 'red' | 'orange' | 'pink' | 'indigo' | 'teal'>('blue');
  const [widgetSize, setWidgetSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [widgetTitle, setWidgetTitle] = useState<string>('AI Support');
  const [widgetPlaceholder, setWidgetPlaceholder] = useState<string>('Type your message...');
  const [widgetMessage, setWidgetMessage] = useState<string>('Hello! I\'m your AI assistant. How can I help you today?');
  const [showWidgetAvatar, setShowWidgetAvatar] = useState<boolean>(true);
  const [widgetAnimation, setWidgetAnimation] = useState<'fadeIn' | 'slideUp' | 'bounce' | 'scale' | 'none'>('slideUp');

  const createDefaultChatbot = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chatbots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          name: 'My AI Assistant',
          description: 'Your personal AI assistant',
          settings: {
            language: 'auto',
            personality: 'professional',
            welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?"
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        const chatbot = result.data;
        setCurrentChatbotId(chatbot.id);
        setChatbotName(chatbot.name);
        setWelcomeMessage(chatbot.settings?.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?");
        setPrimaryLanguage(chatbot.settings?.language || 'auto');
        
        // Update chat welcome message
        setMessages([{
          id: '1',
          text: chatbot.settings?.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        }]);
        
        console.log('Default chatbot created successfully:', chatbot.id);
      } else {
        console.error('Failed to create default chatbot:', result.error);
      }
    } catch (error) {
      console.error('Error creating default chatbot:', error);
    }
  };

  const loadChatbot = async (autoCreate = true) => {
    try {
      console.log('🔍 Loading chatbots...');
      const token = localStorage.getItem('authToken');
      console.log('🔑 Token:', token ? 'exists' : 'missing');
      
      const res = await fetch('https://aiorchestrator-vtihz.ondigitalocean.app/api/chatbots', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('📡 Response status:', res.status);
      const json = await res.json();
      console.log('📊 Response data:', json);
      
      if (json?.data && json.data.length > 0) {
        const first = json.data[0];
        console.log('✅ Found chatbot:', first.id);
        setCurrentChatbotId(first.id);
        setChatbotName(first.name || 'My AI Assistant');
        setWelcomeMessage(first.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?");
        setPrimaryLanguage(first.language || 'auto');
        setChatbotDeleted(false);
        
        // Update chat welcome message
        setMessages([{
          id: '1',
          text: first.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        }]);
      } else {
        // Only auto-create for first-time users, not after delete
        if (autoCreate) {
          console.log('⚠️ No chatbots found, creating default chatbot...');
          await createDefaultChatbot();
        } else {
          console.log('⚠️ No chatbots found (after delete)');
          setChatbotDeleted(true);
        }
      }
    } catch (e) {
      console.error('❌ Error loading chatbot:', e);
    }
  };

  useEffect(() => {
    // Initialize with welcome message
    setMessages([{
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }]);
    loadChatbot();
  }, []);

  // Sync widget customizations with chatbot settings
  useEffect(() => {
    if (chatbotName) {
      setWidgetTitle(chatbotName);
    }
  }, [chatbotName]);

  // Sync input placeholder with chatbot welcome message
  useEffect(() => {
    if (welcomeMessage) {
      setWidgetPlaceholder('Type your message...');
    }
  }, [welcomeMessage]);

  // Sync widget message with chatbot welcome message
  useEffect(() => {
    if (welcomeMessage) {
      setWidgetMessage(welcomeMessage);
    }
  }, [welcomeMessage]);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify({
          message: text.trim(),
          userId: 'demo-user'
        })
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.data?.response || data.response || data.message || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const scrollToBottom = () => {
    const messagesEnd = document.getElementById('messages-end');
    messagesEnd?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-xl font-medium">Loading chatbot...</p>
          <p className="mt-2 text-gray-500">Preparing your AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" data-tour="chatbot-header">My AI Chatbot</h1>
              <p className="text-gray-600 text-lg">Manage and test your AI assistant</p>
            </div>
            <div className="flex items-center space-x-4">
              <TourButton onClick={() => setShowTour(true)} />
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
              <button
                onClick={() => setShowEmbedModal(true)}
                className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                data-tour="embed-code"
              >
                <Code className="w-4 h-4 mr-2" />
                Get Embed Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8" data-tour="tour-welcome">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chat')}
              data-tour="tour-test-chat"
              className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'chat' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2 inline" />
              Test Chat
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              data-tour="tour-settings"
              className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4 mr-2 inline" />
              Settings
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              data-tour="tour-embed"
              className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'embed' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-4 h-4 mr-2 inline" />
              Embed
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              data-tour="tour-manage"
              className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'manage' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bot className="w-4 h-4 mr-2 inline" />
              My Chatbots
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" data-tour="chat-interface">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">AI Assistant</div>
                    <div className="text-xs text-white/80">Online • 50+ languages supported</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Active</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap font-medium">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div id="messages-end" />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Advanced AI Technology • Multi-language • ML Analytics
              </p>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-6" data-tour="chatbot-management">
            {/* Plan Status */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Plan Status</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {user?.planId === 'starter' ? 'Starter' : user?.planId === 'professional' ? 'Professional' : 'Enterprise'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {currentChatbotId ? (
                      user?.planId === 'starter' ? '1/1' : user?.planId === 'professional' ? '1/2' : user?.planId === 'enterprise' ? '1/3' : '1/1'
                    ) : (
                      user?.planId === 'starter' ? '0/1' : user?.planId === 'professional' ? '0/2' : user?.planId === 'enterprise' ? '0/3' : '0/1'
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Chatbots Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {user?.planId === 'starter' ? '1K' : user?.planId === 'professional' ? '5K' : user?.planId === 'enterprise' ? '25K' : '1K'}
                  </div>
                  <div className="text-sm text-gray-600">Messages/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {user?.planId === 'starter' ? '1' : user?.planId === 'professional' ? '2' : user?.planId === 'enterprise' ? '3' : '1'}
                  </div>
                  <div className="text-sm text-gray-600">Websites</div>
                </div>
              </div>
            </div>

            {/* Current Chatbot */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Chatbot</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Main Chatbot - Hide if deleted */}
                {!chatbotDeleted && currentChatbotId && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{chatbotName}</h4>
                        <p className="text-sm text-gray-600">Main chatbot</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-white/50 rounded-lg">
                    <p className="text-xs text-gray-600 italic">{welcomeMessage}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-1 inline" />
                      Test
                    </button>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Settings className="w-4 h-4 mr-1 inline" />
                      Edit
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                )}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Delete chatbot?</h4>
                      <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-2 text-sm rounded border">Cancel</button>
                        <button onClick={async () => { 
                          if(!currentChatbotId) { alert('No chatbot to delete'); return; }
                          try {
                            const res = await fetch(`${API_URL}/api/chatbots/${currentChatbotId}`, {
                              method: 'DELETE',
                              headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                            });
                            const j = await res.json();
                            if(j?.success) { 
                              setShowDeleteConfirm(false); 
                              setChatbotDeleted(false); // Reset per permettere ricreazione
                              setCurrentChatbotId(''); 
                              setShowDeleteSuccess(true);
                              setTimeout(() => setShowDeleteSuccess(false), 3000);
                              
                              // Ricarica senza auto-create per mostrare stato vuoto
                              await loadChatbot(false);
                            } else { 
                              alert('Delete failed'); 
                            }
                          } catch(e) { 
                            alert('Delete failed'); 
                          }
                        }} className="px-3 py-2 text-sm rounded bg-red-600 text-white">Delete</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Create First Chatbot - Show when no chatbot exists */}
                {(!currentChatbotId || chatbotDeleted) && (
                  <div 
                    onClick={async () => {
                      await createDefaultChatbot();
                      setChatbotDeleted(false);
                    }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Create Your First Chatbot</h4>
                      <p className="text-sm text-gray-600 mb-4">Start building your AI assistant now</p>
                      <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-sm inline-block">
                        <Plus className="w-4 h-4 mr-1 inline" />
                        Create Chatbot
                      </div>
                    </div>
                  </div>
                )}

                {/* Add New Chatbot - Only if plan allows and chatbot exists */}
                {currentChatbotId && !chatbotDeleted && user?.planId !== 'starter' ? (
                  <div 
                    onClick={() => {
                      const name = prompt('Enter chatbot name:');
                      if (name) {
                        alert(`Creating new chatbot: ${name}\n\nIn a real implementation, this would create a new chatbot in your account.`);
                      }
                    }}
                    className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-6 h-6 text-gray-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Create New Chatbot</h4>
                      <p className="text-sm text-gray-600 mb-4">Add another AI assistant for different purposes</p>
                      <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm inline-block">
                        <Plus className="w-4 h-4 mr-1 inline" />
                        Create
                      </div>
                    </div>
                  </div>
                ) : currentChatbotId && !chatbotDeleted ? (
                  <PlanLimitations feature="Create Additional Chatbot" requiredPlan="professional">
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus className="w-6 h-6 text-gray-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Create New Chatbot</h4>
                        <p className="text-sm text-gray-600 mb-4">Add another AI assistant for different purposes</p>
                        <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm inline-block">
                          <Plus className="w-4 h-4 mr-1 inline" />
                          Create
                        </div>
                      </div>
                    </div>
                  </PlanLimitations>
                ) : null}
              </div>
            </div>

            {/* Integration Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" data-tour="tour-integration">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Integration Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Embedding Method */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Embedding Code</h4>
                      <p className="text-sm text-gray-600">Add to any website</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Copy and paste our JavaScript code into your website. Works with any platform.
                  </p>
                  <button 
                    onClick={() => setActiveTab('embed')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Code className="w-4 h-4 mr-2 inline" />
                    Get Embed Code
                  </button>
                </div>

                {/* E-commerce Connections */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">E-commerce Integration</h4>
                      <p className="text-sm text-gray-600">One-click setup</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect directly to Shopify, WooCommerce, or other platforms with one click.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/connections'}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Globe className="w-4 h-4 mr-2 inline" />
                    Connect Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" data-tour="chat-settings">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Chatbot Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chatbot Name</label>
                <input
                  type="text"
                  value={chatbotName}
                  onChange={(e)=>setChatbotName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                <textarea
                  value={welcomeMessage}
                  onChange={(e)=>setWelcomeMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Input Placeholder</label>
                <input
                  type="text"
                  value={widgetPlaceholder}
                  onChange={(e) => setWidgetPlaceholder(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your message..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Language</label>
                <select value={primaryLanguage} onChange={(e)=>setPrimaryLanguage(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="auto">Auto Detect</option>
                  <option value="en">English</option>
                  <option value="it">Italiano</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              <div className="flex items-center justify-end">
                <button onClick={async ()=>{
                  if(!currentChatbotId){ 
                    alert('No chatbot found. Please reload the page.');
                    await loadChatbot();
                    return;
                  }
                  try{
                    const res = await fetch(`https://aiorchestrator-vtihz.ondigitalocean.app/api/chatbots/${currentChatbotId}` ,{
                      method:'PUT',
                      headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                      body: JSON.stringify({ name: chatbotName, welcomeMessage, language: primaryLanguage })
                    });
                    const j = await res.json();
                    if(j?.success){ 
                      setShowSaveSuccess(true);
                      setTimeout(() => setShowSaveSuccess(false), 3000);
                      // Reload chatbot to reflect changes
                      await loadChatbot();
                      // Switch to chat tab to see changes
                      setActiveTab('chat');
                    } else { 
                      alert('Save failed'); 
                    }
                  }catch(e){ alert('Save failed'); }
                }} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
                  Save Settings
                </button>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="mt-8 space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">Advanced Features</h4>
              
              {/* Custom Branding */}
              <BrandingSettings />
              
              {/* White-Label Solution */}
              <WhiteLabelSettings />
            </div>
          </div>
        )}


        {activeTab === 'embed' && (
          <div className="space-y-6">
            {/* Plan Limits */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Plan Limits</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {user?.planId === 'starter' ? 'Starter' : user?.planId === 'professional' ? 'Professional' : 'Enterprise'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {user?.planId === 'starter' ? '1' : user?.planId === 'professional' ? '2' : user?.planId === 'enterprise' ? '3' : '1'}
                  </div>
                  <div className="text-sm text-gray-600">Chatbots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {user?.planId === 'starter' ? '1K' : user?.planId === 'professional' ? '5K' : user?.planId === 'enterprise' ? '25K' : '1K'}
                  </div>
                  <div className="text-sm text-gray-600">Messages/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {user?.planId === 'starter' ? '1' : user?.planId === 'professional' ? '2' : user?.planId === 'enterprise' ? '3' : '1'}
                  </div>
                  <div className="text-sm text-gray-600">Websites</div>
                </div>
              </div>
            </div>

            {/* Embed Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Embed Your Chatbot</h3>
              
              {/* Quick Embed */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Quick Embed</h4>
                <p className="text-sm text-gray-600 mb-4">Add this code to your website to embed your chatbot:</p>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-green-400 text-sm whitespace-pre-wrap">
                    {currentChatbotId ? `<!-- AI Orchestrator Chatbot Widget -->
<script 
  src="https://www.aiorchestrator.dev/chatbot-widget.js"
  data-chatbot-id="${currentChatbotId}"
  data-api-key="demo-key"
  data-theme="${widgetTheme}"
  data-size="${widgetSize}"
  data-title="${widgetTitle}"
  data-placeholder="${widgetPlaceholder}"
  data-show-avatar="${showWidgetAvatar}"
  data-welcome-message="${welcomeMessage}"
  data-animation="${widgetAnimation}"
  defer>
</script>` : 'Loading chatbot...'}
                  </code>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button onClick={() => {
                    const code = currentChatbotId ? `<!-- AI Orchestrator Chatbot Widget -->
<script 
  src="https://www.aiorchestrator.dev/chatbot-widget.js"
  data-chatbot-id="${currentChatbotId}"
  data-api-key="demo-key"
  data-theme="${widgetTheme}"
  data-size="${widgetSize}"
  data-title="${widgetTitle}"
  data-placeholder="${widgetPlaceholder}"
  data-show-avatar="${showWidgetAvatar}"
  data-welcome-message="${welcomeMessage}"
  data-animation="${widgetAnimation}"
  defer>
</script>` : 'No chatbot available';
                    navigator.clipboard.writeText(code).then(() => alert('Copied to clipboard!')).catch(() => alert('Copy failed'));
                  }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Copy className="w-4 h-4 mr-2 inline" />
                    Copy Code
                  </button>
                </div>
              </div>

              {/* Customization Options */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Widget Customization</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                    <div className="flex space-x-2">
                      <div 
                        className={`w-8 h-8 bg-blue-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'blue' ? 'border-blue-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('blue')}
                      ></div>
                      <div 
                        className={`w-8 h-8 bg-purple-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'purple' ? 'border-purple-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('purple')}
                      ></div>
                      <div 
                        className={`w-8 h-8 bg-green-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'green' ? 'border-green-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('green')}
                      ></div>
                      <div 
                        className={`w-8 h-8 bg-red-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'red' ? 'border-red-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('red')}
                      ></div>
                      <div 
                        className={`w-8 h-8 bg-orange-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'orange' ? 'border-orange-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('orange')}
                      ></div>
                      <div 
                        className={`w-8 h-8 bg-pink-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'pink' ? 'border-pink-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('pink')}
                      ></div>
                      <div 
                        className={`w-8 h-8 bg-indigo-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'indigo' ? 'border-indigo-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('indigo')}
                      ></div>
                      <div 
                        className={`w-8 h-8 bg-teal-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'teal' ? 'border-teal-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('teal')}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Widget Title</label>
                    <input
                      type="text"
                      value={widgetTitle}
                      onChange={(e) => setWidgetTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="AI Support"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Input Placeholder</label>
                    <input
                      type="text"
                      value={widgetPlaceholder}
                      onChange={(e) => setWidgetPlaceholder(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your message..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Widget Message</label>
                    <textarea
                      value={widgetMessage}
                      onChange={(e) => setWidgetMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Hello! I'm your AI assistant. How can I help you today?"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showAvatar"
                      checked={showWidgetAvatar}
                      onChange={(e) => setShowWidgetAvatar(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showAvatar" className="ml-2 block text-sm text-gray-700">
                      Show Avatar
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
                    <select 
                      value={widgetAnimation}
                      onChange={(e) => setWidgetAnimation(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="slideUp">Slide Up</option>
                      <option value="fadeIn">Fade In</option>
                      <option value="bounce">Bounce</option>
                      <option value="scale">Scale</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Widget Size</label>
                    <select 
                      value={widgetSize}
                      onChange={(e) => setWidgetSize(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="small">Small (280px)</option>
                      <option value="medium">Medium (384px)</option>
                      <option value="large">Large (448px)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Chatbot Preview</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-4 text-sm text-gray-600">Live Preview</span>
                    </div>
                  </div>
                  {/* Just the chatbot iframe, full size */}
                  {currentChatbotId ? (
                    <iframe
                      src={`${API_URL}/public/embed/${currentChatbotId}?theme=${widgetTheme}&size=${widgetSize}&title=${encodeURIComponent(widgetTitle)}&placeholder=${encodeURIComponent(widgetPlaceholder)}&message=${encodeURIComponent(widgetMessage)}&showAvatar=${showWidgetAvatar}&animation=${widgetAnimation}`}
                      className="w-full h-[500px] border-0"
                      title="Live Chatbot Preview"
                    />
                  ) : (
                    <div className="w-full h-[500px] bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-600">Loading chatbot...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="text-center">
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Embed Code Generator Modal */}
      {showEmbedModal && (
        <EmbedCodeGenerator
          chatbotId="demo-chatbot"
          apiKey="demo-token"
          onClose={() => setShowEmbedModal(false)}
        />
      )}

      {/* Chatbot Tour */}
      <ChatbotTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />

      {/* Success Notifications */}
      {showSaveSuccess && (
        <div className="fixed top-20 right-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl shadow-2xl p-6 z-50 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">Settings Saved!</div>
              <div className="text-gray-600 text-sm">Your chatbot has been updated successfully</div>
            </div>
          </div>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="fixed top-20 right-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500 rounded-xl shadow-2xl p-6 z-50 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">Chatbot Deleted!</div>
              <div className="text-gray-600 text-sm">Your chatbot has been removed successfully</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;