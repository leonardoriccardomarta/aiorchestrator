// Remove unused imports
// import { handleAPIError, formatAPIResponse } from '../utils/api';

// Create a simple HTTP client
const httpClient = {
  async get(url: string, config?: Record<string, unknown>) {
    const response = await fetch(url, { method: 'GET', ...(config || {}) });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  },
  async post(url: string, data?: unknown, config?: Record<string, unknown>) {
    const response = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...(config || {})
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  },
  async patch(url: string, data?: unknown, config?: Record<string, unknown>) {
    const response = await fetch(url, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...(config || {})
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  },
  async put(url: string, data?: unknown, config?: Record<string, unknown>) {
    const response = await fetch(url, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...(config || {})
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  },
  async delete(url: string, config?: Record<string, unknown>) {
    const response = await fetch(url, { method: 'DELETE', ...(config || {}) });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  }
};

export interface IntegrationConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  config: Record<string, unknown>;
  instructions: string[];
  codeSnippet?: string;
  setupSteps: string[];
}

export interface ChatbotConfig {
  id: string;
  name: string;
  primaryColor: string;
  gradient: { from: string; to: string };
  theme: 'light' | 'dark';
  welcomeMessage: string;
  language: string;
  avatar?: string;
  chatIcon?: string;
  fontFamily: string;
  fontSize: string;
  bubbleShape: string;
}

export interface WebsiteIntegration {
  chatbotId: string;
  domain: string;
  isActive: boolean;
  customCode?: string;
  analyticsEnabled: boolean;
}

export interface ShopifyIntegration {
  chatbotId: string;
  shopDomain: string;
  apiKey: string;
  isActive: boolean;
  themeIntegration: boolean;
  productRecommendations: boolean;
}

export interface WhatsAppIntegration {
  chatbotId: string;
  phoneNumber: string;
  businessAccountId: string;
  isActive: boolean;
  webhookUrl: string;
  autoReplyEnabled: boolean;
}

export interface FacebookIntegration {
  chatbotId: string;
  pageId: string;
  accessToken: string;
  isActive: boolean;
  webhookUrl: string;
  messengerProfile: Record<string, unknown>;
}

export interface TelegramIntegration {
  chatbotId: string;
  botToken: string;
  botUsername: string;
  isActive: boolean;
  webhookUrl: string;
  commands: string[];
}

export interface InstagramIntegration {
  chatbotId: string;
  accountId: string;
  accessToken: string;
  isActive: boolean;
  autoReplyEnabled: boolean;
  storyReplies: boolean;
}

class IntegrationService {
  // Get all integrations for a chatbot
  async getIntegrations(chatbotId: string): Promise<IntegrationConfig[]> {
    try {
      const response = await httpClient.get(`/chatbots/${chatbotId}/integrations`);
      return response;
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw error;
    }
  }

  // Activate/Deactivate integration
  async toggleIntegration(chatbotId: string, integrationId: string, isActive: boolean): Promise<void> {
    try {
      await httpClient.patch(`/chatbots/${chatbotId}/integrations/${integrationId}`, {
        isActive
      });
    } catch (error) {
      console.error('Error toggling integration:', error);
      throw error;
    }
  }

  // Website Integration
  async setupWebsiteIntegration(chatbotId: string, config: Partial<WebsiteIntegration>): Promise<WebsiteIntegration> {
    try {
      const response = await httpClient.post(`/chatbots/${chatbotId}/integrations/website`, config);
      return response;
    } catch (error) {
      console.error('Error setting up website integration:', error);
      throw error;
    }
  }

  async getWebsiteIntegration(chatbotId: string): Promise<WebsiteIntegration> {
    try {
      const response = await httpClient.get(`/chatbots/${chatbotId}/integrations/website`);
      return response;
    } catch (error) {
      console.error('Error fetching website integration:', error);
      throw error;
    }
  }

  // Shopify Integration
  async setupShopifyIntegration(chatbotId: string, config: Partial<ShopifyIntegration>): Promise<ShopifyIntegration> {
    try {
      const response = await httpClient.post(`/chatbots/${chatbotId}/integrations/shopify`, config);
      return response;
    } catch (error) {
      console.error('Error setting up Shopify integration:', error);
      throw error;
    }
  }

  async getShopifyIntegration(chatbotId: string): Promise<ShopifyIntegration> {
    try {
      const response = await httpClient.get(`/chatbots/${chatbotId}/integrations/shopify`);
      return response;
    } catch (error) {
      console.error('Error fetching Shopify integration:', error);
      throw error;
    }
  }

  // WhatsApp Integration
  async setupWhatsAppIntegration(chatbotId: string, config: Partial<WhatsAppIntegration>): Promise<WhatsAppIntegration> {
    try {
      const response = await httpClient.post(`/chatbots/${chatbotId}/integrations/whatsapp`, config);
      return response;
    } catch (error) {
      console.error('Error setting up WhatsApp integration:', error);
      throw error;
    }
  }

  async getWhatsAppIntegration(chatbotId: string): Promise<WhatsAppIntegration> {
    try {
      const response = await httpClient.get(`/chatbots/${chatbotId}/integrations/whatsapp`);
      return response;
    } catch (error) {
      console.error('Error fetching WhatsApp integration:', error);
      throw error;
    }
  }

  // Facebook Integration
  async setupFacebookIntegration(chatbotId: string, config: Partial<FacebookIntegration>): Promise<FacebookIntegration> {
    try {
      const response = await httpClient.post(`/chatbots/${chatbotId}/integrations/facebook`, config);
      return response;
    } catch (error) {
      console.error('Error setting up Facebook integration:', error);
      throw error;
    }
  }

  async getFacebookIntegration(chatbotId: string): Promise<FacebookIntegration> {
    try {
      const response = await httpClient.get(`/chatbots/${chatbotId}/integrations/facebook`);
      return response;
    } catch (error) {
      console.error('Error fetching Facebook integration:', error);
      throw error;
    }
  }

  // Telegram Integration
  async setupTelegramIntegration(chatbotId: string, config: Partial<TelegramIntegration>): Promise<TelegramIntegration> {
    try {
      const response = await httpClient.post(`/chatbots/${chatbotId}/integrations/telegram`, config);
      return response;
    } catch (error) {
      console.error('Error setting up Telegram integration:', error);
      throw error;
    }
  }

  async getTelegramIntegration(chatbotId: string): Promise<TelegramIntegration> {
    try {
      const response = await httpClient.get(`/chatbots/${chatbotId}/integrations/telegram`);
      return response;
    } catch (error) {
      console.error('Error fetching Telegram integration:', error);
      throw error;
    }
  }

  // Instagram Integration
  async setupInstagramIntegration(chatbotId: string, config: Partial<InstagramIntegration>): Promise<InstagramIntegration> {
    try {
      const response = await httpClient.post(`/chatbots/${chatbotId}/integrations/instagram`, config);
      return response;
    } catch (error) {
      console.error('Error setting up Instagram integration:', error);
      throw error;
    }
  }

  async getInstagramIntegration(chatbotId: string): Promise<InstagramIntegration> {
    try {
      const response = await httpClient.get(`/chatbots/${chatbotId}/integrations/instagram`);
      return response;
    } catch (error) {
      console.error('Error fetching Instagram integration:', error);
      throw error;
    }
  }

  // Generate integration code
  async generateIntegrationCode(chatbotId: string, platform: string, config: ChatbotConfig): Promise<string> {
    try {
      const response = await httpClient.post(`/chatbots/${chatbotId}/integrations/${platform}/code`, config);
      return response.code;
    } catch (error) {
      console.error('Error generating integration code:', error);
      throw error;
    }
  }

  // Test integration connection
  async testIntegration(chatbotId: string, integrationId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpClient.post(`/chatbots/${chatbotId}/integrations/${integrationId}/test`);
      return response;
    } catch (error) {
      console.error('Error testing integration:', error);
      throw error;
    }
  }

  // Get integration analytics
  async getIntegrationAnalytics(chatbotId: string, integrationId: string, period: string = '7d'): Promise<Record<string, unknown>> {
    try {
      const response = await httpClient.get(`/chatbots/${chatbotId}/integrations/${integrationId}/analytics`, {
        params: { period }
      });
      return response;
    } catch (error) {
      console.error('Error fetching integration analytics:', error);
      throw error;
    }
  }

  // Update integration settings
  async updateIntegrationSettings(chatbotId: string, integrationId: string, settings: Record<string, unknown>): Promise<void> {
    try {
      await httpClient.put(`/chatbots/${chatbotId}/integrations/${integrationId}/settings`, settings);
    } catch (error) {
      console.error('Error updating integration settings:', error);
      throw error;
    }
  }

  // Delete integration
  async deleteIntegration(chatbotId: string, integrationId: string): Promise<void> {
    try {
      await httpClient.delete(`/chatbots/${chatbotId}/integrations/${integrationId}`);
    } catch (error) {
      console.error('Error deleting integration:', error);
      throw error;
    }
  }

  // Get available integration platforms
  async getAvailablePlatforms(): Promise<IntegrationConfig[]> {
    try {
      const response = await httpClient.get('/integrations/platforms');
      return response;
    } catch (error) {
      console.error('Error fetching available platforms:', error);
      throw error;
    }
  }

  // Validate integration configuration
  async validateIntegrationConfig(platform: string, config: Record<string, unknown>): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const response = await httpClient.post(`/integrations/${platform}/validate`, config);
      return response;
    } catch (error) {
      console.error('Error validating integration config:', error);
      throw error;
    }
  }

  // Get integration webhooks
  async getIntegrationWebhooks(chatbotId: string, integrationId: string): Promise<Record<string, unknown>[]> {
    try {
      const response = await httpClient.get(`/chatbots/${chatbotId}/integrations/${integrationId}/webhooks`);
      return response;
    } catch (error) {
      console.error('Error fetching integration webhooks:', error);
      throw error;
    }
  }

  // Create integration webhook
  async createIntegrationWebhook(chatbotId: string, integrationId: string, webhook: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const response = await httpClient.post(`/chatbots/${chatbotId}/integrations/${integrationId}/webhooks`, webhook);
      return response;
    } catch (error) {
      console.error('Error creating integration webhook:', error);
      throw error;
    }
  }

  // Delete integration webhook
  async deleteIntegrationWebhook(chatbotId: string, integrationId: string, webhookId: string): Promise<void> {
    try {
      await httpClient.delete(`/chatbots/${chatbotId}/integrations/${integrationId}/webhooks/${webhookId}`);
    } catch (error) {
      console.error('Error deleting integration webhook:', error);
      throw error;
    }
  }
}

const integrationService = new IntegrationService();
export { integrationService };
export default integrationService; 