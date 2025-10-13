import { apiService } from './api';

export interface Integration {
  id: string;
  type: 'whatsapp' | 'messenger' | 'telegram' | 'shopify';
  status: 'connected' | 'pending' | 'disconnected' | 'error';
  phoneNumber?: string;
  pageId?: string;
  username?: string;
  storeUrl?: string;
  connectedAt?: string;
  error?: string;
}

export interface IntegrationConfig {
  whatsapp?: {
    phoneNumber: string;
    webhookUrl?: string;
  };
  messenger?: {
    pageId: string;
    accessToken: string;
  };
  telegram?: {
    botToken: string;
    username: string;
  };
  shopify?: {
    storeUrl: string;
    apiKey: string;
    apiSecret: string;
  };
}

class ChatbotIntegrationService {
  /**
   * Get all integrations for a chatbot
   */
  async getIntegrations(chatbotId: string): Promise<Integration[]> {
    try {
      const response = await apiService.getChatbotIntegrations(chatbotId);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
      return [];
    }
  }

  /**
   * Connect WhatsApp integration
   */
  async connectWhatsApp(chatbotId: string, config: IntegrationConfig['whatsapp']): Promise<Integration> {
    try {
      const response = await apiService.connectWhatsApp(chatbotId, config);
      return response.data;
    } catch (error) {
      console.error('Failed to connect WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Connect Facebook Messenger integration
   */
  async connectMessenger(chatbotId: string, config: IntegrationConfig['messenger']): Promise<Integration> {
    try {
      const response = await apiService.connectMessenger(chatbotId, config);
      return response.data;
    } catch (error) {
      console.error('Failed to connect Messenger:', error);
      throw error;
    }
  }

  /**
   * Connect Telegram integration
   */
  async connectTelegram(chatbotId: string, config: IntegrationConfig['telegram']): Promise<Integration> {
    try {
      const response = await apiService.connectTelegram(chatbotId, config);
      return response.data;
    } catch (error) {
      console.error('Failed to connect Telegram:', error);
      throw error;
    }
  }

  /**
   * Connect Shopify integration
   */
  async connectShopify(chatbotId: string, config: IntegrationConfig['shopify']): Promise<Integration> {
    try {
      const response = await apiService.connectShopify(chatbotId, config);
      return response.data;
    } catch (error) {
      console.error('Failed to connect Shopify:', error);
      throw error;
    }
  }

  /**
   * Disconnect an integration
   */
  async disconnectIntegration(chatbotId: string, integrationId: string): Promise<void> {
    try {
      await apiService.disconnectIntegration(chatbotId, integrationId);
    } catch (error) {
      console.error('Failed to disconnect integration:', error);
      throw error;
    }
  }

  /**
   * Get integration status
   */
  getIntegrationStatus(integration: Integration): 'success' | 'warning' | 'error' {
    switch (integration.status) {
      case 'connected':
        return 'success';
      case 'pending':
        return 'warning';
      case 'disconnected':
      case 'error':
        return 'error';
      default:
        return 'error';
    }
  }

  /**
   * Get integration icon
   */
  getIntegrationIcon(type: Integration['type']): string {
    const icons = {
      whatsapp: '',
      messenger: '💬',
      telegram: '✈️',
      shopify: '🛒'
    };
    return icons[type] || '🔗';
  }

  /**
   * Get integration display name
   */
  getIntegrationName(type: Integration['type']): string {
    const names = {
      whatsapp: 'WhatsApp Business',
      messenger: 'Facebook Messenger',
      telegram: 'Telegram Bot',
      shopify: 'Shopify Store'
    };
    return names[type] || type;
  }

  /**
   * Validate integration configuration
   */
  validateIntegrationConfig(type: Integration['type'], config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (type) {
      case 'whatsapp':
        if (!config?.phoneNumber) {
          errors.push('Phone number is required');
        }
        break;
      case 'messenger':
        if (!config?.pageId) {
          errors.push('Page ID is required');
        }
        if (!config?.accessToken) {
          errors.push('Access token is required');
        }
        break;
      case 'telegram':
        if (!config?.botToken) {
          errors.push('Bot token is required');
        }
        if (!config?.username) {
          errors.push('Bot username is required');
        }
        break;
      case 'shopify':
        if (!config?.storeUrl) {
          errors.push('Store URL is required');
        }
        if (!config?.apiKey) {
          errors.push('API key is required');
        }
        if (!config?.apiSecret) {
          errors.push('API secret is required');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Test integration connection
   */
  async testIntegration(chatbotId: string, integrationId: string): Promise<boolean> {
    try {
      // This would be implemented with a test endpoint in the backend
      const integrations = await this.getIntegrations(chatbotId);
      const integration = integrations.find(i => i.id === integrationId);
      return integration?.status === 'connected';
    } catch (error) {
      console.error('Failed to test integration:', error);
      return false;
    }
  }

  /**
   * Get integration statistics
   */
  async getIntegrationStats(chatbotId: string): Promise<{
    total: number;
    connected: number;
    pending: number;
    errors: number;
  }> {
    try {
      const integrations = await this.getIntegrations(chatbotId);
      return {
        total: integrations.length,
        connected: integrations.filter(i => i.status === 'connected').length,
        pending: integrations.filter(i => i.status === 'pending').length,
        errors: integrations.filter(i => i.status === 'error').length
      };
    } catch (error) {
      console.error('Failed to get integration stats:', error);
      return { total: 0, connected: 0, pending: 0, errors: 0 };
    }
  }
}

export const chatbotIntegrationService = new ChatbotIntegrationService();
export default chatbotIntegrationService;

