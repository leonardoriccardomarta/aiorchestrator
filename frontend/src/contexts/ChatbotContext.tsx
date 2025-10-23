import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '../config/constants';

interface Chatbot {
  id: string;
  name: string;
  description?: string;
  welcomeMessage?: string;
  language?: string;
  settings?: any;
  createdAt?: string;
  updatedAt?: string;
}

interface ChatbotContextType {
  chatbots: Chatbot[];
  selectedChatbot: Chatbot | null;
  selectedChatbotId: string | null;
  loading: boolean;
  selectChatbot: (chatbotId: string | null) => void;
  loadChatbots: () => Promise<void>;
  createChatbot: (data: Partial<Chatbot>) => Promise<Chatbot | null>;
  updateChatbot: (chatbotId: string, data: Partial<Chatbot>) => Promise<boolean>;
  deleteChatbot: (chatbotId: string) => Promise<boolean>;
  resetLoading: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selectedChatbotId, setSelectedChatbotId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Start as false to prevent initial loading state
  const [isLoading, setIsLoading] = useState(false); // Prevent multiple simultaneous loads
  const [retryCount, setRetryCount] = useState(0); // Track retry attempts
  const [isCircuitOpen, setIsCircuitOpen] = useState(false); // Circuit breaker
  const [hasLoaded, setHasLoaded] = useState(false); // Track if we've attempted to load

  const selectedChatbot = React.useMemo(() => 
    chatbots.find(c => c.id === selectedChatbotId) || null, 
    [chatbots, selectedChatbotId]
  );

