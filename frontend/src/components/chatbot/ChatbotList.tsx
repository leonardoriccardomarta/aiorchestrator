import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

const defaultChatbots: Chatbot[] = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'Handles common customer inquiries and support tickets',
    status: 'active',
    lastActive: '2024-03-20T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sales Assistant',
    description: 'Helps qualify leads and answer product questions',
    status: 'active',
    lastActive: '2024-03-20T09:15:00Z',
  },
];

const ChatbotList: React.FC = () => {
  const [chatbots] = React.useState<Chatbot[]>(defaultChatbots);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Chatbots</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your AI assistants
          </p>
        </div>
        <Link
          to="/chatbots/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create New Chatbot
        </Link>
      </div>

      <div className="grid gap-6">
        {chatbots.map((chatbot) => (
          <motion.div
            key={chatbot.id}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{chatbot.name}</h3>
                <p className="text-gray-600 mt-1">{chatbot.description}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    chatbot.status === 'active' 
                      ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20' 
                      : 'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      chatbot.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                    }`}></span>
                    {chatbot.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Last active: {new Date(chatbot.lastActive).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/chatbots/${chatbot.id}`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </Link>
                <Link
                  to={`/chatbots/${chatbot.id}/conversation`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  View Conversations
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChatbotList; 