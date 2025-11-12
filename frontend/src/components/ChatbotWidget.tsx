import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config/constants';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Settings,
  Globe,
  Zap,
  Loader2
} from 'lucide-react';

interface ChatbotWidgetProps {
  chatbotId: string;
  apiKey: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark' | 'blue' | 'purple';
  language?: string;
  welcomeMessage?: string;
  placeholder?: string;
  showAvatar?: boolean;
  showPoweredBy?: boolean;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'button' | 'card';
  buttons?: Array<{ text: string; value: string; type: 'postback' | 'url' }>;
  card?: {
    title: string;
    description: string;
    image?: string;
    buttons?: Array<{ text: string; value: string; type: 'postback' | 'url' }>;
  };
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  chatbotId,
  apiKey,
  position = 'bottom-right',
  theme = 'blue',
  language = 'auto',
  welcomeMessage = 'Hello! How can I help you today?',
  placeholder = 'Type your message...',
  showAvatar = true,
  showPoweredBy = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getThemeClasses = () => {
    const themes = {
      light: {
        primary: 'bg-white',
        secondary: 'bg-slate-50',
        text: 'text-slate-900',
        textSecondary: 'text-slate-600',
        border: 'border-slate-200',
        button: 'bg-indigo-600 hover:bg-indigo-700',
        input: 'bg-white border-slate-300 focus:border-indigo-500',
        messageUser: 'bg-indigo-600 text-white',
        messageBot: 'bg-slate-100 text-slate-900'
      },
      dark: {
        primary: 'bg-slate-900',
        secondary: 'bg-slate-800',
        text: 'text-white',
        textSecondary: 'text-slate-300',
        border: 'border-slate-700',
        button: 'bg-indigo-600 hover:bg-indigo-700',
        input: 'bg-slate-800 border-slate-600 focus:border-indigo-500 text-white',
        messageUser: 'bg-indigo-600 text-white',
        messageBot: 'bg-slate-700 text-white'
      },
      blue: {
        primary: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
        secondary: 'bg-indigo-50',
        text: 'text-slate-900',
        textSecondary: 'text-slate-600',
        border: 'border-indigo-200',
        button: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800',
        input: 'bg-white border-indigo-300 focus:border-indigo-500',
        messageUser: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white',
        messageBot: 'bg-white text-slate-900 border border-indigo-200'
      },
      purple: {
        primary: 'bg-gradient-to-br from-purple-50 to-purple-100',
        secondary: 'bg-purple-50',
        text: 'text-slate-900',
        textSecondary: 'text-slate-600',
        border: 'border-purple-200',
        button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
        input: 'bg-white border-purple-300 focus:border-purple-500',
        messageUser: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white',
        messageBot: 'bg-white text-slate-900 border border-purple-200'
      }
    };
    return themes[theme];
  };

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4'
    };
    return positions[position];
  };

  const themeClasses = getThemeClasses();
  const positionClasses = getPositionClasses();

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }]);
    }
  }, [welcomeMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Chatbot-ID': chatbotId
        },
        body: JSON.stringify({
          message: text.trim(),
          language: language,
          chatbotId: chatbotId,
          userId: 'widget-user'
        })
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
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
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleButtonClick = (button: any) => {
    if (button.type === 'url') {
      window.open(button.value, '_blank');
    } else {
      sendMessage(button.value);
    }
  };

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Chat Widget */}
      {isOpen && (
        <div className={`${isMinimized ? 'h-16' : 'h-96 w-80'} ${themeClasses.primary} ${themeClasses.border} border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden`}>
          {/* Header */}
          <div className={`${themeClasses.secondary} px-4 py-3 border-b ${themeClasses.border} flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              {showAvatar && (
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <h4 className={`font-semibold ${themeClasses.text}`}>AI Assistant</h4>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={`text-xs ${themeClasses.textSecondary}`}>Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className={`p-1 ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.isUser
                          ? themeClasses.messageUser
                          : themeClasses.messageBot
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.buttons && (
                        <div className="mt-2 space-y-1">
                          {message.buttons.map((button, index) => (
                            <button
                              key={index}
                              onClick={() => handleButtonClick(button)}
                              className="block w-full text-left px-3 py-1 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-xs"
                            >
                              {button.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`px-4 py-2 rounded-2xl ${themeClasses.messageBot}`}>
                      <div className="flex items-center space-x-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className={`p-4 border-t ${themeClasses.border}`}>
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${themeClasses.input}`}
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading}
                    className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.button}`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {showPoweredBy && (
                  <div className="mt-2 text-center">
                    <p className={`text-xs ${themeClasses.textSecondary}`}>
                      Powered by <span className="font-semibold">AI Orchestrator</span>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 ${themeClasses.button} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatbotWidget;

import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Settings,
  Globe,
  Zap,
  Loader2
} from 'lucide-react';

interface ChatbotWidgetProps {
  chatbotId: string;
  apiKey: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark' | 'blue' | 'purple';
  language?: string;
  welcomeMessage?: string;
  placeholder?: string;
  showAvatar?: boolean;
  showPoweredBy?: boolean;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'button' | 'card';
  buttons?: Array<{ text: string; value: string; type: 'postback' | 'url' }>;
  card?: {
    title: string;
    description: string;
    image?: string;
    buttons?: Array<{ text: string; value: string; type: 'postback' | 'url' }>;
  };
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  chatbotId,
  apiKey,
  position = 'bottom-right',
  theme = 'blue',
  language = 'auto',
  welcomeMessage = 'Hello! How can I help you today?',
  placeholder = 'Type your message...',
  showAvatar = true,
  showPoweredBy = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getThemeClasses = () => {
    const themes = {
      light: {
        primary: 'bg-white',
        secondary: 'bg-slate-50',
        text: 'text-slate-900',
        textSecondary: 'text-slate-600',
        border: 'border-slate-200',
        button: 'bg-indigo-600 hover:bg-indigo-700',
        input: 'bg-white border-slate-300 focus:border-indigo-500',
        messageUser: 'bg-indigo-600 text-white',
        messageBot: 'bg-slate-100 text-slate-900'
      },
      dark: {
        primary: 'bg-slate-900',
        secondary: 'bg-slate-800',
        text: 'text-white',
        textSecondary: 'text-slate-300',
        border: 'border-slate-700',
        button: 'bg-indigo-600 hover:bg-indigo-700',
        input: 'bg-slate-800 border-slate-600 focus:border-indigo-500 text-white',
        messageUser: 'bg-indigo-600 text-white',
        messageBot: 'bg-slate-700 text-white'
      },
      blue: {
        primary: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
        secondary: 'bg-indigo-50',
        text: 'text-slate-900',
        textSecondary: 'text-slate-600',
        border: 'border-indigo-200',
        button: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800',
        input: 'bg-white border-indigo-300 focus:border-indigo-500',
        messageUser: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white',
        messageBot: 'bg-white text-slate-900 border border-indigo-200'
      },
      purple: {
        primary: 'bg-gradient-to-br from-purple-50 to-purple-100',
        secondary: 'bg-purple-50',
        text: 'text-slate-900',
        textSecondary: 'text-slate-600',
        border: 'border-purple-200',
        button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
        input: 'bg-white border-purple-300 focus:border-purple-500',
        messageUser: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white',
        messageBot: 'bg-white text-slate-900 border border-purple-200'
      }
    };
    return themes[theme];
  };

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4'
    };
    return positions[position];
  };

  const themeClasses = getThemeClasses();
  const positionClasses = getPositionClasses();

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }]);
    }
  }, [welcomeMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Chatbot-ID': chatbotId
        },
        body: JSON.stringify({
          message: text.trim(),
          language: language,
          chatbotId: chatbotId,
          userId: 'widget-user'
        })
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
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
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleButtonClick = (button: any) => {
    if (button.type === 'url') {
      window.open(button.value, '_blank');
    } else {
      sendMessage(button.value);
    }
  };

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Chat Widget */}
      {isOpen && (
        <div className={`${isMinimized ? 'h-16' : 'h-96 w-80'} ${themeClasses.primary} ${themeClasses.border} border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden`}>
          {/* Header */}
          <div className={`${themeClasses.secondary} px-4 py-3 border-b ${themeClasses.border} flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              {showAvatar && (
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <h4 className={`font-semibold ${themeClasses.text}`}>AI Assistant</h4>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={`text-xs ${themeClasses.textSecondary}`}>Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className={`p-1 ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.isUser
                          ? themeClasses.messageUser
                          : themeClasses.messageBot
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.buttons && (
                        <div className="mt-2 space-y-1">
                          {message.buttons.map((button, index) => (
                            <button
                              key={index}
                              onClick={() => handleButtonClick(button)}
                              className="block w-full text-left px-3 py-1 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-xs"
                            >
                              {button.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`px-4 py-2 rounded-2xl ${themeClasses.messageBot}`}>
                      <div className="flex items-center space-x-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className={`p-4 border-t ${themeClasses.border}`}>
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${themeClasses.input}`}
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading}
                    className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.button}`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {showPoweredBy && (
                  <div className="mt-2 text-center">
                    <p className={`text-xs ${themeClasses.textSecondary}`}>
                      Powered by <span className="font-semibold">AI Orchestrator</span>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 ${themeClasses.button} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatbotWidget;
























