// PWA Utilities for AI Orchestrator
// Provides comprehensive PWA functionality including service worker management,
// offline support, update notifications, and install prompts

export interface PWAConfig {
  enableOfflineSupport: boolean;
  enableUpdateNotifications: boolean;
  enableBackgroundSync: boolean;
  enableInstallPrompt: boolean;
  enableNetworkMonitoring: boolean;
  enableAnalytics: boolean;
}

export interface UpdateInfo {
  version: string;
  timestamp: number;
  changes: string[];
}

export interface NetworkStatus {
  online: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export interface CacheInfo {
  name: string;
  size: number;
  entries: number;
  lastUpdated: number;
}

// Default PWA configuration
export const defaultPWAConfig: PWAConfig = {
  enableOfflineSupport: true,
  enableUpdateNotifications: true,
  enableBackgroundSync: true,
  enableInstallPrompt: true,
  enableNetworkMonitoring: true,
  enableAnalytics: true,
};

// Service Worker Registration
export class PWAManager {
  private config: PWAConfig;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private updateCallbacks: ((info: UpdateInfo) => void)[] = [];
  private networkCallbacks: ((status: NetworkStatus) => void)[] = [];
  private installCallbacks: (() => void)[] = [];

  constructor(config: PWAConfig = defaultPWAConfig) {
    this.config = config;
  }

  // Register service worker
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      console.log('Service Worker registered successfully:', this.swRegistration);

      // Set up event listeners
      this.setupServiceWorkerListeners();
      
      // Initialize other PWA features
      if (this.config.enableNetworkMonitoring) {
        this.setupNetworkMonitoring();
      }

      if (this.config.enableInstallPrompt) {
        this.setupInstallPrompt();
      }

