import { apiRequest } from './api';

export const customizeChatbot = (data) =>
  apiRequest('/chatbot/customize', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const generateChatbotLink = (config) =>
  apiRequest('/chatbot/link', {
    method: 'POST',
    body: JSON.stringify(config),
  });

export const generateChatbotResponse = (data) =>
  apiRequest('/chatbot/respond', {
    method: 'POST',
    body: JSON.stringify(data),
  });
