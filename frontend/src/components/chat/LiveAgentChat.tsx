import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Bot, UserCheck, X } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  sender: 'bot' | 'visitor' | 'agent';
  senderName?: string;
  message: string;
  createdAt: Date;
  isInternal?: boolean;
}

interface LiveAgentChatProps {
  chatbotId: string;
  visitorName?: string;
  visitorEmail?: string;
  onClose?: () => void;
}

const LiveAgentChat: React.FC<LiveAgentChatProps> = ({
  chatbotId,
  visitorName,
  visitorEmail,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [status, setStatus] = useState<'bot' | 'waiting' | 'assigned' | 'active'>('bot');
  const [agentName, setAgentName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/agents/conversations`, {
        chatbotId,
        visitorName: visitorName || 'Guest',
        visitorEmail: visitorEmail || undefined,
        priority: 'normal'
      });

      if (response.data.success) {
        setConversationId(response.data.conversation.id);
        
        // Add welcome message
        addBotMessage('Hello! How can I help you today? 👋');
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      addBotMessage('Hi! I\'m here to help. What can I do for you?');
    }
  };

  const addBotMessage = (content: string) => {
    const message: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      senderName: 'AI Assistant',
      message: content,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addAgentMessage = (content: string, name: string) => {
    const message: Message = {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      senderName: name,
      message: content,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'visitor',
      senderName: visitorName || 'You',
      message: inputValue,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Save message to conversation
      if (conversationId) {
        await axios.post(`${API_URL}/api/agents/conversations/${conversationId}/messages`, {
          sender: 'visitor',
          senderName: visitorName || 'Guest',
          message: messageText
        });
      }

      // If talking to live agent, just save message
      if (status === 'active' || status === 'assigned') {
        setIsTyping(false);
        return;
      }

      // Otherwise, get AI response
      const aiResponse = await axios.post(`${API_URL}/api/chat`, {
        message: messageText,
        conversationId,
        userId: 'visitor'
      });

      const botReply = aiResponse.data.data?.response || aiResponse.data.response || 'I apologize, I\'m having trouble right now.';
      
      // Check if bot suggests live agent
      const needsAgent = botReply.toLowerCase().includes('connect you') || 
                        botReply.toLowerCase().includes('live agent') ||
                        botReply.toLowerCase().includes('support specialist');

      if (needsAgent) {
        addBotMessage(botReply);
      } else {
        addBotMessage(botReply);
        
        // Save bot response
        if (conversationId) {
          await axios.post(`${API_URL}/api/agents/conversations/${conversationId}/messages`, {
            sender: 'bot',
            senderName: 'AI Assistant',
            message: botReply
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addBotMessage('Sorry, I\'m having trouble connecting. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const requestLiveAgent = async () => {
    if (!conversationId) {
      addBotMessage('Please start a conversation first.');
      return;
    }

    setIsTyping(true);
    addBotMessage('Let me connect you to one of our support specialists. One moment please...');

    try {
      const response = await axios.post(`${API_URL}/api/agents/handoff/request`, {
        conversationId,
        reason: 'Customer requested human support',
        priority: 'normal'
      });

      if (response.data.success) {
        if (response.data.status === 'assigned') {
          setStatus('assigned');
          setAgentName(response.data.agent.displayName);
          addBotMessage(`Great! You're now connected with ${response.data.agent.displayName}. They'll be with you shortly.`);
        } else if (response.data.status === 'waiting') {
          setStatus('waiting');
          addBotMessage('All our agents are currently busy. You\'ve been added to the queue and will be connected to the next available agent.');
        }
      }
    } catch (error) {
      console.error('Error requesting live agent:', error);
      addBotMessage('Sorry, I couldn\'t connect you to an agent right now. Please try again later.');
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

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status === 'active' || status === 'assigned' ? (
              <UserCheck className="w-6 h-6" />
            ) : (
              <Bot className="w-6 h-6" />
            )}
            <div>
              <h3 className="font-semibold text-lg">
                {status === 'active' || status === 'assigned' 
                  ? agentName || 'Live Agent' 
                  : 'AI Assistant'}
              </h3>
              <p className="text-xs opacity-90">
                {status === 'active' ? '● Online' : 
                 status === 'waiting' ? '⏳ Waiting for agent...' :
                 status === 'assigned' ? '● Agent assigned' :
                 '● Powered by AI'}
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${msg.sender === 'visitor' ? 'order-2' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                {msg.sender === 'visitor' ? (
                  <User className="w-4 h-4 text-gray-500" />
                ) : msg.sender === 'agent' ? (
                  <UserCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-500" />
                )}
                <span className="text-xs text-gray-500 font-medium">
                  {msg.senderName || msg.sender}
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  msg.sender === 'visitor'
                    ? 'bg-blue-600 text-white'
                    : msg.sender === 'agent'
                    ? 'bg-green-100 text-gray-900'
                    : 'bg-white text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500">
            <Bot className="w-4 h-4" />
            <span className="text-sm">Typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Live Agent Button */}
      {status === 'bot' && (
        <div className="p-2 bg-yellow-50 border-t border-yellow-100">
          <button
            onClick={requestLiveAgent}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <UserCheck className="w-4 h-4" />
            Talk to a Live Agent
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              status === 'waiting' ? 'Waiting for agent...' :
              status === 'active' || status === 'assigned' ? 'Message to agent...' :
              'Type your message...'
            }
            disabled={status === 'waiting'}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={isTyping || !inputValue.trim() || status === 'waiting'}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAgentChat;

