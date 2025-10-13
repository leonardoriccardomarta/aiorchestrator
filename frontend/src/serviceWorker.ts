// Service Worker Registration for PWA
import { registerSW } from 'virtual:pwa-register';

// PWA Update Types
export interface PWAUpdateEvent {
  needRefresh: boolean;
  offlineReady: boolean;
  updateSW: () => Promise<void>;
}

// PWA Update Callback
export type PWAUpdateCallback = (event: PWAUpdateEvent) => void;

// Register the service worker
export const registerServiceWorker = (onUpdate?: PWAUpdateCallback) => {
  const updateSW = registerSW({
    onNeedRefresh() {
      // New content is available, show update prompt
      if (onUpdate) {
        onUpdate({
          needRefresh: true,
          offlineReady: false,
          updateSW: () => updateSW(true)
        });
      }
    },
    onOfflineReady() {
      // App is ready for offline use
      if (onUpdate) {
        onUpdate({
          needRefresh: false,
          offlineReady: true,
          updateSW: () => updateSW(true)
        });
      }
    },
    onRegistered(swRegistration: ServiceWorkerRegistration) {
      // Service worker registered successfully
      console.log('PWA Service Worker registered:', swRegistration);
    },
    onRegisterError(error: Error) {
      // Service worker registration failed
      console.error('PWA Service Worker registration failed:', error);
    }
  });

  return updateSW;
};

// Check if the app is running as a PWA
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (typeof (window.navigator as any).standalone === 'boolean' && (window.navigator as any).standalone === true);
};

// Check if the app is running offline
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'default') {
    return await Notification.requestPermission();
  }

  return Notification.permission;
};

// Send a notification
export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
};

// Background sync registration
export const registerBackgroundSync = async (tag: string): Promise<void> => {
  if ('serviceWorker' in navigator && 'sync' in (navigator.serviceWorker.ready as any)) {
    const registration = await navigator.serviceWorker.ready;
    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
    }
  }
};

// Cache management
export const clearAllCaches = async (): Promise<void> => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }
};

// Get cache storage info
export const getCacheInfo = async (): Promise<{ name: string; size: number }[]> => {
  if (!('caches' in window)) {
    return [];
  }

  const cacheNames = await caches.keys();
  const cacheInfo = await Promise.all(
    cacheNames.map(async (name) => {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      let size = 0;
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          size += blob.size;
        }
      }
      
      return { name, size };
    })
  );

  return cacheInfo;
};

// Install prompt management
export class InstallPromptManager {
  private deferredPrompt: Event | null = null;
  private installCallback?: () => void;

  constructor() {
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
  }

  private handleBeforeInstallPrompt = (e: Event) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    this.deferredPrompt = e;
    
    // Notify that install prompt is available
    if (this.installCallback) {
      this.installCallback();
    }
  };

  public onInstallPromptAvailable = (callback: () => void) => {
    this.installCallback = callback;
  };

  public async showInstallPrompt(): Promise<{ outcome: 'accepted' | 'dismissed' }> {
    if (!this.deferredPrompt) {
      throw new Error('Install prompt not available');
    }

    (this.deferredPrompt as any).prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await (this.deferredPrompt as any).userChoice;
    
    // Clear the deferredPrompt
    this.deferredPrompt = null;

    return { outcome };
  }

  public isInstallPromptAvailable(): boolean {
    return this.deferredPrompt !== null;
  }

  public destroy() {
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
  }
}

// Network status monitoring
export class NetworkMonitor {
  private onlineCallback?: () => void;
  private offlineCallback?: () => void;

  constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    if (this.onlineCallback) {
      this.onlineCallback();
    }
  };

  private handleOffline = () => {
    if (this.offlineCallback) {
      this.offlineCallback();
    }
  };

  public onOnline = (callback: () => void) => {
    this.onlineCallback = callback;
  };

  public onOffline = (callback: () => void) => {
    this.offlineCallback = callback;
  };

  public destroy() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }
}

// PWA Analytics
export class PWAAnalytics {
  private static instance: PWAAnalytics;
  private events: Array<{ event: string; timestamp: number; data?: unknown }> = [];

  private constructor() {}

  public static getInstance(): PWAAnalytics {
    if (!PWAAnalytics.instance) {
      PWAAnalytics.instance = new PWAAnalytics();
    }
    return PWAAnalytics.instance;
  }

  public trackEvent(event: string, data?: unknown): void {
    this.events.push({
      event,
      timestamp: Date.now(),
      data
    });

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, data);
    }
  }

  public getEvents(): Array<{ event: string; timestamp: number; data?: unknown }> {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }
}

// Default export for easy import
export default {
  registerServiceWorker,
  isPWA,
  isOffline,
  requestNotificationPermission,
  sendNotification,
  registerBackgroundSync,
  clearAllCaches,
  getCacheInfo,
  InstallPromptManager,
  NetworkMonitor,
  PWAAnalytics
};