import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/constants';
import { ArrowRight, Loader2, MessageCircle, Sparkles, Globe } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const InteractiveDemo: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. Try asking me something in any language - I speak 100+ languages from around the world! 🌍 Try saying "speak [language]" or write in your native language!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);

  // Generate quick examples from supported languages
  const quickExamples = [
    { text: '🇬🇧 How can you help my store?', lang: 'English' },
    { text: '🇮🇹 Che funzionalità hai?', lang: 'Italian' },
    { text: '🇪🇸 ¿Qué puedes hacer?', lang: 'Spanish' },
    { text: '🇩🇪 Was sind deine Features?', lang: 'German' },
    { text: '🇫🇷 Comment fonctionne l\'IA?', lang: 'French' },
    { text: '🇸🇪 Vad kan du hjälpa mig med?', lang: 'Swedish' },
    { text: '🇯🇵 何ができますか？', lang: 'Japanese' },
    { text: '🇨🇳 你能做什么？', lang: 'Chinese' },
    { text: '🇰🇷 무엇을 도와드릴까요?', lang: 'Korean' },
    { text: '🇷🇺 Что вы можете сделать?', lang: 'Russian' },
    { text: '🇦🇷 ¿Cómo funciona la IA?', lang: 'Spanish' },
    { text: '🇳🇱 Wat kun je doen?', lang: 'Dutch' },
    { text: '🇵🇹 O que você pode fazer?', lang: 'Portuguese' },
    { text: '🇸🇦 ماذا يمكنك أن تفعل؟', lang: 'Arabic' },
    { text: '🇮🇳 आप क्या कर सकते हैं?', lang: 'Hindi' },
  ];

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Use real AI API like the chatbot preview
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          userId: 'demo-user',
          context: {
            primaryLanguage: 'auto',
            websiteUrl: typeof window !== 'undefined' ? window.location.origin : null
          }
        })
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.data?.response || data.response || data.message || 'Sorry, I could not process your request.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickExample = (example: string) => {
    handleSendMessage(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!isDemoActive ? (
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-br from-indigo-300 via-white to-indigo-200 rounded-2xl p-4 sm:p-6 md:p-8 border border-indigo-300 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-300/60">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Try Our AI Chatbot Demo
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Experience intelligent conversations - our AI automatically detects and responds in any language
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                <span>Powered by Advanced AI</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600/70" />
                <span>Multi-language</span>
              </div>
            </div>
            <button
              onClick={() => setIsDemoActive(true)}
              className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-600 active:from-indigo-700 active:to-purple-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-400/60 touch-manipulation min-h-[44px]"
            >
              Start Live Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-3xl mb-2">🌍</div>
              <div className="font-semibold text-gray-900">100+ Languages</div>
              <div className="text-sm text-gray-600">Automatic detection</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold text-gray-900">Lightning Fast</div>
              <div className="text-sm text-gray-600">AI-powered</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-3xl mb-2">🧠</div>
              <div className="font-semibold text-gray-900">AI-Powered</div>
              <div className="text-sm text-gray-600">Sentiment & Intent</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">AI Orchestrator Bot</div>
                    <div className="text-xs text-white/80">100+ languages • Universal Support</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/80">Online</span>
                  <button 
                    onClick={() => {
                      setIsDemoActive(false);
                      setMessages([{
                        id: '1',
                        type: 'bot',
                        content: 'Hello! I\'m your AI assistant. Try asking me something in any language - I speak 100+ languages from around the world! 🌍 Try saying "speak [language]" or write in your native language!',
                        timestamp: new Date()
                      }]);
                    }}
                    className="text-white/80 hover:text-white text-sm ml-2"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Examples */}
            <div className="bg-indigo-50/80 p-3 border-b border-indigo-100">
              <div className="text-xs font-semibold text-indigo-700 mb-2">Quick examples:</div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickExamples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickExample(example.text)}
                    className="text-xs bg-indigo-200 text-indigo-900 px-3 py-2 rounded-xl border border-indigo-300/80 hover:bg-indigo-300 hover:border-indigo-400 transition-colors whitespace-nowrap shadow-sm"
                    disabled={isTyping}
                  >
                    {example.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-indigo-100/60 via-white to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-500 text-white border border-indigo-300/80 shadow-[0_12px_30px_rgba(79,70,229,0.45)] backdrop-blur-sm'
                        : 'bg-white text-gray-900 border-2 border-indigo-100 shadow-sm shadow-indigo-100/70'
                    }`}
                  >
                    <p className={`text-sm whitespace-pre-wrap font-medium ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}>{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-indigo-100/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type in any language..."
                  className="flex-1 px-4 py-3 bg-white text-gray-900 border border-indigo-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-indigo-400"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-indigo-300/50"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Advanced AI • Multi-language • Smart Analytics
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InteractiveDemo;
