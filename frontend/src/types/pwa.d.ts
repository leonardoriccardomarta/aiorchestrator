declare module 'virtual:pwa-register' {
  export interface PWAUpdateEvent {
    needRefresh: boolean;
    offlineReady: boolean;
    updateSW: () => Promise<void>;
  }

  export interface RegisterSWOptions {
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (swRegistration: ServiceWorkerRegistration) => void;
    onRegisterError?: (error: any) => void;
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
} 