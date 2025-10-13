import { apiService } from '../api';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = 'serviceWorker' in navigator && 'PushManager' in window;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private async initialize(): Promise<void> {
    if (!this.isSupported) {
      console.warn('Push notifications not supported');
      return;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return { granted: false, denied: false, default: true };
    }

    try {
      const permission = await Notification.requestPermission();
      return {
        granted: permission === 'granted',
        denied: permission === 'denied',
        default: permission === 'default',
      };
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return { granted: false, denied: false, default: true };
    }
  }

  public async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.isSupported || !this.swRegistration) {
      return null;
    }

    try {
      const permission = await this.requestPermission();
      if (!permission.granted) {
        console.log('Notification permission not granted');
        return null;
      }

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY || ''),
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription as any);

      return subscription as any;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  public async unsubscribeFromPush(): Promise<boolean> {
    if (!this.isSupported || !this.swRegistration) {
      return false;
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await this.removeSubscriptionFromServer(subscription as any);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  public async isSubscribed(): Promise<boolean> {
    if (!this.isSupported || !this.swRegistration) {
      return false;
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return false;
    }
  }

  public async showLocalNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    try {
      const permission = await this.requestPermission();
      if (permission.granted) {
        new Notification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          ...options,
        });
      }
    } catch (error) {
      console.error('Failed to show local notification:', error);
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      // Mock API call for demo
      console.log('Subscribe to push notifications:', {
        endpoint: subscription.endpoint,
        keys: (subscription as any).keys,
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      // Mock API call for demo
      console.log('Unsubscribe from push notifications:', {
        endpoint: subscription.endpoint,
      });
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  public getSupportedStatus(): boolean {
    return this.isSupported;
  }
}

export default PushNotificationService.getInstance(); 