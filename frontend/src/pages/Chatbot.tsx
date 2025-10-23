import React, { useState, useEffect } from 'react';
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
  Save,
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
import { useChatbot } from '../contexts/ChatbotContext';
import AddChatbotModal from '../components/AddChatbotModal';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'button' | 'card';
}

const Chatbot: React.FC = () => {
  const { user } = useUser();
  const { chatbots, selectedChatbot } = useChatbot();
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
  const [showAddChatbotModal, setShowAddChatbotModal] = useState(false);
  
  // Widget customization state
  const [widgetTheme, setWidgetTheme] = useState<'blue' | 'purple' | 'green' | 'red' | 'orange' | 'pink' | 'indigo' | 'teal'>('blue');
  const [widgetTitle, setWidgetTitle] = useState<string>('AI Support');
  const [widgetPlaceholder, setWidgetPlaceholder] = useState<string>('Type your message...');
  const [widgetMessage, setWidgetMessage] = useState<string>('Hello! I\'m your AI assistant. How can I help you today?');
  const [showWidgetAvatar, setShowWidgetAvatar] = useState<boolean>(true);
  // removed detectLanguage; use primaryLanguage only

  // Save widget customizations manually
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Sync with ChatbotContext
  useEffect(() => {
    if (selectedChatbot) {
      setCurrentChatbotId(selectedChatbot.id);
      setChatbotName(selectedChatbot.name || 'My AI Assistant');
      setWelcomeMessage(selectedChatbot.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?");
      setPrimaryLanguage(selectedChatbot.language || 'auto');
      
      // Load widget customization settings
      if (selectedChatbot.settings) {
        const settings = typeof selectedChatbot.settings === 'string' ? JSON.parse(selectedChatbot.settings) : selectedChatbot.settings;
        if (settings.theme) setWidgetTheme(settings.theme);
        if (settings.placeholder) setWidgetPlaceholder(settings.placeholder);
        if (settings.showAvatar !== undefined) setShowWidgetAvatar(settings.showAvatar);
        if (settings.title) setWidgetTitle(settings.title);
        if (settings.message) setWidgetMessage(settings.message);
      }
    }
  }, [selectedChatbot]);
  
  const saveWidgetCustomizations = async () => {
    if (!currentChatbotId) {
      console.log('❌ No chatbot ID, skipping save');
      return;
    }
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    console.log('💾 Saving all chatbot settings (main + widget customizations)...', {
      chatbotId: currentChatbotId,
      name: widgetTitle, // widgetTitle is the chatbot name
      welcomeMessage: widgetMessage, // widgetMessage is the welcome message
      language: primaryLanguage,
      settings: {
        theme: widgetTheme,
        placeholder: widgetPlaceholder,
        showAvatar: showWidgetAvatar,
        title: widgetTitle,
        message: widgetMessage
      }
    });
    
    try {
      const response = await fetch(`https://aiorchestrator-vtihz.ondigitalocean.app/api/chatbots/${currentChatbotId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
        },
        body: JSON.stringify({
          name: widgetTitle, // Save widgetTitle as chatbot name
          welcomeMessage: widgetMessage, // Save widgetMessage as chatbot welcomeMessage
          language: primaryLanguage,
          settings: {
            theme: widgetTheme,
            placeholder: widgetPlaceholder,
            showAvatar: showWidgetAvatar,
            title: widgetTitle,
            message: widgetMessage
          }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ All chatbot settings saved:', result);
        setSaveStatus('success');
        
        // Update local state to match saved values
        setChatbotName(widgetTitle);
        setWelcomeMessage(widgetMessage);
        
        // Reload chatbot to ensure everything is in sync
        await loadChatbot(false);
        
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('❌ Save failed with status:', response.status);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('❌ Failed to save chatbot settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };


  // Theme palette (mirror of widget preview)
  const themeColors = {
    blue:   { 
      primary: 'from-blue-600 to-blue-700', 
      secondary: 'from-blue-50 to-blue-100', 
      text: 'text-blue-900', 
      border: 'border-blue-200',
      userMsg: 'bg-blue-600', 
      send: 'bg-blue-600' 
    },
    purple: { 
      primary: 'from-purple-600 to-purple-700', 
      secondary: 'from-purple-50 to-purple-100', 
      text: 'text-purple-900', 
      border: 'border-purple-200',
      userMsg: 'bg-purple-600', 
      send: 'bg-purple-600' 
    },
    green:  { 
      primary: 'from-green-600 to-green-700', 
      secondary: 'from-green-50 to-green-100', 
      text: 'text-green-900', 
      border: 'border-green-200',
      userMsg: 'bg-green-600', 
      send: 'bg-green-600' 
    },
    red:    { 
      primary: 'from-red-600 to-red-700', 
      secondary: 'from-red-50 to-red-100', 
      text: 'text-red-900', 
      border: 'border-red-200',
      userMsg: 'bg-red-600', 
      send: 'bg-red-600' 
    },
    orange: { 
      primary: 'from-orange-600 to-orange-700', 
      secondary: 'from-orange-50 to-orange-100', 
      text: 'text-orange-900', 
      border: 'border-orange-200',
      userMsg: 'bg-orange-600', 
      send: 'bg-orange-600' 
    },
    pink:   { 
      primary: 'from-pink-600 to-pink-700', 
      secondary: 'from-pink-50 to-pink-100', 
      text: 'text-pink-900', 
      border: 'border-pink-200',
      userMsg: 'bg-pink-600', 
      send: 'bg-pink-600' 
    },
    indigo: { 
      primary: 'from-indigo-600 to-indigo-700', 
      secondary: 'from-indigo-50 to-indigo-100', 
      text: 'text-indigo-900', 
      border: 'border-indigo-200',
      userMsg: 'bg-indigo-600', 
      send: 'bg-indigo-600' 
    },
    teal:   { 
      primary: 'from-teal-600 to-teal-700', 
      secondary: 'from-teal-50 to-teal-100', 
      text: 'text-teal-900', 
      border: 'border-teal-200',
      userMsg: 'bg-teal-600', 
      send: 'bg-teal-600' 
    }
  } as const;
  const tc = themeColors[widgetTheme] || themeColors.blue;

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
        setPrimaryLanguage(chatbot.language || 'auto');
        
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
        
        // Load widget customization settings
        console.log('🔧 Loading chatbot settings:', first.settings);
        if (first.settings) {
          const settings = typeof first.settings === 'string' ? JSON.parse(first.settings) : first.settings;
          console.log('🔧 Parsed settings:', settings);
          if (settings.theme) {
            console.log('🔧 Setting theme:', settings.theme);
            setWidgetTheme(settings.theme);
          }
          if (settings.placeholder) {
            console.log('🔧 Setting placeholder:', settings.placeholder);
            setWidgetPlaceholder(settings.placeholder);
          }
          if (settings.showAvatar !== undefined) {
            console.log('🔧 Setting showAvatar:', settings.showAvatar);
            setShowWidgetAvatar(settings.showAvatar);
          }
          if (settings.title) {
            console.log('🔧 Setting title:', settings.title);
            setWidgetTitle(settings.title);
          }
          if (settings.message) {
            console.log('🔧 Setting message:', settings.message);
            setWidgetMessage(settings.message);
          }
        } else {
          console.log('🔧 No settings found, using defaults');
        }
        
        // Update chat welcome message
        setMessages([{
          id: '1',
          text: first.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        }]);
      } else {
        // Auto-create for first-time users or Starter plan users
        if (autoCreate || user?.planId === 'starter') {
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
    // Removed loadChatbots call - chatbots are loaded automatically by ChatbotContext
  }, []);

  // Note: Removed auto-sync useEffects to avoid conflicts
  // Settings and customizations are now saved together when user clicks Save

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Expose widget configuration globally for live preview synchronization
  useEffect(() => {
    if (currentChatbotId) {
      window.AIOrchestratorConfig = {
        chatbotId: currentChatbotId,
        apiKey: API_URL,
        theme: widgetTheme,
        title: widgetTitle,
        placeholder: widgetPlaceholder,
        showAvatar: showWidgetAvatar,
        welcomeMessage: widgetMessage,
        primaryLanguage: primaryLanguage,
        primaryColor: getThemeColor(widgetTheme),
        primaryDarkColor: getThemeDarkColor(widgetTheme),
        headerLightColor: getThemeColor(widgetTheme),
        headerDarkColor: getThemeDarkColor(widgetTheme),
        textColor: '#1f2937',
        accentColor: getThemeColor(widgetTheme)
      };
      console.log('🎯 Widget config exposed globally:', window.AIOrchestratorConfig);
    }
  }, [currentChatbotId, widgetTheme, widgetTitle, widgetPlaceholder, showWidgetAvatar, widgetMessage, primaryLanguage]);

  // Helper function to get theme colors
  const getThemeColor = (theme: string) => {
    const colors = {
      blue: '#3B82F6',
      purple: '#8B5CF6',
      green: '#10B981',
      red: '#EF4444',
      orange: '#F97316',
      pink: '#EC4899',
      indigo: '#6366F1',
      teal: '#14B8A6'
    };
    return colors[theme] || '#3B82F6';
  };

  const getThemeDarkColor = (theme: string) => {
    const colors = {
      blue: '#2563EB',
      purple: '#7C3AED',
      green: '#059669',
      red: '#DC2626',
      orange: '#EA580C',
      pink: '#DB2777',
      indigo: '#4F46E5',
      teal: '#0D9488'
    };
    return colors[theme] || '#2563EB';
  };

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
          message: userMessage.text,
          context: {
            chatbotId: currentChatbotId,
            primaryLanguage
          }
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-3 lg:py-6 space-y-3 lg:space-y-0">
            <div>
              <h1 className="text-xl lg:text-4xl font-bold text-gray-900 mb-1 lg:mb-2" data-tour="chatbot-header">My AI Chatbot</h1>
              <p className="text-gray-600 text-xs lg:text-lg hidden sm:block">Manage and test your AI assistant</p>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <TourButton onClick={() => setShowTour(true)} />
              <div className="flex items-center space-x-2 px-2 lg:px-3 py-1.5 lg:py-2 bg-green-100 text-green-700 rounded-md lg:rounded-lg">
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs lg:text-sm font-medium">Live</span>
              </div>
              {/* removed Get Embed Code button (duplicate of Quick Embed) */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 lg:py-8">
        {/* Tabs */}
        <div className="mb-4 lg:mb-8" data-tour="tour-welcome">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chat')}
              data-tour="tour-test-chat"
              className={`flex-1 px-2 lg:px-4 py-2 lg:py-3 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'chat' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
              <span className="hidden sm:inline">Test </span>Chat
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              data-tour="tour-settings"
              className={`flex-1 px-2 lg:px-4 py-2 lg:py-3 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
              Settings
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              data-tour="tour-embed"
              className={`flex-1 px-2 lg:px-4 py-2 lg:py-3 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'embed' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
              Embed
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              data-tour="tour-manage"
              className={`flex-1 px-2 lg:px-4 py-2 lg:py-3 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'manage' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bot className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
              <span className="hidden sm:inline">My </span>Chatbots
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' && (
          <div key={widgetTheme} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden" data-tour="chat-interface">
            {/* Chat Header */}
            <div className={`bg-gradient-to-br ${tc.secondary} border-b-2 ${tc.border} p-3 lg:p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${tc.primary}`}>
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <div className={`font-bold text-sm lg:text-base ${tc.text}`}>{widgetTitle}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1 lg:gap-2">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></div>
                      <span className="hidden sm:inline">Online 24/7</span>
                      <span className="sm:hidden">Online</span>
                      {primaryLanguage && primaryLanguage !== 'auto' && (
                        <span className="px-1.5 lg:px-2 py-0.5 text-[9px] lg:text-[10px] rounded bg-gray-100 text-gray-700">{primaryLanguage.toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <button className="text-gray-600 hover:bg-gray-200 rounded-lg p-1.5 lg:p-2 transition-colors" title="Minimize">
                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                  </button>
                  <button className="text-gray-600 hover:bg-gray-200 rounded-lg p-1.5 lg:p-2 transition-colors" title="Close">
                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 lg:h-96 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 lg:px-4 py-2 lg:py-3 rounded-xl lg:rounded-2xl ${
                      message.isUser
                        ? `${tc.userMsg} text-white shadow-sm`
                        : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                    }`}
                  >
                    <p className={`text-xs lg:text-sm whitespace-pre-wrap font-medium ${message.isUser ? 'text-white' : 'text-gray-900'}`}>{message.text}</p>
                    <p className={`text-[10px] lg:text-xs mt-1 ${
                      message.isUser ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-3 lg:px-4 py-2 lg:py-3 rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin" />
                      <span className="text-xs lg:text-sm">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div id="messages-end" />
            </div>

            {/* Input */}
            <div className="p-3 lg:p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={widgetPlaceholder}
                  className="flex-1 px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className={`text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 lg:gap-2 ${tc.send} hover:opacity-90`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                  )}
                </button>
              </div>
              {/* footer tagline removed as requested */}
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-4 lg:space-y-6" data-tour="chatbot-management">
            {/* Plan Status */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 lg:p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">Your Plan Status</h3>
                <span className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs lg:text-sm font-medium">
                  {user?.planId === 'starter' ? 'Starter' : user?.planId === 'professional' ? 'Professional' : 'Business'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600 mb-1">
                    {currentChatbotId ? (
                      user?.planId === 'starter' ? '1/1' : user?.planId === 'professional' ? '1/2' : user?.planId === 'business' ? '1/3' : '1/1'
                    ) : (
                      user?.planId === 'starter' ? '0/1' : user?.planId === 'professional' ? '0/2' : user?.planId === 'business' ? '0/3' : '0/1'
                    )}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">Chatbots Used</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-green-600 mb-1">
                    {user?.planId === 'starter' ? '5K' : user?.planId === 'professional' ? '25K' : user?.planId === 'business' ? '100K' : '5K'}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">Messages/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-purple-600 mb-1">
                    {user?.planId === 'starter' ? '1' : user?.planId === 'professional' ? '2' : user?.planId === 'business' ? '3' : '1'}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">Websites</div>
                </div>
              </div>
            </div>

            {/* Current Chatbot */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Your Chatbot</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Main Chatbot - Hide if deleted */}
                {!chatbotDeleted && currentChatbotId && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 lg:p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm lg:text-base text-gray-900">{chatbotName}</h4>
                        <p className="text-xs lg:text-sm text-gray-600">Main chatbot</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 lg:space-x-2">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] lg:text-xs text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                  <div className="mb-3 lg:mb-4 p-2 lg:p-3 bg-white/50 rounded-lg">
                    <p className="text-[10px] lg:text-xs text-gray-600 italic">{welcomeMessage}</p>
                  </div>
                  <div className="flex space-x-1 lg:space-x-2">
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="flex-1 px-2 lg:px-3 py-1.5 lg:py-2 bg-blue-600 text-white rounded-md lg:rounded-lg hover:bg-blue-700 transition-colors text-xs lg:text-sm"
                    >
                      <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4 mr-1 inline" />
                      Test
                    </button>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="flex-1 px-2 lg:px-3 py-1.5 lg:py-2 bg-gray-100 text-gray-700 rounded-md lg:rounded-lg hover:bg-gray-200 transition-colors text-xs lg:text-sm"
                    >
                      <Settings className="w-3 h-3 lg:w-4 lg:h-4 mr-1 inline" />
                      Edit
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-2 lg:px-3 py-1.5 lg:py-2 bg-red-100 text-red-700 rounded-md lg:rounded-lg hover:bg-red-200 transition-colors text-xs lg:text-sm"
                    >
                      <X className="w-3 h-3 lg:w-4 lg:h-4" />
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
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 lg:p-6 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                        <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-sm lg:text-base text-gray-900 mb-2">Create Your First Chatbot</h4>
                      <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">Start building your AI assistant now</p>
                      <div className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md lg:rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-xs lg:text-sm inline-block">
                        <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1 inline" />
                        Create Chatbot
                      </div>
                    </div>
                  </div>
                )}

                {/* Add New Chatbot - Only if plan allows and chatbot exists */}
                {currentChatbotId && !chatbotDeleted && user?.planId !== 'starter' ? (
                  <div 
                    onClick={() => setShowAddChatbotModal(true)}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Create New Chatbot</h4>
                      <p className="text-sm text-gray-600 mb-4">Add another AI assistant for different purposes</p>
                      <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-sm inline-block">
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
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6" data-tour="tour-integration">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Integration Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {/* Embedding Method */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 lg:p-6 border border-blue-200">
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Code className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm lg:text-base text-gray-900">Embedding Code</h4>
                      <p className="text-xs lg:text-sm text-gray-600">Add to any website</p>
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
                    Copy and paste our JavaScript code into your website. Works with any platform (WordPress, Wix, Squarespace, custom HTML, etc.).
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 lg:p-3 mb-3 lg:mb-4">
                    <p className="text-[10px] lg:text-xs text-blue-800 font-medium mb-1">📝 How to install:</p>
                    <ol className="text-[10px] lg:text-xs text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Click "Get Embed Code" below</li>
                      <li>Copy the code snippet</li>
                      <li>Paste it before the <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag in your website</li>
                      <li>Save and publish your website</li>
                    </ol>
                  </div>
                  <button 
                    onClick={() => setActiveTab('embed')}
                    className="w-full px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-600 text-white rounded-md lg:rounded-lg hover:bg-blue-700 transition-colors text-xs lg:text-sm"
                  >
                    <Code className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
                    Get Embed Code
                  </button>
                </div>

                {/* E-commerce Connections */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 lg:p-6 border border-green-200">
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm lg:text-base text-gray-900">Shopify Integration</h4>
                      <p className="text-xs lg:text-sm text-gray-600">One-click setup</p>
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
                    Connect directly to your Shopify store with one click for seamless product and order sync. Your chatbot will automatically access your product catalog, handle order inquiries, and provide real-time inventory information.
                  </p>
                  <div className="bg-green-50 rounded-lg p-3 mb-3 lg:mb-4">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div className="text-xs text-green-800">
                        <p className="font-medium mb-1">What you get:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Real product recommendations</li>
                          <li>• Order tracking assistance</li>
                          <li>• Inventory status updates</li>
                          <li>• Add to cart functionality</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/connections'}
                    className="w-full px-3 lg:px-4 py-1.5 lg:py-2 bg-green-600 text-white rounded-md lg:rounded-lg hover:bg-green-700 transition-colors text-xs lg:text-sm"
                  >
                    <Globe className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
                    Connect Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 lg:space-y-6">
            {/* Your Plan Limits */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Your Plan Limits</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs lg:text-sm font-medium rounded-full">
                  {user?.planId === 'starter' ? 'Starter' : user?.planId === 'professional' ? 'Professional' : 'Business'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                    {user?.planId === 'starter' ? '1' : user?.planId === 'professional' ? '2' : '3'}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">Chatbots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">
                    {user?.planId === 'starter' ? '5K' : user?.planId === 'professional' ? '25K' : '100K'}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">Messages/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                    {user?.planId === 'starter' ? '1' : user?.planId === 'professional' ? '2' : '5'}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">Websites</div>
                </div>
              </div>
            </div>

            {/* Chatbot Settings */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6" data-tour="chat-settings">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Chatbot Settings</h3>
              <div className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Chatbot Name</label>
                    <input
                      type="text"
                      value={chatbotName}
                      onChange={(e)=>{
                        setChatbotName(e.target.value);
                        setWidgetTitle(e.target.value); // Sync with widget title
                      }}
                      className="w-full px-2 lg:px-4 py-1.5 lg:py-3 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Input Placeholder</label>
                    <input
                      type="text"
                      value={widgetPlaceholder}
                      onChange={(e) => setWidgetPlaceholder(e.target.value)}
                      className="w-full px-2 lg:px-4 py-1.5 lg:py-3 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                      placeholder="Type your message..."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Welcome Message</label>
                  <textarea
                    value={welcomeMessage}
                    onChange={(e)=>{
                      setWelcomeMessage(e.target.value);
                      setWidgetMessage(e.target.value); // Sync with widget message
                    }}
                    rows={2}
                    className="w-full px-2 lg:px-4 py-1.5 lg:py-3 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Primary Language</label>
                  <select
                    value={primaryLanguage}
                    onChange={(e)=> setPrimaryLanguage(e.target.value)}
                    className="w-full px-2 lg:px-4 py-1.5 lg:py-3 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                  >
                    <option value="auto">Auto-detect</option>
                    <option value="en">English</option>
                    <option value="it">Italiano</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="pt">Português</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="zh">中文</option>
                  </select>
                  <p className="text-[9px] lg:text-xs text-gray-500 mt-1">Matches Settings • Used as default; auto-detect when 'Auto-detect' selected.</p>
                </div>
                
                <div className="flex items-center justify-end pt-2">
                  <button 
                    onClick={async ()=>{
                      if(!currentChatbotId){ 
                        alert('No chatbot found. Please reload the page.');
                        await loadChatbot();
                        return;
                      }
                      try{
                        const res = await fetch(`https://aiorchestrator-vtihz.ondigitalocean.app/api/chatbots/${currentChatbotId}` ,{
                          method:'PUT',
                          headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                          body: JSON.stringify({ 
                            name: chatbotName, 
                            welcomeMessage, 
                            language: primaryLanguage,
                            settings: {
                              theme: widgetTheme,
                              placeholder: widgetPlaceholder,
                              showAvatar: showWidgetAvatar,
                              title: widgetTitle,
                              message: widgetMessage
                            }
                          })
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
                    }} 
                    className="px-3 lg:px-6 py-1.5 lg:py-3 bg-blue-600 text-white rounded-md lg:rounded-lg hover:bg-blue-700 transition-colors text-xs lg:text-sm"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h4 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Advanced Features</h4>
              
              {/* Custom Branding */}
              <BrandingSettings />
              
              {/* White-Label Solution */}
              <WhiteLabelSettings />
            </div>
          </div>
        )}


        {activeTab === 'embed' && (
          <div className="space-y-4 lg:space-y-6">
            {/* Plan Limits */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 lg:p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">Your Plan Limits</h3>
                <span className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs lg:text-sm font-medium">
                  {user?.planId === 'starter' ? 'Starter' : user?.planId === 'professional' ? 'Professional' : 'Business'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600 mb-1">
                    {user?.planId === 'starter' ? '1' : user?.planId === 'professional' ? '2' : user?.planId === 'business' ? '3' : '1'}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">Chatbots</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-green-600 mb-1">
                    {user?.planId === 'starter' ? '5K' : user?.planId === 'professional' ? '25K' : user?.planId === 'business' ? '100K' : '5K'}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">Messages/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-purple-600 mb-1">
                    {user?.planId === 'starter' ? '1' : user?.planId === 'professional' ? '2' : user?.planId === 'business' ? '3' : '1'}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">Websites</div>
                </div>
              </div>
            </div>

            {/* Embed Options */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Embed Your Chatbot</h3>
              
              {/* Quick Embed */}
              <div className="bg-gray-50 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6">
                <h4 className="font-medium text-sm lg:text-base text-gray-900 mb-2">Quick Embed</h4>
                <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">Add this code to your website to embed your chatbot:</p>
                <div className="bg-gray-900 rounded-lg p-3 lg:p-4 overflow-x-auto">
                  <code className="text-green-400 text-xs lg:text-sm whitespace-pre-wrap">
                    {currentChatbotId ? `<!-- AI Orchestrator Chatbot Widget -->
<script 
  src="https://www.aiorchestrator.dev/chatbot-widget.js"
  data-ai-orchestrator-id="${currentChatbotId}"
  data-api-key="${API_URL}"
  data-theme="${widgetTheme}"
  data-title="${widgetTitle}"
  data-placeholder="${widgetPlaceholder}"
  data-show-avatar="${showWidgetAvatar}"
  data-welcome-message="${welcomeMessage}"
  data-primary-language="${primaryLanguage}"
  defer>
</script>` : 'Loading chatbot...'}
                  </code>
                </div>
                <div className="flex space-x-2 mt-2 lg:mt-3">
                  <button onClick={() => {
                    const code = currentChatbotId ? `<!-- AI Orchestrator Chatbot Widget -->
<script 
  src="https://www.aiorchestrator.dev/chatbot-widget.js"
  data-ai-orchestrator-id="${currentChatbotId}"
  data-api-key="${API_URL}"
  data-theme="${widgetTheme}"
  data-title="${widgetTitle}"
  data-placeholder="${widgetPlaceholder}"
  data-show-avatar="${showWidgetAvatar}"
  data-welcome-message="${welcomeMessage}"
  data-primary-language="${primaryLanguage}"
  defer>
</script>` : 'No chatbot available';
                    navigator.clipboard.writeText(code).then(() => alert('Copied to clipboard!')).catch(() => alert('Copy failed'));
                  }} className="px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-600 text-white rounded-md lg:rounded-lg hover:bg-blue-700 transition-colors text-xs lg:text-sm">
                    <Copy className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
                    Copy Code
                  </button>
                </div>
              </div>

              {/* Customization Options */}
              <div className="mb-4 lg:mb-6">
                <h4 className="font-medium text-sm lg:text-base text-gray-900 mb-3 lg:mb-4">Widget Customization</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Theme Color</label>
                    <div className="flex space-x-1 lg:space-x-2">
                      <div 
                        className={`w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'blue' ? 'border-blue-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('blue')}
                      ></div>
                      <div 
                        className={`w-6 h-6 lg:w-8 lg:h-8 bg-purple-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'purple' ? 'border-purple-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('purple')}
                      ></div>
                      <div 
                        className={`w-6 h-6 lg:w-8 lg:h-8 bg-green-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'green' ? 'border-green-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('green')}
                      ></div>
                      <div 
                        className={`w-6 h-6 lg:w-8 lg:h-8 bg-red-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'red' ? 'border-red-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('red')}
                      ></div>
                      <div 
                        className={`w-6 h-6 lg:w-8 lg:h-8 bg-orange-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'orange' ? 'border-orange-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('orange')}
                      ></div>
                      <div 
                        className={`w-6 h-6 lg:w-8 lg:h-8 bg-pink-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'pink' ? 'border-pink-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('pink')}
                      ></div>
                      <div 
                        className={`w-6 h-6 lg:w-8 lg:h-8 bg-indigo-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'indigo' ? 'border-indigo-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('indigo')}
                      ></div>
                      <div 
                        className={`w-6 h-6 lg:w-8 lg:h-8 bg-teal-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'teal' ? 'border-teal-800' : 'border-transparent'} hover:border-gray-300`}
                        onClick={() => setWidgetTheme('teal')}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Widget Title</label>
                    <input
                      type="text"
                      value={widgetTitle}
                      onChange={(e) => {
                        setWidgetTitle(e.target.value);
                        setChatbotName(e.target.value); // Sync with chatbot name
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                      placeholder="AI Support"
                    />
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Input Placeholder</label>
                    <input
                      type="text"
                      value={widgetPlaceholder}
                      onChange={(e) => setWidgetPlaceholder(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                      placeholder="Type your message..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Widget Message</label>
                    <textarea
                      value={widgetMessage}
                      onChange={(e) => {
                        setWidgetMessage(e.target.value);
                        setWelcomeMessage(e.target.value); // Sync with welcome message
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
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
                    <label htmlFor="showAvatar" className="ml-2 block text-xs lg:text-sm text-gray-700">
                      Show Avatar
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Primary Language</label>
                    <select
                      value={primaryLanguage}
                      onChange={(e) => setPrimaryLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="en">English</option>
                      <option value="it">Italiano</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="pt">Português</option>
                      <option value="ru">Русский</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                      <option value="ko">한국어</option>
                      <option value="ar">العربية</option>
                      <option value="hi">हिन्दी</option>
                    </select>
                    <p className="text-[10px] lg:text-xs text-gray-500 mt-1">Matches Settings • Used as default; auto-detect when 'Auto-detect' selected.</p>
                  </div>
                </div>
                
                {/* Save Button */}
                <div className="mt-4 lg:mt-6 flex justify-end items-center space-x-2 lg:space-x-4">
                  {saveStatus === 'success' && (
                    <span className="text-green-600 text-xs lg:text-sm flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>Saved successfully!</span>
                    </span>
                  )}
                  {saveStatus === 'error' && (
                    <span className="text-red-600 text-xs lg:text-sm flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>Save failed. Try again.</span>
                    </span>
                  )}
                  <button
                    onClick={saveWidgetCustomizations}
                    disabled={isSaving}
                    className={`px-4 lg:px-6 py-1.5 lg:py-2 rounded-md lg:rounded-lg transition-colors flex items-center space-x-1 lg:space-x-2 ${
                      isSaving 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white text-xs lg:text-sm`}
                  >
                    {isSaving ? (
                      <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3 lg:w-4 lg:h-4" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save Widget Settings'}</span>
                  </button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="mb-4 lg:mb-6">
                <h4 className="font-medium text-sm lg:text-base text-gray-900 mb-3 lg:mb-4">Chatbot Preview</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-3 lg:px-4 py-1.5 lg:py-2 border-b border-gray-200">
                    <div className="flex items-center space-x-1 lg:space-x-2">
                      <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 lg:w-3 lg:h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-2 lg:ml-4 text-xs lg:text-sm text-gray-600">Live Preview</span>
                    </div>
                  </div>
                  {/* Just the chatbot iframe, full size */}
                  {currentChatbotId ? (
                    <iframe
                      src={`${API_URL}/public/embed/${currentChatbotId}?theme=${widgetTheme}&title=${encodeURIComponent(widgetTitle)}&placeholder=${encodeURIComponent(widgetPlaceholder)}&message=${encodeURIComponent(widgetMessage)}&showAvatar=${showWidgetAvatar}&primaryLanguage=${encodeURIComponent(primaryLanguage)}`}
                      className="w-full h-[400px] lg:h-[740px] border-0"
                      title="Live Chatbot Preview"
                    />
                  ) : (
                    <div className="w-full h-[300px] lg:h-[600px] bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3 animate-pulse">
                          <Bot className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <p className="text-gray-600 text-sm lg:text-base">Loading chatbot...</p>
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

      {/* Add Chatbot Modal */}
      <AddChatbotModal
        isOpen={showAddChatbotModal}
        onClose={() => setShowAddChatbotModal(false)}
      />
    </div>
  );
};

export default Chatbot;