  // Load chatbots on mount - only once
  useEffect(() => {
    const loadOnce = async () => {
      if (!hasLoaded && !isLoading) {
        setHasLoaded(true);
        // Load chatbots directly without calling the callback
        try {
          setIsLoading(true);
          const token = localStorage.getItem('authToken');
          if (!token) {
            console.log('No auth token, skipping chatbot load');
            setIsLoading(false);
            return;
          }

          const response = await fetch(`${API_URL}/api/chatbots`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
            const data = await response.json();
            const loadedChatbots = data?.data || [];
            console.log('🤖 Loaded chatbots:', loadedChatbots);
            setChatbots(loadedChatbots);

            // Auto-select first chatbot if none selected
            if (loadedChatbots.length > 0) {
              setSelectedChatbotId(prev => prev || loadedChatbots[0].id);
            }
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading chatbots:', error);
          setChatbots([]);
          setIsLoading(false);
        }
      }
    };
    loadOnce();
  }, []); // Empty dependency array to run only once on mount

  // Fallback: create default chatbot if circuit breaker is open and no chatbots exist
  useEffect(() => {
    if (isCircuitOpen && chatbots.length === 0 && !isLoading) {
      console.log('🤖 Circuit breaker open, creating fallback chatbot...');
      const fallbackChatbot = {
        id: 'fallback-' + Date.now(),
        name: 'My AI Assistant',
        description: 'Your personal AI assistant',
        settings: {
          language: 'auto',
          personality: 'professional',
          welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?"
        },
        userId: 'fallback',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setChatbots([fallbackChatbot]);
      setSelectedChatbotId(fallbackChatbot.id);
    }
  }, [isCircuitOpen, chatbots.length, isLoading]);

  const loadChatbots = React.useCallback(async () => {
    // Circuit breaker - if too many failures, stop trying
    if (isCircuitOpen) {
      console.log('🤖 Circuit breaker open, skipping chatbot load');
      return;
    }

    // Prevent multiple simultaneous loads
    if (isLoading) {
      console.log('🤖 LoadChatbots: Already loading, skipping...');
      return;
    }

    // Reset loading state if it's been stuck
    if (isLoading && Date.now() - (window.lastLoadAttempt || 0) > 10000) {
      console.log('🤖 LoadChatbots: Resetting stuck loading state');
      setIsLoading(false);
    }

    try {
      setIsLoading(true);
      window.lastLoadAttempt = Date.now();
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token, skipping chatbot load');
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/api/chatbots`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          const newRetryCount = retryCount + 1;
          setRetryCount(newRetryCount);
          
          // Circuit breaker: stop after 3 failed attempts
          if (newRetryCount >= 3) {
            console.log('🤖 Too many 429 errors, opening circuit breaker');
            setIsCircuitOpen(true);
            setChatbots([]);
            setIsLoading(false);
            // Reset circuit breaker after 30 seconds
            setTimeout(() => {
              setIsCircuitOpen(false);
              setRetryCount(0);
              console.log('🤖 Circuit breaker reset, retrying...');
            }, 30000);
            return;
          }
          
          // Exponential backoff: 5s, 10s, 20s
          const delay = Math.min(5000 * Math.pow(2, newRetryCount - 1), 20000);
          console.log(`🤖 Rate limited (attempt ${newRetryCount}/3), retrying in ${delay/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Retry
          const retryResponse = await fetch(`${API_URL}/api/chatbots`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!retryResponse.ok) {
            console.error(`Failed to load chatbots after retry ${newRetryCount}:`, retryResponse.status);
            setChatbots([]);
            setIsLoading(false);
            return;
          }
          // Use retry response
          const retryData = await retryResponse.json();
          const loadedChatbots = retryData?.data || [];
          setChatbots(loadedChatbots);
          if (loadedChatbots.length > 0) {
            setSelectedChatbotId(prev => prev || loadedChatbots[0].id);
          }
          setIsLoading(false);
          setRetryCount(0); // Reset on success
          return;
        }
        console.error('Failed to load chatbots:', response.status);
        setChatbots([]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const loadedChatbots = data?.data || [];
      console.log('🤖 Loaded chatbots:', loadedChatbots);
      setChatbots(loadedChatbots);

      // Auto-select first chatbot if none selected
      if (loadedChatbots.length > 0) {
        setSelectedChatbotId(prev => {
          if (!prev) {
            console.log('🤖 Auto-selecting first chatbot:', loadedChatbots[0].id);
            return loadedChatbots[0].id;
          }
          return prev;
        });
      } else {
        setSelectedChatbotId(null);
        // Auto-create default chatbot for new users
        console.log('No chatbots found, creating default chatbot...');
        await createChatbot({
          name: 'My AI Assistant',
          description: 'Your personal AI assistant',
          settings: {
            language: 'auto',
            personality: 'professional',
            welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?"
          }
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading chatbots:', error);
      if (error.name === 'AbortError') {
        console.log('🤖 LoadChatbots: Request timed out');
      }
      setChatbots([]);
      setIsLoading(false);
    }
  }, [isCircuitOpen, isLoading, retryCount]); // Remove selectedChatbotId from dependencies

  const selectChatbot = React.useCallback((chatbotId: string | null) => {
    setSelectedChatbotId(chatbotId);
    if (chatbotId) {
      localStorage.setItem('selectedChatbotId', chatbotId);
    } else {
      localStorage.removeItem('selectedChatbotId');
    }
  }, []);

  const createChatbot = React.useCallback(async (data: Partial<Chatbot>): Promise<Chatbot | null> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/chatbots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name || 'My AI Assistant',
          description: data.description || 'Your personal AI assistant',
          settings: data.settings || {
            language: 'auto',
            personality: 'professional',
            welcomeMessage: data.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?"
          }
        })
      });

      const result = await response.json();
      if (result.success && result.data) {
        // Add new chatbot to the list instead of reloading
        setChatbots(prev => [...prev, result.data]);
        setSelectedChatbotId(result.data.id); // Auto-select new chatbot
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating chatbot:', error);
      return null;
    }
  }, []);

  const updateChatbot = React.useCallback(async (chatbotId: string, data: Partial<Chatbot>): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/chatbots/${chatbotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        // Update chatbot in the list instead of reloading
        setChatbots(prev => prev.map(c => c.id === chatbotId ? { ...c, ...data } : c));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating chatbot:', error);
      return false;
    }
  }, []);

  const deleteChatbot = React.useCallback(async (chatbotId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/chatbots/${chatbotId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      if (result.success) {
        // Remove chatbot from the list instead of reloading
        setChatbots(prev => prev.filter(c => c.id !== chatbotId));
        // If deleted chatbot was selected, select first available or null
        if (selectedChatbotId === chatbotId) {
          setChatbots(prev => {
            const remaining = prev.filter(c => c.id !== chatbotId);
            setSelectedChatbotId(remaining.length > 0 ? remaining[0].id : null);
            return remaining;
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      return false;
    }
  }, [selectedChatbotId]);

  const resetLoading = React.useCallback(() => {
    console.log('🤖 Resetting loading state');
    setIsLoading(false);
    setRetryCount(0);
    setIsCircuitOpen(false);
  }, []);

  // This useEffect is removed to prevent duplicate loading

  // Restore selected chatbot from localStorage
  useEffect(() => {
    const savedChatbotId = localStorage.getItem('selectedChatbotId');
    if (savedChatbotId && chatbots.find(c => c.id === savedChatbotId)) {
      setSelectedChatbotId(savedChatbotId);
    }
  }, [chatbots]);

  const value: ChatbotContextType = {
    chatbots,
    selectedChatbot,
    selectedChatbotId,
    loading,
    selectChatbot,
    loadChatbots,
    createChatbot,
    updateChatbot,
    deleteChatbot,
    resetLoading
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotContext;

