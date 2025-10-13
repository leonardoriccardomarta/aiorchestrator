export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  tenantId: string;
  roles: string[];
  lastLogin?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface ChatBot {
  id: string;
  name: string;
  description?: string;
  model: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  chatBot: ChatBot;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ChatBotState {
  chatBots: ChatBot[];
  currentChatBot: ChatBot | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }[];
}

export interface RootState {
  auth: AuthState;
  chatBot: ChatBotState;
  ui: UIState;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
} 