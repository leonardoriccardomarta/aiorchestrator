import React from 'react';
import { Bot, ChevronDown } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';

const ChatbotSelector: React.FC = React.memo(() => {
  const { chatbots, selectedChatbot, selectChatbot, loading } = useChatbot();
  const [isOpen, setIsOpen] = React.useState(false);

  // Remove debug logging to prevent spam

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg animate-pulse">
        <Bot className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  if (chatbots.length === 0) {
    return null; // Don't show selector if no chatbots
  }

  if (chatbots.length === 1) {
    // Only one chatbot - show as static badge with better spacing
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg ml-4">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-900">{selectedChatbot?.name || chatbots[0]?.name || 'My Chatbot'}</span>
      </div>
    );
  }

  // Multiple chatbots - show dropdown
  return (
    <div className="relative ml-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg hover:border-blue-300 transition-colors"
      >
        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-900">{selectedChatbot?.name || 'Select Chatbot'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                Your Chatbots ({chatbots.length})
              </div>
              {chatbots.map((chatbot) => (
                <button
                  key={chatbot.id}
                  onClick={() => {
                    selectChatbot(chatbot.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedChatbot?.id === chatbot.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedChatbot?.id === chatbot.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-gray-200'
                  }`}>
                    <Bot className={`w-4 h-4 ${
                      selectedChatbot?.id === chatbot.id ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">{chatbot.name}</div>
                    {chatbot.description && (
                      <div className="text-xs text-gray-500 truncate">{chatbot.description}</div>
                    )}
                  </div>
                  {selectedChatbot?.id === chatbot.id && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ChatbotSelector.displayName = 'ChatbotSelector';

export default ChatbotSelector;

