import React from 'react';
import { useParams } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const defaultMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hi, I need help with my order.',
    timestamp: '2024-03-20T10:30:00Z',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Hello! I\'d be happy to help you with your order. Could you please provide your order number?',
    timestamp: '2024-03-20T10:30:05Z',
  },
  {
    id: '3',
    role: 'user',
    content: 'My order number is #12345',
    timestamp: '2024-03-20T10:30:15Z',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Thank you for providing the order number. I can see that your order #12345 was placed yesterday and is currently being processed. Is there something specific you\'d like to know about it?',
    timestamp: '2024-03-20T10:30:20Z',
  },
];

const ChatbotConversation: React.FC = () => {
  const { id: _id } = useParams<{ id: string }>();
  const [messages, setMessages] = React.useState<Message[]>(defaultMessages);
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // TODO: Implement actual chatbot API call
    setTimeout(() => {
      const botMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: 'I understand your message. How else can I assist you?',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Conversation</h1>
        <p className="text-gray-600 mt-1">
          Chat history with your AI assistant
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg border border-gray-100 flex flex-col h-[calc(100vh-16rem)]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatbotConversation; 