      return this.swRegistration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  // Setup service worker event listeners
  private setupServiceWorkerListeners(): void {
    if (!this.swRegistration) return;

    // Handle service worker updates
    this.swRegistration.addEventListener('updatefound', () => {
      const newWorker = this.swRegistration!.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.handleUpdateAvailable();
        }
      });
    });

    // Handle service worker controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
      this.notifyUpdateCallbacks({
        version: 'new',
        timestamp: Date.now(),
        changes: ['Service Worker updated'],
      });
    });
  }

  // Handle update available
  private handleUpdateAvailable(): void {
    if (this.config.enableUpdateNotifications) {
      this.notifyUpdateCallbacks({
        version: 'new',
        timestamp: Date.now(),
        changes: ['New version available'],
      });
    }
  }

  // Setup network monitoring
  private setupNetworkMonitoring(): void {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.notifyNetworkCallbacks({ online: true });
    });

    window.addEventListener('offline', () => {
      this.notifyNetworkCallbacks({ online: false });
    });

    // Monitor connection quality (if supported)
    if ('connection' in navigator) {
      const connection = (navigator as unknown as Record<string, unknown>).connection;
      if (typeof connection === 'object' && connection !== null && 'addEventListener' in connection && typeof (connection as Record<string, unknown>).addEventListener === 'function') {
        (connection as EventTarget).addEventListener('change', () => {
          this.notifyNetworkCallbacks({
            online: navigator.onLine,
            connectionType: typeof (connection as Record<string, unknown>).effectiveType === 'string' ? (connection as Record<string, unknown>).effectiveType as string : undefined,
            effectiveType: typeof (connection as Record<string, unknown>).effectiveType === 'string' ? (connection as Record<string, unknown>).effectiveType as string : undefined,
            downlink: typeof (connection as Record<string, unknown>).downlink === 'number' ? (connection as Record<string, unknown>).downlink as number : undefined,
            rtt: typeof (connection as Record<string, unknown>).rtt === 'number' ? (connection as Record<string, unknown>).rtt as number : undefined,
          });
        });
      }
    }
  }

  // Setup install prompt
  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.notifyInstallCallbacks();
    });
  }

  // Update service worker
  async updateServiceWorker(): Promise<boolean> {
    if (!this.swRegistration) return false;

    try {
      await this.swRegistration.update();
      return true;
    } catch (error) {
      console.error('Service Worker update failed:', error);
      return false;
    }
  }

  // Skip waiting and activate new service worker
  async skipWaiting(): Promise<void> {
    if (!this.swRegistration?.waiting) return;

    try {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    } catch (error) {
      console.error('Skip waiting failed:', error);
    }
  }

  // Cache management
  async getCacheInfo(): Promise<CacheInfo[]> {
    if (!('caches' in window)) return [];

    try {
      const cacheNames = await caches.keys();
      const cacheInfo: CacheInfo[] = [];

      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        let totalSize = 0;

        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }

        cacheInfo.push({
          name,
          size: totalSize,
          entries: keys.length,
          lastUpdated: Date.now(),
        });
      }

      return cacheInfo;
    } catch (error) {
      console.error('Failed to get cache info:', error);
      return [];
    }
  }

  // Clear specific cache
  async clearCache(cacheName: string): Promise<boolean> {
    if (!('caches' in window)) return false;

    try {
      await caches.delete(cacheName);
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }

  // Clear all caches
  async clearAllCaches(): Promise<boolean> {
    if (!('caches' in window)) return false;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      return true;
    } catch (error) {
      console.error('Failed to clear all caches:', error);
      return false;
    }
  }

  // Background sync
  async registerBackgroundSync(tag: string, options?: any): Promise<boolean> {
    if (!this.swRegistration || !('sync' in this.swRegistration)) {
      console.warn('Background Sync not supported');
      return false;
    }

    try {
      if (this.swRegistration && 'sync' in this.swRegistration && typeof (this.swRegistration as any).sync.register === 'function') {
        await (this.swRegistration as any).sync.register(tag, options);
        return true;
      } else {
        console.warn('Background Sync not supported');
        return false;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Background sync registration failed:', error);
      } else {
        console.error('Background sync registration failed:', String(error));
      }
      return false;
    }
  }

  // Event listeners
  onUpdate(callback: (info: UpdateInfo) => void): void {
    this.updateCallbacks.push(callback);
  }

  onNetworkChange(callback: (status: NetworkStatus) => void): void {
    this.networkCallbacks.push(callback);
  }

  onInstallPrompt(callback: () => void): void {
    this.installCallbacks.push(callback);
  }

  // Notify callbacks
  private notifyUpdateCallbacks(info: UpdateInfo): void {
    this.updateCallbacks.forEach(callback => callback(info as UpdateInfo));
  }

  private notifyNetworkCallbacks(status: NetworkStatus): void {
    this.networkCallbacks.forEach(callback => callback(status as NetworkStatus));
  }

  private notifyInstallCallbacks(): void {
    this.installCallbacks.forEach(callback => callback());
  }

  // Get current network status
  getNetworkStatus(): NetworkStatus {
    const status: NetworkStatus = { online: navigator.onLine };

    if ('connection' in navigator) {
      const connection = (navigator as unknown as Record<string, unknown>).connection;
      if (typeof connection === 'object' && connection !== null) {
        status.connectionType = typeof (connection as Record<string, unknown>).effectiveType === 'string' ? (connection as Record<string, unknown>).effectiveType as string : undefined;
        status.effectiveType = typeof (connection as Record<string, unknown>).effectiveType === 'string' ? (connection as Record<string, unknown>).effectiveType as string : undefined;
        status.downlink = typeof (connection as Record<string, unknown>).downlink === 'number' ? (connection as Record<string, unknown>).downlink as number : undefined;
        status.rtt = typeof (connection as Record<string, unknown>).rtt === 'number' ? (connection as Record<string, unknown>).rtt as number : undefined;
      }
    }

    return status;
  }

  // Check if app is installed
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as unknown as Record<string, unknown>).standalone === true;
  }

  // Get service worker registration
  getServiceWorkerRegistration(): ServiceWorkerRegistration | null {
    return this.swRegistration;
  }

  // Get configuration
  getConfig(): PWAConfig {
    return this.config;
  }

  // Update configuration
  updateConfig(newConfig: Partial<PWAConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Global PWA manager instance
export const pwaManager = new PWAManager();

// Utility functions
export const isPWAInstalled = (): boolean => {
  return pwaManager.isInstalled();
};

export const getNetworkStatus = (): NetworkStatus => {
  return pwaManager.getNetworkStatus();
};

export const updateServiceWorker = async (): Promise<boolean> => {
  return pwaManager.updateServiceWorker();
};

export const skipWaiting = async (): Promise<void> => {
  return pwaManager.skipWaiting();
};

export const clearAllCaches = async (): Promise<boolean> => {
  return pwaManager.clearAllCaches();
};

// Analytics for PWA events
export const trackPWAEvent = (event: string, data?: any): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, data);
  }
};

// Initialize PWA
export const initializePWA = async (config?: Partial<PWAConfig>): Promise<void> => {
  if (config) {
    pwaManager.updateConfig(config);
  }

  await pwaManager.registerServiceWorker();
  
  trackPWAEvent('pwa_initialized', {
    config: pwaManager.getConfig(),
    installed: pwaManager.isInstalled(),
    network_status: pwaManager.getNetworkStatus(),
  });
};

