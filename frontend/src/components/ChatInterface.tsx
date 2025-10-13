import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { Card, Title, Text, TextInput, Button } from '@tremor/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export const ChatInterface: React.FC = () => {
  const { user: _user } = useAuth();
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput('');
  };

  return (
    <Card className="h-[calc(100vh-2rem)] flex flex-col">
      <Title>Chat Support</Title>
      <div className="flex-grow mt-4 mb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <Text>{message.content}</Text>
                {message.timestamp && (
                  <Text className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Text>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <TextInput
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-grow"
        />
        <Button
          type="submit"
          disabled={isLoading}
          icon={PaperAirplaneIcon}
          loading={isLoading}
        >
          Send
        </Button>
      </form>
    </Card>
  );
}; 