import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { Card, Title, Text, TextInput, Button } from '@tremor/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp?: Date;
}

interface OptimizedChatInterfaceProps {
  maxMessages?: number;
  autoScroll?: boolean;
  showTimestamps?: boolean;
}

// Optimized Message Component with React.memo
const MessageComponent = React.memo<{
  message: Message;
  showTimestamp: boolean;
}>(({ message, showTimestamp }) => {
  const messageStyle = useMemo(() => ({
    maxWidth: '70%',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: message.sender === 'user' ? '#3b82f6' : '#f3f4f6',
    color: message.sender === 'user' ? 'white' : '#111827',
  }), [message.sender]);

  const timestampStyle = useMemo(() => ({
    fontSize: '12px',
    marginTop: '4px',
    opacity: 0.7,
  }), []);

  return (
    <div
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div style={messageStyle}>
        <Text>{message.content}</Text>
        {showTimestamp && message.timestamp && (
          <Text style={timestampStyle}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Text>
        )}
      </div>
    </div>
  );
});

MessageComponent.displayName = 'MessageComponent';

// Virtual Scrolling Hook for Large Message Lists
const useVirtualScrolling = (
  items: Message[],
  itemHeight: number = 80,
  containerHeight: number = 400
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);

  const visibleItems = useMemo(() => 
    items.slice(startIndex, endIndex), 
    [items, startIndex, endIndex]
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    containerRef,
  };
};

// Optimized Chat Interface Component
export const OptimizedChatInterface: React.FC<OptimizedChatInterfaceProps> = React.memo(({
  maxMessages = 1000,
  autoScroll = true,
  showTimestamps = true,
}) => {
  const { user: _user } = useAuth();
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoized messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => 
    messages.slice(-maxMessages), 
    [messages, maxMessages]
  );

  // Virtual scrolling for large message lists
  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    containerRef,
  } = useVirtualScrolling(memoizedMessages);

  // Optimized scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll]);

  // Auto-scroll effect
  useEffect(() => {
    scrollToBottom();
  }, [memoizedMessages, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Optimized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageToSend = input.trim();
    setInput('');
    
    try {
      await sendMessage(messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally restore input on error
      setInput(messageToSend);
    }
  }, [input, isLoading, sendMessage]);

  // Optimized input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  // Memoized form JSX
  const formJSX = useMemo(() => (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <TextInput
        ref={inputRef}
        placeholder="Type your message..."
        value={input}
        onChange={handleInputChange}
        disabled={isLoading}
        className="flex-grow"
      />
      <Button
        type="submit"
        disabled={isLoading || !input.trim()}
        icon={PaperAirplaneIcon}
        loading={isLoading}
      >
        Send
      </Button>
    </form>
  ), [input, isLoading, handleSubmit, handleInputChange]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup any pending operations
      setInput('');
    };
  }, []);

  return (
    <Card className="h-[calc(100vh-2rem)] flex flex-col">
      <Title>Chat Support</Title>
      
      <div 
        ref={containerRef}
        className="flex-grow mt-4 mb-4 overflow-y-auto"
        onScroll={handleScroll}
        style={{ height: '400px' }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            <div className="space-y-4">
              {visibleItems.map((message) => (
                <MessageComponent
                  key={message.id}
                  message={message}
                  showTimestamp={showTimestamps}
                />
              ))}
            </div>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
      
      {formJSX}
    </Card>
  );
});

OptimizedChatInterface.displayName = 'OptimizedChatInterface';