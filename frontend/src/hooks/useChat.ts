import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    responseTime?: number;
    confidence?: number;
    sources?: string[];
  };
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  trialId?: string;
}

interface UseChat {
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  trialId?: string;
  setTrialId: (trialId: string) => void;
  clearChat: () => void;
}

export const useChat = (): UseChat => {
  const { user } = useAuth();
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    trialId: undefined,
  });

  // Get trialId from URL parameters or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trialParam = urlParams.get('trial');
    const storedTrialId = localStorage.getItem('trialId');
    
    if (trialParam) {
      setState((prev: ChatState) => ({ ...prev, trialId: trialParam }));
      localStorage.setItem('trialId', trialParam);
    } else if (storedTrialId) {
      setState((prev: ChatState) => ({ ...prev, trialId: storedTrialId }));
    }
  }, []);

  const sendMessage = async (content: string): Promise<void> => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setState((prev: ChatState) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const startTime = Date.now();
      
      // Build API payload with trialId
      const payload: Record<string, unknown> = {
        message: content,
        userId: user?.id,
        context: {
          conversationHistory: state.messages.slice(-5), // Last 5 messages for context
        },
      };

      // Add trialId if available
      if (state.trialId) {
        payload.trialId = state.trialId;
      }

      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message,
        sender: 'assistant',
        timestamp: new Date(),
        metadata: {
          responseTime,
          confidence: data.confidence,
          sources: data.sources,
        },
      };

      setState((prev: ChatState) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));

      // Update trial statistics if trialId exists
      if (state.trialId) {
        await updateTrialStats(state.trialId, {
          responseTime,
          customerSatisfaction: data.confidence || 0,
        });
      }

    } catch (error: unknown) {
      console.error('Error sending message:', error);
      setState((prev: ChatState) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      }));
    }
  };

  const setTrialId = (trialId: string) => {
    setState((prev: ChatState) => ({ ...prev, trialId }));
    localStorage.setItem('trialId', trialId);
  };

  const clearChat = () => {
    setState((prev: ChatState) => ({
      ...prev,
      messages: [],
      error: null,
    }));
  };

  // Update trial statistics
  const updateTrialStats = async (trialId: string, stats: {
    responseTime?: number;
    customerSatisfaction?: number;
  }) => {
    try {
      await fetch(`/api/trial/${trialId}/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          messagesProcessed: 1, // Increment by 1
          responseTime: stats.responseTime,
          customerSatisfaction: stats.customerSatisfaction,
          timesSaved: Math.round(stats.responseTime! / 1000 / 60), // Minutes saved vs manual response
        }),
      });
    } catch (error) {
      console.error('Error updating trial stats:', error);
      // Don't throw - this shouldn't break the chat flow
    }
  };

  return {
    messages: state.messages,
    sendMessage,
    isLoading: state.isLoading,
    error: state.error,
    trialId: state.trialId,
    setTrialId,
    clearChat,
  };
};