import { apiService } from '../api';

interface OfflineAction {
  id: string;
  type: 'CREATE_CHATBOT' | 'UPDATE_CHATBOT' | 'DELETE_CHATBOT' | 'SEND_MESSAGE';
  payload: any;
  timestamp: Date;
  retryCount: number;
}

class OfflineService {
  private static instance: OfflineService;
  private isOnline: boolean = navigator.onLine;
  private pendingActions: OfflineAction[] = [];
  private syncInProgress: boolean = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  private initialize(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingActions();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Load pending actions from storage
    this.loadPendingActions();
  }

  public isOnlineStatus(): boolean {
    return this.isOnline;
  }

  public async queueAction(type: OfflineAction['type'], payload: any): Promise<string> {
    const action: OfflineAction = {
      id: this.generateId(),
      type,
      payload,
      timestamp: new Date(),
      retryCount: 0,
    };

    this.pendingActions.push(action);
    await this.savePendingActions();

    // If online, try to sync immediately
    if (this.isOnline) {
      this.syncPendingActions();
    }

    return action.id;
  }

  public async syncPendingActions(): Promise<void> {
    if (this.syncInProgress || !this.isOnline || this.pendingActions.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      const actionsToProcess = [...this.pendingActions];
      
      for (const action of actionsToProcess) {
        try {
          await this.processAction(action);
          
          // Remove successful action
          this.pendingActions = this.pendingActions.filter(a => a.id !== action.id);
        } catch (error) {
          console.error(`Failed to process action ${action.id}:`, error);
          action.retryCount++;
          
          // Remove action if it has been retried too many times
          if (action.retryCount >= 3) {
            this.pendingActions = this.pendingActions.filter(a => a.id !== action.id);
            console.warn(`Action ${action.id} removed after ${action.retryCount} failed attempts`);
          }
        }
      }

      await this.savePendingActions();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processAction(action: OfflineAction): Promise<void> {
    switch (action.type) {
      case 'CREATE_CHATBOT':
        await apiService.createChatbot(action.payload);
        break;
      case 'UPDATE_CHATBOT':
        await apiService.updateChatbot(action.payload.id, action.payload.data);
        break;
      case 'DELETE_CHATBOT':
        await apiService.deleteChatbot(action.payload.id);
        break;
      case 'SEND_MESSAGE':
        // Mock API call for demo
        console.log('Send message:', {
          chatbotId: action.payload.chatbotId,
          message: action.payload.message
        });
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  public getPendingActionsCount(): number {
    return this.pendingActions.length;
  }

  public getPendingActions(): OfflineAction[] {
    return [...this.pendingActions];
  }

  public async clearPendingActions(): Promise<void> {
    this.pendingActions = [];
    await this.savePendingActions();
  }

  private async savePendingActions(): Promise<void> {
    try {
      localStorage.setItem('offline_actions', JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  }

  private async loadPendingActions(): Promise<void> {
    try {
      const stored = localStorage.getItem('offline_actions');
      if (stored) {
        this.pendingActions = JSON.parse(stored).map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
      this.pendingActions = [];
    }
  }

  private generateId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods for common offline operations
  public async createChatbotOffline(data: any): Promise<string> {
    return await this.queueAction('CREATE_CHATBOT', data);
  }

  public async updateChatbotOffline(id: string, data: any): Promise<string> {
    return await this.queueAction('UPDATE_CHATBOT', { id, data });
  }

  public async deleteChatbotOffline(id: string): Promise<string> {
    return await this.queueAction('DELETE_CHATBOT', { id });
  }

  public async sendMessageOffline(chatbotId: string, message: string): Promise<string> {
    return await this.queueAction('SEND_MESSAGE', { chatbotId, message });
  }
}

export default OfflineService.getInstance(); 