export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  chatbotApiUrl: import.meta.env.VITE_CHATBOT_API_URL || 'https://api.chatbot.com',
};

export default config; 