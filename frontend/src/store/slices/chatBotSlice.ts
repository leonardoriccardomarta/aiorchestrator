import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatBotState, ChatBot, Message } from '../types';

const initialState: ChatBotState = {
  chatBots: [],
  currentChatBot: null,
  messages: [],
  loading: false,
  error: null,
};

const chatBotSlice = createSlice({
  name: 'chatBot',
  initialState,
  reducers: {
    fetchChatBotsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchChatBotsSuccess: (state, action: PayloadAction<ChatBot[]>) => {
      state.loading = false;
      state.chatBots = action.payload;
      state.error = null;
    },
    fetchChatBotsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentChatBot: (state, action: PayloadAction<ChatBot>) => {
      state.currentChatBot = action.payload;
    },
    clearCurrentChatBot: (state) => {
      state.currentChatBot = null;
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    createChatBotStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createChatBotSuccess: (state, action: PayloadAction<ChatBot>) => {
      state.loading = false;
      state.chatBots.push(action.payload);
      state.currentChatBot = action.payload;
      state.error = null;
    },
    createChatBotFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateChatBotStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateChatBotSuccess: (state, action: PayloadAction<ChatBot>) => {
      state.loading = false;
      const index = state.chatBots.findIndex((bot) => bot.id === action.payload.id);
      if (index !== -1) {
        state.chatBots[index] = action.payload;
      }
      if (state.currentChatBot?.id === action.payload.id) {
        state.currentChatBot = action.payload;
      }
      state.error = null;
    },
    updateChatBotFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteChatBotStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteChatBotSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.chatBots = state.chatBots.filter((bot) => bot.id !== action.payload);
      if (state.currentChatBot?.id === action.payload) {
        state.currentChatBot = null;
        state.messages = [];
      }
      state.error = null;
    },
    deleteChatBotFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchChatBotsStart,
  fetchChatBotsSuccess,
  fetchChatBotsFailure,
  setCurrentChatBot,
  clearCurrentChatBot,
  addMessage,
  setMessages,
  clearMessages,
  createChatBotStart,
  createChatBotSuccess,
  createChatBotFailure,
  updateChatBotStart,
  updateChatBotSuccess,
  updateChatBotFailure,
  deleteChatBotStart,
  deleteChatBotSuccess,
  deleteChatBotFailure,
  clearError,
} = chatBotSlice.actions;

export default chatBotSlice.reducer; 