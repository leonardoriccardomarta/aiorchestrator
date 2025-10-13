import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  selectedChatId: string | null;
}

const initialState: ChatState = {
  messages: [],
  isTyping: false,
  selectedChatId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setSelectedChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
      state.messages = [];
    },
    clearChat: (state) => {
      state.messages = [];
      state.isTyping = false;
    },
  },
});

export const { addMessage, setTyping, setSelectedChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer; 