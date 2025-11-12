import React from 'react';

interface Chatbot {
  id: string;
  name: string;
  status: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

interface ActiveChatbotsProps {
  chatbots: Chatbot[];
  onChatbotClick: (id: string) => void;
}

const ActiveChatbots: React.FC<ActiveChatbotsProps> = ({ chatbots, onChatbotClick }) => {
  // Ensure chatbots is an array
  const chatbotsArray = Array.isArray(chatbots) ? chatbots : [];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Chatbots</h2>
      <div className="space-y-4">
        {chatbotsArray.map((chatbot) => (
          <div
            key={chatbot.id}
            onClick={() => onChatbotClick(chatbot.id)}
            className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                {chatbot.icon || ''}
              </div>
              <div>
                <h3 className="font-medium text-slate-900">{chatbot.name}</h3>
                <p className="text-sm text-slate-500">{chatbot.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                chatbot.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : chatbot.status === 'Draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : chatbot.status === 'Inactive'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {chatbot.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveChatbots; 
