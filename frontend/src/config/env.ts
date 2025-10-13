import { API_URL } from './constants';

export const config = {
  apiUrl: `${API_URL}/api`,
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  chatbotApiUrl: import.meta.env.VITE_CHATBOT_API_URL || 'https://api.chatbot.com',
};

export default config; 