import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Send, Paperclip, MoreVertical, Phone, Video, Image, Smile, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideInFromRight, slideInFromLeft, popIn } from '../utils/animations';
import { Toast } from '../components/ui/Toast';

type FC = React.FC;

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  status: 'sending' | 'sent' | 'error';
  attachments?: string[];
}

const Chat: FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Hello! How can I help you today?',
      sender: 'agent',
      timestamp: '10:00 AM',
      status: 'sent',
    },
    {
      id: 2,
      content: 'I have a question about my subscription.',
      sender: 'user',
      timestamp: '10:01 AM',
      status: 'sent',
    },
    {
      id: 3,
      content: "Of course! I'd be happy to help you with that. What specific aspect of your subscription would you like to know more about?",
      sender: 'agent',
      timestamp: '10:02 AM',
      status: 'sent',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMsg.id ? { ...msg, status: 'sent' } : msg
        )
      );

      // Simulate agent typing
      setTimeout(() => {
        const response: Message = {
          id: messages.length + 2,
          content: "I'm looking into that for you...",
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }, 1000);
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setToastMessage('File size should be less than 5MB');
        setShowToast(true);
        return;
      }
      // Handle file upload here
      setToastMessage('File uploaded successfully');
      setShowToast(true);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)]">
      <motion.div 
        className="flex h-full flex-col"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <motion.div 
            className="flex items-center justify-between p-4"
            variants={popIn}
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-primary-700 dark:text-primary-300 font-medium">JS</span>
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold">John Smith</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isTyping ? 'Typing...' : 'Active now'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={message.sender === 'user' ? slideInFromRight : slideInFromLeft}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <div className="flex items-center justify-end mt-1 space-x-2">
                    <span className={`text-xs ${
                      message.sender === 'user'
                        ? 'text-primary-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp}
                    </span>
                    {message.sender === 'user' && (
                      <span className="text-xs text-primary-100">
                        {message.status === 'sending' ? 'Sending...' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />
            <Button variant="ghost" size="sm" onClick={handleAttachment}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Image className="h-4 w-4" />
            </Button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent focus:outline-none"
            />
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Mic className="h-4 w-4" />
            </Button>
            <Button onClick={handleSend} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {showToast && (
        <Toast
          id="chat-toast"
          title="Info"
          message={toastMessage}
          type="info"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Chat; 