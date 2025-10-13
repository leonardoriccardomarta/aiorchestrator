import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatbotConfig {
  id: string;
  name: string;
  primaryColor: string;
  gradient: { from: string; to: string };
  theme: 'light' | 'dark';
  welcomeMessage: string;
  language: string;
  avatar?: string;
  chatIcon?: string;
  fontFamily: string;
  fontSize: string;
  bubbleShape: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  showBranding?: boolean;
  autoOpen?: boolean;
  triggerDelay?: number;
}

interface EnhancedChatbotPreviewProps {
  config: ChatbotConfig;
  isLivePreview?: boolean;
  onConfigChange?: (config: Partial<ChatbotConfig>) => void;
  className?: string;
}

const EnhancedChatbotPreview: React.FC<EnhancedChatbotPreviewProps> = ({
  config,
  isLivePreview = true,
  onConfigChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [_typingTimeout, _setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (config.welcomeMessage && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: config.welcomeMessage,
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [config.welcomeMessage, messages.length]);

  // Auto-open functionality
  useEffect(() => {
    if (config.autoOpen && config.triggerDelay) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, config.triggerDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [config.autoOpen, config.triggerDelay]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot typing
    setIsTyping(true);
    const responses = [
      "Thank you for your message! I'm here to help you.",
      "I understand your question. Let me provide you with the information you need.",
      "That's a great question! Here's what I can tell you about that.",
      "I'm processing your request. Give me just a moment to find the best answer.",
      "Thanks for reaching out! I'm happy to assist you with that."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{
      id: 'welcome',
      text: config.welcomeMessage,
      isUser: false,
      timestamp: new Date()
    }]);
  };

  const getFontSizeClass = () => {
    switch (config.fontSize) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getBubbleShapeClass = () => {
    switch (config.bubbleShape) {
      case 'rounded-full': return 'rounded-full';
      case 'rounded-xl': return 'rounded-xl';
      case 'rounded-md': return 'rounded-md';
      case 'rounded-none': return 'rounded-none';
      default: return 'rounded-xl';
    }
  };

  const getSizeClasses = () => {
    switch (config.size) {
      case 'small': return { window: 'w-80 h-96', button: 'w-12 h-12' };
      case 'large': return { window: 'w-96 h-[32rem]', button: 'w-16 h-16' };
      default: return { window: 'w-88 h-[28rem]', button: 'w-14 h-14' };
    }
  };

  const getPositionClass = () => {
    switch (config.position) {
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      default: return 'bottom-4 right-4';
    }
  };

  const sizeClasses = getSizeClasses();

  const setMessagesEndRef = (node: HTMLDivElement | null) => {
    if (node) {
      node.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Preview Container */}
      <div className="relative">
        {/* Desktop/Tablet Preview */}
        <div className="hidden md:block">
          <div className="bg-gray-100 rounded-lg p-8 min-h-[500px] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

            {/* Preview Info */}
            <div className="relative z-10 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <p className="text-sm text-gray-600">
                    This is exactly how your chatbot will appear on your website
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetChat}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                    title="Reset Chat"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Live Preview</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Website Mockup */}
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* Browser Bar */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-600">
                    https://yourwebsite.com
                  </div>
                </div>
              </div>

              {/* Website Content */}
              <div className="p-8 h-96 bg-gradient-to-br from-blue-50 to-indigo-100 relative">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Website</h1>
                  <p className="text-gray-600 mb-8">Your chatbot will appear here for visitors to interact with.</p>
                  <div className="space-y-2 text-left max-w-md mx-auto">
                    <div className="bg-white/50 h-4 rounded animate-pulse"></div>
                    <div className="bg-white/50 h-4 rounded animate-pulse w-3/4"></div>
                    <div className="bg-white/50 h-4 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>

                {/* Chatbot Widget */}
                <div className={`absolute ${getPositionClass()} z-50`}>
                  <AnimatePresence>
                    {isOpen && !isMinimized && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className={`${sizeClasses.window} bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden mb-4`}
                        style={{ fontFamily: config.fontFamily }}
                      >
                        {/* Header */}
                        <div 
                          className="px-4 py-3 text-white flex items-center justify-between"
                          style={{
                            background: config.gradient 
                              ? `linear-gradient(135deg, ${config.gradient.from}, ${config.gradient.to})`
                              : config.primaryColor
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {config.avatar ? (
                              <img
                                src={config.avatar}
                                alt={config.name}
                                className="w-8 h-8 rounded-full border-2 border-white/20"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-sm">{config.name}</div>
                              <div className="text-xs opacity-90">Online</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setIsMinimized(true)}
                              className="text-white/80 hover:text-white transition-colors"
                            >
                              <Minimize2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setIsOpen(false)}
                              className="text-white/80 hover:text-white transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${getFontSizeClass()} bg-gray-50`} style={{ height: '280px' }}>
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs px-3 py-2 ${getBubbleShapeClass()} ${getFontSizeClass()} ${
                                  message.isUser
                                    ? 'text-white ml-auto'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                                style={{
                                  backgroundColor: message.isUser 
                                    ? config.primaryColor 
                                    : undefined
                                }}
                              >
                                {message.text}
                              </div>
                            </motion.div>
                          ))}

                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className={`max-w-xs px-3 py-2 ${getBubbleShapeClass()} bg-white text-gray-900 border border-gray-200`}>
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={setMessagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Type a message..."
                              className={`flex-1 px-3 py-2 border border-gray-300 ${getBubbleShapeClass()} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getFontSizeClass()}`}
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={!inputMessage.trim()}
                              className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ backgroundColor: config.primaryColor }}
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                          {config.showBranding && (
                            <div className="text-xs text-gray-500 text-center mt-2">
                              Powered by AI Orchestrator
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {isOpen && isMinimized && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white rounded-lg shadow-lg p-3 mb-4 border border-gray-200 cursor-pointer"
                        onClick={() => setIsMinimized(false)}
                        style={{
                          background: config.gradient 
                            ? `linear-gradient(135deg, ${config.gradient.from}, ${config.gradient.to})`
                            : config.primaryColor
                        }}
                      >
                        <div className="flex items-center space-x-2 text-white">
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-sm font-medium">{config.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                            }}
                            className="ml-auto text-white/80 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Chat Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${sizeClasses.button} rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300`}
                    style={{
                      background: config.gradient 
                        ? `linear-gradient(135deg, ${config.gradient.from}, ${config.gradient.to})`
                        : config.primaryColor
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {isOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="open"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {config.chatIcon ? (
                            <img src={config.chatIcon} alt="Chat" className="w-6 h-6 rounded-full" />
                          ) : (
                            <MessageSquare className="w-6 h-6" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="md:hidden">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mobile Preview</h3>
              <p className="text-sm text-gray-600">Tap the button to test your chatbot</p>
            </div>
            
            <div className="relative bg-gray-800 rounded-2xl p-2 mx-auto max-w-sm">
              <div className="bg-white rounded-xl h-96 p-4 relative overflow-hidden">
                {/* Mobile content simulation */}
                <div className="text-center space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
                </div>

                {/* Mobile Chatbot Widget */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {isLivePreview && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Open Chat
          </button>
          <button
            onClick={resetChat}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Reset Chat
          </button>
          <button
            onClick={() => onConfigChange?.({ autoOpen: !config.autoOpen })}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              config.autoOpen 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Auto-open: {config.autoOpen ? 'ON' : 'OFF'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedChatbotPreview;