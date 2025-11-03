import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config/constants';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI support assistant. How can I help you today? 👋',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState({
    title: 'AI Support',
    placeholder: 'Type your message...',
    welcomeMessage: 'Hi! I\'m your AI support assistant. How can I help you today? 👋',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    fontFamily: 'Inter',
    logo: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get default colors based on theme
  const getThemeColors = (theme: string) => {
    const themeColors = {
      blue: { primary: '#3B82F6', secondary: '#1D4ED8' },
      purple: { primary: '#8B5CF6', secondary: '#7C3AED' },
      green: { primary: '#10B981', secondary: '#059669' },
      red: { primary: '#EF4444', secondary: '#DC2626' },
      orange: { primary: '#F97316', secondary: '#EA580C' },
      pink: { primary: '#EC4899', secondary: '#DB2777' },
      indigo: { primary: '#6366F1', secondary: '#4F46E5' },
      teal: { primary: '#14B8A6', secondary: '#0D9488' }
    };
    return themeColors[theme as keyof typeof themeColors] || themeColors.blue;
  };

  // Listen for global widget configuration updates
  useEffect(() => {
    const handleConfigUpdate = () => {
      if (window.AIOrchestratorConfig) {
        const themeColors = getThemeColors(window.AIOrchestratorConfig.theme || 'blue');
        setWidgetConfig(prev => ({
          ...prev,
          title: window.AIOrchestratorConfig.title || 'AI Support',
          placeholder: window.AIOrchestratorConfig.placeholder || 'Type your message...',
          welcomeMessage: window.AIOrchestratorConfig.welcomeMessage || 'Hi! I\'m your AI support assistant. How can I help you today? 👋',
          primaryColor: window.AIOrchestratorConfig.primaryColor || themeColors.primary,
          secondaryColor: window.AIOrchestratorConfig.accentColor || themeColors.secondary,
          fontFamily: window.AIOrchestratorConfig.fontFamily || 'Inter',
          logo: window.AIOrchestratorConfig.logo || ''
        }));
      }
    };

    // Check for initial config
    handleConfigUpdate();

    // Listen for updates
    window.addEventListener('brandingUpdated', handleConfigUpdate);
    
    return () => {
      window.removeEventListener('brandingUpdated', handleConfigUpdate);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          userId: 'support-chat',
          context: {
            primaryLanguage: 'en',
            websiteUrl: window?.location?.origin || null
          }
        })
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.data?.response || data.response || data.message || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting. Please email us at aiorchestratoor@gmail.com',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us 24/7
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all ${isMinimized ? 'w-80' : 'w-96'}`}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div 
          className="border-b-2 p-4"
          style={{
            background: `linear-gradient(135deg, ${widgetConfig.primaryColor}15, ${widgetConfig.secondaryColor}15)`,
            borderColor: widgetConfig.primaryColor
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: widgetConfig.logo ? 'transparent' : `linear-gradient(135deg, ${widgetConfig.primaryColor}, ${widgetConfig.secondaryColor})`
                }}
              >
                {widgetConfig.logo ? (
                  <img 
                    src={widgetConfig.logo} 
                    alt="Chatbot Logo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <MessageCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <div 
                  className="font-bold text-gray-900 whitespace-nowrap"
                  style={{ fontFamily: widgetConfig.fontFamily }}
                >
                  {widgetConfig.title}
                </div>
                <div 
                  className="text-xs text-gray-600 flex items-center gap-1"
                  style={{ fontFamily: widgetConfig.fontFamily }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online 24/7
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.isUser
                        ? 'text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                    style={message.isUser ? {
                      backgroundColor: widgetConfig.primaryColor,
                      fontFamily: widgetConfig.fontFamily
                    } : {
                      fontFamily: widgetConfig.fontFamily
                    }}
                  >
                    <div className="text-sm">{message.text}</div>
                    <div className={`text-xs mt-1 ${message.isUser ? 'opacity-70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={widgetConfig.placeholder}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    fontFamily: widgetConfig.fontFamily,
                    '--tw-ring-color': widgetConfig.primaryColor
                  } as React.CSSProperties}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{
                    backgroundColor: widgetConfig.primaryColor
                  }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveChatWidget;